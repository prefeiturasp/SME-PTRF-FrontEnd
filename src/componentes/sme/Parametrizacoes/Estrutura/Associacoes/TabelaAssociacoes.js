import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import { TableTags } from "../../../../Globais/TableTags";
import { LegendaInformacao } from "../../../../Globais/ModalLegendaInformacao/LegendaInformacao";
import { coresTagsAssociacoes } from "../../../../../utils/CoresTags";
import {Paginator} from 'primereact/paginator';

export const TabelaAssociacoes = ({
    listaDeAssociacoes, 
    rowsPerPage, 
    acoesTemplate,
    showModalLegendaInformacao, 
    setShowModalLegendaInformacao,
    onPageChange,
    firstPage
}) => {
    return(
        <>
        <LegendaInformacao
            showModalLegendaInformacao={showModalLegendaInformacao}
            setShowModalLegendaInformacao={setShowModalLegendaInformacao}  
            entidadeDasTags="associacao"
            excludedTags={["Encerramento de conta pendente"]}
        />
        <DataTable
            value={listaDeAssociacoes.results}
        >
            <Column field="nome" header="Nome da Associação"/>
            <Column field="unidade.nome_com_tipo" header="Unidade educacional"/>
            <Column
                field="informacao"
                header="Informações"
                className="align-middle text-center"
                body={(rowData) => <TableTags data={rowData} coresTags={coresTagsAssociacoes} excludeTags={["Encerramento de conta pendente"]}/>}
                style={{width: '15%'}}
            />
            <Column field="unidade.nome_dre" header="DRE"/>
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>

        <Paginator
            first={firstPage}
            rows={rowsPerPage}
            totalRecords={listaDeAssociacoes.count}
            template="PrevPageLink PageLinks NextPageLink"
            onPageChange={onPageChange}
        />
        </>
    )
};