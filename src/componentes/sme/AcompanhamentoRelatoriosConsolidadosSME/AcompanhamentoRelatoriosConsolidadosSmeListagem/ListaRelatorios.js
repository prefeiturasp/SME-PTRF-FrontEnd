import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export const ListaRelatorios = ({relatoriosConsolidados, rowsPerPage, acoesTemplate, statusSmeTemplate}) =>{
    return (
        <>
            <div className="card">
                <DataTable
                    value={relatoriosConsolidados}
                    paginator={relatoriosConsolidados.length > rowsPerPage}
                    rows={rowsPerPage}
                    paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                >
                    <Column field='nome_da_dre' header='Nome da DRE' className="nome-dre-tabela" style={{width: '35%'}}/>
                    <Column field='tipo_relatorio' header='Tipo de Relatório' style={{width: '12%'}}/>
                    <Column field='total_unidades_no_relatorio' header='Total de unidades no relatório' style={{width: '13%'}}/>
                    <Column field='data_recebimento' header='Data de recebimento' style={{width: '13%'}}/>
                    <Column header='Status' body={statusSmeTemplate}  style={{width: '20%'}}/>
                    <Column header='Ação' body={acoesTemplate} className="" style={{width: '7%'}}/>
                </DataTable>
            </div>
            
        </>
    )
};