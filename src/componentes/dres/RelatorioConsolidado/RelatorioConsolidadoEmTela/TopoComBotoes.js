import React from "react";

export const TopoComBotoes = ({periodoNome, ePrevia, referencia}) =>{
    const textoVersao = ePrevia ? '(Prévia)': ''

    return(
        <>
            <div className="d-flex bd-highlight mb-3">
                <div className="py-2 flex-grow-1 bd-highlight">
                    <h4 className='pl-0'>Período: {periodoNome} {textoVersao}</h4>
                    <p><h5 className='pl-0'>{referencia}</h5></p>
                </div>
                <div className="py-2 bd-highlight">
                    <button onClick={()=>window.location.assign('/dre-relatorio-consolidado')} className="btn btn-outline-success">Voltar</button>
                </div>
            </div>
        </>
    )
};