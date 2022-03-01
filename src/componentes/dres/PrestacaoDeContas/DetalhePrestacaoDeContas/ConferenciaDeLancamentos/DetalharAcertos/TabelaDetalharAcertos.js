import React, {useState} from "react";
// Hooks Personalizados
import useValorTemplate from "../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate";
import useDataTemplate from "../../../../../../hooks/Globais/useDataTemplate";
import useConferidoTemplate from "../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate";
import useRowExpansionDespesaTemplate from "../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionDespesaTemplate";
import useRowExpansionReceitaTemplate from "../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionReceitaTemplate";
import useNumeroDocumentoTemplate from "../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

export const TabelaDetalharAcertos = ({lancamemtosParaAcertos, prestacaoDeContas, rowClassName}) =>{

    const rowsPerPage = 10;
    const [expandedRows, setExpandedRows] = useState(null);

    // Hooks Personalizados
    const valor_template = useValorTemplate()
    const dataTemplate = useDataTemplate()
    const conferidoTemplate = useConferidoTemplate()
    const rowExpansionDespesaTemplate = useRowExpansionDespesaTemplate(prestacaoDeContas)
    const rowExpansionReceitaTemplate = useRowExpansionReceitaTemplate()
    const numeroDocumentoTemplate = useNumeroDocumentoTemplate()

    const rowExpansionTemplate =  (data) => {
        if (data.tipo_transacao === 'Crédito') {
            return (
                rowExpansionReceitaTemplate(data)
            )
        } else {
            return (
                rowExpansionDespesaTemplate(data)
            )
        }
    };

    const retornaToolTipCredito = (rowData) =>{
        if (rowData.documento_mestre && rowData.documento_mestre.rateio_estornado && rowData.documento_mestre.rateio_estornado.uuid){
            let data_rateio = dataTemplate(null, null, rowData.documento_mestre.rateio_estornado.data_documento)
            let texto_tooltip = `Esse estorno está vinculado <br/> à despesa do dia ${data_rateio}.`
            return(
                <>
                    <div data-tip={texto_tooltip} data-html={true}>
                        <span>{rowData.tipo_transacao}</span>
                        <FontAwesomeIcon
                            style={{fontSize: '18px', marginLeft: "4px", color: '#2A6397'}}
                            icon={faInfoCircle}
                        />
                        <ReactTooltip/>
                    </div>
                </>
            )
        }else {
            return rowData.tipo_transacao
        }
    }

    const retornaToolTipGasto = (rowData) => {

        if (rowData && rowData.rateios && rowData.rateios.length > 0){
            if (rowData.rateios.some(e => e && e.estorno && e.estorno.uuid)) {
                let texto_tooltip = `Esse gasto possui estornos.`
                return(
                    <>
                        <div data-tip={texto_tooltip} data-html={true}>
                            <span>{rowData.tipo_transacao}</span>
                            <FontAwesomeIcon
                                style={{fontSize: '18px', marginLeft: "4px", color: '#2A6397'}}
                                icon={faInfoCircle}
                            />
                            <ReactTooltip/>
                        </div>
                    </>
                )
            }
        }
        return <span>{rowData.tipo_transacao}</span>
    }

    const tipoTransacaoTemplate = (rowData) =>{
        if (rowData && rowData.tipo_transacao && rowData.tipo_transacao === 'Crédito'){
            return retornaToolTipCredito(rowData)
        }else if(rowData && rowData.tipo_transacao && rowData.tipo_transacao === 'Gasto'){
            return retornaToolTipGasto(rowData)
        }
    }

    return(
        <DataTable
            value={lancamemtosParaAcertos}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            paginator={lancamemtosParaAcertos.length > rowsPerPage}
            rows={rowsPerPage}
            rowClassName={rowClassName}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            stripedRows
            className='mt-3'
        >
            <Column
                field='data'
                header='Data'
                body={dataTemplate}
                className="align-middle text-left borda-coluna"
            />
            <Column
                field='tipo_transacao'
                header='Tipo de lançamento'
                className="align-middle text-left borda-coluna"
                body={tipoTransacaoTemplate}
            />
            <Column
                field='numero_documento'
                header='N.º do documento'
                body={numeroDocumentoTemplate}
                className="align-middle text-left borda-coluna"
            />
            <Column field='descricao' header='Descrição' className="align-middle text-left borda-coluna"/>
            <Column
                field='valor_transacao_total'
                header='Valor (R$)'
                body={valor_template}
                className="align-middle text-left borda-coluna"
            />
            <Column
                field='analise_lancamento'
                header='Conferido'
                body={conferidoTemplate}
                className="align-middle text-left borda-coluna"
                style={{borderRight: 'none'}}
            />
            <Column expander style={{width: '3em', borderLeft: 'none'}}/>
        </DataTable>
    )
}