import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Paginator} from 'primereact/paginator';

export const Tabela = ({
    todasAsContas, 
    rowsPerPage, 
    statusTemplate, 
    acoesTemplate, 
    onPageChange,
    firstPage
}) => {

    return(
        <>  
            <DataTable
                value={todasAsContas.results}
            >
                <Column field="associacao_dados.nome" header="Associação"/>
                <Column
                    field="tipo_conta_dados.nome"
                    header="Tipo de conta"
                    style={{width: '15%', textAlign: "center",}}/>

                <Column
                    field="status"
                    header="Status"
                    body={statusTemplate}
                    style={{width: '15%', textAlign: "center",}}
                />
                <Column
                    field="acoes"
                    header="Ações"
                    body={acoesTemplate}
                    style={{width: '10%', textAlign: "center",}}
                />
            </DataTable>
            <Paginator
                first={firstPage}
                rows={rowsPerPage}
                totalRecords={todasAsContas.count}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={onPageChange}
            />
        </>
    )
};