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
            <Column field='tipo_transacao' header='Tipo de lançamento'
                    className="align-middle text-left borda-coluna"/>
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