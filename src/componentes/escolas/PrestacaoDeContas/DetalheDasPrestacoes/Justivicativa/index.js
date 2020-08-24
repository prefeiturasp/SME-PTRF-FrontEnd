import React from "react";

export const Justificativa = ({textareaJustificativa, handleChangeTextareaJustificativa}) => {
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
            >
            </textarea>
        </div>
    );
}