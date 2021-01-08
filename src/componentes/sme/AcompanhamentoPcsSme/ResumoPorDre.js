import React from "react";

import {DataTable} from 'primereact/datatable';

import {Column} from 'primereact/column';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";


export const ResumoPorDre = ({resumoPorDre, statusPeriodo}) => {

    const periodoEmAndamento = statusPeriodo ? statusPeriodo.cor_idx  == 1 : true;

    const estiloLinhaCompleta = {
        font: 'Roboto',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '22px',
    };

    const estiloLinhaIcompleta = {
        font: 'Roboto',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '22px',
    };

    const siglaDreTemplate = (rowData) => {
        const estiloIconeCompleto = {
            marginRight: "0",
            color: '#297805',
            size: '14px'
        };

        const estiloIconeIncompleto = {
            marginRight: "0",
            color: '#B40C02',
            size: '14px'
        };


        return (
            <div>
                <FontAwesomeIcon
                    style={rowData.periodo_completo ? estiloIconeCompleto : estiloIconeIncompleto}
                    icon={rowData.periodo_completo ? faCheckCircle : faTimesCircle}
                />
                <span style={rowData.periodo_completo ? estiloLinhaCompleta : estiloLinhaIcompleta}> {rowData.dre.sigla}</span>

            </div>
        )
    };

    const acoesTemplate = (rowData) => {

        return (
            <div>
                <button
                    onClick={() => ({})}
                    className="btn btn-link"
                >
                    <FontAwesomeIcon
                        style={{marginRight: "0", color: '#00585E'}}
                        icon={faEye}
                    />
                </button>
            </div>
        )
    };

    const colunaTemplate = (completo, valor) => {
        return (
            <span style={completo ? estiloLinhaCompleta : estiloLinhaIcompleta}> {valor}</span>
        )
    };

    const totalUnidadesTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.TOTAL_UNIDADES)
    };

    const naoRecebidaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.NAO_RECEBIDA)
    };

    const naoApresentadaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.NAO_APRESENTADA)
    };

    const recebidaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.RECEBIDA)
    };

    const emAnaliseTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.EM_ANALISE)
    };

    const devolvidaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.DEVOLVIDA)
    };

    const aprovadaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.APROVADA)
    };

    const aprovadaRessalvaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.APROVADA_RESSALVA)
    };

    const reprovadaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.REPROVADA)
    };


    return (
        <>
            <DataTable
                value={resumoPorDre}
                className="mt-3 datatable-footer-coad"
                paginator={false}
            >
                <Column field='dre.sigla' header='DRE' body={siglaDreTemplate}/>
                <Column field='cards.TOTAL_UNIDADES' header='Total de Associações' body={totalUnidadesTemplate}/>

                {periodoEmAndamento && <Column field='cards.NAO_RECEBIDA' header='Não recebidas' body={naoRecebidaTemplate}/>}
                {!periodoEmAndamento && <Column field='cards.NAO_APRESENTADA' header='Não apresentadas'  body={naoApresentadaTemplate}/>}
                {periodoEmAndamento && <Column field='cards.RECEBIDA' header='Recebidas e aguardando análise' body={recebidaTemplate}/>}
                {periodoEmAndamento && <Column field='cards.EM_ANALISE' header='Em análise' body={emAnaliseTemplate}/>}
                {periodoEmAndamento && <Column field='cards.DEVOLVIDA' header='Devolvidas para acerto' body={devolvidaTemplate}/>}

                <Column field='cards.APROVADA' header='Aprovadas' body={aprovadaTemplate}/>
                <Column field='cards.APROVADA_RESSALVA' header='Aprovadas com ressalvas' body={aprovadaRessalvaTemplate}/>
                <Column field='cards.REPROVADA' header='Reprovadas' body={reprovadaTemplate}/>
                <Column field='acoes' header='Ações' body={acoesTemplate}/>
            </DataTable>

        </>
    )
}