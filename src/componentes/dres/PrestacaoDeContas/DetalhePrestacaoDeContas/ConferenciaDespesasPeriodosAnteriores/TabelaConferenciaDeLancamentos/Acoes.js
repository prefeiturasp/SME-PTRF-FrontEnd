import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faListUl } from "@fortawesome/free-solid-svg-icons";

export const Acoes = ({
    totalLancamentosSelecionados,
    totalLancamentos,
    exibirBtnMarcarComoCorreto,
    exibirBtnMarcarComoNaoConferido,
    desmarcarTodos,
    marcarComoCorreto,
    marcarComoNaoConferido,
    detalharAcertos
}) => {

    const buildOptionLink = (label, callback, icon = null, showBar = true) => {
        return (
            <>
            {showBar && <div className="float-right" style={{padding: "0px 10px"}}>|</div>}
            <button
                className="float-right btn btn-link btn-montagem-selecionar"
                onClick={callback}
                style={{textDecoration: "underline", cursor: "pointer"}}
            >
                {
                    icon && (
                        <FontAwesomeIcon
                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                            icon={icon}
                        />
                    )
                }
                <strong>{label}</strong>
            </button>  
            </>
        )      
    };

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
                                {buildOptionLink('Cancelar', desmarcarTodos, null, false)}
                                {exibirBtnMarcarComoCorreto ? buildOptionLink('Marcar como Correto', marcarComoCorreto, faCheckCircle) : null}
                                {exibirBtnMarcarComoNaoConferido ? buildOptionLink('Marcar como não conferido', marcarComoNaoConferido, faCheckCircle) : null}
                                {buildOptionLink('Detalhar acertos', detalharAcertos, faListUl)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}