import React, {useEffect, useState} from "react";
import {getUnidades} from "../../../services/dres/Unidades.service"
import {ListaDeUnidades} from "./ListaDeUnidades";
import Loading from "../../../utils/Loading";

export const EscolheUnidade = (props) =>{

    const {dre_uuid} = props

    const [loading, setLoading] = useState(true);
    const [listaUnidades, setListaUnidades] = useState([]);

    useEffect(()=>{
        carregaListaUnidades();
    }, []);

    const carregaListaUnidades = async ()=>{
        try {
            let listaUnidades = await getUnidades(dre_uuid);
            setListaUnidades(listaUnidades);
        }catch (e) {
            console.log("Erro ao carregar lista de unidades.", e)
        }
        setLoading(false)
    };

    const escolherUnidade = (uuidUnidade) => {
        console.log('Unidade escolhida:', uuidUnidade)
    }

    return(
        <div>
            {loading ? (
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            ) : <ListaDeUnidades listaUnidades={listaUnidades} rowsPerPage={10}
                                 acaoAoEscolherUnidade={escolherUnidade}/>
            }

        </div>
    )
}
