import React, {useState} from "react";
import {visoesService} from "../../../../../services/visoes.service";
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


export const Justificativa = ({
    textareaJustificativa, handleChangeTextareaJustificativa, periodoFechado, 
    btnSalvarJustificativaDisable, setBtnJustificativaSalvarDisable, checkSalvarJustificativa,
    setCheckSalvarJustificativa, salvarJustificativa, classBtnSalvarJustificativa, lancamentosSelecionados,
    setClassBtnSalvarJustificativa}) => {


    const handleOnClick = () => {
        setBtnJustificativaSalvarDisable(true);
        setCheckSalvarJustificativa(true);
        setClassBtnSalvarJustificativa("secondary");
        salvarJustificativa(lancamentosSelecionados);
    }


    return(
        <div className="form-group mt-4">
            <p className="justificativas-e-informacoes-adicionais mt-5 mb-3">Justificativas e informações adicionais</p>
            <p>Adicione justificativas e informações adicionais se necessário (opcional)</p>

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

            {visoesService.getPermissoes(['change_conciliacao_bancaria']) &&
                <div className="bd-highlight d-flex justify-content-end align-items-center">

                    {checkSalvarJustificativa &&
                        <div className="">
                            <p className="mr-2 mt-3">
                                <span className="mr-1">
                                <FontAwesomeIcon
                                    style={{fontSize: '16px', color:'#297805'}}
                                    icon={faCheck}
                                />
                                </span>Salvo
                            </p>
                        </div>
                    }
                    
                    <button 
                        disabled={btnSalvarJustificativaDisable} 
                        type="button" 
                        className={`btn btn-${classBtnSalvarJustificativa} mt-2`}
                        onClick={handleOnClick}
                        >
                            <strong>Salvar Justificativas</strong>
                    </button>
                </div>
            }
            
        </div>
    );
};

