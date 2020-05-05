import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";

export const TabelaDeLancamentosReceitas = ({receitas}) => {
    const rowsPerPage = 7;

    const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData['data']
                    ? moment(rowData['data']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    }

    const valorTemplate = (rowData, column) => {
        const valorFormatado = rowData['valor']
            ? Number(rowData['valor']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : ''
        return (<span>{valorFormatado}</span>)
    }
    return(
        <>
        {receitas && receitas.length > 0 ? (<DataTable
                value={receitas}
                className="mt-3 datatable-footer-coad"
                paginator={receitas.length > rowsPerPage}
                rows={rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                autoLayout={true}
                selectionMode="single"
                //onRowClick={e => redirecionaDetalhe(e.data)}
            >
                <Column field='tipo_receita.nome' header='Tipo'/>
                <Column field='conta_associacao.nome' header='Conta'/>
                <Column field='acao_associacao.nome' header='Ação'/>
                <Column
                    field='data'
                    header='Data'
                    body={dataTemplate}/>
                <Column
                    field='valor'
                    header='Valor'
                    body={valorTemplate}/>
            </DataTable>
            ):null
        }
        </>
    )
}