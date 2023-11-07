import React from "react";
import {useGetComposicao} from "../hooks/useGetComposicao";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";

export const ComposicaoInfo = () => {
    const {isLoading, data} = useGetComposicao()
    const dataTemplate = useDataTemplate()
    return (
        <>
            {!isLoading && data && data.uuid &&
                <div className="p-2 pt-3" data-qa='composicao-info'>
                    <p className='mb-0 fonte-16'><strong>Composição a partir de:</strong></p>
                    <p className='mb-0'>
                        {dataTemplate('', '', data.data_inicial)} até {dataTemplate('', '', data.data_final)}
                    </p>
                </div>
            }
        </>
    )
}