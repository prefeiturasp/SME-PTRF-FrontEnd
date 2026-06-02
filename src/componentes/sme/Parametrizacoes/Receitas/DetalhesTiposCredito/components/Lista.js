import React from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Loading from "../../../../../../utils/Loading";
import { ModalForm } from "./ModalForm";
import { ModalConfirmarExclusao } from "../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";
import {MsgImgCentralizada} from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useDetalhesTiposCreditoContext } from "../hooks/useDetalhesTiposCreditoContext";

import { useGetDetalhesTiposCredito } from "../hooks/useGetDetalhesTiposCredito";
import { usePostDetalhesTiposCredito } from "../hooks/usePostDetalhesTiposCredito";
import { usePatchDetalhesTiposCredito } from "../hooks/usePatchDetalhesTiposCredito";
import { useDeleteDetalhesTiposCredito } from "../hooks/useDeleteDetalhesTiposCredito";

import { Paginacao } from "./Paginacao";


export const Lista = () => {
  const { selectedRecurso } = useAbasPorRecursoContext();

  const { 
    stateFormModal, 
    setStateFormModal, 
    setBloquearBtnSalvarForm, 
    showModalConfirmacaoExclusao, 
    handleCloseModalConfirmacaoExclusao 
  } = useDetalhesTiposCreditoContext();
  const { isLoading, data, total, count } = useGetDetalhesTiposCredito()
  const { mutationPost } = usePostDetalhesTiposCredito()
  const { mutationPatch } = usePatchDetalhesTiposCredito()
  const { mutationDelete } = useDeleteDetalhesTiposCredito()

  // Necessária pela paginação
  const { results } = data;

  const acoesTemplate = (rowData) => {
      return (
        <EditIconButton
            onClick={() => handleEditFormModal(rowData)}
        />
      )
  };

  const handleEditFormModal = (rowData) => {
    const tipoReceita = rowData.tipo_receita?.uuid || rowData.tipo_receita_uuid || rowData.tipo_receita;
    setStateFormModal({
        ...stateFormModal,
        uuid: rowData.uuid,
        nome: rowData.nome,
        tipo_receita: tipoReceita,
        id: rowData.id,
        isOpen: true,
        recurso_uuid: rowData?.recurso_uuid || selectedRecurso?.uuid,
        can_edit_tipo_receita: rowData?.can_edit_tipo_receita || false
    });
  };

  const handleSubmitFormModal = async (values) => {
    // Libera o botão somente após ter resolvido a mutation em usePostDetalhesTiposCredito e usePatchDetalhesTiposCredito
    setBloquearBtnSalvarForm(true)
    let payload = {
        nome: values.nome,
        tipo_receita: values.tipo_receita,
        recurso_uuid: values.recurso_uuid,
    };

    if (values.uuid) {
        mutationPatch.mutate({uuidDetalheTipoCredito: values.uuid, payload: payload})
    } else {
        mutationPost.mutate({payload: payload})
    }
  };

  const handleExcluirDetalheTipoCredito = async (uuid) => {
    if (!uuid) {
        toastCustom.ToastCustomError('Erro ao apagar o detalhe de tipo de crédito', "Informe os campos corretamente e tente novamente.")
    }
    
    mutationDelete.mutate(uuid)
  };

  if (isLoading) {
    return (
        <Loading
            corGrafico="black"
            corFonte="dark"
            marginTop="0"
            marginBottom="0"
        />
    );
  }
  return (
    <>
        {results && results.length > 0 ? (
            <DataTable
                value={results}
                className='tabela-lista-detalhes-tipos-credito'
                data-qa='tabela-lista-detalhes-tipos-credito'
            >
                <Column
                    field="nome"
                    header="Detalhe de tipo de crédito"
                />
                <Column
                    field="tipo_receita_nome"
                    header="Tipo de crédito"
                />
                <Column
                    field="acao"
                    header="Ação"
                    body={acoesTemplate}
                    style={{width: '10%', textAlign: "center",}}
                />
            </DataTable>
        ) :
            <MsgImgCentralizada
                data-qa="imagem-lista-sem-detalhes-tipos-credito"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }

        <Paginacao
            isLoading={isLoading}
            count={count}
            total={total}
        />
      
        <ModalForm
            handleSubmitFormModal={handleSubmitFormModal}
        />

        <ModalConfirmarExclusao
            open={showModalConfirmacaoExclusao.is_open}
            onOk={()=> {
                handleExcluirDetalheTipoCredito(showModalConfirmacaoExclusao.uuid)
                handleCloseModalConfirmacaoExclusao()
            }}
            okText="Excluir"
            onCancel={() => handleCloseModalConfirmacaoExclusao()}
            cancelText="Cancelar"
            titulo="Excluir Detalhe de Tipo de Crédito"
            bodyText="Deseja realmente excluir este detalhe de tipo de crédito?"
        />
    </>
  )
}