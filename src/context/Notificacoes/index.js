import React, {useState, createContext} from "react";
import {getQuantidadeNaoLidas} from "../../services/Notificacoes.service";

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

});

export const NotificacaoContextProvider = ({children}) => {

    const [qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas] = useState(true);
    const [temNotificacaoDevolucaoNaoLida, setTemNotificacaoDevolucaoNaoLida] = useState(true);
    const [exibeMensagemFixaTemDevolucao, setExibeMensagemFixaTemDevolucao] = useState(false);

    const deveExibirModalDevolucao = () => {
        let storage = localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA");

        if(storage === null || storage === "null"){
            return false;
        }
        else {
            return true;
        }
    }

    const [exibeModalTemDevolucao, setExibeModalTemDevolucao] = useState(deveExibirModalDevolucao());

    const getQtdeNotificacoesNaoLidas = async () =>{
        let qtde = await getQuantidadeNaoLidas();
        setQtdeNotificacoesNaoLidas(qtde.quantidade_nao_lidos);
        return qtde.quantidade_nao_lidos;
    };

    return (
        <NotificacaoContext.Provider value={
            {
                qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas, getQtdeNotificacoesNaoLidas,
                temNotificacaoDevolucaoNaoLida, setTemNotificacaoDevolucaoNaoLida,
                exibeModalTemDevolucao, setExibeModalTemDevolucao,
                exibeMensagemFixaTemDevolucao, setExibeMensagemFixaTemDevolucao
            }
        }>
            {children}
        </NotificacaoContext.Provider>
    )
}

