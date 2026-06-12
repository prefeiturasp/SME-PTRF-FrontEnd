import React, { useState } from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import useTagInformacaoAssociacaoEncerradaTemplate from "../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate";
import { ModalConfirmarExclusao } from "../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";
import { LegendaInformacao } from "../../../../Globais/ModalLegendaInformacao/LegendaInformacao";
import Loading from "../../../../../utils/Loading";
import {Paginator} from 'primereact/paginator';
import { useAcoesDasAssociacoesContext } from "./hooks/useAcoesDasAssociacoesContext";
import moment from "moment";
import { EditIconButton } from "../../../../Globais/UI/Button";


export const TabelaAcoesDasAssociacoes = () => {
    const ROWS_PER_PAGE = 10;
    const tagInformacaoAssociacaoEncerrada = useTagInformacaoAssociacaoEncerradaTemplate();
    
    const {
        filters,
        setFilters,

        acoesAssociacoes,
        isLoadingAcoesAssociacoes,
        countAcoesAssociacoes,

        setFormReadOnly,

        setStateFormModal,

        setIsOpenModalForm,
        isOpenModalConfirmDelete,
        handleCloseModalConfirmDelete,
        handleDeleteAcaoAssociacao,
    } = useAcoesDasAssociacoesContext();

    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false);

    const firstPage = (filters.page - 1) * ROWS_PER_PAGE;

    const onPageChange = (event) => {
        const currentPage = event.page + 1

        setFilters((prev) => ({ ...prev, page: currentPage }));
    }

    const handleEditarAcoes = (rowData) => {
        if(rowData.data_de_encerramento_associacao) {
            setFormReadOnly(true);
        } else {
            setFormReadOnly(false);
        }

        setStateFormModal({
            associacao: rowData.associacao.uuid,
            acao: rowData.acao.uuid,
            status: rowData.status,
            codigo_eol: rowData.associacao.unidade.codigo_eol,
            uuid: rowData.uuid,
            id: rowData.id,
            nome_unidade: rowData.associacao.unidade.nome_com_tipo,
            operacao: 'edit',
            recurso: rowData.recurso.uuid,
        });
        setIsOpenModalForm(true)
    };

    const statusTemplate = (rowData) => {
        return rowData.status && rowData.status === 'ATIVA' ? 'Ativa' : 'Inativa'
    };

    const dataTemplate = (rowData) => {
        return rowData.criado_em ? moment(rowData.criado_em).format("DD/MM/YYYY [às] HH[h]mm") : '';
    };

    const acoesTemplate = (rowData) => {
        return (
            <EditIconButton
                onClick={() => handleEditarAcoes(rowData)}
            />
        )
    };

    if (isLoadingAcoesAssociacoes) {
        return (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        );
    }

    return(
        <div className="mt-4">
            <LegendaInformacao
                showModalLegendaInformacao={showModalLegendaInformacao}
                setShowModalLegendaInformacao={setShowModalLegendaInformacao}  
                entidadeDasTags="associacao"
                excludedTags={["Encerramento de conta pendente"]}     
            />

            <DataTable
                value={acoesAssociacoes}
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
                rows={ROWS_PER_PAGE}
                totalRecords={countAcoesAssociacoes}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={onPageChange}
            />

            <ModalConfirmarExclusao
                open={isOpenModalConfirmDelete}
                onOk={handleDeleteAcaoAssociacao}
                okText="Excluir"
                onCancel={handleCloseModalConfirmDelete}
                cancelText="Cancelar"
                titulo="Excluir Ação de Associação"
                bodyText="Deseja realmente excluir esta ação de associação?"
            />
        </div>
    )
};