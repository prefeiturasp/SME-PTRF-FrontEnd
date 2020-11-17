import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

 const TabelaListaPrestacoesDaDre = ({listaPrestacoes, valorTemplate})=>{
    console.log("listaPrestacoes ", listaPrestacoes);

    const unidadeTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{rowData.unidade.codigo_eol} - {rowData.unidade.nome}</span></p>
             </React.Fragment>
         )
     };

    const tipoRecursoTemplate = () =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">Capital</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">Custeio</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">RLA</span></p>
             </React.Fragment>
         )
     };

    const reprogramadoTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.demais_creditos_no_periodo_custeio)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.demais_creditos_no_periodo_capital)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.demais_creditos_no_periodo_livre)}</span></p>
             </React.Fragment>
         )
     };

     const statusTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{rowData.status_prestacao_contas}</span></p>
             </React.Fragment>
         )
     };

  return(
      <>
          {listaPrestacoes && listaPrestacoes.length > 0 &&
              <div className="card">
                  <DataTable
                      value={listaPrestacoes}
                      className='tabela-lista-prestacoes-dre'
                      paginator
                      paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                      rows={10}
                      rowsPerPageOptions={[10,20,50]}
                  >
                      <Column
                          field='unidade.nome'
                          header="Unidade educacional"
                          body={unidadeTemplate}
                          className='align-top'
                      />
                      <Column
                          filterField={'valores.demais_creditos_no_periodo_capital'}
                          header=" Tipo de recurso"
                          body={tipoRecursoTemplate}
                      />
                      <Column
                          field='valores.demais_creditos_no_periodo_capital'
                          header="Reprogramado"
                          body={reprogramadoTemplate}
                      />
                      <Column
                          field='unidade.nome'
                          header="Unidade educacional"
                          body={statusTemplate}
                          className='align-top'
                      />
                  </DataTable>
              </div>
          }

      </>
  )
};

 export default memo(TabelaListaPrestacoesDaDre)