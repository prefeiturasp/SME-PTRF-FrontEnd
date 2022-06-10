import React, {useEffect, useState} from "react";
import {getUnidades} from "../../../services/dres/Unidades.service"
import {ListaDeUnidades} from "./ListaDeUnidades";
import Loading from "../../../utils/Loading";
import {FiltroDeUnidades} from "./FiltroDeUnidades";

export const EscolheUnidade = (props) =>{

    const {dre_uuid} = props

    const initialStateFiltros = {
        nome_ou_codigo: "",
    };


    const [loading, setLoading] = useState(false);
    const [listaUnidades, setListaUnidades] = useState([]);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    useEffect(()=>{
        carregaListaUnidades();
    }, [stateFiltros]);

    const carregaListaUnidades = async ()=>{
        if (stateFiltros.nome_ou_codigo !== "") {
            setLoading(true)
            try {
                let listaUnidades = await getUnidades(dre_uuid, stateFiltros.nome_ou_codigo);
                setListaUnidades(listaUnidades);
            }catch (e) {
                console.log("Erro ao carregar lista de unidades.", e)
            }
            setLoading(false)
        }
        else {
            setListaUnidades([])
        }
    };

    const escolherUnidade = (uuidUnidade) => {
        console.log('Unidade escolhida:', uuidUnidade)
    }

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltros = (event, filtros)=>{
        event.preventDefault();
        setStateFiltros(filtros);
    };

    const limpaFiltros = () => {
        setStateFiltros(initialStateFiltros);
    };

    return(
        <div>
            <FiltroDeUnidades
                stateFiltros={stateFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
                filtroInicial={initialStateFiltros}
            />

            {loading ? (
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            ) : listaUnidades && listaUnidades.length > 0 ? (<ListaDeUnidades listaUnidades={listaUnidades} rowsPerPage={10}
                                 acaoAoEscolherUnidade={escolherUnidade}/>) : <span> </span>
            }

        </div>
    )
}
