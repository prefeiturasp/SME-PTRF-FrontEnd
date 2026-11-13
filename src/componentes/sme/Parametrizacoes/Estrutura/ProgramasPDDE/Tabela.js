import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { EditIconButton } from "../../../../Globais/UI/Button";

const Tabela = ({data, handleOpenModalForm}) => {

    const acoesTemplate = (rowData) => (
        <EditIconButton onClick={() => handleOpenModalForm(rowData)}/>
    );

    return (
        <>
            <p>Exibindo <span data-qa="total-programas" className="total-programas">{data.count}</span> Programas</p>
            <DataTable value={data.results} id="tabela-programas-pdde">
                <Column field="nome" header="Programa"/>
                <Column
                    field="acoes"
                    header="Ações"
                    body={acoesTemplate}
                    style={{width: '10%', textAlign: 'center'}}
                />
            </DataTable>
        </>
    );
};

export default memo(Tabela)
