import React, {useState, createContext} from "react";

export const DadosDoGastoNaoContext = createContext( {
    listaPalavroes: [],
    setListaPalavroes(){},
    getListaPalavroes(){},
});

export const DadosDoGastoNaoContextProvider = ({children}) => {

    const [listaPalavroes, setListaPalavroes] = useState([])

/*    useEffect( () => {
        buscarPalavrasImproprias()
        .then(listaPalavroes => {
            setListaPalavroes(listaPalavroes);
        })
    }, [])*/

    return (
        <DadosDoGastoNaoContext.Provider value={ { listaPalavroes, setListaPalavroes } }>
            {children}
        </DadosDoGastoNaoContext.Provider>
    )
}