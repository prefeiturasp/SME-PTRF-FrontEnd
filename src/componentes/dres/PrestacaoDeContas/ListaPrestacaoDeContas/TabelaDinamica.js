import React, {useEffect, useState, Fragment} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export const TabelaDinamica = ({prestacaoDeContas, statusPrestacao, exibeLabelStatus}) => {

    console.log("TabelaDinamica statusPrestacao ", statusPrestacao);
    console.log("TabelaDinamica prestacaoDeContas ", prestacaoDeContas);

    const [columns, setColumns] = useState([]);

    useEffect(()=> {
        populaColunas();
    }, [statusPrestacao]);

    const populaColunas = async () =>{
        if (statusPrestacao === 'EM_ANALISE'){
            setColumns(colunasEmAnalise)
        }else {
            setColumns(colunasNaoRecebidas)
        }
    };

    const colunasNaoRecebidas = [
        {field: 'unidade_eol', header: 'Código Eol'},
        {field: 'unidade_nome', header: 'Nome da unidade'},
        {field: 'tecnico_responsavel', header: 'Técnico atribuído'},
        {field: 'data_recebimento', header: 'Data de recebimento'},
        {field: 'status', header: 'Status'},
        {field: 'quantity', header: 'Ações'},
    ];

    const colunasEmAnalise = [
        {field: 'unidade_eol', header: 'Código Eol'},
        {field: 'unidade_nome', header: 'Nome da escola'},
        {field: 'processo_sei', header: 'Processo SEI'},
        {field: 'data_recebimento', header: 'Data de recebimento'},
        {field: 'data_ultima_analise', header: 'Última análise'},
        {field: 'tecnico_responsavel', header: 'Técnico atribuído'},
        {field: 'quantity', header: 'Ações'},
    ];

    const statusTemplate = (rowData) => {
        return (
            <div>
                {rowData['status'] ? <span>{exibeLabelStatus(rowData['status']).texto_col_tabela}</span> : ''}
            </div>
        )
    }


    const dynamicColumns = columns.map((col,i) => {
        if (col.field === 'status'){
            return <Column key={col.field} field={col.field} header={col.header} body={statusTemplate} />;
        }else {
            return <Column key={col.field} field={col.field} header={col.header} />;
        }

    });

    return (
        <>
            <div>
                <div className="card">
                    <DataTable value={prestacaoDeContas}>
                        {dynamicColumns}
                    </DataTable>
                </div>
            </div>
        </>
    )
};