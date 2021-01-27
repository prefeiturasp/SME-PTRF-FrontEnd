import React from "react";

export const SelectPeriodo = ({periodosAssociacao, handleChangePeriodo, selectPeriodo, exibeDataPT_BR}) => {
    return(
        <>
            <div className="col-auto my-1">
                <h2 className="subtitulo-itens-painel-out mb-0">Ações recebidas no período:</h2>
            </div>
            <div className="col-auto my-1">
                <select
                    value={selectPeriodo}
                    onChange={(e) => handleChangePeriodo(e.target.value)}
                    name="periodo"
                    id="periodo"
                    className="form-control"
                >
                    {periodosAssociacao && periodosAssociacao.map((periodo) =>
                        <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                    )}
                </select>
            </div>
        </>
    )
};