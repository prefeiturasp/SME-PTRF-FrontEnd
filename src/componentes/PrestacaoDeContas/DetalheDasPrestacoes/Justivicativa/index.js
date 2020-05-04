import React from "react";

export const Justificativa = () => {
    return(
        <div className="form-group mt-4">
            <label htmlFor="justificativa"><strong>Justificativas, informações adicionais e cheques cancelados</strong></label>
            <textarea
                className="form-control"
                id="justificativa"
                rows="3"
                name="justificativa"
                placeholder="Escreva o comentário"
            >
            </textarea>
        </div>
    );
}