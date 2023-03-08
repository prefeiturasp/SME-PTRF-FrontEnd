import React from "react";
import {Link} from "react-router-dom";

import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

import ReactTooltip from "react-tooltip";

export const ResumoPorDre = ({resumoPorDre, statusPeriodo, periodoEscolhido}) => {

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
        return (
            <div>
                <span style={rowData.periodo_completo ? estiloLinhaCompleta : estiloLinhaIcompleta}> {rowData.dre.sigla}</span>
            </div>
        )
    };

    const acoesTemplate = (rowData) => {
        let url = `/acompanhamento-pcs-sme/${rowData.dre.uuid}/${periodoEscolhido}`;

        return (
            <div>
                <Link
                    to={{
                        pathname: `${url}`,
                        state: {nome_dre: rowData.dre.nome}
                    }}
                    className={`btn btn-link`}
                >
                    <FontAwesomeIcon
                        style={{marginRight: "0", color: '#00585E'}}
                        icon={faEye}
                    />
                </Link>
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

    const naoApresentadaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.NAO_APRESENTADA)
    };

    const recebidaTemplate = (rowData) => {
        return colunaTemplate(rowData.periodo_completo, rowData.cards.RECEBIDA)
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

    const emAnaliseHeaderTemplate = () => {
        return (
            <span data-html={true} data-tip={"Soma das PCs Não recebidas, Em análise e Devolvidas para acertos."} data-for="em-analise-header-id">
                <span>Em análise</span>
                <ReactTooltip id="em-analise-header-id" html={true}/>
            </span>
        )
    }

    const emAnaliseBodyTemplate = (rowData) => {
        const quantidadeCardsEmAnalise = rowData.cards.EM_ANALISE + rowData.cards.NAO_RECEBIDA + rowData.cards.DEVOLVIDA;

        const completo = rowData.periodo_completo

        return (
            <span data-html={true} data-tip={"Soma das PCs Não recebidas, Em análise e Devolvidas para acertos."} data-for="em-analise-body-id">
                <span style={completo ? estiloLinhaCompleta : estiloLinhaIcompleta}> {quantidadeCardsEmAnalise}</span>
                <ReactTooltip html={true} id="em-analise-body-id"/>
            </span>
        )
    }

    return (
        <>
            <DataTable
                value={resumoPorDre}
                className="mt-3 datatable-footer-coad"
                paginator={false}
            >
                <Column field='dre.sigla' header='DRE' body={siglaDreTemplate}/>
                <Column field='cards.TOTAL_UNIDADES' header='Total de Associações' body={totalUnidadesTemplate}/>

                {!periodoEmAndamento && <Column field='cards.NAO_APRESENTADA' header='Não apresentadas'  body={naoApresentadaTemplate}/>}
                {periodoEmAndamento && <Column field='cards.RECEBIDA' header='Recebidas e aguardando análise' body={recebidaTemplate}/>}
                {periodoEmAndamento && <Column field='cards.EM_ANALISE' header={emAnaliseHeaderTemplate()} body={emAnaliseBodyTemplate}/>}

                <Column field='cards.APROVADA' header='Aprovadas' body={aprovadaTemplate}/>
                <Column field='cards.APROVADA_RESSALVA' header='Aprovadas com ressalvas' body={aprovadaRessalvaTemplate}/>
                <Column field='cards.REPROVADA' header='Reprovadas' body={reprovadaTemplate}/>
                <Column field='acoes' header='Ações' body={acoesTemplate}/>
            </DataTable>

        </>
    )
}