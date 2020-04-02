import React, {useEffect, useState} from "react";

import {DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column'
import {getListaReceitas} from "../../../services/Receitas.service";
import { useHistory } from 'react-router-dom'


export const ListaDeReceitas = () =>{

    let history = useHistory();

    const [receitas, setReceitas] = useState([])

    useEffect(() => {
        const carregaListaReceitas = async () => {
            const resp = await getListaReceitas();
            console.log(resp)
            setReceitas(resp.results);
        };
        carregaListaReceitas();
    }, [])

    const rowsPerPage = 4
    let cols = [
        {field: 'tipo_receita.nome', header: 'Tipo'},
        {field: 'conta_associacao.nome', header: 'Conta'},
        {field: 'acao_associacao.nome', header: 'Ação'},
        {field: 'data', header: 'Data'},
        {field: 'valor', header: 'Valor'},
    ];
    let dynamicColumns = cols.map((col,i) => {
        return  <Column key={col.field} field={col.field} header={col.header} />;
    });

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

                {dynamicColumns}

            </DataTable>
        </>
    )
}