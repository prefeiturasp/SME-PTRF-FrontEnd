import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { PaginasContainer } from "../../../../paginas/PaginasContainer";
import { getPeriodos } from "../../../../services/dres/Dashboard.service";
import { TopoSelectPeriodoBotaoVoltar } from "./TopoSelectPeriodoBotaoVoltar";
import {
    getPrestacoesDeContas,
    getPrestacoesDeContasNaoRecebidaNaoGerada,
    getQtdeUnidadesDre,
    getPrestacoesDeContasTodosOsStatus,
    getTabelasPrestacoesDeContas,
} from "../../../../services/dres/PrestacaoDeContas.service";
import { BarraDeStatus } from "./BarraDeStatus";
import { FormFiltros } from "./FormFiltros";
import "../prestacao-de-contas.scss";
import { getTabelaAssociacoes } from "../../../../services/dres/Associacoes.service";
import moment from "moment";
import { TabelaDinamica } from "./TabelaDinamica";
import { TabelaDinamicaPaginada } from "./TabelaDinamicaPaginada";
import { getTecnicosDre } from "../../../../services/dres/TecnicosDre.service";
import { ASSOCIACAO_UUID } from "../../../../services/auth.service";
import {
    colunasAprovada,
    colunasEmAnalise,
    colunasNaoRecebidas,
    colunasTodosOsStatus,
} from "./objetoColunasDinamicas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../utils/Loading";
import { MsgImgLadoDireito } from "../../../Globais/Mensagens/MsgImgLadoDireito";
import Img404 from "../../../../assets/img/img-404.svg";
import { gerarUuid } from "../../../../utils/ValidacoesAdicionaisFormularios";
import useUnidadeSelecionada from "../../../../hooks/Globais/useUnidadeSelecionada";
import { visoesService } from "../../../../services/visoes.service";

export const ListaPrestacaoDeContas = () => {
    const DRE_PCS_PAGINACAO_ATIVA =
        visoesService.featureFlagAtiva("dre-pcs-paginacao");
    const { getUUIDUnidadeSelecionadaTipoDRE } =
        useUnidadeSelecionada(visoesService);
    let { periodo_uuid, status_prestacao } = useParams();

    const rowsPerPage = 10;

    const initialStateFiltros = {
        filtrar_por_termo: "",
        filtrar_por_tipo_de_unidade: "",
        filtrar_por_tecnico_atribuido: "",
        filtrar_por_data_inicio: "",
        filtrar_por_data_fim: "",
    };

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);

    const [filtrosAplicados, setFiltrosAplicados] =
        useState(initialStateFiltros);

    const ultimaRequisicaoRef = useRef(0);

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    //const [forcarLimpezaFiltros, setForcarLimpezaFiltros] = useState("");
    const [prestacaoDeContas, setPrestacaoDeContas] = useState(false);
    const [qtdeUnidadesDre, setQtdeUnidadesDre] = useState(false);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [toggleMaisFiltros, setToggleMaisFiltros] = useState(false);
    const [tecnicosList, setTecnicosList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [redirectPcNaoApresentada, setRedirectPcNaoApresentada] =
        useState(false);
    const [selectedStatusPc, setSelectedStatusPc] = useState([]);

    const carregaPeriodos = useCallback(async () => {
        let periodos = await getPeriodos(getUUIDUnidadeSelecionadaTipoDRE());
        setPeriodos(periodos);
        if (periodo_uuid) {
            setPeriodoEsolhido(periodo_uuid);
        } else if (periodos && periodos.length > 0) {
            setPeriodoEsolhido(periodos[0].uuid);
        }
    }, [periodo_uuid]);

    useEffect(() => {
        carregaPeriodos();
    }, [carregaPeriodos]);

    const carregaStatus = useCallback(() => {
        if (status_prestacao !== undefined) {
            if (status_prestacao === "NAO_RECEBIDA") {
                setSelectedStatusPc(["NAO_RECEBIDA", "NAO_APRESENTADA"]);
            } else if (status_prestacao === "APROVADA") {
                setSelectedStatusPc(["APROVADA", "APROVADA_RESSALVA"]);
            } else if (status_prestacao === "DEVOLVIDA") {
                setSelectedStatusPc([
                    "DEVOLVIDA",
                    "DEVOLVIDA_RETORNADA",
                    "DEVOLVIDA_RECEBIDA",
                ]);
            } else {
                setSelectedStatusPc([status_prestacao]);
            }
        }
    }, [status_prestacao]);

    useEffect(() => {
        carregaStatus();
    }, [carregaStatus]);

    const carregaQtdeUnidadesDre = useCallback(async () => {
        let qtde_unidades = await getQtdeUnidadesDre(periodoEscolhido);
        setQtdeUnidadesDre(qtde_unidades.qtd_unidades);
    }, [periodoEscolhido]);

    useEffect(() => {
        carregaQtdeUnidadesDre();
    }, [carregaQtdeUnidadesDre]);

    const carregaTabelaAssociacoes = useCallback(async () => {
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    }, []);

    useEffect(() => {
        carregaTabelaAssociacoes();
    }, [carregaTabelaAssociacoes]);

    const carregaTabelaPrestacaoDeContas = useCallback(async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    }, []);

    useEffect(() => {
        carregaTabelaPrestacaoDeContas();
    }, [carregaTabelaPrestacaoDeContas]);

    const populaColunas = useCallback(() => {
        if (selectedStatusPc.length === 1) {
            if (
                selectedStatusPc.includes("EM_ANALISE") ||
                selectedStatusPc.includes("REPROVADA")
            ) {
                setColumns(colunasEmAnalise);
            } else if (
                selectedStatusPc.includes("APROVADA") ||
                selectedStatusPc.includes("APROVADA_RESSALVA")
            ) {
                setColumns(colunasAprovada);
            } else if (selectedStatusPc.includes("TODOS")) {
                setColumns(colunasTodosOsStatus);
            } else {
                setColumns(colunasNaoRecebidas);
            }
        } else {
            setColumns(colunasTodosOsStatus);
        }
    }, [selectedStatusPc]);

    useEffect(() => {
        populaColunas();
    }, [populaColunas]);

    const carregaTecnicos = useCallback(async () => {
        let dre = localStorage.getItem(ASSOCIACAO_UUID);
        let tecnicos = await getTecnicosDre(dre);
        setTecnicosList(tecnicos);
    }, []);

    useEffect(() => {
        carregaTecnicos();
    }, [carregaTecnicos]);

    const carregaPrestacoesDeContas = useCallback(
        async (pagina, filtros) => {
            if (!periodoEscolhido) return;

            const requisicaoAtual = ++ultimaRequisicaoRef.current;

            setLoading(true);

            try {
                const data_inicio = filtros.filtrar_por_data_inicio
                    ? moment(
                          new Date(filtros.filtrar_por_data_inicio),
                          "YYYY-MM-DD",
                      ).format("YYYY-MM-DD")
                    : "";

                const data_fim = filtros.filtrar_por_data_fim
                    ? moment(
                          new Date(filtros.filtrar_por_data_fim),
                          "YYYY-MM-DD",
                      ).format("YYYY-MM-DD")
                    : "";

                const array_status_convertido = selectedStatusPc.join();

                // No modo antigo, não enviamos o parâmetro page.
                const paginaParaApi = DRE_PCS_PAGINACAO_ATIVA ? pagina : null;

                let resposta;

                if (
                    selectedStatusPc.includes("TODOS") ||
                    selectedStatusPc.length <= 0
                ) {
                    resposta = await getPrestacoesDeContasTodosOsStatus(
                        periodoEscolhido,
                        filtros.filtrar_por_termo,
                        filtros.filtrar_por_tipo_de_unidade,
                        paginaParaApi,
                    );
                } else if (
                    (selectedStatusPc.length === 1 &&
                        selectedStatusPc.includes("NAO_APRESENTADA")) ||
                    (selectedStatusPc.length === 2 &&
                        selectedStatusPc.includes("NAO_APRESENTADA") &&
                        selectedStatusPc.includes("NAO_RECEBIDA"))
                ) {
                    resposta = await getPrestacoesDeContasNaoRecebidaNaoGerada(
                        periodoEscolhido,
                        filtros.filtrar_por_termo,
                        filtros.filtrar_por_tipo_de_unidade,
                        array_status_convertido,
                        paginaParaApi,
                    );
                } else if (!selectedStatusPc.includes("NAO_APRESENTADA")) {
                    resposta = await getPrestacoesDeContas(
                        periodoEscolhido,
                        filtros.filtrar_por_termo,
                        filtros.filtrar_por_tipo_de_unidade,
                        array_status_convertido,
                        filtros.filtrar_por_tecnico_atribuido,
                        data_inicio,
                        data_fim,
                        paginaParaApi,
                    );
                } else {
                    resposta = await getPrestacoesDeContasTodosOsStatus(
                        periodoEscolhido,
                        filtros.filtrar_por_termo,
                        filtros.filtrar_por_tipo_de_unidade,
                        paginaParaApi,
                    );
                }

                // Impede uma resposta antiga de sobrescrever
                // os dados da página mais recente.
                if (requisicaoAtual !== ultimaRequisicaoRef.current) {
                    return;
                }

                if (DRE_PCS_PAGINACAO_ATIVA) {
                    setPrestacaoDeContas(resposta?.results ?? []);
                    setTotalRegistros(resposta?.count ?? 0);
                } else {
                    setPrestacaoDeContas(resposta ?? []);
                    setTotalRegistros(0);
                }
            } catch (error) {
                if (requisicaoAtual === ultimaRequisicaoRef.current) {
                    console.error(
                        "Erro ao carregar prestações de contas:",
                        error,
                    );

                    setPrestacaoDeContas([]);
                    setTotalRegistros(0);
                }
            } finally {
                if (requisicaoAtual === ultimaRequisicaoRef.current) {
                    setLoading(false);
                }
            }
        },
        [periodoEscolhido, selectedStatusPc, DRE_PCS_PAGINACAO_ATIVA],
    );

    useEffect(() => {
        // Aguarda a conclusão da busca dos períodos.
        if (periodos === false) return;

        // Quando não existem períodos disponíveis.
        if (!periodoEscolhido) {
            ultimaRequisicaoRef.current += 1;

            setPrestacaoDeContas([]);
            setTotalRegistros(0);
            setLoading(false);
            return;
        }

        carregaPrestacoesDeContas(
            DRE_PCS_PAGINACAO_ATIVA ? paginaAtual : 1,
            filtrosAplicados,
        );
    }, [
        periodos,
        periodoEscolhido,
        paginaAtual,
        filtrosAplicados,
        carregaPrestacoesDeContas,
    ]);

    const statusTemplate = (rowData) => {
        return (
            <div>
                {rowData["status"] ? (
                    <span className={`span-status-${rowData["status"]}`}>
                        <strong>
                            {
                                exibeLabelStatus(rowData["status"])
                                    .texto_col_tabela
                            }
                        </strong>
                    </span>
                ) : (
                    ""
                )}
            </div>
        );
    };

    const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData[column.field]
                    ? moment(rowData[column.field]).format("DD/MM/YYYY")
                    : "-"}
            </div>
        );
    };

    const nomeTemplate = (rowData) => {
        return (
            <div>
                {rowData["unidade_nome"] ? (
                    <strong>
                        {rowData["unidade_tipo_unidade"]}{" "}
                        {rowData["unidade_nome"]}
                    </strong>
                ) : (
                    ""
                )}
            </div>
        );
    };

    const gravaPcNaoApresentada = (rowData) => {
        let obj_prestacao = {
            associacao: {
                uuid: rowData.associacao_uuid,
                nome: rowData.unidade_nome,
                cnpj: rowData.associacao.cnpj,
                unidade: {
                    codigo_eol: rowData.associacao.unidade.codigo_eol,
                },
                presidente_associacao: {
                    nome: rowData.associacao.presidente_associacao.nome,
                },
                presidente_conselho_fiscal: {
                    nome: rowData.associacao.presidente_conselho_fiscal.nome,
                },
            },
            periodo_uuid: rowData.periodo_uuid,
            status: rowData.status,
        };
        localStorage.setItem(
            "prestacao_de_contas_nao_apresentada",
            JSON.stringify(obj_prestacao),
        );
        setRedirectPcNaoApresentada(true);
    };

    const seiTemplate = (rowData) => {
        return (
            <div>
                {rowData["processo_sei"] ? (
                    <span>{rowData["processo_sei"]}</span>
                ) : (
                    "-"
                )}
            </div>
        );
    };

    const tecnicoTemplate = (rowData, column) => {
        return <div>{rowData[column.field] ? rowData[column.field] : "-"}</div>;
    };

    const acoesTemplate = (rowData) => {
        const getIcone = (status) => {
            switch (status) {
                case "APROVADA":
                case "APROVADA_RESSALVA":
                case "REPROVADA":
                case "DEVOLVIDA":
                    return faEye;
                default:
                    return faEdit;
            }
        };

        return (
            <div>
                {rowData.status !== "NAO_APRESENTADA" ? (
                    <Link
                        to={{
                            pathname: `/dre-detalhe-prestacao-de-contas/${rowData["uuid"]}`,
                        }}
                        className="btn btn-link"
                    >
                        <FontAwesomeIcon
                            style={{ marginRight: "0" }}
                            icon={getIcone(rowData.status)}
                        />
                    </Link>
                ) : (
                    <button
                        onClick={() => gravaPcNaoApresentada(rowData)}
                        className="btn btn-link"
                    >
                        <FontAwesomeIcon
                            style={{ marginRight: "0" }}
                            icon={faEye}
                        />
                    </button>
                )}
            </div>
        );
    };

    const exibeLabelStatus = (status = null) => {
        let status_converter;
        if (status) {
            status_converter = status;
        } else {
            status_converter = status_prestacao;
        }
        if (status_converter === "NAO_RECEBIDA") {
            return {
                texto_barra_de_status: "não recebidas",
                texto_col_tabela: "Não recebida",
                texto_titulo:
                    "Prestações de contas pendentes de análise e recebimento",
            };
        } else if (status_converter === "NAO_APRESENTADA") {
            return {
                texto_barra_de_status: "não apresentadas",
                texto_col_tabela: "Não apresentada",
                texto_titulo:
                    "Prestações de contas pendentes de análise e recebimento",
            };
        } else if (status_converter === "RECEBIDA") {
            return {
                texto_barra_de_status: "recebidas",
                texto_col_tabela: "Recebida",
                texto_titulo:
                    "Prestações de contas pendentes de análise e recebimento",
            };
        } else if (status_converter === "DEVOLVIDA") {
            return {
                texto_barra_de_status: "devolvidas para acerto",
                texto_col_tabela: "Devolvida para acertos",
                texto_titulo:
                    "Prestações de contas pendentes de análise e recebimento",
            };
        } else if (status_converter === "DEVOLVIDA_RETORNADA") {
            return {
                texto_barra_de_status: "apresentadas após acertos",
                texto_col_tabela: "Apresentada após acertos",
                texto_titulo: "Prestações de contas apresentadas após acertos",
            };
        } else if (status_converter === "DEVOLVIDA_RECEBIDA") {
            return {
                texto_barra_de_status: "recebida após acertos",
                texto_col_tabela: "Recebida após acertos",
                texto_titulo: "Prestações de contas recebidas após acertos",
            };
        } else if (status_converter === "EM_ANALISE") {
            return {
                texto_barra_de_status: "em análise",
                texto_col_tabela: "Em análise",
                texto_titulo: "Prestações de contas em análise",
            };
        } else if (status_converter === "APROVADA") {
            return {
                texto_barra_de_status: "aprovadas",
                texto_col_tabela: "Aprovada",
                texto_titulo: "Prestações de contas aprovadas",
            };
        } else if (status_converter === "APROVADA_RESSALVA") {
            return {
                texto_barra_de_status: "aprovada com ressalvas",
                texto_col_tabela: "Aprovada com ressalva",
                texto_titulo: "Prestações de contas aprovadas",
            };
        } else if (status_converter === "REPROVADA") {
            return {
                texto_barra_de_status: "rejeitadas",
                texto_col_tabela: "Rejeitada",
                texto_titulo: "Prestações de contas rejeitadas",
            };
        } else if (status_converter === "TODOS") {
            return {
                texto_barra_de_status: "todos os status",
                texto_col_tabela: "Todos",
                texto_titulo: "Prestações de contas todos os status",
            };
        } else {
            return {
                texto_barra_de_status: "SEM STATUS",
                texto_col_tabela: "SEM STATUS",
                texto_titulo: "Prestações de contas sem status",
            };
        }
    };

    const handleChangePeriodos = (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo);
        setPaginaAtual(1);
    };

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value,
        });
    };

    const handleSubmitFiltros = () => {
        setPaginaAtual(1);
        setFiltrosAplicados({ ...stateFiltros });
    };

    const limpaFiltros = () => {
        setStateFiltros({ ...initialStateFiltros });
        setPaginaAtual(1);
        setFiltrosAplicados({ ...initialStateFiltros });
    };

    const handleChangeSelectStatusPc = (value) => {
        setSelectedStatusPc([...value]);
        setPaginaAtual(1);
    };

    const handlePageChange = (event) => {
        const novaPagina = Math.floor(event.first / event.rows) + 1;

        setPaginaAtual(novaPagina);
    };

    const converteArrayStatusPcEmString = useCallback(() => {
        return selectedStatusPc.join();
    }, [selectedStatusPc]);

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">
                Acompanhamento das Prestações de Contas
            </h1>
            {loading ? (
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            ) : (
                <div className="page-content-inner">
                    {redirectPcNaoApresentada && (
                        <Navigate
                            to={{
                                pathname: `/dre-detalhe-prestacao-de-contas-nao-apresentada`,
                            }}
                            replace
                        />
                    )}
                    <TopoSelectPeriodoBotaoVoltar
                        periodos={periodos}
                        periodoEscolhido={periodoEscolhido}
                        handleChangePeriodos={handleChangePeriodos}
                    />
                    <BarraDeStatus
                        qtdeUnidadesDre={qtdeUnidadesDre}
                        prestacaoDeContas={prestacaoDeContas}
                    />

                    <p className="titulo-explicativo mt-4 mb-4">
                        Prestações de contas
                    </p>

                    <FormFiltros
                        stateFiltros={stateFiltros}
                        tabelaAssociacoes={tabelaAssociacoes}
                        tabelaPrestacoes={tabelaPrestacoes}
                        handleChangeFiltros={handleChangeFiltros}
                        handleSubmitFiltros={handleSubmitFiltros}
                        limpaFiltros={limpaFiltros}
                        toggleMaisFiltros={toggleMaisFiltros}
                        setToggleMaisFiltros={setToggleMaisFiltros}
                        tecnicosList={tecnicosList}
                        selectedStatusPc={selectedStatusPc}
                        setSelectedStatusPc={setSelectedStatusPc}
                        handleChangeSelectStatusPc={handleChangeSelectStatusPc}
                    />

                    {!DRE_PCS_PAGINACAO_ATIVA ? (
                        prestacaoDeContas && prestacaoDeContas.length > 0 ? (
                            <TabelaDinamica
                                prestacaoDeContas={prestacaoDeContas}
                                rowsPerPage={rowsPerPage}
                                columns={columns}
                                statusTemplate={statusTemplate}
                                dataTemplate={dataTemplate}
                                seiTemplate={seiTemplate}
                                tecnicoTemplate={tecnicoTemplate}
                                acoesTemplate={acoesTemplate}
                                nomeTemplate={nomeTemplate}
                            />
                        ) : (
                            <MsgImgLadoDireito
                                texto="Nenhuma prestação retornada. Tente novamente com outros filtros"
                                img={Img404}
                            />
                        )
                    ) : prestacaoDeContas && prestacaoDeContas.length > 0 ? (
                        <TabelaDinamicaPaginada
                            prestacaoDeContas={prestacaoDeContas}
                            rowsPerPage={rowsPerPage}
                            columns={columns}
                            statusTemplate={statusTemplate}
                            dataTemplate={dataTemplate}
                            seiTemplate={seiTemplate}
                            tecnicoTemplate={tecnicoTemplate}
                            acoesTemplate={acoesTemplate}
                            nomeTemplate={nomeTemplate}
                            paginaAtual={paginaAtual}
                            totalRegistros={totalRegistros}
                            handlePageChange={handlePageChange}
                        />
                    ) : (
                        <MsgImgLadoDireito
                            texto="Nenhuma prestação retornada. Tente novamente com outros filtros"
                            img={Img404}
                        />
                    )}
                </div>
            )}
        </PaginasContainer>
    );
};
