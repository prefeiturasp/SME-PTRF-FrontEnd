import React, {useEffect, useState} from "react";

import { DataTable } from 'primereact/datatable';

import { Column } from 'primereact/column';
import { useHistory } from 'react-router-dom';
import '../../../paginas/404/pagina-404.scss'
import moment from 'moment';
import {getListaReceitas, filtroPorPalavra} from "../../../services/Receitas.service";
import {FiltroPorPalavra} from "../../FormFiltroPorPalavra";
import {MensagemCentralizada} from "../../Mensagens/NaoEncontrado/MensagemCentralizada";
import {MensagemLadoDireito} from "../../Mensagens/NaoEncontrado/MensagemLadoDireito";

export const ListaDeReceitas = () =>{

    let history = useHistory();

    const [receitas, setReceitas] = useState([])
    const [inputPesquisa, setInputPesquisa] = useState([])
    const [filtro_por_palavra, set_filtro_por_palavra] = useState(false)

    useEffect(() => {
        const carregaListaReceitas = async () => {
            getListaReceitas().then(response => {
                setReceitas(response.data);
            })
            .catch(error => {
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

    const handleChangeFiltroPorPalavra = (event) => {
        setInputPesquisa(event.target.value)
        //this.setState({inputPesquisa: event.target.value});
    }

    const handleSubmitFiltroPorPalavra = async (event) => {
        event.preventDefault();
        const receitas = await filtroPorPalavra(inputPesquisa)
        setReceitas(receitas)
        set_filtro_por_palavra(true)
    }

    return(
        <>
            <div className="d-flex justify-content-end mb-5 mt-5">
                <button onClick={() => history.push('/cadastro-de-credito')} type="submit" className="btn btn btn-outline-success mt-2 mr-2">Cadastrar crédito</button>
            </div>

            <FiltroPorPalavra
                onSubmit={handleSubmitFiltroPorPalavra}
                inputValue={inputPesquisa}
                onChange={handleChangeFiltroPorPalavra}
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
                <Column field='tipo_receita.nome' header='Tipo' />
                <Column field='conta_associacao.nome' header='Conta' />
                <Column field='acao_associacao.nome' header='Ação' />
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
                    filtro_por_palavra ? (
                            <MensagemCentralizada
                                texto='Não encontramos resultados, verifique os filtros e tente novamente'
                            />
                        ) :
                        <MensagemLadoDireito
                            texto='A sua escola ainda não possui créditos cadastrados, clique no botão "Cadastrar crédito" para começar!'
                        />

              )
            }
        </>
    )
}