import React from "react";
import {useGetMandatos} from "../hooks/useGetMandatos";

export const ExibicaoQuantidade = () => {

    const {isLoading, totalMandatos} = useGetMandatos()

    return(
        <>
            {!isLoading && totalMandatos ? (
                    <p className='p-2 mb-0'>Exibindo <span className='total'>{totalMandatos}</span> períodos</p>
                ) :
                null
            }
        </>
    )

}