import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import { TableTags } from "../../Globais/TableTags";
import { LegendaInformacao } from "../../Globais/ModalLegendaInformacao/LegendaInformacao";
import { coresTagsAssociacoes } from "../../../utils/CoresTags";

export const TabelaAssociacoes = ({
    associacoes, 
    rowsPerPage, 
    unidadeEscolarTemplate, 
    acoesTemplate, 
    showModalLegendaInformacao, 
    setShowModalLegendaInformacao
}) =>{
  return(
    <>
        <LegendaInformacao
            showModalLegendaInformacao={showModalLegendaInformacao}
            setShowModalLegendaInformacao={setShowModalLegendaInformacao}  
            entidadeDasTags="associacao"      
        />
        <DataTable
            value={associacoes}
            className="mt-3 container-tabela-associacoes"
            paginator={associacoes.length > rowsPerPage}
            rows={rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            autoLayout={true}
            selectionMode="single"
        >
            <Column field="unidade.codigo_eol" header="Código Eol" />
            <Column
                field="unidade.nome_com_tipo"
                header="Unidade educacional"
                body={unidadeEscolarTemplate}
            />
            <Column
                field="informacao"
                header="Informações"
                style={{width: '15%'}}
                className="align-middle text-center"
                body={(rowData) => <TableTags data={rowData} coresTags={coresTagsAssociacoes}/>}
            />
            <Column
                field="uuid"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
    </>
  );
};