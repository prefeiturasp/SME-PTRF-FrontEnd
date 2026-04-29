import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPaaPorDre, getTabelaPaaDre } from "../../../services/dres/Paa.service";
import { TabelaPaa } from "./TabelaPaa";
import { FiltrosPaa } from "./FiltrosPaa";
import Loading from "../../../utils/Loading";
import Img404 from "../../../assets/img/img-404.svg";
import { MsgImgCentralizada } from "../../Globais/Mensagens/MsgImgCentralizada";
import { MsgImgLadoDireito } from "../../Globais/Mensagens/MsgImgLadoDireito";
import { Icon } from "../../Globais/UI/Icon";
import { useRecursoSelecionadoContext } from "../../../context/RecursoSelecionado";
import "./scss/paa.scss";
import { toast } from 'react-toastify';

const LINHAS_POR_PAGINA = 10;
const ESTADO_FILTROS_INICIAL = {
    periodo: [],
    unidade: "",
    tipo_unidade: "",
    status: [],
};

export const Paa = () => {
    const [carregando, setCarregando] = useState(true);
    const [dadosTabelaPaa, setDadosTabelaPaa] = useState({});
    const [pagina, setPagina] = useState(1);
    const [filtros, setFiltros] = useState(ESTADO_FILTROS_INICIAL);
    const [utilizandoFiltros, setUtilizandoFiltros] = useState(false);
    const [tipoUnidadeManual, setTipoUnidadeManual] = useState(false);
    const [listaPaa, setListaPaa] = useState({ results: [], count: 0, total_pages: 0 });

    const { recursoSelecionado } = useRecursoSelecionadoContext();
    const uuidRecurso = recursoSelecionado?.uuid;
    const navigate = useNavigate();

    const formatarParametros = (filtrosAtivos, paginaAlvo) => ({
        periodo: filtrosAtivos.periodo?.join(",") || "",
        unidade: filtrosAtivos.unidade || "",
        tipo_unidade: filtrosAtivos.tipo_unidade || "",
        status: filtrosAtivos.status?.join(",") || "",
        page: paginaAlvo,
        page_size: LINHAS_POR_PAGINA
    });

    const carregarFiltrosIniciais = async () => {
        if (!uuidRecurso) return;
        try {
            const tabela = await getTabelaPaaDre(uuidRecurso);
            setDadosTabelaPaa(tabela);
        } catch (error) {
            toast.error("Não foi possível carregar as opções dos filtros.");
            console.error("Erro ao carregar opções dos filtros:", error);
        }
    };

    const carregarLista = async (filtrosAtivos = filtros, paginaAlvo = pagina) => {
        if (!uuidRecurso) return;
        setCarregando(true);
        try {
            const params = formatarParametros(filtrosAtivos, paginaAlvo);
            const resposta = await getPaaPorDre(params, uuidRecurso);
            setListaPaa(resposta);
        } catch (error) {
            toast.error("Erro ao carregar a lista de PAA. Tente novamente mais tarde.");
            console.error("Erro ao buscar lista PAA:", error);
        } finally {
            setCarregando(false);
        }
    };

    const aoSubmeterFiltros = (e) => {
        e?.preventDefault();
        setUtilizandoFiltros(true);
        setPagina(1);
        carregarLista(filtros, 1);
    };

    const aoAlterarFiltro = (nome, valor) => {
        setFiltros(prev => {
            const novoEstado = { ...prev, [nome]: valor };

            if (nome === "unidade") {
                const unidadeObj = dadosTabelaPaa?.unidades?.find(u => u.uuid === valor);
                novoEstado.tipo_unidade = unidadeObj?.tipo_unidade || "";
                setTipoUnidadeManual(false);
            }

            if (nome === "tipo_unidade") {
                setTipoUnidadeManual(true);
            }

            return novoEstado;
        });
    };

    const limparFiltros = () => {
        setFiltros(ESTADO_FILTROS_INICIAL);
        setPagina(1);
        setUtilizandoFiltros(false);
        setTipoUnidadeManual(false);
        carregarLista(ESTADO_FILTROS_INICIAL, 1);
    };

    const aoMudarPagina = (event) => {
        const novaPagina = event.page + 1;
        setPagina(novaPagina);
        carregarLista(filtros, novaPagina);
    };

    useEffect(() => {
        if (uuidRecurso) {
            carregarFiltrosIniciais();
            carregarLista(ESTADO_FILTROS_INICIAL, 1);
        }
    }, [uuidRecurso]);

    const renderizarConteudo = () => {
        if (carregando){
           return( 
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />)
        }                      

        if (listaPaa?.results?.length > 0) {
            return (
                <TabelaPaa
                
                    listaPaa={listaPaa}
                    linhasPorPagina={LINHAS_POR_PAGINA}
                    unidadeEscolarTemplate={(row) => <strong>{row?.unidade?.unidade_educacional || "-"}</strong>}
                    acaoTemplatePdf={() => (
                        <button className="btn btn-link" disabled>
                            <Icon icon="faFileLines" />
                        </button>
                    )}
                    aoMudarPagina={aoMudarPagina}
                    paginaAtual={pagina}
                />
            );
        }

        const Mensagem = utilizandoFiltros ? MsgImgCentralizada : MsgImgLadoDireito;
        const texto = utilizandoFiltros ? "Nenhum resultado encontrado." : "Nenhum PAA disponível.";

        return <Mensagem texto={texto} img={Img404} />;
    };

    return (
        <main className="paa-container">
            <FiltrosPaa
                tabelaPaa={dadosTabelaPaa}
                filtros={filtros}
                aoAlterarFiltro={aoAlterarFiltro}
                aoSubmeterFiltros={aoSubmeterFiltros}
                limpaFiltros={limparFiltros}
                tipoUnidadeManual={tipoUnidadeManual}
            />
            {renderizarConteudo()}
        </main>
    );
};