import React from "react";
import useDataTemplate from "../../../hooks/Globais/useDataTemplate";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

export const ResumoPorUnidadeEducacional = ({unidadesEducacionais}) => {
    const dataTemplate = useDataTemplate()
    const rowsPerPage = 10

    const style = {
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: '700',
        lineHeight: '20px',
        letterSpacing: '0em',
        textAlign: 'left',
        color: '#42474A'
    };

    const commonStyles = {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '16px',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '0.01em'
    };
    
    const getStyles = (color) => ({
        ...commonStyles,
        color
    });
    
    const stylesStatus = (rowData) => {
        if (rowData) {
            if (rowData.status === 'NAO_RECEBIDA' || rowData.status === 'NAO_APRESENTADA') {
                return getStyles('#B40C02');
            } else if (["APROVADA", "APROVADA_RESSALVA", "RECEBIDA"].includes(rowData.status)) {
                return getStyles('#297805');
            } else if (["EM_ANALISE", "DEVOLVIDA", "DEVOLVIDA_RETORNADA", "DEVOLVIDA_RECEBIDA"].includes(rowData.status)) {
                return getStyles('#F9A825');
            }
        }
    }
    
    const alteraColorETexto = (rowData) => {

            if (rowData === 'NAO_RECEBIDA') {
                return 'Não recebida' 
            } else if (rowData === 'RECEBIDA') {
                return 'Recebida'
            } else if (rowData === 'DEVOLVIDA') {
                return 'Devolvida para acerto'
            } else if (rowData === 'EM_ANALISE') {
                return 'Em análise'
            } else if (rowData === 'APROVADA') {
                return 'Aprovada'
            } else if (rowData === 'APROVADA_RESSALVA') {
                return 'Aprovada com ressalva'
            } else if (rowData === 'REPROVADA') {
                return 'Reprovada'
            } else if (rowData === 'NAO_APRESENTADA') {
                return 'Não apresentada'
            } else if (rowData === 'DEVOLVIDA_RETORNADA') {
                return 'Apresentada após acertos'
            }else {
                return '-'
            }
        }

    const codigoEOLTemplate = (rowData) => {
        if(rowData.unidade_eol === '200237') {
        }
        return rowData.unidade_eol ? rowData.unidade_eol : '-'
    }

    const nomeDaUnidadeTemplate = (rowData) => {
        return rowData.unidade_nome ? rowData.unidade_nome : '-'
    }

    const processoSeiTemplate = (rowData) => {
        return rowData.processo_sei ? rowData.processo_sei : '-'
    }

    const dataDeRecebimentoTemplate = (rowData) => {
        return rowData.data_recebimento ? dataTemplate(null, null, rowData.data_recebimento) : '-'
    }

    const ultimaAnaliseTemplate = (rowData) => {
        return rowData.data_ultima_analise ? dataTemplate(null, null, rowData.data_ultima_analise) : '-'
    }

    const tecnicoResponsavelTemplate = (rowData) => {
        return rowData.tecnico_responsavel ? rowData.tecnico_responsavel : '-'
    }

    const devolucaoTesouroTemplate = (rowData) => {
        return rowData.devolucao_ao_tesouro ? rowData.devolucao_ao_tesouro : '-'
    }

    const statusTemplate = (rowData) => {
        return <span style={stylesStatus(rowData)}>{alteraColorETexto(rowData?.status)}</span>
    }

    return (
        <>
            <DataTable
                value={unidadesEducacionais}
                className="mt-3 datatable-footer-coad"
                paginator={true}
                rows={rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            >
                <Column field='' header='Código EOL' body={codigoEOLTemplate}/>
                <Column field='' header='Nome da unidade' style={style} body={nomeDaUnidadeTemplate}/>
                <Column field='' header='Processo SEI' body={processoSeiTemplate}/>
                <Column field='' header='Data de recebimento'  body={dataDeRecebimentoTemplate}/>
                <Column field='' header='Última análise' body={ultimaAnaliseTemplate}/>
                <Column field='' header='Técnico responsável' body={tecnicoResponsavelTemplate}/>
                <Column field='' header='Devolução ao tesouro' body={devolucaoTesouroTemplate}/>
                <Column field='' body={statusTemplate}/>
            </DataTable>

        </>
    )
}