import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";

export const Paginacao = ({ data={}, onPageChange=()=>{}, firstPage=0, rowsPerPage=10}) => {
    
    const handlePageChange = (event) => {
        const _currentPage = event.page + 1
        const _firstPage = event.first
        onPageChange(_currentPage, _firstPage);
    };

    return (
        <>
            {(data?.count || 0) > rowsPerPage &&
            <Paginator
                first={firstPage}
                rows={rowsPerPage}
                totalRecords={data?.count}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={handlePageChange}
                alwaysShow={false}
                />
            }
        </>
    );
};
