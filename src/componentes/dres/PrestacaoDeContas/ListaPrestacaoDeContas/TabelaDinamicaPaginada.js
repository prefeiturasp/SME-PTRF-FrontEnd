import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const TabelaDinamicaPaginada = ({
    prestacaoDeContas,
    rowsPerPage,
    columns,
    statusTemplate,
    dataTemplate,
    acoesTemplate,
    seiTemplate,
    devolucaoTemplate,
    tecnicoTemplate,
    nomeTemplate,
    paginaAtual,
    totalRegistros,
    handlePageChange,
}) => {
    const dynamicColumns = columns.map((col) => {
        if (col.field === "status") {
            return (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={statusTemplate}
                />
            );
        } else if (
            col.field === "data_recebimento" ||
            col.field === "data_ultima_analise"
        ) {
            return (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={dataTemplate}
                />
            );
        } else if (col.field === "processo_sei") {
            return (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={seiTemplate}
                />
            );
        } else if (col.field === "tecnico_responsavel") {
            return (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={tecnicoTemplate}
                />
            );
        } else if (col.field === "devolucao_ao_tesouro") {
            return (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={devolucaoTemplate}
                />
            );
        } else if (col.field === "acoes") {
            return (
                <Column
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    body={acoesTemplate}
                />
            );
        } else if (col.field === "unidade_nome") {
            return (
                <Column
                    key={col.field}
                    style={{ width: "23%" }}
                    field={col.field}
                    header={col.header}
                    body={nomeTemplate}
                />
            );
        }

        return (
            <Column
                key={col.field}
                style={{ width: "7%" }}
                field={col.field}
                header={col.header}
            />
        );
    });

    return (
        <div className="card">
            <DataTable
                value={prestacaoDeContas}
                lazy
                paginator={totalRegistros > rowsPerPage}
                first={(paginaAtual - 1) * rowsPerPage}
                rows={rowsPerPage}
                totalRecords={totalRegistros}
                onPage={handlePageChange}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
                emptyMessage="Nenhuma prestação de contas encontrada."
            >
                {dynamicColumns}
            </DataTable>
        </div>
    );
};
