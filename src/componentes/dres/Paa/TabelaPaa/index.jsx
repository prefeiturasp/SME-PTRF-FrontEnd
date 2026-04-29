import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export const TabelaPaa = ({
    listaPaa,
    linhasPorPagina,
    unidadeEscolarTemplate,
    acaoTemplatePdf,
    aoMudarPagina,
    paginaAtual
}) => {

    return (
        <DataTable
            value={listaPaa?.results}
            lazy
            paginator
            rows={linhasPorPagina}
            totalRecords={listaPaa?.count}
            first={(paginaAtual - 1) * linhasPorPagina}
            onPage={aoMudarPagina}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column 
                field="codigo_eol" header="Código EOL" 
                body={(rowData) => rowData?.unidade?.codigo_eol || "-"} 
            />

            <Column
                header="Unidade educacional"
                body={unidadeEscolarTemplate}
                style={{ width: "40%", textTransform: "uppercase" }}
            />

            <Column
                header="Período"
                body={(rowData) => rowData?.periodo_paa?.referencia || "-"}
            />

            <Column
                header="Status"
                body={(rowData) => rowData?.status_display || "-"}
            />

            <Column
                header="Documento"
                body={acaoTemplatePdf}
                style={{ textAlign: 'center' }}
            />
        </DataTable>
    );
};