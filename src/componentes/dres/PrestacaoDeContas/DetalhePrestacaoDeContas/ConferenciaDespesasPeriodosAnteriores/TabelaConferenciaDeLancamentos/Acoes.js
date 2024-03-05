import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export const Acoes = ({
    totalLancamentosSelecionados,
    totalLancamentos,
    exibirBtnMarcarComoCorreto,
    exibirBtnMarcarComoNaoConferido,
    desmarcarTodos,
    marcarComoCorreto,
    marcarComoNaoConferido
}) => {
    return (
        <div className="row">
            <div className="col-12"
                 style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                <div className="row">
                    <div className="col-5">
                        {totalLancamentosSelecionados} {totalLancamentosSelecionados === 1 ? "lançamento selecionado" : "lançamentos selecionados"} / {totalLancamentos} totais
                    </div>
                    <div className="col-7">
                        <div className="row">
                            <div className="col-12">
                                <button className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={desmarcarTodos}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                    <strong>Cancelar</strong>
                                </button>
                                {exibirBtnMarcarComoCorreto &&
                                    <>
                                        <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                        <button
                                            className="float-right btn btn-link btn-montagem-selecionar"
                                            onClick={marcarComoCorreto}
                                            style={{textDecoration: "underline", cursor: "pointer"}}
                                        >
                                            <FontAwesomeIcon
                                                style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                                icon={faCheckCircle}
                                            />
                                            <strong>Marcar como Correto</strong>
                                        </button>
                                    </>
                                }
                                {exibirBtnMarcarComoNaoConferido &&
                                    <>
                                        <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                        <button
                                            className="float-right btn btn-link btn-montagem-selecionar"
                                            onClick={marcarComoNaoConferido}
                                            style={{textDecoration: "underline", cursor: "pointer"}}
                                        >
                                            <FontAwesomeIcon
                                                style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                                icon={faCheckCircle}
                                            />
                                            <strong>Marcar como não conferido</strong>
                                        </button>
                                    </>
                                }
                                {/* <div className="float-right" style={{padding: "0px 10px"}}>|</div> */}
                                {/* <button
                                    className="float-right btn btn-link btn-montagem-selecionar"
                                    onClick={() => {
                                        // setStateCheckBoxOrdenarPorImposto(false)
                                        detalharAcertos()
                                    }}
                                    style={{textDecoration: "underline", cursor: "pointer"}}
                                >
                                    <FontAwesomeIcon
                                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                        icon={faListUl}
                                    />
                                    <strong>Detalhar acertos</strong>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}