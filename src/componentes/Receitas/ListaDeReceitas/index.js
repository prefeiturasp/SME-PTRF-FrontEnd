import React, {useContext, useEffect, useState} from "react";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column'
import { useHistory, Link } from 'react-router-dom'


export const ListaDeReceitas = () =>{
    const dadosApiContext = useContext(GetDadosApiDespesaContext);
    let history = useHistory();

    const [receitas, setReceitas] = useState([])

    useEffect( ()=>{
        dadosApiContext.getReceitas()
        .then(resposta_api => {
            console.log("Ollyver", resposta_api)
            setReceitas(resposta_api.data.results)
        })
    }, [])

    let cols = [
        {field: 'tipo_receita.nome', header: 'Tipo'},
        {field: 'conta_associacao.nome', header: 'Conta'},
        {field: 'acao_associacao.nome', header: 'Ação'},
        {field: 'data', header: 'Data'},
        {field: 'valor', header: 'Valor'},
    ];
    let dynamicColumns = cols.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });

    return(
        <>
            <div className="d-flex justify-content-end mb-5 mt-5">
                <button onClick={() => history.push('/cadastro-de-credito')} type="submit" className="btn btn btn-outline-success mt-2 mr-2">Cadastrar crédito</button>
            </div>

            <DataTable value={receitas}>
                {dynamicColumns}
            </DataTable>
        </>
    )
}