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
                <Column field="unidade__codigo_eol" header="Código Eol" sortable style={{width: '13%'}}/>
                <Column field="unidade__nome" header="Nome da Unidade Educacional" sortable style={{width: '30%'}}/>
                <Column field="obs_periodo__data_extrato" header="Data informada" body={dataTemplate} sortable style={{width: '16%'}}/>
                <Column field="obs_periodo__saldo_extrato" header="Valor informado (R$)" body={valorTemplate} sortable style={{width: '21%'}}/>
                <Column field="acoes" header="Ações" body={acoesTemplate} style={{width: '15%'}}/>
            </DataTable>
        </div>
    )
};