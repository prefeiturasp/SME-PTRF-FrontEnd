import React, { useCallback, useContext } from "react";
import Loading from "../../../../../utils/Loading";
import { Filtros } from "./Filtros";
import ModalForm from "./ModalForm";
import { ModalBootstrap } from "../../../../Globais/ModalBootstrap";
import { IconButton } from "../../../../Globais/UI/Button/IconButton";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { useGetMotivosEstorno } from "./hooks/useGetMotivosEstorno";
import { MotivosEstornoContext } from "./context/MotivosEstorno";
import { usePostMotivoEstorno } from "./hooks/usePostMotivoEstorno";
import { usePatchMotivoEstorno } from "./hooks/usePatchMotivoEstorno";
import { useDeleteMotivoEstorno } from "./hooks/useDeleteMotivoEstorno";
import Tabela from "./Tabela";

export const Lista = () => {
  const { isLoading, data: results, count } = useGetMotivosEstorno();
  const {
    initialStateFormModal,
    stateFormModal,
    showModalConfirmacaoExclusao,
    rowsPerPage,
    setShowModalConfirmacaoExclusao,
    setStateFormModal,
    setShowModalForm,
  } = useContext(MotivosEstornoContext);

  const { mutationPost } = usePostMotivoEstorno();
  const { mutationPatch } = usePatchMotivoEstorno();
  const { mutationDelete } = useDeleteMotivoEstorno();

  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES =
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

  const handleEditFormModal = useCallback(
    async (rowData) => {
      setStateFormModal({
        ...stateFormModal,
        motivo: rowData.motivo,
        uuid: rowData.uuid,
        id: rowData.id,
        operacao: "edit",
      });
      setShowModalForm(true);
    },
    [stateFormModal]
  );

  const acoesTemplate = useCallback(
    (rowData) => {
      return (
        <IconButton
          icon="faEdit"
          iconProps={{
            style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
          }}
          onClick={() => handleEditFormModal(rowData)}
          aria-label="Editar"
        />
      );
    },
    [handleEditFormModal]
  );

  const handleSubmitFormModal = (values) => {
    let payload = {
      motivo: values.motivo,
    };

    if (!values.uuid) {
      mutationPost.mutate({ payload: payload });
    } else {
      mutationPatch.mutate({ UUID: values.uuid, payload: payload });
    }
  };

  const handleExcluirMotivo = async (uuid) => {
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
      <div className="d-flex  justify-content-end pb-4 mt-2">
        <IconButton
          icon="faPlus"
          iconProps={{
            style: { fontSize: "15px", marginRight: "5", color: "#fff" },
          }}
          label="Adicionar motivo de estorno"
          onClick={() => {
            setStateFormModal(initialStateFormModal);
            setShowModalForm(true);
          }}
          variant="success"
          disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
        />
      </div>
      <Filtros />
      {(results || []).length ? (
        <>
          <p>Exibindo {count} motivo(s) de estorno</p>
          <Tabela
            rowsPerPage={rowsPerPage}
            lista={results}
            acoesTemplate={acoesTemplate}
          />
        </>
      ) : (
        <MsgImgCentralizada
          data-qa="imagem-lista-sem-motivos-pagamento-antecipado"
          texto="Nenhum resultado encontrado."
          img={Img404}
        />
      )}

      <section>
        <ModalForm handleSubmitFormModal={handleSubmitFormModal} />
      </section>

      <section>
        <ModalBootstrap
          show={showModalConfirmacaoExclusao}
          onHide={setShowModalConfirmacaoExclusao}
          segundoBotaoOnclick={() => {
            setShowModalConfirmacaoExclusao(false);
            handleExcluirMotivo(stateFormModal.uuid);
          }}
          titulo="Excluir Motivo de Estorno"
          bodyText="<p>Deseja realmente excluir este motivo de estorno?</p>"
          primeiroBotaoTexto="Cancelar"
          primeiroBotaoCss="outline-success"
          segundoBotaoCss="danger"
          segundoBotaoTexto="Excluir"
        />
      </section>
    </>
  );
};
