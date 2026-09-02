import React from "react";
import { Spin } from "antd";
import { useRecursoSelecionadoContext } from "../../../../../../../../context/RecursoSelecionado";
import { useReordenarAcoesContext } from "../hooks/useReordenarAcoesContext";
import Loading from "../../../../../../../../utils/Loading";
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import {
    aceitaCapitalTemplate,
    aceitaCusteioTemplate,
    aceitaLivreTemplate,
    recursosPropriosTemplate,
    exibePaaTemplate,
    ordenacaoHeaderTemplate
} from "../../../templates/acoesTemplates";

export const TabelaOrdenarAcoes = () => {
  const { 
    isLoading,
    existemDiferencas,
    tempResults,
    setTempResults,
    setUuidsOrdenados,
    handleSalvarOrdenacaoBtnSalvar,
  } = useReordenarAcoesContext();
  
  const { recursoSelecionado } = useRecursoSelecionadoContext();

  // Template customizado passando o rowIndex
  const ordenacaoTemplateCustom = (rowData, options, corRecurso) => {
    // options.rowIndex traz a posição base 0 (0, 1, 2...). Adicionamos +1 para exibir (1, 2, 3...)
    const ordemExibicao = options.rowIndex + 1;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>
          {ordemExibicao}
        </span>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="mt-5">
          <Loading
              corGrafico="black"
              corFonte="dark"
              marginTop="0"
              marginBottom="0"
          />
        </div>
      ) : (
        <>
          <Spin spinning={isLoading} tip="Carregando...">
            <DataTable
              value={tempResults}
              reorderableRows
              onRowReorder={(e) => {
                setTempResults(e.value);
                setUuidsOrdenados(e.value.map((acao) => acao.uuid));
                console.log("Nova ordem de UUIDs:", e.value.map((acao) => acao.uuid));
              }}
              dataKey="uuid"
              size="normal"
              responsiveLayout="scroll"
            >
              <Column
                rowReorder
                style={{ width: "3em", padding: "0.4rem .4rem 0.4rem .8rem" }}
              />

              <Column 
                field="nome" 
                header="Nome"
              />

              <Column 
                body={(rowData, options) => ordenacaoTemplateCustom(rowData, options, recursoSelecionado?.cor)} 
                header={ordenacaoHeaderTemplate(recursoSelecionado?.cor)} 
                style={{ width: '100px', textAlign: 'center' }} 
                headerStyle={{ width: '100px', textAlign: 'center' }}
              />

              <Column 
                body={aceitaCapitalTemplate} 
                header='Aceita Capital?'
                style={{textAlign: 'center', width:'110px',}}
              />

              <Column 
                body={aceitaCusteioTemplate} 
                header='Aceita Custeio?'
                style={{textAlign: 'center', width:'110px',}}
              />

              <Column 
                body={aceitaLivreTemplate} 
                header='Aceita Livre Aplicação?'
                style={{textAlign: 'center', width:'110px',}}
              />

              <Column 
                body={recursosPropriosTemplate} 
                header='Recursos externos?'
                style={{textAlign: 'center', width:'110px',}}
              />

              <Column 
                body={exibePaaTemplate} 
                header='Exibe no PAA?'
                style={{textAlign: 'center', width:'110px',}}
              />
            </DataTable>
          </Spin>

          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-primary ml-3 text-nowrap mt-4" 
              onClick={handleSalvarOrdenacaoBtnSalvar}
              disabled={!existemDiferencas()}
            >
              Salvar
            </button>
          </div>
        </>
      )}
    </>
  );
};