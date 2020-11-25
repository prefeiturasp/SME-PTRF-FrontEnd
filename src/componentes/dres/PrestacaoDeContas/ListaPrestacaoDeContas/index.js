import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPeriodos} from "../../../../services/dres/Dashboard.service";
import {TopoSelectPeriodoBotaoVoltar} from "./TopoSelectPeriodoBotaoVoltar";
import {getPrestacoesDeContas, getPrestacoesDeContasNaoRecebidaNaoGerada, getQtdeUnidadesDre, getTabelasPrestacoesDeContas} from "../../../../services/dres/PrestacaoDeContas.service";
import {BarraDeStatus} from "./BarraDeStatus";
import {FormFiltros} from "./FormFiltros";
import "../prestacao-de-contas.scss"
import {getTabelaAssociacoes} from "../../../../services/dres/Associacoes.service";
import moment from "moment";
import {TabelaDinamica} from "./TabelaDinamica";
import {getTecnicosDre} from "../../../../services/dres/TecnicosDre.service";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {colunasAprovada, colunasEmAnalise, colunasNaoRecebidas} from "./objetoColunasDinamicas";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../utils/Loading";
import {MsgImgLadoDireito} from "../../../Globais/Mensagens/MsgImgLadoDireito";
import Img404 from "../../../../assets/img/img-404.svg";

export const ListaPrestacaoDeContas = () => {

    let {periodo_uuid, status_prestacao} = useParams();

    const rowsPerPage = 10;

    const initialStateFiltros = {
        filtrar_por_termo: "",
        filtrar_por_tipo_de_unidade: "",
        filtrar_por_status: "",
        filtrar_por_tecnico_atribuido: "",
        filtrar_por_data_inicio: "",
        filtrar_por_data_fim: "",
    };

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [statusPrestacao, setStatusPrestacao] = useState("");
    const [prestacaoDeContas, setPrestacaoDeContas] = useState(false);
    const [qtdeUnidadesDre, setQtdeUnidadesDre] = useState(false);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [toggleMaisFiltros, setToggleMaisFiltros] = useState(false);
    const [tecnicosList, setTecnicosList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregaPeriodos();
        carregaStatus();
        carregaQtdeUnidadesDre();
        carregaTabelaAssociacoes();
        carregaTabelaPrestacaoDeContas();
    }, []);

    useEffect(() => {
        populaColunas();
    }, [statusPrestacao]);

    useEffect(() => {
        carregaPrestacoesDeContas();
    }, [periodoEscolhido]);

    useEffect(() => {
        carregaPrestacoesDeContas();
    }, [statusPrestacao]);

    useEffect(() => {
        carregaTecnicos();
    }, []);

    useEffect(() => {
        setLoading(false);
    }, []);

    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodo_uuid) {
            setPeriodoEsolhido(periodo_uuid)
        } else if (periodos && periodos.length > 0) {
            setPeriodoEsolhido(periodos[0].uuid)
        }
    };

    const carregaStatus = async () => {
        if (status_prestacao !== undefined) {
            setStatusPrestacao(status_prestacao);
            setStateFiltros({
                ...stateFiltros,
                filtrar_por_status: status_prestacao
            });
        }
    };

    const carregaPrestacoesDeContas = async () => {

        setLoading(true);
        if (periodoEscolhido) {
            let data_inicio = stateFiltros.filtrar_por_data_inicio ? moment(new Date(stateFiltros.filtrar_por_data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
            let data_fim = stateFiltros.filtrar_por_data_fim ? moment(new Date(stateFiltros.filtrar_por_data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : '';
            let prestacoes_de_contas;

            if (stateFiltros.filtrar_por_status === 'NAO_RECEBIDA' || stateFiltros.filtrar_por_status === 'NAO_APRESENTADA'){
                prestacoes_de_contas = await getPrestacoesDeContasNaoRecebidaNaoGerada(periodoEscolhido, stateFiltros.filtrar_por_termo, stateFiltros.filtrar_por_tipo_de_unidade)
            }else {
                prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido, stateFiltros.filtrar_por_termo, stateFiltros.filtrar_por_tipo_de_unidade, stateFiltros.filtrar_por_status, stateFiltros.filtrar_por_tecnico_atribuido, data_inicio, data_fim);
            }

            setPrestacaoDeContas(prestacoes_de_contas)
        }
        setLoading(false);
    };

    const carregaPrestacoesDeContasPorDrePeriodo = async () => {
        setLoading(true);
        let prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido);
        setPrestacaoDeContas(prestacoes_de_contas);
        setLoading(false);
    };

    const carregaQtdeUnidadesDre = async () => {
        let qtde_unidades = await getQtdeUnidadesDre();
        setQtdeUnidadesDre(qtde_unidades.qtd_unidades)
    };

    const carregaTabelaAssociacoes = async () => {
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const carregaTabelaPrestacaoDeContas = async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    };

    const carregaTecnicos = async () => {
        let dre = localStorage.getItem(ASSOCIACAO_UUID);
        let tecnicos = await getTecnicosDre(dre);
        setTecnicosList(tecnicos);
    };

    const populaColunas = async () => {
        if (statusPrestacao === 'EM_ANALISE' || statusPrestacao === 'REPROVADA') {
            setColumns(colunasEmAnalise)
        } else if (statusPrestacao === 'APROVADA' || statusPrestacao === 'APROVADA_RESSALVA') {
            setColumns(colunasAprovada)
        } else {
            setColumns(colunasNaoRecebidas)
        }
    };

    const statusTemplate = (rowData) => {
        return (
            <div>
                {rowData['status'] ? <span className={`span-status-${rowData['status']}`}><strong>{exibeLabelStatus(rowData['status']).texto_col_tabela}</strong></span> : ''}
            </div>
        )
    };

    const dataTemplate = (rowData) => {
        return (
            <div>
                {rowData['data_recebimento'] ? moment(rowData['data_recebimento']).format('DD/MM/YYYY') : rowData['data_ultima_analise'] ? moment(rowData['data_ultima_analise']).format('DD/MM/YYYY') : '-'}
            </div>
        )
    };

    const nomeTemplate = (rowData) => {
        return (
            <div>
                {rowData['unidade_nome'] ? <strong>{rowData['unidade_nome']}</strong> : ''}
            </div>
        )
    };

    const acoesTemplate = (rowData) => {

        let obj_props;

        if (rowData.status === 'NAO_APRESENTADA'){
            obj_props = {
                pathname: `/dre-detalhe-prestacao-de-contas-nao-apresentada`,
                prestacao: rowData
            }
        }else {
            obj_props = {
                pathname: `/dre-detalhe-prestacao-de-contas/${rowData['uuid']}`,
            }
        }

        console.log('acoesTemplate ', rowData)

        return (
            <div>
                <Link
                    to={obj_props}
                    className="btn btn-link"
                >
                    <FontAwesomeIcon
                        style={{marginRight: "0", color: '#00585E'}}
                        icon={faEye}
                    />
                </Link>
            </div>
        )
    };

    const exibeLabelStatus = (status = null) => {
        let status_converter;
        if (status) {
            status_converter = status
        } else {
            status_converter = statusPrestacao
        }
        if (status_converter === 'NAO_RECEBIDA') {
            return {
                texto_barra_de_status: 'não recebidas',
                texto_col_tabela: 'Não recebida',
                texto_titulo: 'Prestações de contas pendentes de análise e recebimento',
            }
        } else if (status_converter === 'NAO_APRESENTADA') {
            return {
                texto_barra_de_status: 'não apresentadas',
                texto_col_tabela: 'Não apresentada',
                texto_titulo: 'Prestações de contas pendentes de análise e recebimento',
            }
        } else if (status_converter === 'RECEBIDA') {
            return {
                texto_barra_de_status: 'recebidas',
                texto_col_tabela: 'Recebida',
                texto_titulo: 'Prestações de contas pendentes de análise e recebimento',
            }
        } else if (status_converter === 'DEVOLVIDA') {
            return {
                texto_barra_de_status: 'devolvidas para acerto',
                texto_col_tabela: 'Devolvida para acerto',
                texto_titulo: 'Prestações de contas pendentes de análise e recebimento',
            }
        } else if (status_converter === 'EM_ANALISE') {
            return {
                texto_barra_de_status: 'em análise',
                texto_col_tabela: 'Em análise',
                texto_titulo: 'Prestações de contas em análise',
            }
        } else if (status_converter === 'APROVADA') {
            return {
                texto_barra_de_status: 'aprovadas',
                texto_col_tabela: 'Aprovada',
                texto_titulo: 'Prestações de contas aprovadas',
            }
        } else if (status_converter === 'APROVADA_RESSALVA') {
            return {
                texto_barra_de_status: 'aprovada com ressalvas',
                texto_col_tabela: 'Aprovada com ressalva',
                texto_titulo: 'Prestações de contas aprovadas',
            }
        } else if (status_converter === 'REPROVADA') {
            return {
                texto_barra_de_status: 'reprovadas',
                texto_col_tabela: 'Reprovada',
                texto_titulo: 'Prestações de contas reprovadas',
            }
        } else {
            return {
                texto_barra_de_status: 'SEM STATUS',
                texto_col_tabela: 'SEM STATUS',
                texto_titulo: 'Prestações de contas sem status',
            }
        }
    };

    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltros = async (event) => {
        event.preventDefault();
        setStatusPrestacao(stateFiltros.filtrar_por_status);
        await carregaPrestacoesDeContas();
    };

    const limpaFiltros = async () => {
        await setStateFiltros(initialStateFiltros);
        await setStatusPrestacao('');
        await carregaPrestacoesDeContasPorDrePeriodo();
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <div className="page-content-inner">
                    <TopoSelectPeriodoBotaoVoltar
                        periodos={periodos}
                        periodoEscolhido={periodoEscolhido}
                        handleChangePeriodos={handleChangePeriodos}
                    />
                    <BarraDeStatus
                        qtdeUnidadesDre={qtdeUnidadesDre}
                        prestacaoDeContas={prestacaoDeContas}
                        statusDasPrestacoes={exibeLabelStatus(statusPrestacao).texto_barra_de_status}
                    />

                    <p className='titulo-explicativo mt-4 mb-4'>{exibeLabelStatus(statusPrestacao).texto_titulo}</p>

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
                    />

                    {prestacaoDeContas && prestacaoDeContas.length > 0 ? (
                            <TabelaDinamica
                                prestacaoDeContas={prestacaoDeContas}
                                rowsPerPage={rowsPerPage}
                                columns={columns}
                                statusTemplate={statusTemplate}
                                dataTemplate={dataTemplate}
                                acoesTemplate={acoesTemplate}
                                nomeTemplate={nomeTemplate}
                            />
                        ) :
                        <MsgImgLadoDireito
                            texto='Nenhuma prestação retornada. Tente novamente com outros filtros'
                            img={Img404}
                        />
                    }
                </div>
            }
        </PaginasContainer>
    )
};