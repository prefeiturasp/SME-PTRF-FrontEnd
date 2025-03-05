import React, { useState } from "react"; 
import { DataTable } from 'primereact/datatable'; 
import { Column } from 'primereact/column'; 
import useTagInformacaoAssociacaoEncerradaTemplate from "../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate"; 
import { LegendaInformacao } from "../../../../Globais/ModalLegendaInformacao/LegendaInformacao";
import {Paginator} from 'primereact/paginator';

export const TabelaAssociacaoAcao = ({
  unidades, 
  rowsPerPage, 
  selecionarHeader, 
  selecionarTemplate, 
  acoesTemplate, 
  autoLayout=true, 
  caminhoUnidade="", 
  onPageChange, 
  firstPage
}) => {
  const tagInformacaoAssociacaoEncerrada = useTagInformacaoAssociacaoEncerradaTemplate();
  const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false);
  
  return (
    <>
      <LegendaInformacao
        showModalLegendaInformacao={showModalLegendaInformacao}
        setShowModalLegendaInformacao={setShowModalLegendaInformacao}
        entidadeDasTags="associacao"
        excludedTags={["Encerramento de conta pendente"]}
      />
      <DataTable
        value={unidades.results}
        className="datatable-footer-coad"
        rows={rowsPerPage}
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        autoLayout={autoLayout}
        selectionMode="single"
      >
        <Column header={selecionarHeader()} body={selecionarTemplate}/>
        <Column field={`${caminhoUnidade}.codigo_eol`} header='Código Eol'/>
        <Column field={`${caminhoUnidade}.nome_com_tipo`} header='Nome UE'/>
        <Column
          field="informacao"
          header="Informações"
          style={{ width: '15%' }}
          className="align-middle text-center"
          body={tagInformacaoAssociacaoEncerrada}
        />                                                            
        <Column
          field="acoes"
          header="Ações"
          body={acoesTemplate}
        />
      </DataTable>
      <Paginator
        first={firstPage}
        rows={rowsPerPage}
        totalRecords={unidades.count}
        template="PrevPageLink PageLinks NextPageLink"
        onPageChange={onPageChange}
      />
    </>
  );
};
