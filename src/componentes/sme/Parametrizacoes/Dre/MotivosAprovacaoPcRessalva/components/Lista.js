import React from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useGetMotivosAprovacaoPcRessalva } from "../hooks/useGetMotivosAprovacaoPcRessalva";
import Loading from "../../../../../../utils/Loading";
import { usePostMotivoAprovacaoPcRessalva } from '../hooks/usePostMotivoAprovacaoPcRessalva';
import { usePatchMotivoAprovacaoPcRessalva } from '../hooks/usePatchMotivoAprovacaoPcRessalva';
import { useDeleteMotivoAprovacaoPcRessalva } from '../hooks/useDeleteMotivoAprovacaoPcRessalva';
import { ModalForm } from "./ModalForm";
import {MsgImgCentralizada} from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { ModalConfirmarExclusao } from "../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";
import { useMotivosAprovacaoPcRessalvaContext } from "../hooks/useMotivoAprovacaoComRessalvaContext";

export const Lista = () => {

  const { showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao, setShowModalForm, stateFormModal, setStateFormModal, setBloquearBtnSalvarForm } = useMotivosAprovacaoPcRessalvaContext();
  const { isLoading, data } = useGetMotivosAprovacaoPcRessalva()
  const { mutationPost } = usePostMotivoAprovacaoPcRessalva()
  const { mutationPatch } = usePatchMotivoAprovacaoPcRessalva()
  const { mutationDelete } = useDeleteMotivoAprovacaoPcRessalva()

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
        recurso: rowData.recurso ? rowData.recurso : '',
    });
    setShowModalForm(true)
  };

  const handleSubmitFormModal = async (values) => {
    // Libera o botão somente após ter resolvido a mutation em usePostMotivoAprovacaoPcRessalva e usePatchMotivoAprovacaoPcRessalva
    setBloquearBtnSalvarForm(true)
    let payload = {
        motivo: values.motivo,
        recurso: values.recurso,
    };

    if (!values.uuid) {
        mutationPost.mutate({payload: payload})
    } else {
        mutationPatch.mutate({uuidMotivoAprovacaoPcRessalva: values.uuid, payload: payload})
    }
  };

  const handleExcluirMotivo = async (uuid) => {
    if (!uuid) {
        console.log("Erro ao tentar excluir o motivo.")
    } else {
        mutationDelete.mutate(uuid)
    }
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
    <div className="mt-4">
      {results && results.length > 0 ? (
            <DataTable
                value={results}
                className='tabela-lista-motivos-aprovacao-pc-ressalva'
                data-qa='tabela-lista-motivos-aprovacao-pc-ressalva'
            >
                <Column
                    field="motivo"
                    header="Motivos de PC aprovada com ressalva"
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
            data-qa="imagem-lista-sem-motivos-pagamento-antecipado"
            texto='Nenhum resultado encontrado.'
            img={Img404}
        />
      }
      <section>
            <ModalForm
                handleSubmitFormModal={handleSubmitFormModal}
            />
        </section>
        <section>
            <ModalConfirmarExclusao
                open={showModalConfirmacaoExclusao.open}
                onOk={()=> {
                    handleExcluirMotivo(showModalConfirmacaoExclusao.uuid)
                    setShowModalConfirmacaoExclusao({open: false, uuid: ''})
                }}
                okText="Excluir"
                onCancel={()=> setShowModalConfirmacaoExclusao({open: false, uuid: ''})}
                cancelText="Cancelar"
                titulo="Confirmação de exclusão"
                bodyText="Deseja realmente excluir este motivo de aprovação de PC com ressalva?"
            />
        </section>
    </div>
  )
}