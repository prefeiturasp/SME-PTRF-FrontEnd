import React from "react";
import {useGetMandatoVigente} from "../hooks/useGetMandatoVigente";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";

export const MandatoInfo = () => {
    const {isLoading, data} = useGetMandatoVigente()
    const dataTemplate = useDataTemplate()
    return (
        <>
            {!isLoading && data && data.uuid &&
                <div className="p-2 pt-3 flex-grow-1 bd-highlight" data-qa='mandato-info'>
                    <p className='mb-0 fonte-16'><strong>Mandato</strong></p>
                    <p className='mb-0'>
                        <span><strong>Período atual: </strong></span>{dataTemplate('', '', data.data_inicial)} até {dataTemplate('', '', data.data_final)}
                    </p>
                </div>
            }
        </>
    )
}