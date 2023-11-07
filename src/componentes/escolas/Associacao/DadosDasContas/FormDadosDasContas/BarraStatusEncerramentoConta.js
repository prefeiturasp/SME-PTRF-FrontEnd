import React, { useEffect, useState } from "react";
import "./form-dados-das-contas.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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
    }, [conta])

    const formatarDataSolicitacao = (dataStr) => {
        const data = new Date(dataStr);

        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
      
        const horas = data.getHours().toString().padStart(2, '0');
        const minutos = data.getMinutes().toString().padStart(2, '0');
      
        return `${dia}/${mes}/${ano} às ${horas}h${minutos}`;
    }

    const estadoEncerramentoConta = (conta) => {
        if (!conta || !conta.solicitacao_encerramento) {
            return null;
        } else if (conta.solicitacao_encerramento.status === "APROVADA"){
            return null;
        } else if (conta.solicitacao_encerramento.status === "PENDENTE"){
            let dataSolicitacaoFormatada = formatarDataSolicitacao(conta.solicitacao_encerramento.criado_em);

            return setEstadoBarraEncerramento({
                estiloBarra: "barra-status-encerramento-conta-pendente",
                estiloIcone: "icone-barra-encerramento-conta-pendente",
                texto: `Aguardando validação de encerramento de conta. Solicitação enviada em ${dataSolicitacaoFormatada}.`
            });
        } else if (conta.solicitacao_encerramento.status === "REJEITADA"){
            return setEstadoBarraEncerramento({
                estiloBarra: "barra-status-encerramento-conta-rejeitada",
                estiloIcone: "icone-barra-encerramento-conta-rejeitada",
                texto: "Solicitação de encerramento da conta negada."
            });
        }
    }

    return (
        <div className="row mt-4 mx-1">
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