import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const TabelaSaldosDetalhesAssociacoes = ({saldosDetalhesAssociacoes, valorTemplate, dataTemplate, acoesTemplate, rowsPerPage}) =>{
    return(
        <div className='mt-3'>
            <DataTable
                value={saldosDetalhesAssociacoes}
                paginator={saldosDetalhesAssociacoes.length > rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                rows={rowsPerPage}
            >
                <Column field="unidade__codigo_eol" header="Código Eol" sortable/>
                <Column field="nome" header="Nome da Unidade Educacional" sortable/>
                <Column field="obs_periodo__data_extrato" header="Data informada" body={dataTemplate} sortable/>
                <Column field="obs_periodo__saldo_extrato" header="Valor informado (R$)" body={valorTemplate} sortable/>
                <Column field="acoes" header="Ações" body={acoesTemplate}/>
            </DataTable>
        </div>
    )
};