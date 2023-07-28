import React from "react";
import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";


export const ExibicaoQuantidade = () => {

    const {isLoading, totalMotivosRejeicao} = useGetMotivosRejeicao()

    return(
        <>
            {!isLoading && totalMotivosRejeicao ? (
                    <p className='p-2 mb-0'>Exibindo <span className='total'>{totalMotivosRejeicao}</span> motivos</p>
                ) :
                null
            }
        </>
    )
}