import React, {useState, createContext} from "react";
import { getQuantidadeNaoLidas } from "../../services/CentralDeDownload.service";

export const CentralDeDownloadContext = createContext({
    qtdeNotificacoesNaoLidas: '',
    setQtdeNotificacoesNaoLidas(){},

    getQtdeNotificacoesNaoLidas(){},
    
});

export const CentralDeDownloadContextProvider = ({children}) => {
    const [qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas] = useState(true);

    const getQtdeNotificacoesNaoLidas = async () =>{
        let qtde = await getQuantidadeNaoLidas();
        setQtdeNotificacoesNaoLidas(qtde.quantidade_nao_lidos);
        return qtde.quantidade_nao_lidos;
    };

    return (
        <CentralDeDownloadContext.Provider value={{ qtdeNotificacoesNaoLidas, setQtdeNotificacoesNaoLidas, getQtdeNotificacoesNaoLidas }}>
            {children}
        </CentralDeDownloadContext.Provider>
    )
}