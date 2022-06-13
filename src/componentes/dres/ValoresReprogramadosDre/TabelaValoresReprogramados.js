import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const TabelaValoresReprogramados = ({
    listaDeValoresReprogramados,
    rowsPerPage,
    valorTemplateCheque, 
    valorTemplateCartao,
    statusTemplate,
    acoesTemplate
}) => {

    return(
        <DataTable
            value={listaDeValoresReprogramados}
            rows={rowsPerPage}
            paginator={listaDeValoresReprogramados.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column field="associacao.unidade.codigo_eol" header="Código Eol" style={{width: '9%'}}/>
            <Column 
                field="associacao.unidade.nome_com_tipo" 
                header="Nome da unidade" 
                style={{width: '38%'}}
            />
            <Column field="periodo.referencia" header="Período" style={{width: '8%'}}/>
            <Column 
                field="total_conta_cheque" 
                header="Saldo Cheque" 
                body={valorTemplateCheque} 
                style={{width: '12%'}}
            />
            <Column 
                field="total_conta_cartao" 
                header="Saldo Cartão" 
                body={valorTemplateCartao} 
                style={{width: '12%'}}
            />
            <Column 
                field="associacao.status_valores_reprogramados" 
                header="Status" 
                body={statusTemplate} 
                style={{width: '15%'}}
            />
            <Column field="" header="Ações" body={acoesTemplate} style={{width: '6%'}}/>
            
        </DataTable>
    )
}