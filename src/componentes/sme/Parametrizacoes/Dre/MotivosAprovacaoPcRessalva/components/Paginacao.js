import React, {useContext} from "react";
import {Paginator} from 'primereact/paginator';
import { useGetMotivosAprovacaoPcRessalva } from "../hooks/useGetMotivosAprovacaoPcRessalva";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";


export const Paginacao = () => {
    const {isLoading, data, totalMotivosAprovacaoPcRessalva} = useGetMotivosAprovacaoPcRessalva()
    const {count} = data
    const {setCurrentPage, firstPage,setFirstPage} = useContext(MotivosAprovacaoPcRessalvaContext)


    const onPageChange = (event) => {
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)
    };

    return (
        <>
            {!isLoading && totalMotivosAprovacaoPcRessalva ? (
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