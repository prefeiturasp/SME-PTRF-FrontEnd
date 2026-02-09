import { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Loading from "../../../../../utils/Loading";
import { OutrosRecursosPaaContext } from './context/index';
import { useGet } from "./hooks/useGet";
import { usePost } from './hooks/usePost';
import { usePatch } from './hooks/usePatch';
import { useDelete } from './hooks/useDelete';
import { ModalForm } from "./ModalForm";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { ModalConfirmarExclusao } from "../../componentes/ModalConfirmarExclusao"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { EditIconButton } from "../../../../Globais/UI/Button";

export const Tabela = () => {

  const {
    setShowModalForm,
    stateFormModal,
    setStateFormModal,
    setBloquearBtnSalvarForm,
    showModalForm,
    showModalConfirmacaoExclusao,
    setShowModalConfirmacaoExclusao,
    setCurrentPage,
    setFirstPage,
    } = useContext(OutrosRecursosPaaContext)
  const { isLoading, data, total, count } = useGet()
  const { mutationPost } = usePost()
  const { mutationPatch } = usePatch()
  const { mutationDelete } = useDelete({
    onSuccessDelete: () => {
        setCurrentPage(1)
        setFirstPage(0)
    }
  })

  // Necessária pela paginação
  const {results} = data;

    const aceitaCapitalTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_capital)
    }
    const aceitaCusteioTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_custeio)
    }
    const aceitaLivreTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_livre_aplicacao)
    }
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
        aceita_capital: rowData.aceita_capital,
        aceita_custeio: rowData.aceita_custeio,
        aceita_livre_aplicacao: rowData.aceita_livre_aplicacao,
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
        aceita_capital: values.aceita_capital,
        aceita_custeio: values.aceita_custeio,
        aceita_livre_aplicacao: values.aceita_livre_aplicacao
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
        console.error("Recurso sem UUID. Não é possível excluir!")
    }
  };

  const booleanTemplate = (value) => {
          const opcoes = {
              true: {icone: faCheckCircle, cor: "#297805", texto: "Sim"},
              false: {icone: faTimesCircle, cor: "#B40C02", texto: "Não"}
          }
          const iconeData = opcoes[value]
          const estiloFlag = {fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconeData.cor}
          return (
              <div style={estiloFlag}>
                  <FontAwesomeIcon
                      style={{fontSize: '16px', marginRight: "5px", color: iconeData.cor}}
                      icon={iconeData.icone}/>
              </div>
          )
      }

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
                            Recurso{count === 1 ? '' : 's'}</p>
                    ) :
                    null
                }
                <DataTable
                    value={results}
                    className='tabela-lista-outros-recursos-paa'
                    data-qa='tabela-lista-outros-recursos-paa'>
                    <Column field="nome" header="Nome do recurso"/>
                    <Column
                        field="aceita_capital"
                        header="Aceita capital?"
                        body={aceitaCapitalTemplate}
                        align='center'
                        style={{width: '15%'}}
                        />
                    <Column
                        field="aceita_custeio"
                        header="Aceita custeio?"
                        body={aceitaCusteioTemplate}
                        align='center'
                        style={{width: '15%'}}
                        />
                    <Column
                        field="aceita_livre_aplicacao"
                        header="Aceita livre aplicação?"
                        body={aceitaLivreTemplate}
                        align='center'
                        style={{width: '15%'}}
                        />
                    <Column
                        field="acao"
                        header="Ação"
                        body={acoesTemplate}
                        align='center'
                        style={{width: 1}}/>
                </DataTable>
            </div>
        ) :
        <MsgImgCentralizada
                data-qa="imagem-lista-sem-outros-recursos-paa"
                texto='Nenhum resultado encontrado.'
                img={Img404}
            />
        }
        <section>
            <ModalForm
                show={showModalForm}
                handleSubmitFormModal={handleSubmitFormModal}
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
                titulo="Excluir Recurso"
                bodyText={<p>Tem certeza que deseja excluir esse Recurso?</p>}
            />
        </section>
        
    </>
  )
}