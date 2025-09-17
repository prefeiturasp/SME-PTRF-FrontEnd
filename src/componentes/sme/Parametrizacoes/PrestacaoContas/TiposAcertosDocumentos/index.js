import React, { useState, useEffect, useCallback, useMemo } from "react";
import Loading from "../../../../../utils/Loading";
import { 
getListaDeAcertosDocumentos,
getAcertosDocumentosFiltrados,
postAddAcertosDocumentos,
putAtualizarAcertosDocumentos,
deleteAcertosDocumentos,
getTabelaDocumento,
 } from "../../../../../services/sme/Parametrizacoes.service";
import { TabelaDocumentos } from "./TabelaDocumento";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { Filtros } from "./Filtros";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg"
import "../parametrizacoes-prestacao-contas.scss";
import { ModalFormDocumentos } from "./ModalFormDocumento";
import { ModalConfirmDeleteDocumento } from "../../PrestacaoContas/TiposAcertosDocumentos/ModalConfirmDeleteDocumento";
import { ModalInfoNaoPodeExcluir } from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import { ModalInfoNaoPodeGravar } from "../../Estrutura/Acoes/ModalInfoNaoPodeGravar";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const ParametrizacoesTiposAcertosDocumentos = () => {
  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

  const initialStateFiltros = {
      filtrar_por_nome: "",
      filtrar_por_categoria: [],
      filtrar_por_ativo: "",
      filtrar_por_documento_relacionado: [],
  };

  const initialStateFormModal = {
      nome: "",
      categoria: "",
      tipos_documento_prestacao: [],
      ativo: false,
      operacao: 'create',
  };

  const [todosDocumentos, setTodosDocumentos] = useState([]);
  const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
  const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
  const [showModalForm, setShowModalForm] = useState(false);
  const [showModalInfoNaoPodeGravar, setShowModalInfoNaoPodeGravar] = useState(false);
  const [mensagemModalInfoNaoPodeGravar, setMensagemModalInfoNaoPodeGravar] = useState("");
  const [showModalDeleteDocumento, setShowModalDeleteDocumento] = useState(false);
  const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
  const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
  const [categoriaTabela, setCategoriaTabela] = useState([]);
  const [documentoTabela, setDocumentoTabela] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readOnly, setReadOnly] = useState(false);

  const carregaTodosAcertosDocumentos = useCallback(async () => {
    setLoading(true);
    let todosDocumentos = await getListaDeAcertosDocumentos();
    setTodosDocumentos(todosDocumentos);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregaTodosAcertosDocumentos();
  }, [carregaTodosAcertosDocumentos]);

  useEffect(() => {
    async function carregaTabela() {
        let resp = await getTabelaDocumento()
        setCategoriaTabela(resp.categorias)
        const docsComIdString = resp.documentos.map(doc => ({
          ...doc,
          id: String(doc.id)
        }));
        setDocumentoTabela(docsComIdString)
    }
    carregaTabela();
  }, []);


  const totalDocumentos = useMemo(
    () => (todosDocumentos||[]).length,
    [todosDocumentos]
  );

  const handleChangeFiltros = (name, value) => {
    setStateFiltros({
      ...stateFiltros,
      [name]: value,
    });
  };

  const handleSubmitFiltros = async () => {
    setLoading(true);
    let documentosFiltrado = await getAcertosDocumentosFiltrados(
      stateFiltros.filtrar_por_nome,
      stateFiltros.filtrar_por_categoria,
      stateFiltros.filtrar_por_ativo,
      stateFiltros.filtrar_por_documento_relacionado.join(',')
    );
    setTodosDocumentos(documentosFiltrado);
    setLoading(false);
  };

  const limpaFiltros = async () => {
    setLoading(true);
    setStateFiltros(initialStateFiltros);
    await getListaDeAcertosDocumentos();
  };

  const rowsPerPage = 20;

  const editDocumentosTemplate = (rowData) => {
    return (
      <div>
        <button
          onClick={() => handleEditarDocumentos(rowData)}
          className="btn-editar-acertos"
        >
          <FontAwesomeIcon
            style={{ fontSize: "20px", marginRight: "0", color: "#00585E" }}
            icon={faEdit}
          />
        </button>
      </div>
    );
  };

  const handleEditarDocumentos = (rowData) => {
    setReadOnly(false);
    setStateFormModal({
      uuid: rowData.uuid,
      id: rowData.id,
      nome: rowData.nome,
      categoria: rowData.categoria,
      tipos_documento_prestacao: rowData.tipos_documento_prestacao.map(v => v.id),
      ativo: rowData.ativo,
      operacao: "edit",
    });
    setShowModalForm(true);
  };

  const onHandleClose = () => {
    setStateFormModal(initialStateFormModal);
    setShowModalForm(false);
  };

  const handleOnChangeMultipleSelectModal = async (value) => {
    let name = "categoria"

    setStateFormModal({
        ...stateFormModal,
        [name]: value
    });
  }

  const handleSubmitModalFormDocumentos = async (stateFormModal) => {
    const payload = {
      nome: stateFormModal.nome,
      categoria: stateFormModal.categoria,
      tipos_documento_prestacao: stateFormModal.tipos_documento_prestacao,
      ativo: stateFormModal.ativo,
    }

    if(payload.tipos_documento_prestacao.includes('all')){
        payload.tipos_documento_prestacao = documentoTabela.map(item => item.id)
    }
    
    if (stateFormModal.operacao === "create") {
      try {
        await postAddAcertosDocumentos(payload);
        setShowModalForm(false);
        toastCustom.ToastCustomSuccess('Inclusão de tipo de acerto em documento realizado com sucesso.', `O tipo de acerto em documento foi adicionado ao sistema com sucesso.`)
        await carregaTodosAcertosDocumentos();
      } catch (e) {
        toastCustom.ToastCustomError('Erro ao criar tipo de acerto em documento', `Não foi possível criar o tipo de acerto em documento`)
        if (e.response.data && e.response.data.non_field_errors) {
          setMensagemModalInfoNaoPodeGravar(
            "Ja existe uma ação com esse nome."
          );
          setShowModalInfoNaoPodeGravar(true);
        } else {
          setMensagemModalInfoNaoPodeGravar(
            JSON.parse(e.request['responseText'])['detail']
          );
          setShowModalInfoNaoPodeGravar(true);
        }
      }
    } else {
      try {
        await putAtualizarAcertosDocumentos(stateFormModal.uuid, payload);
        setShowModalForm(false);
        toastCustom.ToastCustomSuccess('Edição do tipo de acerto em documento realizado com sucesso.', `O tipo de acerto em documento foi editado no sistema com sucesso.`)
        console.log("Ação alterada com sucesso", payload);
        await carregaTodosAcertosDocumentos();
      } catch (e) {
        toastCustom.ToastCustomError('Erro ao editar tipo de acerto em documento', `Não foi possível editar o tipo de acerto em documento`)
        if (e.response.data && e.response.data.non_field_errors) {
          setMensagemModalInfoNaoPodeGravar(
            e.response.data.non_field_errors
          );
          setShowModalInfoNaoPodeGravar(true);
        } else {
          setMensagemModalInfoNaoPodeGravar(
            "Já existe um documento com esse nome."
          );
          setShowModalInfoNaoPodeGravar(true);
        }
      }
    }
  };

  const serviceCrudDocumentos = async () => {
    setShowModalDeleteDocumento(true)
  };

  const handleCloseDeleteDocumento = () => {
    setShowModalInfoNaoPodeExcluir(false)
    setShowModalDeleteDocumento(false)
  };

  const onDeleteDocumentoTrue = async () => {
    try {
        setShowModalDeleteDocumento(false);
        await deleteAcertosDocumentos(stateFormModal.uuid);
        setShowModalForm(false);
        toastCustom.ToastCustomSuccess('Remoção do tipo de acerto em documento efetuado com sucesso.', `O tipo de acerto em documento foi removido do sistema com sucesso.`)
        console.log('Documentos excluído com sucesso');
        await carregaTodosAcertosDocumentos();
    } catch (e) {
        toastCustom.ToastCustomError('Erro ao remover tipo de acerto em documento', `Não foi possível remover o tipo de acerto em documento`)
        if (e.response && e.response.data && e.response.data.mensagem){
            setMensagemModalInfoNaoPodeExcluir(e.response.data.mensagem);
            setShowModalInfoNaoPodeExcluir(true);
            console.log(e.response.data.mensagem)
        }
        console.log('Erro ao excluir Delete!! ', e.response)
    }
};

  const handleCloseInfoNaoPodeGravar = () => {
    setShowModalInfoNaoPodeGravar(false);
    setMensagemModalInfoNaoPodeGravar("");
  };

  const handleCloseInfoNaoPodeExcluir = () => {
    setShowModalInfoNaoPodeExcluir(false)
  };

  const handleChangeFormModal = (name, value) => {
    setStateFormModal({
      ...stateFormModal,
      [name]: value,
    });
  };

  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Tipo de acertos em documentos</h1>
      <div className="page-content-inner">
        <>
          <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
                  <button
                    onClick={() => {
                      setStateFormModal(initialStateFormModal);
                      setShowModalForm(true);
                    }}
                    className="btn btn-success ml-2"
                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                  >
                    <FontAwesomeIcon
                      style={{ marginRight: "5px", color: "#fff" }}
                      icon={faPlus}
                    />
                    Adicionar tipo de acertos em documentos
                  </button>
                </div>
                <Filtros
                  categoriaTabela={categoriaTabela}
                  documentoTabela={documentoTabela}
                  stateFiltros={stateFiltros}
                  handleChangeFiltros={handleChangeFiltros}
                  handleSubmitFiltros={handleSubmitFiltros}
                  limpaFiltros={limpaFiltros}
                  />
                  <p>
                    Exibindo{" "}
                    <span className="total">{totalDocumentos}</span>{" "}
                    tipos de acertos em documentos
                  </p>
                  {loading ? (
            <div className="mt-5">
              <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
              />
            </div>
          ) : (
            (todosDocumentos||[]).length > 0 ? (
            <>
              <TabelaDocumentos
                todosDocumentos={todosDocumentos}
                rowsPerPage={rowsPerPage}
                editDocumentosTemplate={editDocumentosTemplate}
              />
            </>
          ) : (
          <MsgImgCentralizada
              texto='Não há documentos'
              img={Img404}
          />
          )
      )}
        <section>
          <ModalFormDocumentos
            show={showModalForm}
            handleClose={onHandleClose}
            handleSubmitModalFormDocumentos={handleSubmitModalFormDocumentos}
            handleOnChangeMultipleSelectModal={handleOnChangeMultipleSelectModal}
            handleChangeFormModal={handleChangeFormModal}
            stateFormModal={stateFormModal}
            readOnly={readOnly}
            categoriaTabela={categoriaTabela}
            documentoTabela={documentoTabela}
            serviceCrudDocumentos={serviceCrudDocumentos}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
          />
        </section>
        <section>
          <ModalConfirmDeleteDocumento
            show={showModalDeleteDocumento}
            handleClose={handleCloseDeleteDocumento}
            onDeleteDocumentoTrue={onDeleteDocumentoTrue}
            titulo="Excluir documento"
            texto={`<p>Deseja realmente apagar ${stateFormModal.nome}?</p>`}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoCss="danger"
            segundoBotaoTexto="Excluir"
          />
        </section>
        <section>
          <ModalInfoNaoPodeExcluir
            show={showModalInfoNaoPodeExcluir}
            handleClose={handleCloseInfoNaoPodeExcluir}
            titulo="Exclusão não permitida"
            texto={mensagemModalInfoNaoPodeExcluir}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="success"
          />
        </section>
        <section>
          <ModalInfoNaoPodeGravar
            show={showModalInfoNaoPodeGravar}
            handleClose={handleCloseInfoNaoPodeGravar}
            titulo="Atualização não permitida"
            texto={mensagemModalInfoNaoPodeGravar}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="success"
          />
        </section>
        </>
        </div>
    </PaginasContainer>
  )
}