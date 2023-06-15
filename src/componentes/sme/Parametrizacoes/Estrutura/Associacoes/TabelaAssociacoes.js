import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import { TagInformacao } from "../../../../Globais/TagInformacao";
import { LegendaInformacao } from "../../../../Globais/ModalLegendaInformacao/LegendaInformacao";

export const TabelaAssociacoes = ({
    listaDeAssociacoes, 
    rowsPerPage, 
    acoesTemplate,
    showModalLegendaInformacao, 
    setShowModalLegendaInformacao
}) => {
    return(
        <>
        <LegendaInformacao
            showModalLegendaInformacao={showModalLegendaInformacao}
            setShowModalLegendaInformacao={setShowModalLegendaInformacao}  
            entidadeDasTags="associacao"  
        />
        <DataTable
            value={listaDeAssociacoes}
            paginator={listaDeAssociacoes.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="nome" header="Nome da Associação"/>
            <Column field="unidade.nome_com_tipo" header="Unidade educacional"/>
            <Column
                field="informacao"
                header="Informações"
                className="align-middle text-center"
                body={(rowData) => <TagInformacao data={rowData}/>}
                style={{width: '15%'}}
            />
            <Column field="unidade.nome_dre" header="DRE"/>
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
        </>
    )
};