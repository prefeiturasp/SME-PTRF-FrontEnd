import React from "react";
import {useGetMandatoVigente} from "../hooks/useGetMandatoVigente";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";


export const MandatoInfo = ({ mandato, label = "Mandato atual" }) => {
    const {isLoading, data} = useGetMandatoVigente()
    const dataTemplate = useDataTemplate()
    const dadosMandato = mandato || data
    const carregando = !mandato && isLoading
    return (
        <>
            {!carregando && dadosMandato?.uuid &&
                <div className="p-2 pt-3 flex-grow-1 bd-highlight MandatoInfo" data-qa='mandato-info'>
                    <p className='mb-0'>
                        <span><strong>{label}: </strong></span>{dataTemplate('', '', dadosMandato.data_inicial)} até {dataTemplate('', '', dadosMandato.data_final)}
                    </p>
                </div>
            }
        </>
    )
}