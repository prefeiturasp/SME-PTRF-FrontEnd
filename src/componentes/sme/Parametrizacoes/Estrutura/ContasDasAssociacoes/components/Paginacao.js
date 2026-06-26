import React from "react";
import {Paginator} from 'primereact/paginator';
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";


export const Paginacao = ({ isLoading, total }) => {
    const { setFilter, filter } = useContasDasAssociacoesContext();
    const firstPage = (filter.page - 1) * filter.page_size;

    const onPageChange = (event) => {
        const currentPage = event.page + 1;

        setFilter((prev) => ({
            ...prev,
            page: currentPage
        }))
    };

    return (
        <>
            {!isLoading && total ? (
                    <Paginator
                        first={firstPage}
                        rows={filter.page_size}
                        totalRecords={total}
                        template="PrevPageLink PageLinks NextPageLink"
                        onPageChange={onPageChange}
                    />
                ) :
                null
            }
        </>
    )

}