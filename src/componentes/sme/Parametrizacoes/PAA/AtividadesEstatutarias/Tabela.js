import { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "antd";
import { IconButton } from "../../../../Globais/UI";
import Loading from "../../../../../utils/Loading";
import { AtividadesEstatutariasContext } from './context/index';
import { useGetTabelas } from "./hooks/useGetTabelas";
import { useGet } from "./hooks/useGet";
import { usePost } from './hooks/usePost';
import { usePatch } from './hooks/usePatch';
import { useDelete } from './hooks/useDelete';
import { ModalForm } from "./ModalForm";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { ModalConfirmarExclusao } from "../../componentes/ModalConfirmarExclusao"

export const Tabela = () => {

  const {
    setShowModalForm,
    stateFormModal,
    setStateFormModal,
    setBloquearBtnSalvarForm,
    showModalForm,
    showModalConfirmacaoExclusao,
    setShowModalConfirmacaoExclusao
    } = useContext(AtividadesEstatutariasContext)
  const { isLoading, data, total, count } = useGet()
  const { data: atividadesEstatutariasTabelas } = useGetTabelas()
  const { mutationPost } = usePost()
  const { mutationPatch } = usePatch()
  const { mutationDelete } = useDelete()

  // Necessária pela paginação
  const {results} = data;

  const acoesTemplate = (rowData) => {
      return (
        <Tooltip title="Editar atividade estatutária do PAA">
            <IconButton
                icon="faEdit"
                iconProps={{style: {fontSize: '20px', marginRight: "0", color: "#00585E"}}}
                onClick={() => handleEditFormModal(rowData)}
                aria-label="Editar"
                className="btn-Editar-atividade-estatutaria"
            />
        </Tooltip>
      )
  };

  const handleEditFormModal = (rowData) => {
    setStateFormModal({
        ...stateFormModal,
        nome: rowData.nome,
        status: rowData.status ? 1 : 0,
        mes: rowData.mes,
        tipo: rowData.tipo,
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
        tipo: values.tipo,
        mes: values.mes,
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
        console.error("Atividade Estatutária de PAA sem UUID. Não é possível excluir!")
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
                            atividade{total === 1 ? ' ' : 's '}
                            estatutária{total === 1 ? '' : 's'}
                        </p>
                    ) :
                    null
                }
                <DataTable
                    value={results}
                    className='tabela-lista-atividades-estatutarias'
                    data-qa='tabela-lista-atividades-estatutarias'>
                    <Column field="tipo_label" header="Tipo da atividade" style={{width: '200px'}}/>
                    <Column field="nome" header="Atividade Estatutária"/>
                    <Column field="mes_label" header="Mês" style={{width: '130px'}}/>
                    <Column
                        field="acao"
                        header="Ação"
                        body={acoesTemplate}
                        style={{width: '100px', justifyItems: 'center'}}/>
                </DataTable>
            </div>
        ) :
        <MsgImgCentralizada
                data-qa="imagem-lista-sem-atividades-estatutarias"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }
        <section>
            <ModalForm
                show={showModalForm}
                handleSubmitFormModal={handleSubmitFormModal}
                atividadesEstatutariasTabelas={atividadesEstatutariasTabelas}
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
                titulo="Excluir atividade estatutária"
                bodyText={<p>Tem certeza que deseja excluir essa atividade estatutária?</p>}
            />
        </section>
        
    </>
  )
}