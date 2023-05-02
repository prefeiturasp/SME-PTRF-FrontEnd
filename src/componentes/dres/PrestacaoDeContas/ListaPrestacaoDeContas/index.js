import React, {useCallback, useEffect, useState} from "react";
import {useParams, Link, Redirect} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPeriodos} from "../../../../services/dres/Dashboard.service";
import {TopoSelectPeriodoBotaoVoltar} from "./TopoSelectPeriodoBotaoVoltar";
import {getPrestacoesDeContas, getPrestacoesDeContasNaoRecebidaNaoGerada, getQtdeUnidadesDre, getPrestacoesDeContasTodosOsStatus, getTabelasPrestacoesDeContas} from "../../../../services/dres/PrestacaoDeContas.service";
import {BarraDeStatus} from "./BarraDeStatus";
import {FormFiltros} from "./FormFiltros";
import "../prestacao-de-contas.scss"
import {getTabelaAssociacoes} from "../../../../services/dres/Associacoes.service";
import moment from "moment";
import {TabelaDinamica} from "./TabelaDinamica";
import {getTecnicosDre} from "../../../../services/dres/TecnicosDre.service";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {colunasAprovada, colunasEmAnalise, colunasNaoRecebidas, colunasTodosOsStatus} from "./objetoColunasDinamicas";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEdit} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../utils/Loading";
import {MsgImgLadoDireito} from "../../../Globais/Mensagens/MsgImgLadoDireito";
import Img404 from "../../../../assets/img/img-404.svg";
import {gerarUuid} from "../../../../utils/ValidacoesAdicionaisFormularios";

export const ListaPrestacaoDeContas = () => {

    let {periodo_uuid, status_prestacao} = useParams();

    const rowsPerPage = 10;

    const initialStateFiltros = {
        filtrar_por_termo: "",
        filtrar_por_tipo_de_unidade: "",
        filtrar_por_tecnico_atribuido: "",
        filtrar_por_data_inicio: "",
        filtrar_por_data_fim: "",
    };

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [forcarLimpezaFiltros, setForcarLimpezaFiltros] = useState("");
    const [prestacaoDeContas, setPrestacaoDeContas] = useState(false);
    const [qtdeUnidadesDre, setQtdeUnidadesDre] = useState(false);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [toggleMaisFiltros, setToggleMaisFiltros] = useState(false);
    const [tecnicosList, setTecnicosList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [redirectPcNaoApresentada, setRedirectPcNaoApresentada] = useState(false);
    const [selectedStatusPc, setSelectedStatusPc] = useState([]);

    const carregaPeriodos = useCallback(async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodo_uuid) {
            setPeriodoEsolhido(periodo_uuid)
        } else if (periodos && periodos.length > 0) {
            setPeriodoEsolhido(periodos[0].uuid)
        }
    }, [periodo_uuid]) ;

    useEffect(()=>{
        carregaPeriodos()
    }, [carregaPeriodos])

    const carregaStatus = useCallback(() => {
        if (status_prestacao !== undefined) {
            if (status_prestacao === 'NAO_RECEBIDA'){
                setSelectedStatusPc(['NAO_RECEBIDA', 'NAO_APRESENTADA']);
            }else if(status_prestacao === 'APROVADA'){
                setSelectedStatusPc(['APROVADA', 'APROVADA_RESSALVA']);
            }else if(status_prestacao === 'DEVOLVIDA'){
                setSelectedStatusPc(['DEVOLVIDA', 'DEVOLVIDA_RETORNADA', 'DEVOLVIDA_RECEBIDA']);
            }else {
                setSelectedStatusPc([status_prestacao]);
            }
        }
    }, [status_prestacao]) ;

    useEffect(()=>{
        carregaStatus();
    }, [carregaStatus])

    const carregaQtdeUnidadesDre = useCallback(async () => {
        let qtde_unidades = await getQtdeUnidadesDre(periodoEscolhido);
        setQtdeUnidadesDre(qtde_unidades.qtd_unidades)
    }, [periodoEscolhido]);

    useEffect(()=>{
        carregaQtdeUnidadesDre();
    }, [carregaQtdeUnidadesDre])

    const carregaTabelaAssociacoes = useCallback(async () => {
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    }, []) ;

    useEffect(() => {
        carregaTabelaAssociacoes();
    }, [carregaTabelaAssociacoes]);

    const carregaTabelaPrestacaoDeContas = useCallback(async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    }, []) ;

    useEffect(() => {
        carregaTabelaPrestacaoDeContas();
    }, [carregaTabelaPrestacaoDeContas]);

    const populaColunas = useCallback(() => {
        if (selectedStatusPc.length === 1){
            if (selectedStatusPc.includes('EM_ANALISE') || selectedStatusPc.includes('REPROVADA')) {
                setColumns(colunasEmAnalise)
            } else if (selectedStatusPc.includes('APROVADA') || selectedStatusPc.includes('APROVADA_RESSALVA')) {
                setColumns(colunasAprovada)
            } else if (selectedStatusPc.includes('TODOS')) {
                setColumns(colunasTodosOsStatus)
            } else {
                setColumns(colunasNaoRecebidas)
            }
        }else {
            setColumns(colunasTodosOsStatus)
        }
    }, [selectedStatusPc]) ;

    useEffect(() => {
        populaColunas();
    }, [populaColunas]);

    const carregaTecnicos = useCallback(async () => {
        let dre = localStorage.getItem(ASSOCIACAO_UUID);
        let tecnicos = await getTecnicosDre(dre);
        setTecnicosList(tecnicos);
    }, []) ;

    useEffect(() => {
        carregaTecnicos();
    }, [carregaTecnicos]);


    useEffect(() => {
        carregaPrestacoesDeContas();
    }, [periodoEscolhido, forcarLimpezaFiltros]);

    const carregaPrestacoesDeContas = async () => {

        setLoading(true);
        if (periodoEscolhido) {

            let data_inicio = stateFiltros.filtrar_por_data_inicio ? moment(new Date(stateFiltros.filtrar_por_data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
            let data_fim = stateFiltros.filtrar_por_data_fim ? moment(new Date(stateFiltros.filtrar_por_data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : '';
            let prestacoes_de_contas;
            let array_status_convertido = converteArrayStatusPcEmString()

            if (selectedStatusPc.includes('TODOS') || selectedStatusPc.length <= 0){
                prestacoes_de_contas = await getPrestacoesDeContasTodosOsStatus(periodoEscolhido, stateFiltros.filtrar_por_termo, stateFiltros.filtrar_por_tipo_de_unidade)

            }else if ( (selectedStatusPc.length === 1 && selectedStatusPc.includes('NAO_APRESENTADA') ) || ( selectedStatusPc.length === 2 && selectedStatusPc.includes('NAO_APRESENTADA') && selectedStatusPc.includes('NAO_RECEBIDA') ) ) {
                prestacoes_de_contas = await getPrestacoesDeContasNaoRecebidaNaoGerada(periodoEscolhido, stateFiltros.filtrar_por_termo, stateFiltros.filtrar_por_tipo_de_unidade)

            }else if (!selectedStatusPc.includes('NAO_APRESENTADA')) {
                prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido, stateFiltros.filtrar_por_termo, stateFiltros.filtrar_por_tipo_de_unidade, array_status_convertido, stateFiltros.filtrar_por_tecnico_atribuido, data_inicio, data_fim);

            }else{
                prestacoes_de_contas = await getPrestacoesDeContasTodosOsStatus(periodoEscolhido, stateFiltros.filtrar_por_termo, stateFiltros.filtrar_por_tipo_de_unidade)
            }

            setPrestacaoDeContas(prestacoes_de_contas)
        }
        setLoading(false);
    };

    const statusTemplate = (rowData) => {
        return (
            <div>
                {rowData['status'] ? <span className={`span-status-${rowData['status']}`}><strong>{exibeLabelStatus(rowData['status']).texto_col_tabela}</strong></span> : ''}
            </div>
        )
    };

    const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : '-'}
            </div>
        )
    };

    const nomeTemplate = (rowData) => {
        return (
            <div>
                {rowData['unidade_nome'] ? <strong>{rowData['unidade_tipo_unidade']} {rowData['unidade_nome']}</strong> : ''}
            </div>
        )
    };

    const gravaPcNaoApresentada = (rowData) =>{
        console.log('rowData', rowData)
        let obj_prestacao = {
            associacao: {
                uuid: rowData.associacao_uuid,
                nome: rowData.unidade_nome,
                cnpj: rowData.associacao.cnpj,
                unidade: {
                    codigo_eol:rowData.associacao.unidade.codigo_eol,
                },
                presidente_associacao:{
                    nome:rowData.associacao.presidente_associacao.nome,
                },
                presidente_conselho_fiscal:{
                    nome:rowData.associacao.presidente_conselho_fiscal.nome,
                }
            },
            periodo_uuid: rowData.periodo_uuid,
            status: rowData.status,
        };
        localStorage.setItem("prestacao_de_contas_nao_apresentada", JSON.stringify( obj_prestacao));
        setRedirectPcNaoApresentada(true)
    };

    const seiTemplate = (rowData) => {
        return (
            <div>
                {rowData['processo_sei'] ? <span>{rowData['processo_sei']}</span> : '-'}
            </div>
        )
    }

    const tecnicoTemplate = (rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? rowData[column.field] : '-'}
            </div>
        )
    };

    const acoesTemplate = (rowData) => {
        const getIcone = (status) => {
            switch (status) {
                case 'APROVADA':
                case 'APROVADA_RESSALVA':
                case 'REPROVADA':
                case 'DEVOLVIDA':
                    return faEye
                default:
                    return faEdit
            }
        }

        return (
            <div>
                { rowData.status !== 'NAO_APRESENTADA' ? (
                        <Link
                            to={{
                                pathname: `/dre-detalhe-prestacao-de-contas/${rowData['uuid']}`,
                            }}
                            className="btn btn-link"
                        >
                            <FontAwesomeIcon
                                style={{marginRight: "0", color: '#00585E'}}
                                icon={getIcone(rowData.status)}
                            />
                        </Link>
                    ):
                    <button
                        onClick={()=>gravaPcNaoApresentada(rowData)}
                        className="btn btn-link"
                    >
                        <FontAwesomeIcon
                            style={{marginRight: "0", color: '#00585E'}}
                            icon={faEye}
                        />
                    </button>
                }
            </div>
        )
    };

    const exibeLabelStatus = (status = null) => {
        let status_converter;
        if (status) {
            status_converter = status
        } else {
            status_converter = status_prestacao
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
                texto_col_tabela: 'Devolvida para acertos',
                texto_titulo: 'Prestações de contas pendentes de análise e recebimento',
            }
        } else if (status_converter === 'DEVOLVIDA_RETORNADA') {
            return {
                texto_barra_de_status: 'apresentadas após acertos',
                texto_col_tabela: 'Apresentada após acertos',
                texto_titulo: 'Prestações de contas apresentadas após acertos',
            }
        } else if (status_converter === 'DEVOLVIDA_RECEBIDA') {
            return {
                texto_barra_de_status: 'recebida após acertos',
                texto_col_tabela: 'Recebida após acertos',
                texto_titulo: 'Prestações de contas recebidas após acertos',
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
        } else if (status_converter === 'TODOS') {
            return {
                texto_barra_de_status: 'todos os status',
                texto_col_tabela: 'Todos',
                texto_titulo: 'Prestações de contas todos os status',
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

    const handleSubmitFiltros = async () => {
        await carregaPrestacoesDeContas();
    };

    const limpaFiltros = async () => {
        setLoading(true);
        setStateFiltros({
            ...initialStateFiltros,
        });
        setForcarLimpezaFiltros(gerarUuid());
        setLoading(false)
    };

    const handleChangeSelectStatusPc =  async (value) => {
        setSelectedStatusPc([...value]);
    }

    const converteArrayStatusPcEmString = useCallback(()=>{
        return selectedStatusPc.join()
    }, [selectedStatusPc])

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
                    {redirectPcNaoApresentada &&
                    <Redirect
                        to={{
                            pathname: `/dre-detalhe-prestacao-de-contas-nao-apresentada`,
                        }}
                    />
                    }
                    <TopoSelectPeriodoBotaoVoltar
                        periodos={periodos}
                        periodoEscolhido={periodoEscolhido}
                        handleChangePeriodos={handleChangePeriodos}
                    />
                    <BarraDeStatus
                        qtdeUnidadesDre={qtdeUnidadesDre}
                        prestacaoDeContas={prestacaoDeContas}
                    />

                    <p className='titulo-explicativo mt-4 mb-4'>Prestações de contas</p>

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

                    {prestacaoDeContas && prestacaoDeContas.length > 0 ? (
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