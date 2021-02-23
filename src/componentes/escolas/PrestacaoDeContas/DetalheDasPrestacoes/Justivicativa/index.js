import React from "react";
import {visoesService} from "../../../../../services/visoes.service";

export const Justificativa = ({textareaJustificativa, handleChangeTextareaJustificativa, periodoFechado}) => {
    return(
        <div className="form-group mt-4">
            <label htmlFor="justificativa"><strong>Justificativas, informações adicionais e cheques cancelados</strong></label>
            <textarea
                value={textareaJustificativa}
                onChange={handleChangeTextareaJustificativa}
                className="form-control"
                rows="3"
                id="justificativa"
                name="justificativa"
                placeholder="Escreva o comentário"
                disabled={periodoFechado || !visoesService.getPermissoes(['change_conciliacao_bancaria'])}
            >
            </textarea>
        </div>
    );
};