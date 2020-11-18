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
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.saldo_reprogramado_periodo_anterior_capital)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.saldo_reprogramado_periodo_anterior_custeio)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.saldo_reprogramado_periodo_anterior_livre)}</span></p>
             </React.Fragment>
         )
     };

    const repasseTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.repasses_no_periodo_capital)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.repasses_no_periodo_custeio)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.repasses_no_periodo_livre)}</span></p>
             </React.Fragment>
         )
     };

     const rendimentoTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.receitas_rendimento_no_periodo_capital)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.receitas_rendimento_no_periodo_custeio)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.receitas_rendimento_no_periodo_livre)}</span></p>
             </React.Fragment>
         )
     };

     const devolucaoPtrfTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.receitas_devolucao_no_periodo_capital)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.receitas_devolucao_no_periodo_custeio)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.receitas_devolucao_no_periodo_livre)}</span></p>
             </React.Fragment>
         )
     };

     const demaisCreditosTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.demais_creditos_no_periodo_capital)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.demais_creditos_no_periodo_custeio)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.demais_creditos_no_periodo_livre)}</span></p>
             </React.Fragment>
         )
     };

     const despesaRealizadaTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.despesas_no_periodo_capital)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.despesas_no_periodo_custeio)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">-</span></p>
             </React.Fragment>
         )
     };
     const saldoTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.saldo_reprogramado_proximo_periodo_capital)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.saldo_reprogramado_proximo_periodo_custeio)}</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.saldo_reprogramado_proximo_periodo_livre)}</span></p>
             </React.Fragment>
         )
     };
     const devolucaoTesouroTemplate = (rowData) =>{
         return (
             <React.Fragment>
                 <p className='mb-0 p-0'><span className="py-2 px-2 conteudo-celulas-lista-dres">-</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">-</span></p>
                 <p className='mb-0 border-top'><span className="p-2 py-2 px-2 conteudo-celulas-lista-dres">{valorTemplate(rowData.valores.devolucoes_ao_tesouro_no_periodo_total)}</span></p>
             </React.Fragment>
         )
     };

     const statusTemplate = (rowData) =>{
         return (
             <div>
                 {rowData['status_prestacao_contas'] ? <p className='mb-0 p-0'><span className={`py-2 px-2 conteudo-celulas-lista-dres span-status-${rowData['status_prestacao_contas']}`}><strong>{exibeLabelStatus(rowData['status_prestacao_contas']).texto_col_tabela}</strong></span></p> : ''}
             </div>
         )
     };

     const exibeLabelStatus = (status_converter) => {

         if (status_converter === 'NAO_RECEBIDA') {
             return {
                 texto_col_tabela: 'Não recebida',
             }
         } else if (status_converter === 'RECEBIDA') {
             return {
                 texto_col_tabela: 'Recebida',
             }
         } else if (status_converter === 'DEVOLVIDA') {
             return {
                 texto_col_tabela: 'Devolvida para acerto',
             }
         } else if (status_converter === 'EM_ANALISE') {
             return {
                 texto_col_tabela: 'Em análise',
             }
         } else if (status_converter === 'APROVADA') {
             return {
                 texto_col_tabela: 'Aprovada',
             }
         } else if (status_converter === 'APROVADA_RESSALVA') {
             return {
                 texto_col_tabela: 'Aprovada com ressalva',
             }
         } else if (status_converter === 'REPROVADA') {
             return {
                 texto_col_tabela: 'Reprovada',
             }
         } else if (status_converter === 'NAO_APRESENTADA') {
             return {
                 texto_col_tabela: 'Não apresentada',
             }
         } else {
             return {
                 texto_col_tabela: 'SEM STATUS',
             }
         }
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
                          field='valores.demais_creditos_no_periodo_capital'
                          header="Repasse"
                          body={repasseTemplate}
                      />
                      <Column
                          field='valores.demais_creditos_no_periodo_capital'
                          header="Rendimento"
                          body={rendimentoTemplate}
                      />
                      <Column
                          field='valores.demais_creditos_no_periodo_capital'
                          header="Devolução à conta PTRF"
                          body={devolucaoPtrfTemplate}
                      />
                      <Column
                          field='valores.demais_creditos_no_periodo_capital'
                          header="Demais créditos"
                          body={demaisCreditosTemplate}
                      />
                      <Column
                          field='valores.demais_creditos_no_periodo_capital'
                          header="Despesa realizada"
                          body={despesaRealizadaTemplate}
                      />
                      <Column
                          field='valores.demais_creditos_no_periodo_capital'
                          header="Saldo"
                          body={saldoTemplate}
                      />
                      <Column
                          field='valores.demais_creditos_no_periodo_capital'
                          header="Devolução ao tesouro"
                          body={devolucaoTesouroTemplate}
                      />
                      <Column
                          field='status_prestacao_contas'
                          header="Situação da Prestação de Contas"
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