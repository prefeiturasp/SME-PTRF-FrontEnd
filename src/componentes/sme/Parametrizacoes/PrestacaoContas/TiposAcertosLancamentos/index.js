import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import {
  getListaDeLancamentos,
  getLancamentosFiltrados,
  postAddLancamentos,
  putAtualizarLancamento,
} from "../../../../../services/sme/Parametrizacoes.service";
import { Filtros } from "./Filtros";
import { TabelaLancamentos } from "../../PrestacaoContas/TiposAcertosLancamentos/TabelaLancamentos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../utils/Loading";
import { Link } from "react-router-dom";
import { ModalFormLancamentos } from "../../PrestacaoContas/TiposAcertosLancamentos/ModalFormLancamento";
import { ModalConfirmDeleteAcao } from "../../Estrutura/Acoes/ModalConfirmDeleteAcao";
import { ModalInfoNaoPodeExcluir } from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import { ModalInfoNaoPodeGravar } from "../../Estrutura/Acoes/ModalInfoNaoPodeGravar";
import "../parametrizacoes-prestacao-contas.scss";

export const ParametrizacoesTiposAcertosLancamentos = () => {
  const initialStateFiltros = {
    filtrar_por_nome: "",
    filtrar_por_categoria: "",
    filtrar_por_ativo: "",
  };
  const initialStateFormModal = {
    nome: "",
    categoria: "",
    uuid: "",
    id: "",
  };
  const [todosLancamentos, setTodosLancamentos] = useState([]);
  const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
  const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
  const [showModalForm, setShowModalForm] = useState(false);
  const [showModalInfoNaoPodeGravar, setShowModalInfoNaoPodeGravar] = useState(false);
  const [mensagemModalInfoNaoPodeGravar, setMensagemModalInfoNaoPodeGravar] = useState("");
  const [showModalDeleteAcao, setShowModalDeleteAcao] = useState(false);
  const [showModalInfoNaoPodeExcluir, setShowModalInfoNaoPodeExcluir] = useState(false);
  const [mensagemModalInfoNaoPodeExcluir, setMensagemModalInfoNaoPodeExcluir] = useState("");
  const [loading, setLoading] = useState(true);
  const [readOnly, setReadOnly] = useState(false);

  const carregaTodosLancamentos = useCallback(async () => {
    setLoading(true);
    let todosLancamentos = await getListaDeLancamentos();
    setTodosLancamentos(todosLancamentos);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregaTodosLancamentos();
  }, [carregaTodosLancamentos]);

  const totalLancamentos = useMemo(
    () => todosLancamentos.length,
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
    let lancamentosFiltrados = await getLancamentosFiltrados(
      stateFiltros.filtrar_por_nome,
      stateFiltros.filtrar_por_categoria,
      stateFiltros.filtrar_por_ativo
    );
    setTodosLancamentos(lancamentosFiltrados);
    setLoading(false);
  };

  const limpaFiltros = async () => {
    setStateFiltros(initialStateFiltros);
  };

  const rowsPerPage = 20;

  const lancamentosTemplate = (rowData) => {
    return (
      <div>
        <button
          onClick={() => handleEditarLancamentos(rowData)}
          className="btn-editar-membro"
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

  const handleSubmitModalFormLancamentos = async (stateFormModal) => {
    const payload = {
      nome: stateFormModal.nome,
      categoria: stateFormModal.categoria,
      ativo: stateFormModal.ativo,
    };

    if (stateFormModal.operacao === "create") {
      try {
        await postAddLancamentos(payload);
        setShowModalForm(false);
        console.log("Ação criada com sucesso");
        await carregaTodosLancamentos();
      } catch (e) {
        console.log("Erro ao criar Ação!!! ", e.response.data);
        if (e.response.data && e.response.data.non_field_errors) {
          setMensagemModalInfoNaoPodeGravar(
            "Ja existe uma ação com esse nome."
          );
          setShowModalInfoNaoPodeGravar(true);
        } else {
          setMensagemModalInfoNaoPodeGravar(
            "Houve um erro ao tentar fazer essa atualização."
          );
          setShowModalInfoNaoPodeGravar(true);
        }
      }
    } else {
      try {
        await putAtualizarLancamento(stateFormModal.uuid, payload);
        setShowModalForm(false);
        console.log("Ação alterada com sucesso", payload);
        await carregaTodosLancamentos();
      } catch (e) {
        console.log("Erro ao alterar Ação!! ", e);
        if (e.response.data && e.response.data.non_field_errors) {
          setMensagemModalInfoNaoPodeGravar(
            "Ja existe uma ação com esse nome."
          );
          setShowModalInfoNaoPodeGravar(true);
        } else {
          setMensagemModalInfoNaoPodeGravar(
            "Houve um erro ao tentar fazer essa atualização."
          );
          setShowModalInfoNaoPodeGravar(true);
        }
      }
    }
  };

  const serviceCrudLancamentos = async () => {
    console.log("service crud");
  };

  const handleCloseDeleteAcao = () => {
    console.log("handle close delete acao");
  };

  const onDeleteAcaoTrue = () => {
    console.log("on delete acao true");
  };

  const handleCloseInfoNaoPodeGravar = () => {
    setShowModalInfoNaoPodeGravar(false);
    setMensagemModalInfoNaoPodeGravar("");
  };

  const handleCloseInfoNaoPodeExcluir = () => {
    setShowModalInfoNaoPodeGravar(false);
    setMensagemModalInfoNaoPodeGravar("");
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
      <h1 className="titulo-itens-painel mt-5">Tipo de Acertos Lançamentos</h1>
      <div className="page-content-inner">
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
          <>
            <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
              <Link
                to="#"
                onClick={() => {
                  setStateFormModal(initialStateFormModal);
                  setShowModalForm(true);
                }}
                className="btn btn-success ml-2"
              >
                <FontAwesomeIcon
                  style={{ marginRight: "5px", color: "#fff" }}
                  icon={faPlus}
                />
                Adicionar tipo de acerto nos lançamentos
              </Link>
            </div>
            <Filtros
              stateFiltros={stateFiltros}
              handleChangeFiltros={handleChangeFiltros}
              handleSubmitFiltros={handleSubmitFiltros}
              limpaFiltros={limpaFiltros}
            />
            <p>
              Exibindo{" "}
              <span className="total-lancamentos">{totalLancamentos}</span>{" "}
              tipos de acertos de lançamentos
            </p>
            <TabelaLancamentos
              todosLancamentos={todosLancamentos}
              rowsPerPage={rowsPerPage}
              lancamentosTemplate={lancamentosTemplate}
            />
          </>
        )}
        <section>
          <ModalFormLancamentos
            show={showModalForm}
            handleClose={onHandleClose}
            handleSubmitModalFormLancamentos={handleSubmitModalFormLancamentos}
            handleChangeFormModal={handleChangeFormModal}
            stateFormModal={stateFormModal}
            readOnly={readOnly}
            serviceCrudLancamentos={serviceCrudLancamentos}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
          />
        </section>
        <section>
          <ModalConfirmDeleteAcao
            show={showModalDeleteAcao}
            handleClose={handleCloseDeleteAcao}
            onDeleteAcaoTrue={onDeleteAcaoTrue}
            titulo="Excluir Ação"
            texto="<p>Deseja realmente excluir esta ação?</p>"
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
