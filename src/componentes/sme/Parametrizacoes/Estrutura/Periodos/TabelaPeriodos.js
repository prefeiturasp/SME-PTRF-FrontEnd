import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelaPeriodos = ({rowsPerPage, listaDePeriodos, dataTemplate, acoesTemplate}) =>{
    return(
        <DataTable
            value={listaDePeriodos}
            rows={rowsPerPage}
            paginator={listaDePeriodos.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
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
    );
};

export default memo(TabelaPeriodos)