import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import useTagInformacaoAssociacaoEncerradaTemplate from "../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate";
import { LegendaInformacao } from "../../../../Globais/ModalLegendaInformacao/LegendaInformacao";
import {Paginator} from 'primereact/paginator';

export const TabelaAcoesDasAssociacoes = ({
    todasAsAcoes, 
    rowsPerPage, 
    statusTemplate, 
    dataTemplate, 
    acoesTemplate, 
    showModalLegendaInformacao,
    setShowModalLegendaInformacao,
    onPageChange,
    firstPage
}) => {
    const tagInformacaoAssociacaoEncerrada = useTagInformacaoAssociacaoEncerradaTemplate();

    return(
        <>
            <LegendaInformacao
                showModalLegendaInformacao={showModalLegendaInformacao}
                setShowModalLegendaInformacao={setShowModalLegendaInformacao}  
                entidadeDasTags="associacao"
                excludedTags={["Encerramento de conta pendente"]}     
            />
            <DataTable
                value={todasAsAcoes.results}
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
            <Paginator
                first={firstPage}
                rows={rowsPerPage}
                totalRecords={todasAsAcoes.count}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={onPageChange}
            />
        </>
    )
};