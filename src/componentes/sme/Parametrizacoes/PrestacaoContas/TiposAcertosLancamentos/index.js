import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import {
  getListaDeAcertosLancamentos,
  getAcertosLancamentosFiltrados,
  postAddAcertosLancamentos,
  putAtualizarAcertosLancamentos,
  getTabelaCategoria,
  deleteAcertosLancamentos,
} from "../../../../../services/sme/Parametrizacoes.service";
import { Filtros } from "./Filtros";
import { TabelaLancamentos } from "./TabelaLancamentos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import { ModalFormLancamentos } from "./ModalFormLancamento";
import { ModalConfirmDeleteLancamento } from "./ModalConfirmDeleteLancamento";
import { ModalInfoNaoPodeExcluir } from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import { ModalInfoNaoPodeGravar } from "../../Estrutura/Acoes/ModalInfoNaoPodeGravar";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg"
import "../parametrizacoes-prestacao-contas.scss";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import {toastCustom} from "../../../../Globais/ToastCustom";

export const ParametrizacoesTiposAcertosLancamentos = () => {

  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
  
  const initialStateFiltros = {
    filtrar_por_nome: "",
    filtrar_por_categoria: [''],
    filtrar_por_ativo: "",
  };

  const initialStateFormModal = {
    nome: "",
    categoria: "",
    ativo: false,
    operacao: 'create',
  };

  const [todosLancamentos, setTodosLancamentos] = useState([]);
  const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
  const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
  const [showModalForm, setShowModalForm] = useState(false);
  const [showModalInfoNaoPodeGravar, setShowModalInfoNaoPodeGravar] = useState(false);
  const [mensagemModalInfoNaoPodeGravar, setMensagemModalInfoNaoPodeGravar] = useState("");
  const [showModalDeleteLancamento, setShowModalDeleteLancamento] = useState(false);
  const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
  const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
  const [categoriaTabela, setCategoriaTabela] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readOnly, setReadOnly] = useState(false);

  const carregaTodosLancamentos = useCallback(async () => {
    setLoading(true);
    let todosLancamentos = await getListaDeAcertosLancamentos();
    setTodosLancamentos(todosLancamentos);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregaTodosLancamentos().then();
  }, [carregaTodosLancamentos]);

  useEffect(() => {
    async function carregaTabelaCategoria() {
        let resp = await getTabelaCategoria()
        setCategoriaTabela(resp.categorias)
    }
    carregaTabelaCategoria();
  }, []);

  const totalLancamentos = useMemo(
    () => (todosLancamentos||[]).length,
    [todosLancamentos]
  );

  const handleChangeFiltros = (name, value) => {
    setStateFiltros({
      ...stateFiltros,
      [name]: value,
    });
  };

  const handleSubmitFiltros = async () => {
    setLoading(true);
    let lancamentosFiltrados = await getAcertosLancamentosFiltrados(
      stateFiltros.filtrar_por_nome,
      stateFiltros.filtrar_por_categoria,
      stateFiltros.filtrar_por_ativo
    );
    setTodosLancamentos(lancamentosFiltrados);
    setLoading(false);
  };

  const limpaFiltros = async () => {
    setStateFiltros(initialStateFiltros);
    await carregaTodosLancamentos()
  };

  const rowsPerPage = 20;

  const lancamentosTemplate = (rowData) => {
    return (
      <div>
        <button
          onClick={() => handleEditarLancamentos(rowData)}
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

  const handleSubmitModalFormLancamentos = async (stateFormModal) => {
    const payload = {
      nome: stateFormModal.nome,
      categoria: stateFormModal.categoria,
      ativo: stateFormModal.ativo,
    };

    if (stateFormModal.operacao === "create") {
      try {
        await postAddAcertosLancamentos(payload);
        setShowModalForm(false);
        toastCustom.ToastCustomSuccess('Inclusão de tipo de acerto em lançamento realizado com sucesso.', `O tipo de acerto em lançamento foi adicionado ao sistema com sucesso.`)
        await carregaTodosLancamentos();
      } catch (e) {
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
        await putAtualizarAcertosLancamentos(stateFormModal.uuid, payload);
        setShowModalForm(false);
        toastCustom.ToastCustomSuccess('Edição do tipo de acerto em lançamento realizado com sucesso.', `O tipo de acerto em lançamento foi editado no sistema com sucesso.`)
        console.log("Ação alterada com sucesso", payload);
        await carregaTodosLancamentos();
      } catch (e) {
        if (e.response.data && e.response.data.non_field_errors) {
          setMensagemModalInfoNaoPodeGravar(
            e.response.data.non_field_errors
          );
          setShowModalInfoNaoPodeGravar(true);
        } else {
          setMensagemModalInfoNaoPodeGravar(
            "Já existe um lançamento com esse nome."
          );
          setShowModalInfoNaoPodeGravar(true);
        }
      }
    }
  };

  const serviceCrudLancamentos = async () => {
    setShowModalDeleteLancamento(true)
  };

  const handleCloseDeleteLancamento = () => {
    setShowModalInfoNaoPodeExcluir(false)
    setShowModalDeleteLancamento(false)
  };

  const onDeleteLancamentoTrue = async () => {
    try {
        setShowModalDeleteLancamento(false);
        await deleteAcertosLancamentos(stateFormModal.uuid);
        setShowModalForm(false);
      toastCustom.ToastCustomSuccess('Remoção do tipo de acerto em lançamento efetuado com sucesso.', `O tipo de acerto em lançamento foi removido do sistema com sucesso.`)
        console.log('Lançamento excluído com sucesso');
        await carregaTodosLancamentos();
    } catch (e) {
        if (e.response && e.response.data && e.response.data.mensagem){
            setMensagemModalInfoNaoPodeExcluir(e.response.data.mensagem);
            setShowModalInfoNaoPodeExcluir(true);
            console.log(e.response.data.mensagem)
        }
        console.log('Erro ao excluir Lançamento!! ', e.response)
    }
};

  const handleCloseInfoNaoPodeGravar = () => {
    setShowModalInfoNaoPodeGravar(false);
    setMensagemModalInfoNaoPodeGravar("");
  };

  const handleCloseInfoNaoPodeExcluir = () => {
    setShowModalInfoNaoPodeExcluir(false)
  };

  const handleEditarLancamentos = (rowData) => {
    setReadOnly(false);
    setStateFormModal({
      uuid: rowData.uuid,
      id: rowData.id,
      nome: rowData.nome,
      categoria: rowData.categoria,
      ativo: rowData.ativo,
      operacao: "edit",
    });
    setShowModalForm(true);
  };

  const handleChangeFormModal = (name, value) => {
    setStateFormModal({
      ...stateFormModal,
      [name]: value,
    });
  };

  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Tipo de acertos em lançamentos</h1>
      <div className="page-content-inner">
        <>
          <div className="p-2 bd-highlight pt-3 pb-3 justify-content-end d-flex">
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
                    Adicionar tipo de acerto em lançamentos
                  </button>
                </div>
                <Filtros
                  categoriaTabela={categoriaTabela}
                  stateFiltros={stateFiltros}
                  handleChangeFiltros={handleChangeFiltros}
                  handleSubmitFiltros={handleSubmitFiltros}
                  limpaFiltros={limpaFiltros}
                  />
                  <p>
                    Exibindo{" "}
                    <span className="total">{totalLancamentos}</span>{" "}
                    tipos de acertos em lançamentos
                  </p>
            </>
            
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
          (todosLancamentos||[]).length > 0 ? (
          <>
            <TabelaLancamentos
              todosLancamentos={todosLancamentos}
              rowsPerPage={rowsPerPage}
              lancamentosTemplate={lancamentosTemplate}
            />
          </>
        ) : (
        <MsgImgCentralizada
            texto='Não há lançamentos'
            img={Img404}
        />
        )
      )}
        <section>
          <ModalFormLancamentos
            show={showModalForm}
            handleClose={onHandleClose}
            handleSubmitModalFormLancamentos={handleSubmitModalFormLancamentos}
            handleOnChangeMultipleSelectModal={handleOnChangeMultipleSelectModal}
            handleChangeFormModal={handleChangeFormModal}
            stateFormModal={stateFormModal}
            readOnly={readOnly}
            categoriaTabela={categoriaTabela}
            serviceCrudLancamentos={serviceCrudLancamentos}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
          />
        </section>
        <section>
          <ModalConfirmDeleteLancamento
            show={showModalDeleteLancamento}
            handleClose={handleCloseDeleteLancamento}
            onDeleteLancamentoTrue={onDeleteLancamentoTrue}
            titulo="Excluir Ação"
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
      </div>
    </PaginasContainer>
  );
};
