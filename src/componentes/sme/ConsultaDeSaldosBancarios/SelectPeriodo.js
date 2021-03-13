import React from "react";

export const SelectPeriodo = ({periodosAssociacao, handleChangePeriodo, selectPeriodo, exibeDataPT_BR}) => {
    return(
        <>
            <div className="col">
                <label htmlFor='periodo'><strong>Selecione o período:</strong></label>
                <select
                    value={selectPeriodo}
                    onChange={(e) => handleChangePeriodo(e.target.value)}
                    name="periodo"
                    id="periodo"
                    className="form-control"
                >
                    <option value="">Escolha um período</option>
                    {periodosAssociacao && periodosAssociacao.map((periodo) =>
                        <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                    )}
                </select>
            </div>
        </>
    )
};