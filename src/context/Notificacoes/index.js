import React, {useState, createContext, useCallback, useEffect} from "react";
import {
    deleteNotificacaoPorUuid,
    getNotificacoesErroConcluirPc,
    getQuantidadeNaoLidas
} from "../../services/Notificacoes.service";
import {visoesService} from "../../services/visoes.service";
import {ModalNotificaErroConcluirPC} from "../../componentes/Globais/Cabecalho/ModalNotificaErroConcluirPC";

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
    const [periodoErroConcluirPc, setPeriodoErroConcluirPc] = useState('');

    const deveExibirModalDevolucao = () => {
        let storage = localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA");

        if(storage === null || storage === "null"){
            return false;
        }
        else {
            return true;
        }
    }

    const getExibeModalErroConcluirPc = useCallback(async () =>{

        let notificacoes = await getNotificacoesErroConcluirPc();

        // Verifica se estamos na visao de UE
        let visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome')

        let unidade_selecionada = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid')

        // Verifica se existe notificações para a Unidade Selecionada
        let primeiro_registro = notificacoes.find(element=> element.unidade === unidade_selecionada)

        // Não dispara o modal quando estamos em visão de UE em /prestacao-de-contas para corrigir uma PC de cada vez
        let current_url = window.location.pathname

        if (visao_selecionada === 'UE' && primeiro_registro && current_url !== '/prestacao-de-contas'){
            setPeriodoErroConcluirPc(primeiro_registro.periodo.referencia)
            setShow(true)
            return true
        }else {
            setShow(false)
            return false
        }
    }, []);

    useEffect(()=>{
        getExibeModalErroConcluirPc()
    }, [getExibeModalErroConcluirPc])

    const irParaConcluirPc = async () =>{
        let notificacoes = await getNotificacoesErroConcluirPc();
        let unidade_selecionada = visoesService.getItemUsuarioLogado('unidade_selecionada.uuid')
        let primeiro_registro = notificacoes.find(element=> element.unidade === unidade_selecionada)

        if (primeiro_registro){
            try {
                localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(
                    {
                        data_final: primeiro_registro.periodo.data_final ,
                        data_inicial: primeiro_registro.periodo.data_inicial,
                        periodo_uuid: primeiro_registro.periodo.periodo_uuid
                    })
                );
                await deleteNotificacaoPorUuid(primeiro_registro.uuid)
                console.log("Notificação apagada com sucesso: ", primeiro_registro.uuid)

                await getExibeModalErroConcluirPc()
                window.location.assign('/prestacao-de-contas')
            }catch (e) {
                console.log("Erro ao apagar notificacao: ", primeiro_registro.uuid)
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
                qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas, getQtdeNotificacoesNaoLidas,
                temNotificacaoDevolucaoNaoLida, setTemNotificacaoDevolucaoNaoLida,
                exibeModalTemDevolucao, setExibeModalTemDevolucao,
                exibeMensagemFixaTemDevolucao, setExibeMensagemFixaTemDevolucao,
                getExibeModalErroConcluirPc
            }
        }>
            {children}
        </NotificacaoContext.Provider>
            <section>
                <ModalNotificaErroConcluirPC
                    show={show}
                    handleClose={()=>setShow(false)}
                    irParaConcluirPc={irParaConcluirPc}
                    titulo="Atenção"
                    texto={`<p>A geração da prestação de contas ${periodoErroConcluirPc} não foi finalizada corretamente, favor efetuar a geração novamente.`}
                />
            </section>
        </>
    )
}

