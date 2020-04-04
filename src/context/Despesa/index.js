import React, {useState, createContext, useEffect} from "react";

export const DespesaContext = createContext( {
    verboHttp:[],
    setVerboHttp(){},

});

export const DespesaContextProvider = ({children}) => {

    const [verboHttp, setVerboHttp] = useState([]);

    return (
        <DespesaContext.Provider value={
            {verboHttp, setVerboHttp,}}>
            {children}
        </DespesaContext.Provider>
    )

}