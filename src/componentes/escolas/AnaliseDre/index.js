import React, {useCallback, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {getListaDeAnalises, getListaDeAnalisesFiltros} from "../../../services/escolas/AnaliseDaDre.service";
import TabelaAnaliseDre from "./TabelaAnaliseDre";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";
import './analise-dre.scss'
import {Filtros} from "./Filtros";
import {getPeriodosAteAgoraForaImplantacaoDaAssociacao} from "../../../services/escolas/PrestacaoDeContas.service";
import {getTabelasPrestacoesDeContas} from "../../../services/dres/PrestacaoDeContas.service";
import Loading from "../../../utils/Loading";
import { mantemEstadoAnaliseDre as meapcservice } from "../../../services/mantemEstadoAnaliseDre.service";
import { visoesService } from "../../../services/visoes.service";

export const AnaliseDre = () =>{

    const associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID);
    const rowsPerPage = 10
    const navigate = useNavigate();

    const [listaDeAnalises, setListaDeAnalises] = useState([])
    const [loading, setLoading] = useState(false);

    const carregaListaDeAnalises = useCallback(async ()=>{
        setLoading(true)
        let lista_de_analises = await getListaDeAnalises(associacao_uuid)
        setListaDeAnalises(lista_de_analises)
        setLoading(false)
    }, [associacao_uuid])

    useEffect(()=>{
        carregaListaDeAnalises()
    }, [carregaListaDeAnalises])

    // Filtros
    const initialStateFiltros = {
        filtrar_por_periodo: "",
        filtrar_por_status: "",
    };

    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [periodosAssociacao, setPeriodosAssociacao] = useState([]);
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});

    const buscaPeriodos = useCallback(async () => {
        let periodos = await getPeriodosAteAgoraForaImplantacaoDaAssociacao(associacao_uuid);
        setPeriodosAssociacao(periodos);
    }, [associacao_uuid]);

    useEffect(() => {
        buscaPeriodos();
    }, [buscaPeriodos]);

    const carregaTabelaPrestacaoDeContas = useCallback(async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    }, []);

    useEffect(()=>{
        carregaTabelaPrestacaoDeContas()
    }, [carregaTabelaPrestacaoDeContas])

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        setLoading(true);
        let analises_filtradas = await getListaDeAnalisesFiltros(associacao_uuid, stateFiltros.filtrar_por_periodo, stateFiltros.filtrar_por_status);
        setListaDeAnalises(analises_filtradas);
        setLoading(false);
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros(initialStateFiltros);
        await carregaListaDeAnalises();
        setLoading(false);
    };

    const periodoTemplate = (rowData) =>{
        return (
            <>
                <span>{rowData.referencia}</span> - <span>{rowData.data_inicio_realizacao_despesas ? exibeDataPT_BR(rowData.data_inicio_realizacao_despesas) : "-"}</span> até <span>{rowData.data_fim_realizacao_despesas ? exibeDataPT_BR(rowData.data_fim_realizacao_despesas) : "-"}</span>
            </>
        )
    };

    const retornaObjetoPeriodo = (rowData) => {
        return {
            referencia: rowData.referencia ? rowData.referencia : '',
            data_inicio_realizacao_despesas: rowData.data_inicio_realizacao_despesas ? exibeDataPT_BR(rowData.data_inicio_realizacao_despesas) : '',
            data_fim_realizacao_despesas: rowData.data_fim_realizacao_despesas ? exibeDataPT_BR(rowData.data_fim_realizacao_despesas) : '',
        }

    }

    const acoesTemplate = (rowData) =>{
        return (
            <>
                {rowData.pode_habilitar_botao_ver_acertos_em_analise_da_dre ? (
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E", cursor: "pointer"}}
                        icon={faEye}
                        onClick={() => {
                            limpaStorageAnaliseDre();
                            navigate(`/consulta-detalhamento-analise-da-dre/${rowData.prestacao_de_contas_uuid}`, {
                                state: {
                                    periodoFormatado: retornaObjetoPeriodo(rowData),
                                }
                            });
                        }}
                    />
                ):
                    <span> - </span>
                }
            </>
        )
    };
    const resultadoAnaliseTemplate = (rowData) =>{
        return (
            <div>
                <span className={`texto-legenda-cor-${rowData.legenda_cor}`}><strong>{rowData.texto_status}</strong></span>
            </div>
        )
    };

    const limpaStorageAnaliseDre = () => {
        meapcservice.limpaAnaliseDreUsuarioLogado(visoesService.getUsuarioLogin())
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Análise DRE</h1>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <div className="page-content-inner">
                    <h4 className='mt-3 mb-5'>Confira os resultados das análises das prestações de contas passadas</h4>
                    <Filtros
                        stateFiltros={stateFiltros}
                        handleChangeFiltros={handleChangeFiltros}
                        handleSubmitFiltros={handleSubmitFiltros}
                        limpaFiltros={limpaFiltros}
                        periodosAssociacao={periodosAssociacao}
                        tabelaPrestacoes={tabelaPrestacoes}
                        exibeDataPT_BR={exibeDataPT_BR}
                    />
                    <TabelaAnaliseDre
                        rowsPerPage={rowsPerPage}
                        listaDeAnalises={listaDeAnalises}
                        acoesTemplate={acoesTemplate}
                        periodoTemplate={periodoTemplate}
                        resultadoAnaliseTemplate={resultadoAnaliseTemplate}
                    />
                </div>
            }
        </PaginasContainer>
    )
}