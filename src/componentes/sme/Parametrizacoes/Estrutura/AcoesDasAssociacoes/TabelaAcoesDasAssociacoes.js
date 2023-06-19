import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import useTagInformacaoAssociacaoEncerradaTemplate from "../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate";
import { LegendaInformacao } from "../../../../Globais/ModalLegendaInformacao/LegendaInformacao";

export const TabelaAcoesDasAssociacoes = ({
    todasAsAcoes, 
    rowsPerPage, 
    statusTemplate, 
    dataTemplate, 
    acoesTemplate, 
    showModalLegendaInformacao,
    setShowModalLegendaInformacao
}) => {
    const tagInformacaoAssociacaoEncerrada = useTagInformacaoAssociacaoEncerradaTemplate();

    return(
        <>
            <LegendaInformacao
                showModalLegendaInformacao={showModalLegendaInformacao}
                setShowModalLegendaInformacao={setShowModalLegendaInformacao}  
                entidadeDasTags="associacao"            
            />
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