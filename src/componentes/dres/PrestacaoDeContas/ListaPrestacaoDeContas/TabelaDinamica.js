import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export const TabelaDinamica = ({prestacaoDeContas, rowsPerPage, columns, statusTemplate, dataTemplate, acoesTemplate, nomeTemplate}) => {

    const dynamicColumns = columns.map((col) => {
        if (col.field === 'status'){
            return <Column key={col.field} field={col.field} header={col.header} body={statusTemplate} />;
        }else if(col.field === 'data_recebimento' || col.field === 'data_ultima_analise') {
            return <Column key={col.field} field={col.field} header={col.header} body={dataTemplate} />;
        }else if(col.field === 'acoes') {
            return <Column key={col.field} field={col.field} header={col.header} body={acoesTemplate} />;
        }else if(col.field === 'unidade_nome') {
            return <Column key={col.field} field={col.field} header={col.header} body={nomeTemplate} />;
        }else {
            return <Column key={col.field} field={col.field} header={col.header} />;
        }
    });

    return (
        <>
            <div>
                <div className="card">
                    <DataTable
                        value={prestacaoDeContas}
                        paginator={prestacaoDeContas.length > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                    >
                        {dynamicColumns}
                    </DataTable>
                </div>
            </div>
        </>
    )
};