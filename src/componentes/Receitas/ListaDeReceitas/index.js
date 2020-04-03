import React, {useContext, useEffect, useState} from "react";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column'
import { useHistory, Link } from 'react-router-dom'
import moment from 'moment';


export const ListaDeReceitas = () =>{
    const dadosApiContext = useContext(GetDadosApiDespesaContext);
    let history = useHistory();

    const [receitas, setReceitas] = useState([])

    useEffect( ()=>{
        dadosApiContext.getReceitas()
        .then(resposta_api => {
            setReceitas(resposta_api.data.results)
        })
    }, [])

    const rowsPerPage = 10;

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
        console.log(typeof(rowData['valor']));
        const valorFormatado = rowData['valor']
          ? new Number(rowData['valor']).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })
          : ''
        return (<span>{valorFormatado}</span>)
    }

    return(
        <>
            <div className="d-flex justify-content-end mb-5 mt-5">
                <button onClick={() => history.push('/cadastro-de-credito')} type="submit" className="btn btn btn-outline-success mt-2 mr-2">Cadastrar crédito</button>
            </div>

            <DataTable
                value={receitas}
                className="mt-3 datatable-footer-coad"
                paginator={receitas.length > rowsPerPage}
                rows={rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                autoLayout={true}
                selectionMode="single"
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
            </DataTable>
        </>
    )
}