import React, {useEffect, useState, Fragment} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

export const TabelaDinamica = ({prestacaoDeContas, statusPrestacao, exibeLabelStatus, handleClickAcoes}) => {

    const rowsPerPage = 10;

    const [columns, setColumns] = useState([]);

    useEffect(()=> {
        populaColunas();
    }, [statusPrestacao]);

    const populaColunas = async () =>{
        if (statusPrestacao === 'EM_ANALISE' || statusPrestacao === 'REPROVADA') {
            setColumns(colunasEmAnalise)
        }else if (statusPrestacao === 'APROVADA' || statusPrestacao === 'APROVADA_RESSALVA'){
            setColumns(colunasAprovada)
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
        {field: 'acoes', header: 'Ações'},
    ];

    const colunasEmAnalise = [
        {field: 'unidade_eol', header: 'Código Eol'},
        {field: 'unidade_nome', header: 'Nome da escola'},
        {field: 'processo_sei', header: 'Processo SEI'},
        {field: 'data_recebimento', header: 'Data de recebimento'},
        {field: 'data_ultima_analise', header: 'Última análise'},
        {field: 'tecnico_responsavel', header: 'Técnico atribuído'},
        {field: 'acoes', header: 'Ações'},
    ];

    const colunasAprovada = [
        {field: 'unidade_eol', header: 'Código Eol'},
        {field: 'unidade_nome', header: 'Nome da escola'},
        {field: 'processo_sei', header: 'Processo SEI'},
        {field: 'data_recebimento', header: 'Data de recebimento'},
        {field: 'data_ultima_analise', header: 'Última análise'},
        {field: 'tecnico_responsavel', header: 'Quem está validando'},
        {field: 'tecnico_responsavel', header: 'Devolução ao tesouro'},
        {field: 'status', header: 'Status'},
        {field: 'acoes', header: 'Ações'},
    ];

    const statusTemplate = (rowData) => {
        return (
            <div>
                {rowData['status'] ? <span className={`span-status-${rowData['status']}`}><strong>{exibeLabelStatus(rowData['status']).texto_col_tabela}</strong></span> : ''}
            </div>
        )
    };

    const dataTemplate = (rowData) => {
        return (
            <div>
                {rowData['data_recebimento'] ? moment(rowData['data_recebimento']).format('DD/MM/YYYY') : rowData['data_ultima_analise'] ? moment(rowData['data_ultima_analise']).format('DD/MM/YYYY') : '-' }
            </div>
        )
    };

    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button onClick={()=>handleClickAcoes(rowData)} type="button" className="btn btn-link">
                    <FontAwesomeIcon
                        style={{marginRight: "0", color: '#00585E'}}
                        icon={faEye}
                    />
                </button>
            </div>
        )
    };


    const dynamicColumns = columns.map((col,i) => {
        if (col.field === 'status'){
            return <Column key={col.field} field={col.field} header={col.header} body={statusTemplate} />;
        }else if(col.field === 'data_recebimento' || col.field === 'data_ultima_analise') {
            return <Column key={col.field} field={col.field} header={col.header} body={dataTemplate} />;
        }else if(col.field === 'acoes') {
            return <Column key={col.field} field={col.field} header={col.header} body={acoesTemplate} />;
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