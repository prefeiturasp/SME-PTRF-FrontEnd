import React from "react";
import {useGetMandatoVigente} from "../hooks/useGetMandatoVigente";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";

export const MandatoInfo = () => {
    const {isLoading, data} = useGetMandatoVigente()
    const dataTemplate = useDataTemplate()
    return (
        <>
            {!isLoading && data && data.uuid &&
                <div className="d-flex bd-highlight mt-2">
                    <div className="p-2 pt-3 flex-grow bd-highlight">
                        <p className='mb-0 fonte-16'><strong>Mandato</strong></p>
                        <p className='mb-0'>
                            <span><strong>Período atual: </strong></span>{dataTemplate(null, null, data.data_inicial)} até {dataTemplate(null, null, data.data_final)}
                        </p>
                    </div>
                </div>
            }

        </>
    )
}