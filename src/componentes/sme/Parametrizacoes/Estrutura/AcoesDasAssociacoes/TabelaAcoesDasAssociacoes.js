import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import useTagInformacaoAssociacaoEncerradaTemplate from "../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate";

export const TabelaAcoesDasAssociacoes = ({todasAsAcoes, rowsPerPage, statusTemplate, dataTemplate, acoesTemplate, setShowModalLegendaInformacao}) => {
    const tagInformacaoAssociacaoEncerrada = useTagInformacaoAssociacaoEncerradaTemplate();

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
                value={todasAsAcoes}
                paginator={todasAsAcoes.length > rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                rows={rowsPerPage}
            >
                <Column field="associacao.unidade.codigo_eol" header="EOL"/>
                <Column field="associacao.unidade.nome_com_tipo" header="Unidade Educacional"/>
                <Column
                    field="informacao"
                    header="Informações"
                    style={{width: '15%'}}
                    className="align-middle text-center"
                    body={tagInformacaoAssociacaoEncerrada}
                />            
                <Column field="acao.nome" header="Ação"/>
                <Column
                    field="acao.nome"
                    header="Status"
                    body={statusTemplate}
                />
                <Column
                    field="criado_em"
                    header="Criado em"
                    body={dataTemplate}
                />
                <Column
                    field="status"
                    header="Ações"
                    body={acoesTemplate}
                />
            </DataTable>
        </>
    )
};