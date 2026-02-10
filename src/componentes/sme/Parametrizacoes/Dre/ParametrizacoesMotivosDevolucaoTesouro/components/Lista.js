import React, { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useGetMotivosDevolucaoTesouro } from "../hooks/useGetMotivosDevolucaoTesouro";
import Loading from "../../../../../../utils/Loading";
import { MotivosDevolucaoTesouroContext } from '../context/MotivosDevolucaoTesouro';
import { usePostMotivoDevolucaoTesouro } from '../hooks/usePostMotivoDevolucaoTesouro';
import { usePatchMotivoDevolucaoTesouro } from '../hooks/usePatchMotivoDevolucaoTesouro';
import { useDeleteMotivoDevolucaoTesouro } from '../hooks/useDeleteMotivoDevolucaoTesouro';
import { ModalForm } from "./ModalForm";
import { ModalConfirmacaoExclusao } from "./ModalConfirmacaoExclusao";
import {MsgImgCentralizada} from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { EditIconButton } from "../../../../../Globais/UI/Button";

export const Lista = () => {

  const { setShowModalForm, stateFormModal, setStateFormModal, setBloquearBtnSalvarForm } = useContext(MotivosDevolucaoTesouroContext)
  const { isLoading, data } = useGetMotivosDevolucaoTesouro()
  const { mutationPost } = usePostMotivoDevolucaoTesouro()
  const { mutationPatch } = usePatchMotivoDevolucaoTesouro()
  const { mutationDelete } = useDeleteMotivoDevolucaoTesouro()

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
        nome: rowData.nome,
        uuid: rowData.uuid,
        id: rowData.id,
    });
    setShowModalForm(true)
  };

  const handleSubmitFormModal = async (values) => {
    // Libera o botão somente após ter resolvido a mutation em usePostMotivoDevolucaoTesouro e usePatchMotivoDevolucaoTesouro
    setBloquearBtnSalvarForm(true)
    let payload = {
        nome: values.nome,
    };

    if (!values.uuid) {
        mutationPost.mutate({payload: payload})
    } else {
        mutationPatch.mutate({uuidMotivoDevolucaoTesouro: values.uuid, payload: payload})
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
                  className='tabela-lista-motivos-devolucao-tesouro'
                  data-qa='tabela-lista-motivos-devolucao-tesouro'
              >
                  <Column
                      field="nome"
                      header="Motivos de devolução ao tesouro"
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