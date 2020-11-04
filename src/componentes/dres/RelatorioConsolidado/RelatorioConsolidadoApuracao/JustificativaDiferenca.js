import React from "react";

export const JustificativaDiferenca = ({comparaValores, justificativaDiferenca, setJustificativaDiferenca, onChangeJustificativaDiferenca, onSubmitJustificativaDiferenca}) => {
    return(
        <>
            {comparaValores() &&
                <>
                    <p className='texto-aviso-associacoes-em-analise'><strong>Justificativa da diferença entre o valor previsto pela SME e o transferido pela DRE no período</strong></p>
                    <div className="form-group">
                        <textarea onChange={(e)=>onChangeJustificativaDiferenca(e.target.value)} className="form-control" id="justificativaDiferenca" rows="3" value={justificativaDiferenca.texto} placeholder='Escreva aqui a justificativa para essa diferença.'>
                        </textarea>
                    </div>
                    <div className="d-flex  justify-content-end pb-3">
                        <button onClick={()=>setJustificativaDiferenca('')} type="reset" className="btn btn btn-outline-success mt-2">Limpar</button>
                        <button onClick={onSubmitJustificativaDiferenca} disabled={!justificativaDiferenca} type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                    </div>
                </>
            }
        </>
    )
};