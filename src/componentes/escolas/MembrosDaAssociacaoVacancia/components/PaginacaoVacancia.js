import React from "react";
import { Paginator } from "primereact/paginator";

export const PaginacaoVacancia = ({ count, firstPage, onPageChange }) => {

    const handlePageChange = (event) => {
        onPageChange(event.page + 1, event.first)
    };

    return (
        <div data-qa='paginacao-composicao-vacancia' className='PaginacaoVacancia'>
            <Paginator
                first={firstPage}
                rows={1}
                totalRecords={count}
                template="PrevPageLink NextPageLink"
                onPageChange={handlePageChange}
                className='paginacao-composicoes-v2'
                style={{ padding: "0 0 15px 15px" }}
            />
        </div>
    )
}