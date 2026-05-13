import React from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Loading from "../../../../../../utils/Loading";
import { ModalForm } from "./ModalForm";
import { ModalConfirmarExclusao } from "../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";
import {MsgImgCentralizada} from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { EditIconButton, IconButton } from "../../../../../Globais/UI/Button";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useMotivosReprovacaoPcContext } from "../hooks/useMotivoReprovacaoContext";
import { useGetMotivosReprovacaoPc } from "../hooks/useGetMotivosReprovacaoPc";
import { usePostMotivoReprovacaoPc } from "../hooks/usePostMotivoReprovacaoPc";
import { usePatchMotivoReprovacaoPc } from "../hooks/usePatchMotivoReprovacaoPc";
import { useDeleteMotivoReprovacaoPc } from "../hooks/useDeleteMotivoReprovacaoPc";


export const Lista = () => {
  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
  const { selectedRecurso } = useAbasPorRecursoContext();

  const { stateFormModal, setStateFormModal, setBloquearBtnSalvarForm, handleOpenCreateModal, showModalConfirmacaoExclusao, handleCloseModalConfirmacaoExclusao } = useMotivosReprovacaoPcContext();
  const { isLoading, data } = useGetMotivosReprovacaoPc({ is_required_recurso_uuid: true, recurso_uuid: selectedRecurso?.uuid })
  const { mutationPost } = usePostMotivoReprovacaoPc()
  const { mutationPatch } = usePatchMotivoReprovacaoPc()
  const { mutationDelete } = useDeleteMotivoReprovacaoPc()

  // Necessária pela paginação
  const {results} = data;

  const acoesTemplate = (rowData) => {
      return (
        <EditIconButton
            onClick={() => handleEditFormModal(rowData)}
        />
      )
  };

  const handleEditFormModal = (rowData) => {
    setStateFormModal({
        ...stateFormModal,
        motivo: rowData.motivo,
        uuid: rowData.uuid,
        id: rowData.id,
        isOpen: true,
        recurso_uuid: rowData?.recurso
    });
  };

  const handleSubmitFormModal = async (values) => {
    // Libera o botão somente após ter resolvido a mutation em usePostMotivoAprovacaoPcRessalva e usePatchMotivoAprovacaoPcRessalva
    setBloquearBtnSalvarForm(true)
    let payload = {
        motivo: values.motivo,
        recurso: values.recurso_uuid
    };

    if (values.uuid) {
        mutationPatch.mutate({uuidMotivoReprovacaoPc: values.uuid, payload: payload})
    } else {
        mutationPost.mutate({payload: payload})
    }
  };

  const handleExcluirMotivo = async (uuid) => {
    if (!uuid) {
        toastCustom.ToastCustomError('Erro ao apagar o motivo de reprovação de PC', "Informe os campos corretamente e tente novamente.")
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
        <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo os motivos de reprovação do {selectedRecurso?.nome_exibicao}.</p>
            </div>

            <IconButton
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar motivo de reprovação"
                onClick={() => handleOpenCreateModal(selectedRecurso)}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        </div>

        {results && results.length > 0 ? (
            <DataTable
                value={results}
                className='tabela-lista-motivos-reprovacao-pc'
                data-qa='tabela-lista-motivos-reprovacao-pc'
            >
                <Column
                    field="motivo"
                    header="Motivos de reprovação de PC"
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
                data-qa="imagem-lista-sem-motivos-reprovacao-pc"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }
      
        <ModalForm
            handleSubmitFormModal={handleSubmitFormModal}
        />

        <ModalConfirmarExclusao
            open={showModalConfirmacaoExclusao.is_open}
            onOk={()=> {
                handleExcluirMotivo(showModalConfirmacaoExclusao.motivo_uuid)
                handleCloseModalConfirmacaoExclusao()
            }}
            okText="Excluir"
            onCancel={() => handleCloseModalConfirmacaoExclusao()}
            cancelText="Cancelar"
            titulo="Excluir Motivo"
            bodyText="Deseja realmente excluir este motivo de reprovação de PC?"
        />
    </>
  )
}