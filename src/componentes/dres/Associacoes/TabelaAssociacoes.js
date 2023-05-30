import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { TagInformacao } from "../../Globais/TagInformacao";

export const TabelaAssociacoes = ({associacoes, rowsPerPage, unidadeEscolarTemplate, acoesTemplate, setShowModalLegendaInformacao}) =>{
  return(
    <>
        <div className="d-flex justify-content-end">
            <button
                onClick={()=> setShowModalLegendaInformacao(true)}
                className="btn btn-link link-green"
                style={{padding: '0px', textDecoration: 'none'}}
            >
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "4px", paddingTop: "2px"}}
                    icon={faInfoCircle}
                />
                <span>Legenda informação</span>
            </button>
        </div>

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
                body={(rowData) => TagInformacao(rowData)}
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