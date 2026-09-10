import React from "react";
import { Paginator } from "primereact/paginator";


const ROWS_POR_PAGINA = 10;

export const Paginacao = ({ count, firstPage, onPageChange }) => {
    if (!count || count <= ROWS_POR_PAGINA) return null;

    const handlePageChange = (event) => {
        onPageChange(event.page + 1, event.first);
    };

    return (
        <div data-qa="paginacao-mandato-vacancia" className="Paginacao">
            <Paginator
                first={firstPage}
                rows={ROWS_POR_PAGINA}
                totalRecords={count}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={handlePageChange}
            />
        </div>
    );
};
