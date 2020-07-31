import React, {useEffect, useState} from "react";
import {getAssociacoes} from "../../../services/dres/Associacoes.service";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import "./associacoes.scss"

export const Associacoes = () =>{

    const rowsPerPage = 15;

    const [associacoes, setAssociacoes] = useState([]);

    useEffect(()=>{
        buscaAssociacoes();
    }, []);

    const buscaAssociacoes = async ()=>{
        let associacoes = await getAssociacoes();
        setAssociacoes(associacoes);
        console.log("buscaAssociacoes ", associacoes)
    };

    const unidadeEscolarTemplate = (rowData, column) =>{
        return (
            <div>
                {rowData['nome'] ? <strong>{rowData['nome']}</strong> : ''}
            </div>
        )
    };

    const statusRegularidadeTemplate = (rowData, column) =>{
        return (
            <div>
                {rowData['status_regularidade'] ? <strong>{rowData['status_regularidade']}</strong> : ''}
            </div>
        )
    };

    return(
        <>

            <DataTable
                value={associacoes}
                className="mt-3 container-tabela-associacoes"
                paginator={associacoes.length > rowsPerPage}
                rows={rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                autoLayout={true}
                selectionMode="single"
            >
                <Column field="unidade.codigo_eol" header="Código Eol" />
                <Column
                    field="nome"
                    header="Unidade escolar"
                    body={unidadeEscolarTemplate}
                />
                <Column
                    field="status_regularidade"
                    header="Regularidade"
                    body={statusRegularidadeTemplate}
                />
                <Column field="color" header="Ações" />
            </DataTable>

        </>
    )
};