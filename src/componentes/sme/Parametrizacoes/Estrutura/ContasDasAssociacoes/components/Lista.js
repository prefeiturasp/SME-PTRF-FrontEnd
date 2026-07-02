import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useGetContasDasAssociacoes } from "../hooks/useGetContasDasAssociacoes";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import {MsgImgCentralizada} from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { Paginacao } from './Paginacao';
import ModalForm from "./ModalForm";
import { ModalConfirmarExclusao } from "../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePostContaAssociacao } from "../hooks/usePostContaAssociacao";
import { usePatchContaAssociacao } from "../hooks/usePatchContaAssociacao";
import { useDeleteContaAssociacao } from "../hooks/useDeleteContaAssociacao";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

import Loading from "../../../../../../utils/Loading";

export const Lista = () => {
  const {
    stateFormModal,
    setStateFormModal,
    setBloquearBtnSalvarForm,
    showModalConfirmacaoExclusao,
    handleCloseModalConfirmacaoExclusao,
  } = useContasDasAssociacoesContext();
  const { isLoading, data, total } = useGetContasDasAssociacoes();
  const { mutationPost } = usePostContaAssociacao();
  const { mutationPatch } = usePatchContaAssociacao();
  const { mutationDelete } = useDeleteContaAssociacao();
  const { selectedRecurso } = useAbasPorRecursoContext();

  const statusTemplate = (rowData) => {
    return rowData.status && rowData.status === "ATIVA" ? "Ativa" : "Inativa";
  };

    // Necessária pela paginação
    const {results} = data;
  
    const acoesTemplate = (rowData) => {
        return (
          <div className="d-flex justify-content-center">
            <EditIconButton
                onClick={() => handleEditFormModal(rowData)}
                data-testid="btn-editar-contas-das-associacoes"
            />
          </div>
        )
    };
  
    const handleEditFormModal = (rowData) => {
      setStateFormModal({
          ...stateFormModal,
          associacao: rowData.associacao,
          associacao_nome: rowData.associacao_dados?.unidade?.nome_com_tipo,
          tipo_conta: rowData.tipo_conta,
          status: rowData.status,
          uuid: rowData.uuid,
          id: rowData.id,
          banco_nome: rowData.banco_nome,
          agencia: rowData.agencia,
          numero_conta: rowData.numero_conta,
          numero_cartao: rowData.numero_cartao,
          data_inicio: rowData.data_inicio,
          recurso_uuid: rowData.recurso_uuid || rowData.recurso || selectedRecurso?.uuid || '',
          isOpen: true,
      });
    };

    const handleSubmitFormModal = async (values) => {
      setBloquearBtnSalvarForm(true);

      const payload = {
        associacao: values.associacao,
        tipo_conta: values.tipo_conta,
        status: values.status,
        uuid: values.uuid,
        banco_nome: values.banco_nome,
        agencia: values.agencia,
        numero_conta: values.numero_conta,
        numero_cartao: values.numero_cartao,
        data_inicio: values.data_inicio,
      };

      if (values.uuid) {
        mutationPatch.mutate({uuidContaAssociacao: values.uuid, payload});
      } else {
        mutationPost.mutate({payload});
      }
    };

    const handleExcluirConta = async (uuid) => {
      if (!uuid) {
        toastCustom.ToastCustomError("Erro ao apagar conta de associação", "Informe os campos corretamente e tente novamente.");
        return;
      }

      mutationDelete.mutate(uuid);
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
    <div className="mt-3">

      {results && results.length > 0 ? (
        <DataTable
          value={data.results}
          className="p-datatable-gridlines p-datatable-striped"
          paginator={false}
          rows={10}
          responsiveLayout="scroll"
        >
          <Column field="associacao_dados.unidade.nome_com_tipo" header="Unidade Educacional " />
          <Column
            field="tipo_conta_dados.nome"
            header="Tipo de conta"
            style={{ width: "15%", textAlign: "center" }}
          />

          <Column
              field="status"
              header="Status"
              body={statusTemplate}
              style={{width: '15%', textAlign: "center",}}
          />
          
          <Column
              field="acoes"
              header="Ações"
              body={acoesTemplate}
              style={{width: '10%', textAlign: "center",}}
          />
        </DataTable>
      ) : (
        <MsgImgCentralizada
            data-qa="imagem-lista-contas-de-associacoes-vazia"
            texto='Nenhum resultado encontrado.'
            img={Img404}
        />
      )}

        <Paginacao
            isLoading={isLoading}
            total={total}
        />

    </div>

    <ModalForm
        handleSubmitFormModal={handleSubmitFormModal}
    />

    <ModalConfirmarExclusao
        open={showModalConfirmacaoExclusao.is_open}
        onOk={() => {
            handleExcluirConta(showModalConfirmacaoExclusao.conta_uuid);
            handleCloseModalConfirmacaoExclusao();
        }}
        okText="Excluir"
        onCancel={() => handleCloseModalConfirmacaoExclusao()}
        cancelText="Cancelar"
        titulo="Excluir conta de associação"
        bodyText="Deseja realmente excluir esta conta de associação?"
    />
    </>
  );
}
