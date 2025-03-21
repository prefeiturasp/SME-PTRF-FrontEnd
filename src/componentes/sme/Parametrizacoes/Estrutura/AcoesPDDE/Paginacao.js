import React from "react";
import {Paginator} from 'primereact/paginator';

export const Paginacao = ({acoes, setCurrentPage, firstPage, setFirstPage, isLoading}) => {
    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && acoes.results && acoes.results.length > 0 ? (
                    <Paginator
                        first={firstPage}
                        rows={5}
                        totalRecords={acoes.count}
                        template="PrevPageLink PageLinks NextPageLink"
                        onPageChange={onPageChange}
                    />
                ) :
                null
            }
        </>
    )
}
