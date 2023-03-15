import React, {useState, createContext, useCallback, useEffect} from "react";
import {getQuantidadeNaoLidas, getRegistrosFalhaGeracaoPc} from "../../services/Notificacoes.service";
import {visoesService} from "../../services/visoes.service";
import {ModalNotificaErroConcluirPC} from "../../componentes/Globais/Cabecalho/ModalNotificaErroConcluirPC";
import {authService} from "../../services/auth.service";

export const NotificacaoContext = createContext( {
    qtdeNotificacoesNaoLidas: '',
    setQtdeNotificacoesNaoLidas(){},
    getQtdeNotificacoesNaoLidas(){},

    temNotificacaoDevolucaoNaoLida: '',
    setTemNotificacaoDevolucaoNaoLida(){},

    exibeModalTemDevolucao: false,
    setExibeModalTemDevolucao(){},

    exibeMensagemFixaTemDevolucao: false,
    setExibeMensagemFixaTemDevolucao(){},

    getExibeModalErroConcluirPc(){},
    exibeModalErroConcluirPc: false,

});

export const NotificacaoContextProvider = ({children}) => {

    const [qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas] = useState(true);
    const [temNotificacaoDevolucaoNaoLida, setTemNotificacaoDevolucaoNaoLida] = useState(true);
    const [exibeMensagemFixaTemDevolucao, setExibeMensagemFixaTemDevolucao] = useState(false);

    // FalhaGeracaoPC
    const [registroFalhaGeracaoPc, setRegistroFalhaGeracaoPc] = useState([]);

    const deveExibirModalDevolucao = () => {
        let storage = localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA");

        if(storage === null || storage === "null"){
            return false;
        }
        else {
            return true;
        }
    }

    const getExibeModalErroConcluirPc = useCallback(async () => {

        if (authService.isLoggedIn()){

            // Verifica se estamos na visao de UE
            let visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome')

            if (visao_selecionada === 'UE') {

                // FalhaGeracaoPC
                let associacao_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
                let registros_de_falha = await getRegistrosFalhaGeracaoPc(associacao_uuid)
                if (registros_de_falha && registros_de_falha.length > 0) {
                    setRegistroFalhaGeracaoPc(registros_de_falha[0])
                    setShow(true)
                    return true
                } else {
                    setShow(false)
                    return false
                }
            }
        }
    }, []);

    useEffect(()=>{
        getExibeModalErroConcluirPc()
    }, [getExibeModalErroConcluirPc])


    const irParaConcluirPc = async () =>{
        if (registroFalhaGeracaoPc && registroFalhaGeracaoPc.periodo_uuid){
            try {
                localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(
                    {
                        data_final: registroFalhaGeracaoPc.periodo_data_final ,
                        data_inicial: registroFalhaGeracaoPc.periodo_data_inicio,
                        periodo_uuid: registroFalhaGeracaoPc.periodo_uuid
                    })
                );
                await getExibeModalErroConcluirPc()
                window.location.assign('/prestacao-de-contas/monitoramento-de-pc')
            }catch (e) {
                console.log("Erro ao apagar notificacao: ", e)
            }
        }

    }

    const [show, setShow] = useState(false);
    const [exibeModalTemDevolucao, setExibeModalTemDevolucao] = useState(deveExibirModalDevolucao());


    const getQtdeNotificacoesNaoLidas = async () =>{
        let qtde = await getQuantidadeNaoLidas();
        setQtdeNotificacoesNaoLidas(qtde.quantidade_nao_lidos);
        return qtde.quantidade_nao_lidos;
    };

    return (
        <>
        <NotificacaoContext.Provider value={
            {
                qtdeNotificacoesNaoLidas,
                setQtdeNotificacoesNaoLidas,
                getQtdeNotificacoesNaoLidas,
                temNotificacaoDevolucaoNaoLida,
                setTemNotificacaoDevolucaoNaoLida,
                exibeModalTemDevolucao,
                setExibeModalTemDevolucao,
                exibeMensagemFixaTemDevolucao,
                setExibeMensagemFixaTemDevolucao,
                getExibeModalErroConcluirPc,
                setRegistroFalhaGeracaoPc,
                setShow,
            }
        }>
            {children}
        </NotificacaoContext.Provider>
            <section>
                <ModalNotificaErroConcluirPC
                    show={show}
                    handleClose={()=>setShow(false)}
                    titulo="Atenção"
                    texto={`${registroFalhaGeracaoPc.excede_tentativas ? '<p><strong>Por favor, entre em contato com a DRE.</strong></p>' : ''}<p>${registroFalhaGeracaoPc.texto}</p>`}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="outline-success"
                    segundoBotaoCss="success"
                    segundoBotaoTexto={registroFalhaGeracaoPc && !registroFalhaGeracaoPc.excede_tentativas ? "Concluir geração" : null}
                    segundoBotaoOnclick={registroFalhaGeracaoPc && !registroFalhaGeracaoPc.excede_tentativas ? irParaConcluirPc : null}
                />
            </section>
        </>
    )
}

