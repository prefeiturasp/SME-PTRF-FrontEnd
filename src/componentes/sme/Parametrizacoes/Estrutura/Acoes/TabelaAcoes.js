import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'


export const TabelaAcoes = ({
    todasAsAcoes,
    rowsPerPage,
    acoesTemplate,
    conferirUnidadesTemplate,
    aceitaCapitalTemplate,
    aceitaCusteioTemplate,
    aceitaLivreTemplate,
    recursosPropriosTemplate,
}) => {

    return(
        <DataTable
            value={todasAsAcoes}
            paginator={todasAsAcoes.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="nome" header="Nome"/>

            <Column body={conferirUnidadesTemplate} header='UEs vinculadas'
                                                style={{textAlign: 'center', width:'140px',}}/>
            <Column body={aceitaCapitalTemplate} header='Aceita Capital'
                                                style={{textAlign: 'center', width:'110px',}}/>
            <Column body={aceitaCusteioTemplate} header='Aceita Custeio'
                                                style={{textAlign: 'center', width:'110px',}}/>
            <Column body={aceitaLivreTemplate} header='Aceita Livre Aplicação'
                                                style={{textAlign: 'center', width:'110px',}}/>
            <Column body={recursosPropriosTemplate} header='Recursos externos'
                                                style={{textAlign: 'center', width:'110px',}}/>

            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
                style={{width:'80px', textAlign: 'center'}}
            />
        </DataTable>
    )
};