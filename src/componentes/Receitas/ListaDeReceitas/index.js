import React, {useContext, useEffect, useState} from "react";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";
import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column'
import {Button} from 'primereact/button';


export const ListaDeReceitas = () =>{
    const dadosApiContext = useContext(GetDadosApiDespesaContext);

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
            {receitas && receitas.map((receita)=>{
                console.log(receita);
            })}
        <h1>Lista de Receitas</h1>
            <DataTable value={receitas}>
                {dynamicColumns}
            </DataTable>
        </>
    )
}