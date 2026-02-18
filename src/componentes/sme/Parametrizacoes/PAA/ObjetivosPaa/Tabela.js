import { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "antd";
import { IconButton } from "../../../../Globais/UI";
import Loading from "../../../../../utils/Loading";
import { ObjetivosPaaContext } from './context/index';
import { useGetTabelas } from "./hooks/useGetTabelas";
import { useGet } from "./hooks/useGet";
import { usePost } from './hooks/usePost';
import { usePatch } from './hooks/usePatch';
import { useDelete } from './hooks/useDelete';
import { ModalForm } from "./ModalForm";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { ModalConfirmarExclusao } from "../../componentes/ModalConfirmarExclusao"
import { EditIconButton } from "../../../../Globais/UI/Button";

export const Tabela = () => {

  const {
    setShowModalForm,
    stateFormModal,
    setStateFormModal,
    setBloquearBtnSalvarForm,
    showModalForm,
    showModalConfirmacaoExclusao,
    setShowModalConfirmacaoExclusao
    } = useContext(ObjetivosPaaContext)
  const { isLoading, data, total, count } = useGet()
  const { data: objetivoTabelas } = useGetTabelas()
  const { mutationPost } = usePost()
  const { mutationPatch } = usePatch()
  const { mutationDelete } = useDelete()

  // Necessária pela paginação
  const {results} = data;

  const acoesTemplate = (rowData) => {
      return (
        <Tooltip title="Editar objetivo do PAA">
            <EditIconButton
                onClick={() => handleEditFormModal(rowData)}
            />
        </Tooltip>
      )
  };

  const handleEditFormModal = (rowData) => {
    setStateFormModal({
        ...stateFormModal,
        nome: rowData.nome,
        status: rowData.status ? 1 : 0,
        uuid: rowData.uuid,
        id: rowData.id,
        operacao: 'edit'
    });
    setShowModalForm(true)
  };

  const handleSubmitFormModal = async (values) => {
    // Libera o botão somente após ter resolvido a mutation em usePost e usePatch
    setBloquearBtnSalvarForm(true)
    let payload = {
        nome: values.nome,
        status: values.status,
    };

    if (!values.uuid) {
        mutationPost.mutate({payload: payload})
    } else {
        mutationPatch.mutate({uuid: values.uuid, payload: payload})
    }
  };

  const handleExcluir = async (uuid) => {
    if (uuid) {
        mutationDelete.mutate(uuid)
        setShowModalConfirmacaoExclusao(false)
    } else {
        console.error("Objetivo de PAA sem UUID. Não é possível excluir!")
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
                {!isLoading && total ? (
                        <p className='p-2 mb-0'>
                            Exibindo 
                            <span className='total'> {total} </span> 
                            de
                            <span className='total'> {count} </span> 
                            objetivo{total === 1 ? '' : 's'}</p>
                    ) :
                    null
                }
                <DataTable
                    value={results}
                    className='tabela-lista-objetivos-paa'
                    data-qa='tabela-lista-objetivos-paa'>
                    <Column field="nome" header="Objetivo"/>
                    <Column
                        field="acao"
                        header="Ação"
                        body={acoesTemplate}
                        style={{width: '10%', textAlign: "center",}}/>
                </DataTable>
            </div>
        ) :
        <MsgImgCentralizada
                data-qa="imagem-lista-sem-objetivos-paa"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }
        <section>
            <ModalForm
                show={showModalForm}
                handleSubmitFormModal={handleSubmitFormModal}
                objetivosTabelas={objetivoTabelas}
            />
        </section>
        <section>
            <ModalConfirmarExclusao
                open={showModalConfirmacaoExclusao}
                onOk={() => handleExcluir(stateFormModal.uuid)}
                okText="Excluir"
                onCancel={() => setShowModalConfirmacaoExclusao(false)}
                cancelText="Voltar"
                cancelButtonProps={{ className: "btn-base-verde-outline" }}
                titulo="Excluir Objetivo"
                bodyText={<p>Tem certeza que deseja excluir esse objetivo?</p>}
            />
        </section>
        
    </>
  )
}