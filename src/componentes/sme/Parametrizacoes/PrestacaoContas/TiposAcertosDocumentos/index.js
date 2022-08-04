import React, { useState, useEffect, useCallback, useMemo } from "react";
import Loading from "../../../../../utils/Loading";
import { getListaDeAcertosDocumentos } from "../../../../../services/sme/Parametrizacoes.service";
import { TabelaDocumentos } from "../../PrestacaoContas/TiposAcertosDocumentos/TabelaDocumentos";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { Filtros } from "./Filtros";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg"
import "../parametrizacoes-prestacao-contas.scss";
import { ModalFormLancamentos } from "../../PrestacaoContas/TiposAcertosLancamentos/ModalFormLancamento";
import { ModalConfirmDeleteLancamento } from "../../PrestacaoContas/TiposAcertosLancamentos/ModalConfirmDeleteLancamento";
import { ModalInfoNaoPodeExcluir } from "../../Estrutura/Acoes/ModalInfoNaoPodeExcluir";
import { ModalInfoNaoPodeGravar } from "../../Estrutura/Acoes/ModalInfoNaoPodeGravar";


export const ParametrizacoesTiposAcertosDocumentos = () => {
  
  const initialStateFiltros = {
      filtrar_por_nome: "",
      filtrar_por_categoria: "",
      filtrar_por_ativo: "",
  };

  const initialStateFormModal = {
      nome: "",
      categoria: "",
      ativo: false,
      operacao: 'create',
  };

  const [todosDocumentos, setTodosDocumentos] = useState([]);
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

  const carregaTodosDocumentos = useCallback(async () => {
    setLoading(true);
    let todosDocumentos = await getListaDeAcertosDocumentos();
    console.log("fui chamado? ", todosDocumentos)
    setTodosDocumentos(todosDocumentos);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregaTodosDocumentos();
  }, [carregaTodosDocumentos]);

  const totalDocumentos = useMemo(
    () => todosDocumentos.length,
    [todosDocumentos]
  );

  const rowsPerPage = 20;

  const documentosTemplate = (rowData) => {
    return (
      <div>
        <button
          onClick={() => handleEditarDocumentos(rowData)}
          className="btn-editar-documentos"
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
    // setReadOnly(false);
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

  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Tipo de acertos em documentos</h1>
      <div className="page-content-inner">
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
                    Adicionar tipo de acerto em documentos
                  </Link>
                </div>
                <Filtros
                  categoriaTabela={categoriaTabela}
                  stateFiltros={''}
                  handleChangeFiltros={''}
                  handleSubmitFiltros={''}
                  limpaFiltros={''}
                  />
                  <p>
                    Exibindo{" "}
                    <span className="total-documentos">{totalDocumentos}</span>{" "}
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
            todosDocumentos.length > 0 ? (
            <>
              <TabelaDocumentos
                todosDocumentos={todosDocumentos}
                rowsPerPage={rowsPerPage}
                documentosTemplate={documentosTemplate}
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
          <ModalFormLancamentos
            show={''}
            handleClose={(e) => {''}}
            handleSubmitModalFormLancamentos={''}
            handleOnChangeMultipleSelectModal={''}
            handleChangeFormModal={''}
            stateFormModal={''}
            readOnly={''}
            categoriaTabela={''}
            serviceCrudLancamentos={''}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
          />
        </section>
        <section>
          <ModalConfirmDeleteLancamento
            show={''}
            handleClose={''}
            onDeleteLancamentoTrue={''}
            titulo="Excluir Ação"
            texto={`<p>Deseja realmente apagar ${3}?</p>`}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoCss="danger"
            segundoBotaoTexto="Excluir"
          />
        </section>
        <section>
          <ModalInfoNaoPodeExcluir
            show={''}
            handleClose={''}
            titulo="Exclusão não permitida"
            texto={''}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="success"
          />
        </section>
        <section>
          <ModalInfoNaoPodeGravar
            show={''}
            handleClose={''}
            titulo="Atualização não permitida"
            texto={''}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="success"
          />
        </section>
        </>
        </div>
    </PaginasContainer>
  )
}