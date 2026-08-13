import React, { useState } from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import { TableTags } from "../../../../../Globais/TableTags";
import { LegendaInformacao } from "../../../../../Globais/ModalLegendaInformacao/LegendaInformacao";
import { coresTagsAssociacoes } from "../../../../../../utils/CoresTags";
import {Paginator} from 'primereact/paginator';
import { useNavigate } from "react-router-dom";
import { useAssociacaoListagemContext } from "../hooks/useAssociacoesListagemContext";
import Loading from "../../../../../../utils/Loading";
import { TotalRegistros } from "../../../componentes/TotalRegistros"
import { EditIconButton } from "../../../../../Globais/UI/Button";

export const TabelaAssociacoes = () => {
    const navigate = useNavigate();
    const {
        isLoadingAssociacaoListagem,
        dataAssociacaoListagem,
        countAssociacaoListagem,
        filter,
        setFilter,
    } = useAssociacaoListagemContext();

    const ROWS_PER_PAGE = 10;

    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false);

    const { results } = dataAssociacaoListagem;
    const firstPage = (filter.page - 1) * ROWS_PER_PAGE;

    const onPageChange = (event) => {
        const newPage = event.page + 1;

        setFilter((prevState) => ({
            ...prevState,
            page: newPage,
        }));
    }

    const acoesTemplate = (rowData) => {
        return (
            <EditIconButton
                onClick={() => navigate(`/formulario-associacao/${rowData.uuid}`)}
                data-testid="btn-editar-fique-de-olho"
            />
        )
    };

    if (isLoadingAssociacaoListagem) {
        return (
            <div className="mt-5">
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            </div>
        )
    }

    return(
        <>
        <TotalRegistros
            titulo="associações"
            total_registros={countAssociacaoListagem}
        />
        <LegendaInformacao
            showModalLegendaInformacao={showModalLegendaInformacao}
            setShowModalLegendaInformacao={setShowModalLegendaInformacao}
            entidadeDasTags="associacao"
            excludedTags={["Encerramento de conta pendente"]}
        />
        <DataTable
            value={results}
        >
            <Column field="nome" header="Nome da Associação"/>
            <Column field="unidade.nome_com_tipo" header="Unidade educacional"/>
            <Column field="unidade.nome_dre" header="DRE"/>
            <Column field="recursos" header="Recurso(s)"/>
            <Column
                field="informacao"
                header="Informações"
                className="align-middle text-center"
                body={(rowData) => <TableTags data={rowData} coresTags={coresTagsAssociacoes} excludeTags={["Encerramento de conta pendente"]}/>}
                style={{width: '15%'}}
            />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>

        <Paginator
            first={firstPage}
            rows={ROWS_PER_PAGE}
            totalRecords={countAssociacaoListagem}
            template="PrevPageLink PageLinks NextPageLink"
            onPageChange={onPageChange}
        />
        </>
    )
};
