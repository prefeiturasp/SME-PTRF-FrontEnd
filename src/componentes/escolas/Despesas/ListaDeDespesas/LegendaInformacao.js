import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {
    ModalLegendaInformacao
} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalLegendaInformacao";

export const LegendaInformacao = ({showModalLegendaInformacao, setShowModalLegendaInformacao}) => {
    return (
        <>

            <FontAwesomeIcon
                style={{
                    fontSize: '18px',
                    marginRight: "2px",
                    color: '#00585D'
            }}
                icon={faInfoCircle}
            />
            <button
                className='legendas-table text-md-start'
                onClick={() => setShowModalLegendaInformacao(true)}
                style={{
                    color: '#00585D',
                    outline: 'none',
                    border: 0,
                    background: 'inherit',
                    padding: '4px',
                    marginRight: '5px'

                }}
            >
                Legenda informação
            </button>

            <ModalLegendaInformacao
                show={showModalLegendaInformacao}
                primeiroBotaoOnclick={() => setShowModalLegendaInformacao(false)}
                titulo="Legenda Informação"
                primeiroBotaoTexto="Fechar"
                primeiroBotaoCss="outline-success"
            />
        </>
    )

}