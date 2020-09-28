import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";

export const FormRecebimentoPelaDiretoria = ({prestacaoDeContas, dataRecebimento, handleChangeDataRecebimento}) =>{

    return(
        <>
            <h4>Recebimento pela Diretoria</h4>
            <form method="post">
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="tecnico_atribuido">Técnico atribuído</label>
                        <input
                            defaultValue={prestacaoDeContas.tecnico_responsavel.nome}
                            //onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='tecnico_atribuido'
                            type="text"
                            className="form-control"

                        />
                    </div>
                    <div className="col">
                        <label htmlFor="dt_recebimento">Data de recebimento</label>
                        <DatePickerField
                            name="dt_recebimento"
                            id="dt_recebimento"
                            value={dataRecebimento}
                            onChange={handleChangeDataRecebimento}
                        />
                    </div>
                </div>
            </form>
        </>
    )
};