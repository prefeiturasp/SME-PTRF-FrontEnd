import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodasTags, getFiltrosTags} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaTags from "./TabelaTags";
import {Filtros} from "./Filtros";

export const Tags = ()=>{

    const [count, setCount] = useState(0);
    const [listaDeTags, setListaDeTags] = useState([]);

    const carregaTodasAsTags = useCallback(async ()=>{
        let todas_tags = await getTodasTags();
        setListaDeTags(todas_tags);
        console.log('Todas as tags ', todas_tags)
    }, []);

    useEffect(()=>{
        carregaTodasAsTags()
    }, [carregaTodasAsTags]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeTags = useMemo(() => listaDeTags.length, [listaDeTags]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_nome: "",
        filtrar_por_status: "",
    };
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        let tags_filtradas = await getFiltrosTags(stateFiltros.filtrar_por_nome, stateFiltros.filtrar_por_status);
        setListaDeTags(tags_filtradas);
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaTodasAsTags();
    };

    // TabelaTags
    const rowsPerPage = 20;
    const statusTemplate = (rowData) => {
        return rowData.status && rowData.status === 'ATIVO' ? 'Ativo' : 'Inativo'
    };

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Etiquetas/Tags</h1>
            <div className="page-content-inner">
                <button onClick={()=>setCount(prevState => prevState+1)}>Count - {count}</button>
                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                />
                <p>Exibindo <span className='total-acoes'>{totalDeTags}</span> etiquetas/tags</p>
                <TabelaTags
                    rowsPerPage={rowsPerPage}
                    listaDeTags={listaDeTags}
                    statusTemplate={statusTemplate}
                />
            </div>
        </PaginasContainer>
    )
};