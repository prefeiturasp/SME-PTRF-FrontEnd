import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelaAnaliseDre = ({rowsPerPage, listaDeAnalises, acoesTemplate, periodoTemplate, resultadoAnaliseTemplate})=>{
    return(
        <DataTable
            value={listaDeAnalises}
            rows={rowsPerPage}
            paginator={listaDeAnalises.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            className='mt-4'
        >
            <Column
                field="referencia"
                header="Período"
                body={periodoTemplate}
            />
            <Column
                field="texto_status"
                header="Resultado da análise"
                body={resultadoAnaliseTemplate}
            />
            <Column
                field="ver_acertos"
                header="Ver acertos"
                body={acoesTemplate}
                style={{width:'200px'}}
            />

        </DataTable>
    );
};
export default memo(TabelaAnaliseDre)

