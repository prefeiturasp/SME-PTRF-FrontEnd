import React, {useContext} from "react";
import {useGetMandatosAnteriores} from "../hooks/useGetMandatosAnteriores";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import {MembrosDaAssociacaoContext} from "../context/MembrosDaAssociacao";

export const SelectMandatosAnteriores = () => {
    const dataTemplate = useDataTemplate()
    const {data_mandatos_anteriores, isError} = useGetMandatosAnteriores()
    const {setMandatoUuid, mandatoUuid} = useContext(MembrosDaAssociacaoContext)

    const onChangeMandato = (event) => {
        setMandatoUuid(event.target.value)
    }

    return (
        <>
            {data_mandatos_anteriores && !isError &&
                <div className="p-2 pt-3 mr-auto">
                    <label data-qa='lbs-selecionar-periodo'>Selecionar período</label>
                    <select
                        value={mandatoUuid}
                        onChange={onChangeMandato}
                        name="status"
                        id="status"
                        className="form-control pr-5"
                    >
                        {data_mandatos_anteriores.length > 0 && data_mandatos_anteriores.map(mandato => (
                            <option
                                key={mandato.uuid}
                                value={mandato.uuid}
                                data-qa={`opt-mandato-${mandato.id}`}
                            >
                                {mandato.data_inicial && dataTemplate('', '', mandato.data_inicial)} até {mandato.data_final && dataTemplate('', '', mandato.data_final)}
                            </option>
                        ))}
                    </select>
                </div>
            }
        </>
    )
}