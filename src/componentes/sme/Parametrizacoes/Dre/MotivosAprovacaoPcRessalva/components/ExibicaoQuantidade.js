import React from "react";
import { useGetMotivosAprovacaoPcRessalva } from "../hooks/useGetMotivosAprovacaoPcRessalva";


export const ExibicaoQuantidade = () => {

    const {isLoading, totalMotivosAprovacaoPcRessalva} = useGetMotivosAprovacaoPcRessalva()

    return(
        <>
            {!isLoading && totalMotivosAprovacaoPcRessalva ? (
                    <p className='p-2 mb-0'>Exibindo <span className='total'>{totalMotivosAprovacaoPcRessalva}</span> motivos</p>
                ) :
                null
            }
        </>
    )
}