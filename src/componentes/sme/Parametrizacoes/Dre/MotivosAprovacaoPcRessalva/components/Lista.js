import React, { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useGetMotivosAprovacaoPcRessalva } from "../hooks/useGetMotivosAprovacaoPcRessalva";
import Loading from "../../../../../../utils/Loading";
import { MotivosAprovacaoPcRessalvaContext } from '../context/MotivosAprovacaoPcRessalva';
import { usePostMotivoAprovacaoPcRessalva } from '../hooks/usePostMotivoAprovacaoPcRessalva';
import { usePatchMotivoAprovacaoPcRessalva } from '../hooks/usePatchMotivoAprovacaoPcRessalva';
import { useDeleteMotivoAprovacaoPcRessalva } from '../hooks/useDeleteMotivoAprovacaoPcRessalva';
import { ModalForm } from "./ModalForm";
import { ModalConfirmacaoExclusao } from "./ModalConfirmacaoExclusao";
import {MsgImgCentralizada} from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";

export const Lista = () => {

  const { setShowModalForm, stateFormModal, setStateFormModal, setBloquearBtnSalvarForm } = useContext(MotivosAprovacaoPcRessalvaContext)
  const { isLoading, data } = useGetMotivosAprovacaoPcRessalva()
  const { mutationPost } = usePostMotivoAprovacaoPcRessalva()
  const { mutationPatch } = usePatchMotivoAprovacaoPcRessalva()
  const { mutationDelete } = useDeleteMotivoAprovacaoPcRessalva()

  // Necessária pela paginação
  const {results} = data;

  const acoesTemplate = (rowData) => {
      return (
          <div>
              <button className="btn-editar-membro" onClick={() => handleEditFormModal(rowData)}>
                  <span data-tip="Editar motivo" data-html={true}>
                      <FontAwesomeIcon
                          style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                          icon={faEdit}
                      />
                      <ReactTooltip/>
                  </span>
              </button>
          </div>
      )
  };

  const handleEditFormModal = (rowData) => {
    setStateFormModal({
        ...stateFormModal,
        motivo: rowData.motivo,
        uuid: rowData.uuid,
        id: rowData.id,
    });
    setShowModalForm(true)
  };

  const handleSubmitFormModal = async (values) => {
    // Libera o botão somente após ter resolvido a mutation em usePostMotivoAprovacaoPcRessalva e usePatchMotivoAprovacaoPcRessalva
    setBloquearBtnSalvarForm(true)
    let payload = {
        motivo: values.motivo,
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
    <>
      {results && results.length > 0 ? (
          <div className="p-2">
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
          </div>
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
            <ModalConfirmacaoExclusao
                handleExcluirMotivo={handleExcluirMotivo}
            />
        </section>
    </>
  )
}