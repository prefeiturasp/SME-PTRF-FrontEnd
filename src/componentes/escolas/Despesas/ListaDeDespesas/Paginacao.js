import React, {useEffect, useState} from 'react';
import UltimatePagination from 'react-ultimate-pagination-bootstrap-4'

export const Paginacao = ({paginacaoPaginasTotal, buscaDespesasPaginacao, forcarPrimeiraPagina, buscaUtilizandoOrdenacao, buscaDespesasOrdenacaoPaginacao }) => {
    const [page, setPage] = useState(1);

    useEffect(()=>{
        setPage(1)
    }, [forcarPrimeiraPagina]);

    const onPageChange = (page) => {
        setPage(page);

         if(buscaUtilizandoOrdenacao){
            buscaDespesasOrdenacaoPaginacao(page);
        }
        else{
            buscaDespesasPaginacao(page);
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