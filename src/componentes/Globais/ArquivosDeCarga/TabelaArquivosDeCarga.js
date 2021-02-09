import React, {memo} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelaArquivosDeCarga = ({arquivos, rowsPerPage, conteudoTemplate, dataTemplate, dataHoraTemplate, statusTemplate, acoesTemplate}) =>{
    return(
        <DataTable
            className='container-tabela-associacoes'
            value={arquivos}
            rows={rowsPerPage}
            paginator={arquivos.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            autoLayout={true}
        >
            <Column
                field="identificador"
                header="Identificador"
                className='quebra-palavra'
            />
            <Column
                field="conteudo"
                header="Conteúdo"
                body={conteudoTemplate}
            />
            <Column
                field="criado_em"
                header="Data"
                body={dataTemplate}
            />
            <Column
                field="status"
                header="Status"
                body={statusTemplate}
            />
            <Column
                field="ultima_execucao"
                header="Última execução"
                body={dataHoraTemplate}
            />
            <Column
                field="acoes"
                header="Ações"

                body={acoesTemplate}
            />
        </DataTable>
    );
};

export default memo(TabelaArquivosDeCarga)