import React from "react";
import {Paginator} from 'primereact/paginator';

export const Paginacao = ({acoes, setCurrentPage, firstPage, setFirstPage, isLoading, count}) => {
    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && acoes && acoes.length > 0 ? (
                    <Paginator
                        first={firstPage}
                        rows={20}
                        totalRecords={count}
                        template="PrevPageLink PageLinks NextPageLink"
                        onPageChange={onPageChange}
                    />
                ) :
                null
            }
        </>
    )
}
