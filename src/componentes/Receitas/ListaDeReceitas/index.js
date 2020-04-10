import React, {useEffect, useState} from "react";

import {DataTable} from 'primereact/datatable';

import {Column} from 'primereact/column';
import {Link, useHistory} from 'react-router-dom';
import '../../../paginas/404/pagina-404.scss'
import moment from 'moment';
import {getListaReceitas} from "../../../services/Receitas.service";
import {FormFiltroPorPalavra} from "../../FormFiltroPorPalavra";
import {MsgImgCentralizada} from "../../Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../Mensagens/MsgImgLadoDireito";
import Img404 from "../../../assets/img/img-404.svg";
import "./lista-de-receitas.scss"
import {FormFiltrosAvancados} from "../FormFiltrosAvancados";

export const ListaDeReceitas = () => {

    let history = useHistory();
    const rowsPerPage = 7;

    const [receitas, setReceitas] = useState([])
    const [inputPesquisa, setInputPesquisa] = useState("")
    const [buscaUtilizandoFiltro, setBuscaUtilizandoFiltro] = useState(false)
    const [btnMaisFiltros, setBtnMaisFiltros] = useState(false)

    useEffect(() => {
        buscaListaReceitas()
    }, [])



    const buscaListaReceitas = async () => {
        const listaReceitas = await getListaReceitas()
        setReceitas(listaReceitas)
    }

    const redirecionaDetalhe = value => {
        const url = '/edicao-de-receita/' + value.uuid
        history.push(url);
    }

    const dataTemplate = (rowData, column) => {
        return (
            <div>

                {rowData['data']
                    ? moment(rowData['data']).format('DD/MM/YYYY')
                    : ''}
            </div>
        )
    }

    const valorTemplate = (rowData, column) => {
        const valorFormatado = rowData['valor']
            ? new Number(rowData['valor']).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : ''
        return (<span>{valorFormatado}</span>)
    }

    const onClickBtnMaisFiltros = (event) => {
        setBtnMaisFiltros(!btnMaisFiltros)
    }



    return (
        <>
            <div className="row">
                <div className="col-12">
                    <p>Filtrar por</p>
                </div>
                <div className={`col-12 col-md-7 pr-0 ${!btnMaisFiltros ? "lista-de-receitas-visible" : "lista-de-receitas-invisible"}`} >
                    <FormFiltroPorPalavra
                        inputPesquisa={inputPesquisa}
                        setInputPesquisa={setInputPesquisa}
                        buscaUtilizandoFiltro={buscaUtilizandoFiltro}
                        setBuscaUtilizandoFiltro={setBuscaUtilizandoFiltro}
                        setLista={setReceitas}
                        origem="Receitas"
                    />
                </div>
                <div className={`col-12 col-md-2 pl-0 ${!btnMaisFiltros ? "lista-de-receitas-visible" : "lista-de-receitas-invisible"}`} >
                    <button
                        onClick={onClickBtnMaisFiltros}
                        type="button"
                        className="btn btn btn-outline-success"
                    >
                        Mais Filtros
                    </button>
                </div>
                <div className={`${btnMaisFiltros ? "col-12" : "col-12 col-md-3"}`}>
                    <button onClick={() => history.push('/cadastro-de-credito')} type="submit" className="btn btn btn-outline-success float-right">Cadastrar crédito
                    </button>
                </div>
            </div>

            <FormFiltrosAvancados
                btnMaisFiltros = {btnMaisFiltros}
                onClickBtnMaisFiltros={onClickBtnMaisFiltros}
                setLista={setReceitas}
                setBuscaUtilizandoFiltro={setBuscaUtilizandoFiltro}
                iniciaLista={buscaListaReceitas}

            />

            {receitas.length > 0 ? (<DataTable
                    value={receitas}
                    className="mt-3 datatable-footer-coad"
                    paginator={receitas.length > rowsPerPage}
                    rows={rowsPerPage}
                    paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                    autoLayout={true}
                    selectionMode="single"
                    onRowClick={e => redirecionaDetalhe(e.data)}
                >
                    <Column field='tipo_receita.nome' header='Tipo'/>
                    <Column field='conta_associacao.nome' header='Conta'/>
                    <Column field='acao_associacao.nome' header='Ação'/>
                    <Column
                        field='data'
                        header='Data'
                        body={dataTemplate}/>
                    <Column
                        field='valor'
                        header='Valor'
                        body={valorTemplate}/>
                </DataTable>)
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
    )
}