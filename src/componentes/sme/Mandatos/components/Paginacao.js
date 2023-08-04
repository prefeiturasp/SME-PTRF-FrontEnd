import React, {useContext} from "react";
import {Paginator} from 'primereact/paginator';
import {useGetMandatos} from "../hooks/useGetMandatos";
import {MandatosContext} from "../context/Mandatos";

export const Paginacao = () => {
    const {isLoading, data, totalMandatos} = useGetMandatos()
    const {count} = data
    const {setCurrentPage, firstPage,setFirstPage} = useContext(MandatosContext)

    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && totalMandatos ? (
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