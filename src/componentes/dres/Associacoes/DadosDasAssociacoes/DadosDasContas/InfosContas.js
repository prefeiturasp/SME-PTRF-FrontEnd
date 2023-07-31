import React, {Fragment} from "react";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import {formataDataYYYYMMDDParaApresentacao} from "../../../../../utils/FormataData"

export const  InfosContas = ({dadosDaAssociacao, handleOpenModalConfirmarEncerramentoConta, handleOpenModalRejeitarEncerramentoConta}) =>{

    const apresentaDataDeEncerramentoDeConta = (conta) => {
        return conta && conta.solicitacao_encerramento !== null && conta.solicitacao_encerramento.status === "PENDENTE";
    }

    return(
        <>
            <div className="row">
                <div className="d-flex bd-highlight">
                    <div className="flex-grow-1 bd-highlight">
                        <p className="mb-1 ml-2 titulo-explicativo-dre-detalhes">Dados da conta da associação</p>
                    </div>
                
                </div>
            </div>

            <div className="row">
                {dadosDaAssociacao.dados_da_associacao.contas &&
                dadosDaAssociacao.dados_da_associacao.contas.length > 0 ?
                dadosDaAssociacao.dados_da_associacao.contas.map((conta, index)=>
                    <Fragment key={index}>
                        <div className={`col-12 mt-${index === 0 ? "2" : 4} mb-xs-4 mb-md-4 mb-xl-3 ml-0`}>
                            <p className="mb-0">
                                <span className="contador-conta"><strong>Conta {index + 1}</strong></span> <span className="divisor"></span>
                            </p>
                        </div>
                        <div className={`col-12 col-md-${apresentaDataDeEncerramentoDeConta(conta) ? "2" : "3"}`}>
                            <p><strong>Banco</strong></p>
                            <p>{conta.banco_nome}</p>
                        </div>
                        <div className={`col-12 col-md-${apresentaDataDeEncerramentoDeConta(conta) ? "2" : "3"}`}>
                            <p><strong>Tipo de conta</strong></p>
                            <p>{conta.tipo_conta.nome}</p>
                        </div>
                        <div className={`col-12 col-md-${apresentaDataDeEncerramentoDeConta(conta) ? "2" : "3"}`}>
                            <p><strong>Agência</strong></p>
                            <p>{conta.agencia}</p>
                        </div>
                        <div className="col-12 col-md-3">
                            <p><strong>Nº da conta com o dígito</strong></p>
                            <p>{conta.numero_conta}</p>
                        </div>
                        {apresentaDataDeEncerramentoDeConta(conta) &&
                            <>
                            <div className="col-12 col-md-3 form-group">
                                <label>
                                    <strong>Data do encerramento</strong> 
                                    <span data-html={true} data-tip="Informar a data de encerramento da conta na agência.">
                                        <FontAwesomeIcon
                                            style={{marginLeft: "10px", color: '#2B7D83'}}
                                            icon={faExclamationCircle}
                                        />
                                    </span>
                                    <ReactTooltip html={true}/>
                                </label>
                                <input className="form-control" disabled value={conta.solicitacao_encerramento !== null ? formataDataYYYYMMDDParaApresentacao(conta.solicitacao_encerramento.data_de_encerramento_na_agencia)  : null}/>
                            </div>
                            </>
                        }
                        <div className="card h-100 w-100 mx-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-5">
                                        <div>
                                            <label className="textos-card-saldos">Saldo de Recursos da Conta {index + 1}</label>
                                        </div>
                                        <div>
                                            <span className="saldo-recursos-conta">R$ {conta.saldo_atual_conta ? conta.saldo_atual_conta.toLocaleString("pt-BR") : 0}</span>
                                        </div>
                                    </div>
                                    {/* {apresentaDataDeEncerramentoDeConta(conta) &&
                                        <div className="col-7 text-right mt-3">
                                            <button 
                                                type="button"
                                                className="btn btn-base-verde-outline mr-3"
                                                onClick={() => handleOpenModalConfirmarEncerramentoConta(conta)}
                                            >
                                                Confirmar encerramento
                                            </button>
                                            <button 
                                                type="button"
                                                className="btn btn-base-verde-outline"
                                                onClick={() => handleOpenModalRejeitarEncerramentoConta(conta)}
                                            >
                                                Rejeitar encerramento
                                            </button>
                                        </div>
                                    } */}
                                </div>
                            </div>
                        </div>
                    </Fragment>
                ):
                    <MsgImgCentralizada
                        texto='Não encontramos nenhuma conta, tente novamente'
                        img={Img404}
                    />
                }
            </div>
        </>
    );
};
