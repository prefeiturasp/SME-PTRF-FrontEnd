import React, { useEffect, useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./barra-status.scss";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

export const BarraStatusEncerramentoConta = ({conta}) =>{

    const estadoInicialBarraEncerramento = {
        estiloBarra: null,
        estiloIcone: null,
        texto: null
    }

    const [estadoBarraEncerramento, setEstadoBarraEncerramento] = useState(estadoInicialBarraEncerramento);

    useEffect(() => {
        estadoEncerramentoConta(conta);
    }, [])

    const estadoEncerramentoConta = (conta) => {
        if (!conta || !conta.solicitacao_encerramento) {
            return null;
        } else if (conta.solicitacao_encerramento.status === "APROVADA"){
            return null;
        } else if (conta.solicitacao_encerramento.status === "REJEITADA"){
            return setEstadoBarraEncerramento({
                estiloBarra: "barra-status-encerramento-conta-rejeitada",
                estiloIcone: "icone-barra-encerramento-conta-rejeitada",
                texto: "Solicitação de encerramento da conta negada."
            });
        }
    }

    return (
        <div className="row mx-1 mb-2">
            <div className={`col-12 ${estadoBarraEncerramento.estiloBarra}`}>
                <p className="pt-1 pb-1 mb-0">
                    <FontAwesomeIcon
                        className={`${estadoBarraEncerramento.estiloIcone}`}
                        icon={faExclamationCircle}
                    />
                    {estadoBarraEncerramento.texto}
                </p>
            </div>
        </div>
    );
};