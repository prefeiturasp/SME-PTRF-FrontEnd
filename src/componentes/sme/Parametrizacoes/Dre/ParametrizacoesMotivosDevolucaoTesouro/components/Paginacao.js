import React, {useContext} from "react";
import {Paginator} from 'primereact/paginator';
import { useGetMotivosDevolucaoTesouro } from "../hooks/useGetMotivosDevolucaoTesouro";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";


export const Paginacao = () => {
    const {isLoading, data, totalMotivosDevolucaoTesouro} = useGetMotivosDevolucaoTesouro()
    const {count} = data
    const {setCurrentPage, firstPage,setFirstPage} = useContext(MotivosDevolucaoTesouroContext)


    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && totalMotivosDevolucaoTesouro ? (
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