import React, {useEffect, useState} from 'react';
import UltimatePagination from 'react-ultimate-pagination-bootstrap-4'

export const Paginacao = ({paginacaoPaginasTotal, trazerNotificacoesPaginacao, trazerNotificacoesLidasNaoLidasPaginacao, categoriaLidaNaoLida, forcarPrimeiraPagina, usouFiltros, trazerNotificacoesFiltrosPaginacao }) => {
    const [page, setPage] = useState(1);

    useEffect(()=>{
        setPage(1)
    }, [forcarPrimeiraPagina]);

    const onPageChange = (page) => {
        setPage(page);
        if(usouFiltros){
            trazerNotificacoesFiltrosPaginacao(page)
        }else if (categoriaLidaNaoLida === 'todas'){
            trazerNotificacoesPaginacao(page);
        }else if(categoriaLidaNaoLida === 'nao_lidas' || categoriaLidaNaoLida === 'lidas') {
            trazerNotificacoesLidasNaoLidasPaginacao(categoriaLidaNaoLida, page)
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center container-paginacao mt-5">
                <UltimatePagination
                    currentPage={page}
                    totalPages={paginacaoPaginasTotal}
                    onChange={onPageChange}
                />
            </div>
        </>
    );
};