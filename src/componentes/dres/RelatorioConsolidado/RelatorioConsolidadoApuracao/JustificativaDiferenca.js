import React from "react";
import {visoesService} from "../../../../services/visoes.service";


export const JustificativaDiferenca = ({comparaValores, justificativaDiferenca, setJustificativaDiferenca, onChangeJustificativaDiferenca, onSubmitJustificativaDiferenca, btnSalvarJustificativaDisable, setBtnSalvarJustificativaDisable}) => {
    
    const onClickBtnLimpar = () => {
        setJustificativaDiferenca({
            ...justificativaDiferenca,
            texto: ""
        })
        setBtnSalvarJustificativaDisable(false);
    }
    
    return(
        <>
            {comparaValores() &&
                <>
                    <p className='texto-aviso-associacoes-em-analise'><strong>Justificativa da diferença entre o valor previsto pela SME e o transferido pela DRE no período</strong></p>
                    <div className="form-group">
                        <textarea disabled={!visoesService.getPermissoes(['change_relatorio_consolidado_dre'])} onChange={(e)=>onChangeJustificativaDiferenca(e.target.value)} className="form-control" id="justificativaDiferenca" rows="3" value={justificativaDiferenca.texto} placeholder='Escreva aqui a justificativa para essa diferença.'>
                        </textarea>
                    </div>
                    <div className="d-flex  justify-content-end pb-3">
                        <button onClick={onClickBtnLimpar} disabled={!visoesService.getPermissoes(['change_relatorio_consolidado_dre'])} type="reset" className="btn btn btn-outline-success mt-2">Limpar</button>
                        <button onClick={onSubmitJustificativaDiferenca} disabled={btnSalvarJustificativaDisable | !justificativaDiferenca |  !visoesService.getPermissoes(['change_relatorio_consolidado_dre'])} type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                    </div>
                </>
            }
        </>
    )
};