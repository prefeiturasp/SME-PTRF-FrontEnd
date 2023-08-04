import React, {useContext} from "react";
import {Paginator} from 'primereact/paginator';
import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";


export const Paginacao = () => {
    const {isLoading, data, totalMotivosRejeicao} = useGetMotivosRejeicao()
    const {count} = data
    const {setCurrentPage, firstPage,setFirstPage} = useContext(MotivosRejeicaoContext)


    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && totalMotivosRejeicao ? (
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