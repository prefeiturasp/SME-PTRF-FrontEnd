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
        let label_status_reguralidade;
        if (rowData['status_regularidade'] === "PENDENTE"){
            label_status_reguralidade = "Pendente"
        }else if (rowData['status_regularidade'] === "REGULAR"){
            label_status_reguralidade = "Regular"
        }
        return (
            <div className={`status-regularidade-${rowData['status_regularidade'].toLowerCase()}`}>
                {rowData['status_regularidade'] ? <strong>{label_status_reguralidade}</strong> : ''}
            </div>
        )
    };

    const acoesTemplate = (rowData, column) =>{
        return (
            <div>
                {/*<button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>*/}
                <li className="nav-item dropdown link-acoes">
                    <a href="#" id="linkDropdownAcoes" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>
                    </a>
                    <div className="dropdown-menu" aria-labelledby="linkDropdownAcoes">
                        <a className="dropdown-item" href="#">Ver dados unidade</a>
                        <a className="dropdown-item" href="#">Ver regularidade</a>
                        <a className="dropdown-item" href="#">Ver situação financeira</a>
                    </div>
                </li>
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
                <Column
                    header="Ações"
                    body={acoesTemplate}
                />
            </DataTable>

        </>
    )
};