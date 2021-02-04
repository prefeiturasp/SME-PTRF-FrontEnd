import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodasTags} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaTags from "./TabelaTags";

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