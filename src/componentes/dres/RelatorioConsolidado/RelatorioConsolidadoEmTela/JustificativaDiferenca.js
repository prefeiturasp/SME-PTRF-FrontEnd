import PropTypes from "prop-types";
import {visoesService} from "../../../../services/visoes.service";


export const JustificativaDiferenca = ({execucaoFinanceira, haDiferencaPrevisaoExecucaoRepasse, justificativaDiferenca, setJustificativaDiferenca, onChangeJustificativaDiferenca, onSubmitJustificativaDiferenca, btnSalvarJustificativaDisable, setBtnSalvarJustificativaDisable, jaPublicado}) => {
    
    const onClickBtnLimpar = () => {
        setJustificativaDiferenca((prevState) => ({
            ...prevState,
            [execucaoFinanceira.tipo_conta_uuid]: {
                ...(prevState[execucaoFinanceira.tipo_conta_uuid] || justificativaDiferenca),
                texto: ""
            }
        }));
        setBtnSalvarJustificativaDisable((prevState) => ({
            ...prevState,
            [execucaoFinanceira.tipo_conta_uuid]: false
        }));
    }
    return(
        <>
            {haDiferencaPrevisaoExecucaoRepasse(execucaoFinanceira.valores) &&
                <>
                    <p className='texto-aviso-associacoes-em-analise'><strong>Justificativa da diferença entre o valor previsto pela SME e o transferido pela DRE no período</strong></p>
                    <div className="form-group">
                        <textarea
                            disabled={
                                jaPublicado ||
                                !visoesService.getPermissoes(['change_relatorio_consolidado_dre'])
                            }
                            onChange={(e) => onChangeJustificativaDiferenca(e.target.value, execucaoFinanceira.tipo_conta_uuid)}
                            className="form-control" id="justificativaDiferenca"
                            rows="3"
                            value={justificativaDiferenca.texto}
                            placeholder='Escreva aqui a justificativa para essa diferença.'
                        >
                        </textarea>
                    </div>
                    {!justificativaDiferenca.texto?.trim() &&
                    <span className="span_erro text-danger mt-1">
                        O campo justificativa da diferença é obrigatório para a geração do consolidado
                    </span>
                    }
                    <div className="d-flex  justify-content-end pb-3">
                        <button
                            onClick={onClickBtnLimpar}
                            disabled={
                                jaPublicado ||
                                !visoesService.getPermissoes(['change_relatorio_consolidado_dre'])
                        }
                            type="reset"
                            className="btn btn btn-outline-success mt-2"
                        >
                            Limpar
                        </button>
                        <button
                            onClick={onSubmitJustificativaDiferenca}
                            disabled={
                                jaPublicado ||
                                btnSalvarJustificativaDisable ||
                                !justificativaDiferenca?.texto?.trim() ||
                                !visoesService.getPermissoes(['change_relatorio_consolidado_dre'])
                        }
                            type="submit"
                            className="btn btn-success mt-2 ml-2"
                        >
                            Salvar
                        </button>
                    </div>
                </>
            }
        </>
    )
};

JustificativaDiferenca.propTypes = {
    execucaoFinanceira: PropTypes.object.isRequired,
    haDiferencaPrevisaoExecucaoRepasse: PropTypes.func.isRequired,
    justificativaDiferenca: PropTypes.object.isRequired,
    setJustificativaDiferenca: PropTypes.func.isRequired,
    onChangeJustificativaDiferenca: PropTypes.func.isRequired,
    onSubmitJustificativaDiferenca: PropTypes.func.isRequired,
    btnSalvarJustificativaDisable: PropTypes.bool.isRequired,
    setBtnSalvarJustificativaDisable: PropTypes.func.isRequired,
    jaPublicado: PropTypes.bool.isRequired
};