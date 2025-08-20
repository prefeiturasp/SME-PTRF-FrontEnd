import React, {memo, useCallback} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import moment from "moment";
import { IconButton } from "../../../../Globais/UI/Button/IconButton";
import {faEdit, faPlus, faTimesCircle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Tooltip as ReactTooltip } from "react-tooltip";

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
            <div>
                <button onClick={() => handleOpenModalForm(rowData)} className="btn-editar-membro">
                    <div data-tooltip-content="Editar" data-tooltip-id={`tooltip-id-${rowData.uuid}`}>
                        <ReactTooltip id={`tooltip-id-${rowData.uuid}`}/>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                            icon={faEdit}
                        />
                    </div>
                </button>
            </div>
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