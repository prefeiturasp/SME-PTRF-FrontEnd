import React from "react";

export const BotaoSalvarRodape = ({exibeSalvar, metodoSalvarAnalise, btnSalvarDisabled, textoBtn}) =>{
    return(
        <>
        {exibeSalvar &&
            <div>
                <button
                    onClick={metodoSalvarAnalise}
                    className="btn btn-success ml-2"
                    disabled={btnSalvarDisabled}
                >
                    {textoBtn}
                </button>
            </div>
        }
        </>
    )
}