import React from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";

export const MarcoInfoVacancia = ({ dataInicio, dataFim }) => {
    const dataTemplate = useDataTemplate()
    return (
        <div className="p-2 pt-3 MarcoInfoVacancia" data-qa='marco-info-vacancia'>
            <p className='mb-0 fonte-16'><strong>Composição a partir de:</strong></p>
            <p className='mb-0'>{dataTemplate('', '', dataInicio)} até {dataTemplate('', '', dataFim)}</p>
        </div>
    )
}