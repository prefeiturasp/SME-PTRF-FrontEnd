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

export const ListaDeReceitas = () => {

    let history = useHistory();

    const [receitas, setReceitas] = useState([])
    const [inputPesquisa, setInputPesquisa] = useState("")
    const [buscaUtilizandoFiltro, setBuscaUtilizandoFiltro] = useState(false)

    useEffect(() => {
        const carregaListaReceitas = async () => {
            getListaReceitas().then(response => {
                setReceitas(response.data);
            }).catch(error => {
                console.log(error);
            });
        };
        carregaListaReceitas();
    }, [])

    const rowsPerPage = 7;

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


    return (
        <>
            <div className="row">
                <div className="col-12">
                    <p>Filtrar por</p>
                </div>
                <div className="col-12 col-md-8">
                    <FormFiltroPorPalavra
                        inputPesquisa={inputPesquisa}
                        setInputPesquisa={setInputPesquisa}
                        buscaUtilizandoFiltro={buscaUtilizandoFiltro}
                        setBuscaUtilizandoFiltro={setBuscaUtilizandoFiltro}
                        setLista={setReceitas}
                        origem="Receitas"
                    />
                </div>
                <div className="col-12 col-md-4">
                    <button onClick={() => history.push('/cadastro-de-credito')} type="submit" className="btn btn btn-outline-success float-right">Cadastrar crédito
                    </button>
                </div>
            </div>

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