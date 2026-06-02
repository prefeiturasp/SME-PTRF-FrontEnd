import React from "react";
import { Paginator } from 'primereact/paginator';
import { useDetalhesTiposCreditoContext } from "../hooks/useDetalhesTiposCreditoContext";


export const Paginacao = ({ isLoading, count, total }) => {
    const { filter, setFilter } = useDetalhesTiposCreditoContext();

    const onPageChange = (event) => {
        const currentPage = event.page + 1;
        setFilter(prevState => ({
            ...prevState,
            page: currentPage
        }))
    };

    const firstPage = (filter.page - 1) * 10;

    return (
        <>
            {!isLoading && total ? (
                    <Paginator
                        first={firstPage}
                        rows={10}
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