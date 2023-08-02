import React, { useEffect, useState } from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

export const CardSaldoEncerramentoConta = ({index, conta, handleOpenModalConfirmEncerramentoConta, handleOpenModalMotivoRejeicaoEncerramento, errosDataEncerramentoConta, inicioPeriodo}) => {

    const [dataEncerramento, setDataEncerramento] = useState("");
    const [erroData, setErroData] = useState(null);

    useEffect(() => {
        if(errosDataEncerramentoConta) {
            let erro = errosDataEncerramentoConta.find((erro) => erro.index === index);
            setErroData(erro); 
        }
    }, [errosDataEncerramentoConta]);

    useEffect(() => {
        if(conta.solicitacao_encerramento){
            setDataEncerramento(conta.solicitacao_encerramento.data_de_encerramento_na_agencia)
        }
    }, [conta]);

    const habilitaEncerramentoConta = (conta) => {
        if(conta.solicitacao_encerramento === null) {
            return false;
        } else if (conta.solicitacao_encerramento.status === "PENDENTE" || conta.solicitacao_encerramento.status === "APROVADA"){
            return true;
        }
        return false;
    }

    return (
        <div className="card h-100">
            <div className="card-body">
                <div className="row">
                    <div className="col-3">
                        <div>
                            <label className="textos-card-saldos">Saldo de Recursos da Conta {index + 1}</label>
                        </div>
                        <div>
                            <span className="saldo-recursos-conta">R$ {conta.saldo_atual_conta ? conta.saldo_atual_conta.toLocaleString("pt-BR") : 0}</span>
                        </div>
                    </div>
                    {conta.saldo_atual_conta === 0 &&
                        <>
                            <div className="col-3">
                                <div className="form-group">
                                    <label htmlFor="data_encerramento">
                                        Data de encerramento
                                        <span data-html={true} data-tip="Informar a data de encerramento da conta na agência.">
                                            <FontAwesomeIcon
                                                style={{marginLeft: "10px", color: '#2B7D83'}}
                                                icon={faExclamationCircle}
                                            />
                                        </span>
                                        <ReactTooltip html={true}/>
                                    </label>
                                    
                                    <DatePickerField
                                        disabled={habilitaEncerramentoConta(conta)}
                                        value={dataEncerramento}
                                        onChange={(name, value) => setDataEncerramento(value)}
                                        name='data_extrato'
                                        type="date"
                                        className="form-control"
                                        maxDate={new Date()}
                                        minDate={new Date(inicioPeriodo)}
                                    />
                                    {erroData && erroData.mensagem && (
                                    <span className="span_erro text-danger mt-1">
                                        <small>{erroData.mensagem}</small>
                                    </span>
                                    )}
                                </div>                                                             
                            </div>
                            <div className="col-6 d-flex justify-content-end" style={{marginTop: "30px"}}>
                                <div data-html={true} data-tip="Essa solicitação deve ser feita à DRE, após o encerramento da conta no banco e, caso validada, inativará a referida conta para eventos futuros no sistema.">
                                    <button 
                                        type="button"
                                        disabled={habilitaEncerramentoConta(conta)}
                                        className="btn btn-base-verde-outline"
                                        onClick={() => handleOpenModalConfirmEncerramentoConta(conta, dataEncerramento, index)}
                                    >
                                        <FontAwesomeIcon
                                            className="icon-btn-base-verde-outline"
                                            icon={faTimesCircle}
                                        />
                                        Solicitar encerramento da conta
                                    </button>
                                </div>
                                {/* {conta.solicitacao_encerramento && conta.solicitacao_encerramento.status === "REJEITADA" 
                                && (
                                    <div className="ml-2">
                                    <button 
                                        type="button"
                                        className="btn btn-base-verde"
                                        onClick={() => handleOpenModalMotivoRejeicaoEncerramento()}
                                    >
                                        Ver motivo da negativa
                                    </button>
                                </div>
                                )} */}
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
};