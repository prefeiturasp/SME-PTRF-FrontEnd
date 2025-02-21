import React, { memo, useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelaArquivosDeCarga = ({
  arquivos,
  rowsPerPage,
  conteudoTemplate,
  dataTemplate,
  dataHoraTemplate,
  statusTemplate,
  acoesTemplate
}) => {
  const [page, setPage] = useState(0);
  const [filteredArquivos, setFilteredArquivos] = useState(arquivos);

  useEffect(() => {
    setPage(0); 
    setFilteredArquivos(arquivos);  
  }, [arquivos]);

  const onPageChange = (event) => {
    setPage(event.page);
  };

  return (
    <DataTable
      className="container-tabela-associacoes"
      value={filteredArquivos} 
      rows={rowsPerPage}
      paginator={filteredArquivos.length > rowsPerPage} 
      paginatorTemplate="PrevPageLink PageLinks NextPageLink"
      autoLayout={true}
      onPage={onPageChange}
      first={page * rowsPerPage}
    >
      <Column
        field="identificador"
        header="Identificador"
        className="quebra-palavra"
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

export default memo(TabelaArquivosDeCarga);
