import React, { memo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { EditIconButton } from "../../Globais/UI/Button";
import useDataTemplate from "../../../hooks/Globais/useDataTemplate";

const Tabela = ({ lista, handleEditFormModal }) => {
    const dataTemplate = useDataTemplate();

    const dataInicialTemplate = (rowData) => dataTemplate("", "", rowData.data_inicial);
    const dataFinalTemplate = (rowData) => dataTemplate("", "", rowData.data_final);

    const acoesTemplate = (rowData) => (
        <EditIconButton onClick={() => handleEditFormModal(rowData)} />
    );

    return (
        <DataTable
            className="Tabela"
            data-qa="tabela-mandato-vacancia"
            value={lista}
        >
            <Column data-qa="tabela-col-mandato-vacancia-referencia" field="referencia_mandato" header="Referência" />
            <Column data-qa="tabela-col-mandato-vacancia-data-inicial" field="data_inicial" header="Data inicial" body={dataInicialTemplate} />
            <Column data-qa="tabela-col-mandato-vacancia-data-final" field="data_final" header="Data final" body={dataFinalTemplate} />
            <Column
                data-qa="tabela-col-mandato-vacancia-acoes"
                field="acoes"
                header="Ações"
                body={acoesTemplate}
                style={{ width: '80px', textAlign: 'center' }}
            />
        </DataTable>
    );
};

export default memo(Tabela);
