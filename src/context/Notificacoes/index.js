import React, {useState, createContext, useCallback, useEffect} from "react";
import {getQuantidadeNaoLidas, getRegistrosFalhaGeracaoPc} from "../../services/Notificacoes.service";
import {visoesService} from "../../services/visoes.service";
import {ModalNotificaErroConcluirPC} from "../../componentes/Globais/ModalAntDesign/ModalNotificaErroConcluirPC";
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

    exibeModalPerdeuAcesso: false,
    setExibeModalPerdeuAcesso(){},

});

export const NotificacaoContextProvider = ({children}) => {

    const [qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas] = useState(true);
    const [temNotificacaoDevolucaoNaoLida, setTemNotificacaoDevolucaoNaoLida] = useState(true);
    const [exibeMensagemFixaTemDevolucao, setExibeMensagemFixaTemDevolucao] = useState(false);
    const [periodoErroConcluirPc, setPeriodoErroConcluirPc] = useState('');

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

    const deveExibirModalPerdeuAcesso = () => {
        let storage = JSON.parse(localStorage.getItem("INFO_PERDEU_ACESSO"));

        if(storage === null || storage === "null"){
            return false;
        }
        else if(storage.exibe_modal === 'true' || storage.exibe_modal === true) {
            return true;
        }
        else{
            return false;
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
    const [exibeModalPerdeuAcesso, setExibeModalPerdeuAcesso] = useState(deveExibirModalPerdeuAcesso());


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
                exibeModalPerdeuAcesso,
                setExibeModalPerdeuAcesso
            }
        }>
            {children}
        </NotificacaoContext.Provider>
            <section>
                <ModalNotificaErroConcluirPC
                    show={show}
                    titulo={`${registroFalhaGeracaoPc.excede_tentativas ? "Já foram feitas diversas tentativas para realizar a conclusão do período" : "Não foi possível concluir o período"}`}
                    texto={`${registroFalhaGeracaoPc.excede_tentativas ? `Favor entrar em contato com a DRE para que a geração da Prestação de Contas ${registroFalhaGeracaoPc.periodo_referencia} possa ser concluída.` : `Houve um erro na geração da Prestação de Contas do período ${registroFalhaGeracaoPc.periodo_referencia}, deseja reprocessar?`}`}
                    
                    primeiroBotaoTexto={`${registroFalhaGeracaoPc.excede_tentativas ? "OK" : "Cancelar"}`}
                    primeiroBotaoCss={`${registroFalhaGeracaoPc.excede_tentativas ? "btn-base-verde" : "btn-base-verde-outline"}`}
                    handleClose={()=>setShow(false)}
                    
                    segundoBotaoTexto={registroFalhaGeracaoPc && !registroFalhaGeracaoPc.excede_tentativas ? "Reprocessar" : null}
                    segundoBotaoCss={`${registroFalhaGeracaoPc.excede_tentativas ? null : "success"}`}
                    segundoBotaoOnclick={
                        registroFalhaGeracaoPc && !registroFalhaGeracaoPc.excede_tentativas ? irParaConcluirPc : null
                    }
                    hideSegundoBotao={registroFalhaGeracaoPc.excede_tentativas}
                    wrapClassName={"modal-notifica-erro-concluir-pc"}
                    dataQa="modal-notifica-erro-concluir-PC"
                />
            </section>
        </>
    )
}

