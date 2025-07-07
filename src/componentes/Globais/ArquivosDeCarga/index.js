import React, { memo, useMemo, useCallback, useEffect, useState } from "react";
import "./arquivos-de-carga.scss";
import "../../dres/Associacoes/associacoes.scss";
import { ModalConfirmarExclusao } from "../../../componentes/sme/Parametrizacoes/componentes/ModalConfirmarExclusao";
import { Navigate, useParams } from "react-router-dom";
import { BotoesTopo } from "./BotoesTopo";
import { PaginasContainer } from "../../../paginas/PaginasContainer";
import {
  getTabelaArquivosDeCarga,
  getArquivosDeCargaFiltros,
  postCreateArquivoDeCarga,
  patchAlterarArquivoDeCarga,
  deleteArquivoDeCarga,
  getDownloadArquivoDeCarga,
  postProcessarArquivoDeCarga,
  getDownloadModeloArquivoDeCarga,
  getTiposContas,
} from "../../../services/sme/Parametrizacoes.service";
import moment from "moment";
import TabelaArquivosDeCarga from "./TabelaArquivosDeCarga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCogs,
  faDownload,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Filtros } from "./Filtros";
import { MenuInterno } from "../MenuInterno";
import ModalFormArquivosDeCarga from "./ModalFormArquivosDeCarga";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from "../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios";
import { toastCustom } from "../ToastCustom";
import { getPeriodos } from "../../../services/dres/Dashboard.service";

const ArquivosDeCarga = () => {
  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES =
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
  const TEM_PERMISSAO_EDICAO_GESTAO_USUARIOS =
    RetornaSeTemPermissaoEdicaoGestaoUsuarios();

  const url_params = useParams();
  const dadosDeOrigem = useMemo(() => {
    let obj = {
      titulo: "",
      acesso_permitido: false,
      url: "",
      origem: "",
    };

    if (url_params.tipo_de_carga === "CARGA_ASSOCIACOES") {
      obj = {
        titulo: "Associações",
        titulo_modal: "associação",
        acesso_permitido: true,
        UrlsMenuInterno: [
          { label: "Dados das associações", url: "parametro-associacoes" },
          {
            label: "Cargas de arquivo",
            url: "parametro-arquivos-de-carga",
            origem: "CARGA_ASSOCIACOES",
          },
        ],
      };
    } else if (url_params.tipo_de_carga === "CARGA_ACOES_ASSOCIACOES") {
      obj = {
        titulo: "Ações das Associações",
        titulo_modal: "ações das associações",
        acesso_permitido: true,
        UrlsMenuInterno: [
          {
            label: "Ações das associações",
            url: "parametro-acoes-associacoes",
          },
          {
            label: "Cargas de arquivo",
            url: "parametro-arquivos-de-carga",
            origem: "CARGA_ACOES_ASSOCIACOES",
          },
        ],
      };
    } else if (url_params.tipo_de_carga === "CARGA_CONTAS_ASSOCIACOES") {
      obj = {
        titulo: "Contas de Associações",
        titulo_modal: "conta de associação",
        acesso_permitido: true,
        UrlsMenuInterno: [
          {
            label: "Contas de Associações",
            url: "parametro-contas-associacoes",
          },
          {
            label: "Cargas de arquivo",
            url: "parametro-arquivos-de-carga",
            origem: "CARGA_CONTAS_ASSOCIACOES",
          },
        ],
      };
    } else if (
      url_params.tipo_de_carga === "CARGA_USUARIOS" &&
      url_params.versao === "V2"
    ) {
      obj = {
        titulo: "Usuários",
        titulo_modal: "usuário",
        acesso_permitido: true,
        UrlsMenuInterno: [
          { label: "Dados dos usuários", url: "gestao-de-usuarios-list" },
          {
            label: "Cargas de arquivo",
            url: "parametro-arquivos-de-carga",
            origem: "CARGA_USUARIOS",
          },
        ],
      };
    } else if (url_params.tipo_de_carga === "CARGA_USUARIOS") {
      obj = {
        titulo: "Usuários",
        titulo_modal: "usuário",
        acesso_permitido: true,
        UrlsMenuInterno: [
          { label: "Dados dos perfis", url: "gestao-de-perfis" },
          {
            label: "Cargas de arquivo",
            url: "parametro-arquivos-de-carga",
            origem: "CARGA_USUARIOS",
          },
        ],
      };
    } else if (url_params.tipo_de_carga === "CARGA_MATERIAIS_SERVICOS") {
      obj = {
        titulo: "Especificações de Materiais e Serviços",
        titulo_modal: "Especificações de Materiais e Serviços",
        acesso_permitido: true,
        UrlsMenuInterno: [
          {
            label: "Especificações e Serviços",
            url: "parametro-especificacoes",
          },
          {
            label: "Cargas de arquivo",
            url: "parametro-arquivos-de-carga",
            origem: "CARGA_MATERIAIS_SERVICOS",
          },
        ],
      };
    } else if (url_params.tipo_de_carga === "REPASSE_PREVISTO") {
      obj = {
        titulo: "Repasses",
        titulo_modal: "repasse previsto",
        acesso_permitido: true,
        UrlsMenuInterno: [
          { label: "Repasses", url: "parametro-repasse" },
          {
            label: "Cargas de repasses previstos",
            url: "parametro-arquivos-de-carga",
            origem: "REPASSE_PREVISTO",
          },
          {
            label: "Cargas de repasses realizados",
            url: "parametro-arquivos-de-carga",
            origem: "REPASSE_REALIZADO",
          },
        ],
      };
    } else if (url_params.tipo_de_carga === "REPASSE_REALIZADO") {
      obj = {
        titulo: "Repasses",
        titulo_modal: "repasse realizado",
        acesso_permitido: true,
        UrlsMenuInterno: [
          { label: "Repasses", url: "parametro-repasse" },
          {
            label: "Cargas de repasses previstos",
            url: "parametro-arquivos-de-carga",
            origem: "REPASSE_PREVISTO",
          },
          {
            label: "Cargas de repasses realizados",
            url: "parametro-arquivos-de-carga",
            origem: "REPASSE_REALIZADO",
          },
        ],
      };
    }
    return obj;
  }, [url_params]);

  const [tabelaArquivos, setTabelaArquivos] = useState([]);
  const [arquivos, setArquivos] = useState([]);
  const [clickProcessar, setClickProcessar] = useState(false);

  const [arquivoRequerPeriodo, setArquivoRequerPeriodo] = useState(false);
  const [arquivoRequerTipoDeConta, setArquivoRequerTipoDeConta] =
    useState(false);

  useEffect(() => {
    if (
      arquivos &&
      arquivos.length > 0 &&
      arquivos.filter((arquivo) => arquivo.status === "PROCESSANDO").length > 0
    ) {
      const timer = setInterval(() => {
        carregaArquivosPeloTipoDeCarga();
      }, 5000);
      // clearing interval
      return () => clearInterval(timer);
    }
  });

  const carregaTabelaArquivos = useCallback(async () => {
    if (dadosDeOrigem.acesso_permitido) {
      let tabela = await getTabelaArquivosDeCarga();
      setTabelaArquivos(tabela);
      if (tabela && tabela.tipos_cargas) {
        const requerPeriodo = tabela.tipos_cargas.find(
          (tipo) => tipo.id === url_params.tipo_de_carga
        )?.requer_periodo;
        const requerTipoConta = tabela.tipos_cargas.find(
          (tipo) => tipo.id === url_params.tipo_de_carga
        )?.requer_tipo_de_conta;
        setArquivoRequerPeriodo(requerPeriodo);
        setArquivoRequerTipoDeConta(requerTipoConta);
      }
    }
  }, [dadosDeOrigem.acesso_permitido]);

  useEffect(() => {
    carregaTabelaArquivos();
  }, [carregaTabelaArquivos]);

  useEffect(() => {
    if (tabelaArquivos && tabelaArquivos.tipos_cargas) {
      const requerPeriodo = tabelaArquivos.tipos_cargas.find(
        (tipo) => tipo.id === url_params.tipo_de_carga
      )?.requer_periodo;
      const requerTipoConta = tabelaArquivos.tipos_cargas.find(
        (tipo) => tipo.id === url_params.tipo_de_carga
      )?.requer_tipo_de_conta;
      setArquivoRequerPeriodo(requerPeriodo);
      setArquivoRequerTipoDeConta(requerTipoConta);
    }
  }, [url_params.tipo_de_carga, tabelaArquivos]);

  const carregaArquivosPeloTipoDeCarga = useCallback(async () => {
    if (dadosDeOrigem.acesso_permitido) {
      try {
        let arquivos = await getArquivosDeCargaFiltros(
          url_params.tipo_de_carga
        );
        setArquivos(arquivos);
      } catch (e) {
        console.log("Erro ao carregar arquivos");
      }
    }
  }, [url_params, dadosDeOrigem.acesso_permitido]);

  useEffect(() => {
    carregaArquivosPeloTipoDeCarga();
  }, [carregaArquivosPeloTipoDeCarga]);

  // Quando a state de todasAsAcoes sofrer alteração
  const totalDeArquivos = useMemo(
    () => (arquivos ? arquivos.length : 0),
    [arquivos]
  );

  // Filtros
  const initialStateFiltros = {
    filtrar_por_identificador: "",
    filtrar_por_status: "",
    filtrar_por_data_de_execucao: "",
  };
  const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

  const handleChangeFiltros = useCallback(
    (name, value) => {
      setStateFiltros({
        ...stateFiltros,
        [name]: value,
      });
    },
    [stateFiltros]
  );

  const handleSubmitFiltros = async () => {
    let arquivos_filtrados = await getArquivosDeCargaFiltros(
      url_params.tipo_de_carga,
      stateFiltros.filtrar_por_identificador,
      stateFiltros.filtrar_por_status,
      stateFiltros.filtrar_por_data_de_execucao
        ? moment(stateFiltros.filtrar_por_data_de_execucao).format("YYYY-MM-DD")
        : ""
    );
    setArquivos(arquivos_filtrados);
  };

  const limpaFiltros = async () => {
    setStateFiltros(initialStateFiltros);
    await carregaArquivosPeloTipoDeCarga();
  };

  //Para a Tabela
  const rowsPerPage = 20;

  const conteudoTemplate = (rowData) => {
    return (
      <div className="quebra-palavra">{rowData.conteudo.split("/").pop()}</div>
    );
  };

  const statusTemplate = useCallback(
    (rowData = "", status_estatico = "") => {
      if (
        tabelaArquivos &&
        tabelaArquivos.status &&
        tabelaArquivos.status.length > 0
      ) {
        let status_retornar;
        if (rowData) {
          status_retornar = tabelaArquivos.status.filter(
            (item) => item.id === rowData.status
          );
        } else if (status_estatico) {
          status_retornar = tabelaArquivos.status.filter(
            (item) => item.id === status_estatico
          );
        } else {
          return "";
        }
        return status_retornar[0].nome;
      }
    },
    [tabelaArquivos]
  );

  const dataTemplate = (rowData, column) => {
    return (
      <div>
        {rowData[column.field]
          ? moment(rowData[column.field]).format("DD/MM/YYYY")
          : "-"}
      </div>
    );
  };

  const dataHoraTemplate = (rowData, column) => {
    return rowData[column.field]
      ? moment(rowData[column.field]).format("DD/MM/YYYY [às] HH[h]mm")
      : "-";
  };

  // Modais
  const initialStateFormModal = {
    identificador: "",
    tipo_carga: url_params.tipo_de_carga,
    tipo_delimitador: "",
    ultima_execucao: "",
    status: "",
    conteudo: "",
    valida_conteudo: true,
    nome_arquivo: "",
    uuid: "",
    id: "",
    log: "",
    operacao: "create",
  };

  const [showModalForm, setShowModalForm] = useState(false);
  const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
  const [
    showModalConfirmDeleteArquivosDeCarga,
    setShowModalConfirmDeleteArquivosDeCarga,
  ] = useState(false);

  const handleClickEditarArquivos = useCallback(
    async (rowData) => {
      setShowModalForm(true);

      let stateFormModalValues = {
        ...stateFormModal,
        identificador: rowData.identificador,
        tipo_carga: rowData.tipo_carga,
        tipo_delimitador: rowData.tipo_delimitador,
        ultima_execucao: rowData.ultima_execucao
          ? moment(rowData.ultima_execucao).format("DD/MM/YYYY")
          : "-",
        status: rowData.status,
        valida_conteudo: false,
        uuid: rowData.uuid,
        id: rowData.id,
        log: rowData.log,
        operacao: "edit",
        periodo: rowData.periodo,
        tipo_de_conta: rowData.tipo_de_conta,
      };

      const url = rowData.conteudo;
      const nome_arquivo = url.split("/").pop();
      stateFormModalValues.nome_arquivo = nome_arquivo;

      setStateFormModal(stateFormModalValues);
    },
    [stateFormModal]
  );

  const handleClickDeleteArquivoDeCarga = useCallback(
    (uuid_arquivo_de_carga) => {
      setStateFormModal({
        ...stateFormModal,
        uuid: uuid_arquivo_de_carga,
      });
      setShowModalConfirmDeleteArquivosDeCarga(true);
    },
    [stateFormModal]
  );

  const handleClickDownloadArquivoDeCarga = useCallback(async (rowData) => {
    let nome_do_arquivo_com_extensao = conteudoTemplate(rowData).props.children;
    try {
      await getDownloadArquivoDeCarga(
        rowData.uuid,
        nome_do_arquivo_com_extensao
      );
      console.log("Download efetuado com sucesso");
    } catch (e) {
      console.log("Erro ao efetuar o download ", e.response);
    }
  }, []);

  const handleClickProcessarArquivoDeCarga = useCallback(
    async (rowData) => {
      try {
        await postProcessarArquivoDeCarga(rowData.uuid);
        console.log("Arquivo de Carga processado com sucesso");
        setClickProcessar(true);
        await carregaArquivosPeloTipoDeCarga();
      } catch (e) {
        console.log("Erro ao processar o Arquivo de Carga  ", e.response);
      }
      await carregaArquivosPeloTipoDeCarga();
    },
    [carregaArquivosPeloTipoDeCarga]
  );

  const handleClickDownloadModeloArquivoDeCarga = useCallback(async () => {
    try {
      await getDownloadModeloArquivoDeCarga(url_params.tipo_de_carga);
      console.log("Download do modelo efetuado com sucesso");
    } catch (e) {
      console.log("Erro ao fazer o download do modelo ", e.response);
    }
  }, [url_params.tipo_de_carga]);

  const acoesTemplate = useCallback(
    (rowData) => {
      return (
        <div className="dropdown">
          <span
            id="linkDropdownAcoes"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <button className="btn-acoes">
              <span className="btn-acoes-dots">...</span>
            </button>
          </span>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <button
              onClick={() => handleClickProcessarArquivoDeCarga(rowData)}
              className="btn btn-link dropdown-item fonte-14"
              type="button"
              disabled={!temPermissaoEditarCarga()}
            >
              <FontAwesomeIcon
                style={{
                  fontSize: "15px",
                  marginRight: "5px",
                  color: "#00585E",
                }}
                icon={faCogs}
              />
              <strong>Processar</strong>
            </button>
            <button
              onClick={() => handleClickEditarArquivos(rowData)}
              className="btn btn-link dropdown-item fonte-14"
              type="button"
              disabled={!temPermissaoEditarCarga()}
            >
              <FontAwesomeIcon
                style={{
                  fontSize: "15px",
                  marginRight: "5px",
                  color: "#00585E",
                }}
                icon={faEdit}
              />
              <strong>Editar</strong>
            </button>
            <button
              onClick={() => handleClickDownloadArquivoDeCarga(rowData)}
              className="btn btn-link dropdown-item fonte-14"
              type="button"
              disabled={!temPermissaoEditarCarga()}
            >
              <FontAwesomeIcon
                style={{
                  fontSize: "15px",
                  marginRight: "5px",
                  color: "#00585E",
                }}
                icon={faDownload}
              />
              <strong>Baixar</strong>
            </button>
            <button
              onClick={() => handleClickDeleteArquivoDeCarga(rowData.uuid)}
              className="btn btn-link dropdown-item fonte-14"
              type="button"
              disabled={!temPermissaoEditarCarga()}
            >
              <FontAwesomeIcon
                style={{
                  fontSize: "15px",
                  marginRight: "5px",
                  color: "#B40C02",
                }}
                icon={faTrashAlt}
              />
              <strong>Excluir</strong>
            </button>
          </div>
        </div>
      );
    },
    [
      handleClickDeleteArquivoDeCarga,
      handleClickDownloadArquivoDeCarga,
      handleClickEditarArquivos,
      handleClickProcessarArquivoDeCarga,
    ]
  );

  const handleSubmitModalForm = useCallback(
    async (values) => {
      if (values.operacao === "create") {
        try {
          let payload = {
            identificador: values.identificador,
            tipo_carga: url_params.tipo_de_carga,
            tipo_delimitador: values.tipo_delimitador,
            status: "PENDENTE",
            conteudo: values.conteudo,
          };
          if (url_params.tipo_de_carga === "REPASSE_PREVISTO") {
            payload.periodo = values.periodo;
          }
          if (url_params.tipo_de_carga === "REPASSE_PREVISTO") {
            payload.tipo_de_conta = values.tipo_de_conta;
          }

          await postCreateArquivoDeCarga(payload);
          console.log("Arquivo de carga criado com sucesso");
          setShowModalForm(false);
          toastCustom.ToastCustomSuccess(
            "Arquivo de carga",
            `Arquivo de carga criado com sucesso`
          );
          await carregaArquivosPeloTipoDeCarga();
        } catch (e) {
          console.log("Erro ao criar Arquivo de carga ", e.response.data);
          toastCustom.ToastCustomError(
            "Arquivo de carga",
            `Erro ao criar arquivo de carga.`
          );
          if (e.response.data.identificador[0]) {
            toastCustom.ToastCustomError(
              "Arquivo de carga",
              `${e.response.data.identificador[0]}`
            );
          }
        }
      } else if (values.operacao === "edit") {
        let payload;
        if (values.conteudo) {
          payload = {
            identificador: values.identificador,
            tipo_delimitador: values.tipo_delimitador,
            conteudo: values.conteudo,
          };
        } else {
          payload = {
            identificador: values.identificador,
            tipo_delimitador: values.tipo_delimitador,
          };
        }
        if (url_params.tipo_de_carga === "REPASSE_PREVISTO") {
          payload.periodo = values.periodo;
        }
        if (url_params.tipo_de_carga === "REPASSE_PREVISTO") {
          payload.tipo_de_conta = values.tipo_de_conta;
        }

        try {
          await patchAlterarArquivoDeCarga(values.uuid, payload);
          console.log("Arquivo de carga alterado com sucesso");
          setShowModalForm(false);
          toastCustom.ToastCustomSuccess(
            "Arquivo de carga",
            `Arquivo de carga alterado com sucesso`
          );
          await carregaArquivosPeloTipoDeCarga();
        } catch (e) {
          console.log("Erro ao alterar Arquivo de carga ", e.response.data);
          toastCustom.ToastCustomError(
            "Arquivo de carga",
            `Erro ao alterar arquivo de carga.`
          );
          if (e.response.data.identificador[0]) {
            toastCustom.ToastCustomError(
              "Arquivo de carga",
              `${e.response.data.identificador[0]}`
            );
          }
        }
      }
    },
    [carregaArquivosPeloTipoDeCarga, url_params]
  );

  const onDeleteArquivoDeCargaTrue = async () => {
    try {
      await deleteArquivoDeCarga(stateFormModal.uuid);
      console.log("Arquivo de Carga excluído com sucesso");
      setShowModalConfirmDeleteArquivosDeCarga(false);
      setShowModalForm(false);
      toastCustom.ToastCustomSuccess(
        "Arquivo de carga",
        `Arquivo de Carga excluído com sucesso`
      );
      await carregaArquivosPeloTipoDeCarga();
    } catch (e) {
      console.log("Erro ao excluir Arquivo de carga ", e.response.data);
      toastCustom.ToastCustomError(
        "Arquivo de carga",
        `Erro ao excluir Arquivo de carga`
      );
    }
  };

  const handleCloseFormModal = () => {
    setShowModalForm(false);
  };

  const handleCloseConfirmDeleteArquivoDeCarga = useCallback(() => {
    setShowModalConfirmDeleteArquivosDeCarga(false);
  }, []);

  const temPermissaoEditarCarga = () => {
    if (url_params && url_params.versao === "V2") {
      return TEM_PERMISSAO_EDICAO_GESTAO_USUARIOS;
    }

    return TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES;
  };

  const [periodos, setPeriodos] = useState([]);
  const carregaPeriodos = async () => {
    try {
      let response = await getPeriodos();
      setPeriodos(response);
    } catch (error) {
      console.log("Erro ao tentar resgatar períodos: ", error);
    }
  };

  const [tiposDeContas, setTiposDeContas] = useState([]);
  const carregaTiposDeContas = async () => {
    try {
      let response = await getTiposContas();
      setTiposDeContas(response);
    } catch (error) {
      console.log("Erro ao tentar resgatar tipos de conta: ", error);
    }
  };

  useEffect(() => {
    carregaPeriodos();
    carregaTiposDeContas();
  }, []);

  return (
    <PaginasContainer>
      <>
        {!dadosDeOrigem.acesso_permitido ? (
          <Navigate
            to={{
              pathname: "/painel-parametrizacoes",
            }}
            replace
          />
        ) : (
          <>
            <h1 className="titulo-itens-painel mt-5">{dadosDeOrigem.titulo}</h1>
            <div className="page-content-inner">
              <MenuInterno
                caminhos_menu_interno={dadosDeOrigem.UrlsMenuInterno}
              />
              <BotoesTopo
                setShowModalForm={setShowModalForm}
                setStateFormModal={setStateFormModal}
                initialStateFormModal={initialStateFormModal}
                handleClickDownloadModeloArquivoDeCarga={
                  handleClickDownloadModeloArquivoDeCarga
                }
                temPermissaoEditarCarga={temPermissaoEditarCarga}
              />
              <Filtros
                stateFiltros={stateFiltros}
                handleChangeFiltros={handleChangeFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
                tabelaArquivos={tabelaArquivos}
                tipoCarga={url_params.tipo_de_carga}
              />
              <p>
                Exibindo <span className="total-acoes">{totalDeArquivos}</span>{" "}
                cargas de arquivo
              </p>
              <TabelaArquivosDeCarga
                arquivos={arquivos}
                rowsPerPage={rowsPerPage}
                conteudoTemplate={conteudoTemplate}
                dataTemplate={dataTemplate}
                dataHoraTemplate={dataHoraTemplate}
                statusTemplate={statusTemplate}
                acoesTemplate={acoesTemplate}
              />
            </div>
          </>
        )}
        <section>
          <ModalFormArquivosDeCarga
            show={showModalForm}
            stateFormModal={stateFormModal}
            tabelaArquivos={tabelaArquivos}
            statusTemplate={statusTemplate}
            handleClose={handleCloseFormModal}
            handleSubmitModalForm={handleSubmitModalForm}
            dadosDeOrigem={dadosDeOrigem}
            periodos={periodos}
            arquivoRequerPeriodo={arquivoRequerPeriodo}
            tiposDeContas={tiposDeContas}
            arquivoRequerTipoDeConta={arquivoRequerTipoDeConta}
          />
        </section>
        <section>
          <ModalConfirmarExclusao
            open={showModalConfirmDeleteArquivosDeCarga}
            onOk={onDeleteArquivoDeCargaTrue}
            okText="Excluir"
            onCancel={handleCloseConfirmDeleteArquivoDeCarga}
            cancelText="Cancelar"
            cancelButtonProps={{ className: "btn-base-verde-outline" }}
            titulo="Excluir arquivo de carga"
            bodyText={
              <p>Tem certeza que deseja excluir este arquivo de carga?</p>
            }
          />
        </section>
      </>
    </PaginasContainer>
  );
};

export default memo(ArquivosDeCarga);
