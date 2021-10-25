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
    const [exibeModalTemDevolucao, setExibeModalTemDevolucao] = useState(localStorage.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA") !== 'null');
    const [exibeMensagemFixaTemDevolucao, setExibeMensagemFixaTemDevolucao] = useState(false);

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

