import React from "react";
import {Paginator} from 'primereact/paginator';

export const Paginacao = ({programas, rowsPerPage, setCurrentPage, firstPage, setFirstPage, isLoading}) => {
    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    if (isLoading || !programas.results || programas.results.length === 0) {
        return null;
    }

    return (
        <Paginator
            first={firstPage}
            rows={rowsPerPage}
            totalRecords={programas.count}
            template="PrevPageLink PageLinks NextPageLink"
            onPageChange={onPageChange}
        />
    )
}
