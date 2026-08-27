import React from "react";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";

export const SelectMandatoAnteriorVacancia = ({ mandatos, mandatoUuid, onChangeMandato }) => {
    const dataTemplate = useDataTemplate();

    return (
        <div className="p-2 pt-3 mr-auto SelectMandatoAnteriorVacancia">
            <label htmlFor="mandato-anterior-vacancia" data-qa='lbs-selecionar-periodo'>Selecionar período</label>
            <select
                value={mandatoUuid || ""}
                onChange={(event) => onChangeMandato(event.target.value)}
                name="mandato-anterior-vacancia"
                id="mandato-anterior-vacancia"
                className="form-control pr-5"
            >
                {mandatos.map((mandato) => (
                    <option key={mandato.uuid} value={mandato.uuid} data-qa={`opt-mandato-${mandato.id}`}>
                        {dataTemplate('', '', mandato.data_inicial)} até {dataTemplate('', '', mandato.data_final)}
                    </option>
                ))}
            </select>
        </div>
    );
};