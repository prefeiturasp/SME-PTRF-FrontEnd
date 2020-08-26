import React from "react";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";

export const SelectsPeriodoAcao = ({periodosAssociacao, handleChangePeriodo, tiposConta, handleChangeAcao}) =>{
    return(
        <>
            <div className="form-row align-items-center mb-3">
                <div className="col-auto my-1">
                    <h2 className="subtitulo-itens-painel-out mb-0">Ações recebidas no período:</h2>
                </div>
                <div className="col-auto my-1">
                    <select
                        value={periodosAssociacao.uuid}
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


                <div className="col-auto ml-3 my-1">
                    <h2 className="subtitulo-itens-painel-out mb-0">Tipo de conta:</h2>
                </div>

                <div className="col-auto my-1">
                    <select
                        value={tiposConta.uuid}
                        onChange={(e) => handleChangeAcao(e.target.value)}
                        name="periodo"
                        id="periodo"
                        className="form-control"
                    >
                        <option value="">Escolha uma conta</option>
                        <option value="todas_contas">Todas as contas</option>
                        {tiposConta && tiposConta.map((conta) =>
                            <option key={conta.uuid} value={conta.uuid}>{conta.nome}</option>
                        )}
                    </select>
                </div>
            </div>
        </>
    )
};