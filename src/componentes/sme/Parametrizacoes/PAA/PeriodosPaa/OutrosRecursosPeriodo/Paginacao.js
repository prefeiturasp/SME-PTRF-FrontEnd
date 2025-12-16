import React, {useContext} from "react";
import { Spin } from "antd";
import {Paginator} from 'primereact/paginator';
import { useGetOutrosRecursos } from "./hooks/useGet";
import { OutrosRecursosPeriodosPaaContext } from "./context/index";


export const Paginacao = () => {
    const {isLoading, data} = useGetOutrosRecursos()
    const {count} = data
    const {setCurrentPage, firstPage, setFirstPage, rowsPerPage} = useContext(OutrosRecursosPeriodosPaaContext)


    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {rowsPerPage < count && <Spin spinning={isLoading}>
                <Paginator
                    first={firstPage}
                    rows={rowsPerPage}
                    totalRecords={count}
                    template="PrevPageLink PageLinks NextPageLink"
                    onPageChange={onPageChange}
                />
            </Spin>}
        </>
    )

}