import React, {memo, useCallback} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import moment from "moment";
import { IconButton } from "../../../../Globais/UI";

const Tabela = ({
    rowsPerPage, 
    data, 
    count,
    handleOpenModalForm
}) =>{
    const dataTemplate = useCallback((rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : ''}
            </div>
        )
    }, []);

    const acoesTemplate = (rowData) => {
        return (
            rowData.editavel ? (
                <IconButton
                    icon="faEdit"
                    iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
                    onClick={() => handleOpenModalForm(rowData)}
                    aria-label="Editar"
                />
            ) : (
                <IconButton
                    icon="faEye"
                    iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
                    onClick={() => handleOpenModalForm(rowData)}
                    aria-label="Visualizar"
                />
            )
        )
    }

    return(
        <>
        <p>Exibindo <span data-qa="total-acoes" className='total-acoes'>{count}</span> períodos</p>        
        <DataTable  
            value={data}
            rows={rowsPerPage}
            paginator={data.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            id={'tabela-periodos'}
        >
            <Column field="referencia" header="Referência"/>
            <Column
                field="data_prevista_repasse"
                header="Data prevista do repasse"
                body={dataTemplate}
            />
            <Column
                field="data_inicio_realizacao_despesas"
                header="Início realização de despesas"
                body={dataTemplate}
            />
            <Column
                field="data_fim_realizacao_despesas"
                header="Fim realização de despesas"
                body={dataTemplate}
            />
            <Column
                field="data_inicio_prestacao_contas"
                header="Início prestação de contas"
                body={dataTemplate}
            />
            <Column
                field="data_fim_prestacao_contas"
                header="Fim prestação de contas"
                body={dataTemplate}
            />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
        </>

    );
};

export default memo(Tabela)