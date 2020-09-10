import React, {useState, createContext} from "react";
import {notificacoesService} from "../../services/Notificacoes.service";

export const NotificacaoContext = createContext( {
    qtdeNotificacoesNaoLidas: '',
    setQtdeNotificacoesNaoLidas(){},

    getQtdeNotificacoesNaoLidas(){},
});

export const NotificacaoContextProvider = ({children}) => {
    const [qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas] = useState(true);

    const getQtdeNotificacoesNaoLidas = async () =>{
        let qtde = await notificacoesService.getQuantidadeNaoLidas();
        setQtdeNotificacoesNaoLidas(qtde.quantidade_nao_lidos);
        return qtde.quantidade_nao_lidos;
    };

    return (
        <NotificacaoContext.Provider value={{ qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas, getQtdeNotificacoesNaoLidas }}>
            {children}
        </NotificacaoContext.Provider>
    )
}