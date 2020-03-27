import React, {useState, createContext, useEffect} from "react";
import Api from "../../services/Api";

export const GetDadosApiDespesaContext = createContext( {
    tiposCusteio:[],
    setTiposCusteio(){},
});

export const GetDadosApiDespesaContextProvider = ({children}) => {

    const [tiposCusteio, setTiposCusteio] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('tipos_custeio')
            setTiposCusteio(response.data);
        };
        fetchData();
    }, []);


    return (
        <GetDadosApiDespesaContext.Provider value={{tiposCusteio, setTiposCusteio}}>
            {children}
        </GetDadosApiDespesaContext.Provider>
    )

}