import React, {useEffect, useState} from "react";

import {DataTable} from 'primereact/datatable';

import {Column} from 'primereact/column';
import {useHistory} from 'react-router-dom';
import '../../../../paginas/escolas/404/pagina-404.scss'
import moment from 'moment';
import {getListaReceitas, getTotaisReceitas} from "../../../../services/escolas/Receitas.service";
import {MsgImgLadoDireito} from "../../../Globais/Mensagens/MsgImgLadoDireito"
import {MsgImgCentralizada} from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg";
import "./lista-de-receitas.scss"
import {FormFiltrosAvancados} from "../FormFiltrosAvancados";
import {FiltroPorTipoReceita} from "../FiltroPorTipoReceita";
import {SomaDosCreditos} from "../SomaDosCreditos";
import Loading from "../../../../utils/Loading";
import {visoesService} from "../../../../services/visoes.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from "react-tooltip";
import { mantemEstadoFiltrosUnidade } from "../../../../services/mantemEstadoFiltrosUnidade.service";
import {filtrosAvancadosReceitas} from "../../../../services/escolas/Receitas.service";


export const ListaDeReceitas = () => {

    let history = useHistory();
    const rowsPerPage = 7;

    const initialState = {
        filtrar_por_termo: "",
        tipo_receita: "",
        acao_associacao: "",
        conta_associacao: "",
        data_inicio: "",
        data_fim: "",
    };

    const [receitas, setReceitas] = useState([]);
    const [totais, setTotais] = useState([]);
    const [inputPesquisa, setInputPesquisa] = useState("");
    const [buscaUtilizandoFiltro, setBuscaUtilizandoFiltro] = useState(false);
    const [btnMaisFiltros, setBtnMaisFiltros] = useState(false);
    const [loading, setLoading] = useState(true);
    const [previousPath, setPreviousPath] = useState(null);
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (!previousPath) {
            const storedPath = sessionStorage.getItem('previousPath');
            setPreviousPath(storedPath || '/');
            sessionStorage.removeItem('previousPath');
        }
    }, [previousPath]);

    useEffect(() => {
        if (!previousPath) return;

        setLoading(true);

        if (previousPath.includes('/edicao-de-receita')) {
            const storedFiltros = mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades();
            let filtrosCompletos = { ...storedFiltros };
            buscaListaUtilizandoFiltro(filtrosCompletos.filtrar_por_termo, filtrosCompletos.tipo_receita, filtrosCompletos.acao_associacao, filtrosCompletos.conta_associacao, filtrosCompletos.data_inicio, filtrosCompletos.data_fim);
            buscaTotaisReceitas(filtrosCompletos.tipo_receita, filtrosCompletos.acao_associacao, filtrosCompletos.conta_associacao, filtrosCompletos.data_inicio, filtrosCompletos.data_fim);
        } else {
            buscaListaReceitas();
            buscaTotaisReceitas();
        }
    }, [previousPath]);

    const buscaListaUtilizandoFiltro = async (filtrar_por_termo = "", tipo_receita = "", acao_associacao = "", conta_associacao = "", data_inicio = "", data_fim = "") => {
        const lista_retorno_api = await filtrosAvancadosReceitas(filtrar_por_termo, tipo_receita, acao_associacao, conta_associacao, data_inicio, data_fim);
        setReceitas(lista_retorno_api);
        setBuscaUtilizandoFiltro(true);
        setLoading(false);
    };

    const buscaListaReceitas = async () => {
        const listaReceitas = await getListaReceitas();
        setReceitas(listaReceitas);

        setLoading(false);
    };

    const buscaTotaisReceitas = async (tipo_receita = "", acao_associacao__uuid = "", conta_associacao__uuid = "", data_inicio = "", data_fim = "") => {
        const listaTotais = await getTotaisReceitas(tipo_receita, acao_associacao__uuid, conta_associacao__uuid, data_inicio, data_fim);
        setTotais(listaTotais);
    };

    const redirecionaDetalhe = value => {
        const url = '/edicao-de-receita/' + value.uuid;
        history.push(url);
    };

    const tipoReceitaTemplate = (rowData) => {
        if (rowData.tipo_receita){
            if (rowData.tipo_receita.e_recursos_proprios && !rowData.saida_do_recurso){
                return(
                    <div>
                        {rowData.tipo_receita.nome}
                        <span data-html={true} data-tip='A saída desse crédito ainda <br/> não foi registrada!'>
                        <FontAwesomeIcon
                            style={{marginLeft: "3px", color: '#b41d00'}}
                            icon={faExclamationTriangle}
                        />
                        </span>
                        <ReactTooltip html={true}/>
                    </div>
                )
            }else {
                return(
                    <div>
                        {rowData.tipo_receita.nome}
                    </div>
                )
            }
        }
    };

    const dataTemplate = (rowData) => {
        return (
            <div>

                {rowData['data']
                    ? moment(rowData['data']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    };

    const valorTemplate = (rowData) => {
        const valorFormatado = rowData['valor']
            ? Number(rowData['valor']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '';
        return (<span>{valorFormatado}</span>)
    };

    const onClickBtnMaisFiltros = () => {
        setInputPesquisa("")
        setBtnMaisFiltros(!btnMaisFiltros)
    };


    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="50"
                        marginBottom="0"
                    />
                ) :
                <>
                    <div className="row mb-3">
                        <div className="col-12">
                            <p>Filtrar por</p>
                        </div>
                        <div className={`col-12 col-md-5 pr-0 ${!btnMaisFiltros ? "lista-de-receitas-visible" : "lista-de-receitas-invisible"}`}>
                            <FiltroPorTipoReceita
                                buscaUtilizandoFiltro={buscaUtilizandoFiltro}
                                setBuscaUtilizandoFiltro={setBuscaUtilizandoFiltro}
                                setLista={setReceitas}
                                buscaTotaisReceitas={buscaTotaisReceitas}
                                previousPath={previousPath}
                                state={state}
                                setState={setState}
                            />
                        </div>
                        <div className={`col-12 col-md-2 mt-2 pl-0 ${!btnMaisFiltros ? "lista-de-receitas-visible" : "lista-de-receitas-invisible"}`}>
                            <button
                                onClick={onClickBtnMaisFiltros}
                                type="button"
                                className="btn btn btn-outline-success"
                            >
                                Mais Filtros
                            </button>
                        </div>
                        <div className={`${btnMaisFiltros ? "col-12" : "col-12 col-md-5 mt-2"}`}>
                            <button disabled={!visoesService.getPermissoes(['add_receita'])} onClick={() => history.push('/cadastro-de-credito')} type="submit" className="btn btn btn-outline-success float-right">Cadastrar crédito</button>
                            <button disabled={!visoesService.getPermissoes(['add_receita'])} onClick={() => history.push('/cadastro-de-valores-reprogramados')} type="submit" className="btn btn btn-outline-success float-right mr-2">Valores reprogramados</button>
                        </div>
                    </div>

                    <FormFiltrosAvancados
                        btnMaisFiltros={btnMaisFiltros}
                        onClickBtnMaisFiltros={onClickBtnMaisFiltros}
                        setLista={setReceitas}
                        setBuscaUtilizandoFiltro={setBuscaUtilizandoFiltro}
                        iniciaLista={buscaListaReceitas}
                        buscaTotaisReceitas={buscaTotaisReceitas}
                        setLoading={setLoading}
                        previousPath={previousPath}
                        state={state}
                        setState={setState}
                        initialState={initialState}
                    />

                    {receitas.length > 0  && Object.entries(totais).length > 0 ? (
                        
                            <>
                                <SomaDosCreditos somaDosTotais={totais} />
                            
                                <DataTable
                                    value={receitas}
                                    className="mt-3 datatable-footer-coad"
                                    paginator={receitas.length > rowsPerPage}
                                    rows={rowsPerPage}
                                    paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                    autoLayout={true}
                                    selectionMode="single"
                                    onRowClick={e => redirecionaDetalhe(e.data)}
                                >
                                    <Column
                                        field='tipo_receita.nome'
                                        header='Tipo'
                                        body={tipoReceitaTemplate}
                                        className='py-3'
                                    />
                                    <Column className='py-3' field='conta_associacao.nome' header='Conta'/>
                                    <Column className='py-3' field='acao_associacao.nome' header='Ação'/>
                                    <Column
                                        field='data'
                                        header='Data'
                                        body={dataTemplate}
                                        className='py-3'
                                    />
                                    <Column
                                        field='valor'
                                        header='Valor'
                                        body={valorTemplate}
                                        className='py-3'
                                    />
                                </DataTable>
                            </>
                        )
                        : (
                            buscaUtilizandoFiltro ? (
                                    <MsgImgCentralizada
                                        texto='Não encontramos resultados, verifique os filtros e tente novamente.'
                                        img={Img404}
                                    />
                                ) :
                                <MsgImgLadoDireito
                                    texto='A sua escola ainda não possui créditos cadastrados, clique no botão "Cadastrar crédito" para começar.'
                                    img={Img404}
                                />

                        )
                    }
                </>

            }
        </>
    )
}