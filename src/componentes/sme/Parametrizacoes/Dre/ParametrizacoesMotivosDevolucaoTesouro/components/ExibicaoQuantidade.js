import React from "react";
import { useGetMotivosDevolucaoTesouro } from "../hooks/useGetMotivosDevolucaoTesouro";


export const ExibicaoQuantidade = () => {

    const {isLoading, totalMotivosDevolucaoTesouro} = useGetMotivosDevolucaoTesouro()

    return(
        <>
            {!isLoading && totalMotivosDevolucaoTesouro ? (
                    <p className='p-2 mb-0'>Exibindo <span className='total'>{totalMotivosDevolucaoTesouro}</span> motivos</p>
                ) :
                null
            }
        </>
    )
}