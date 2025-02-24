import React, {useContext} from "react";
import {Paginator} from 'primereact/paginator';
import { useGet } from "../hooks/useGet";
import { MateriaisServicosContext } from "../context/MateriaisServicos";

export const Paginacao = () => {
    const {isLoading, data} = useGet()
    const {count} = data
    const {setCurrentPage, firstPage,setFirstPage} = useContext(MateriaisServicosContext)

    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && data.results && data.results.length > 0 ? (
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
