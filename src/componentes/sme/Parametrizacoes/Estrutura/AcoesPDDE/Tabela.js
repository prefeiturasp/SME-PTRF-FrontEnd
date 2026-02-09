import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {faTimesCircle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { EditIconButton } from "../../../../Globais/UI/Button";

const Tabela = ({
    rowsPerPage, 
    data, 
    handleOpenModalForm
}) =>{

    const booleanTemplate = (value) => {
        const opcoes = {
            true: {icone: faCheckCircle, cor: "#297805", texto: "Sim"},
            false: {icone: faTimesCircle, cor: "#B40C02", texto: "Não"}
        }
        const iconeData = opcoes[value]
        const estiloFlag = {fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconeData.cor}
        return (
            <div style={estiloFlag}>
                <FontAwesomeIcon
                    style={{fontSize: '16px', marginRight: "5px", color: iconeData.cor}}
                    icon={iconeData.icone}/>
            </div>
        )
    }
    const aceitaCapitalTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_capital)
    }
    const aceitaCusteioTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_custeio)
    }
    const aceitaLivreTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_livre_aplicacao)
    }
    const acoesTemplate = (rowData) => {
        return (
            <EditIconButton
                onClick={() => handleOpenModalForm(rowData)}
            />
        )
    }

    return(
        <>
        <p>Exibindo <span data-qa="total-acoes" className='total-acoes'>{data.count}</span> Ações</p>        
        <DataTable  
            value={data.results}
            id={'tabela-acoes-pdde'}
        >
            <Column field="nome" header="Ação PDDE"/>
            <Column field="programa_objeto.nome" header="Programa"/>
            <Column
                field="aceita_capital"
                header="Aceita capital?"
                body={aceitaCapitalTemplate}
            />
            <Column
                field="aceita_custeio"
                header="Aceita custeio?"
                body={aceitaCusteioTemplate}
            />
            <Column
                field="aceita_livre_aplicacao"
                header="Aceita livre aplicação?"
                body={aceitaLivreTemplate}
            />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
        </>

    );
};

export default memo(Tabela)