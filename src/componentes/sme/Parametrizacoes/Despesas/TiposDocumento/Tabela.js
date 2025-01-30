import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';

const Tabela = (props)=>{
    const templateHeaderApenasDigito = ()=>{
        const header ="No número do documento deve constar apenas dígitos?"
        return (
            <p data-qa="legenda-apenas-digitos" className="mb-0">
                {header}
                <span data-qa="col-tooltip-apenas-digitos"
                    data-tip="(ex: 0,1,2,3,4)" data-for={` col-tooltip-id-apenas-digitos`}>
                    <ReactTooltip id={` col-tooltip-id-apenas-digitos`}/>
                    <FontAwesomeIcon
                        style={{fontSize: '16px', marginLeft: "10px", color: "#00585E"}}
                        icon={faInfoCircle}
                    />
                </span>
            </p>
        )
    }
    return(
        <DataTable
            data-qa="tabela-tipo-documento"
            value={props.lista}
            rows={props.rowsPerPage}
            paginator={props.lista.length > props.rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column
                data-qa="tabela-col-tipo-documento-nome"
                field="nome"
                header="Nome"
            />
            <Column
                data-qa="tabela-col-tipo-documento-numero-documento-digitado"
                field="numero_documento_digitado"
                header="Solicitar a digitação do número do documento?"
                body={props.numeroDocumentoDigitadoTemplate}
            />
            <Column
                data-qa="tabela-col-tipo-documento-apenas-digitos"
                field="apenas_digitos"
                header={templateHeaderApenasDigito()}
                body={props.apenasDigitoTemplate}
            />
            <Column
                data-qa="tabela-col-tipo-documento-documento-comprobatorio-de-despesa"
                field="documento_comprobatorio_de_despesa"
                header="Documento comprobatório de despesa?"
                body={props.documentoComprobatorioDeDespesaTemplate}
            />
            <Column
                data-qa="tabela-col-tipo-documento-pode-reter-imposto"
                field="pode_reter_imposto"
                header="Habilita preenchimento do imposto?"
                body={props.podeReterImpostoTemplate}
            />
            <Column
                data-qa="tabela-col-tipo-documento-eh-documento-de-retencao-de-imposto"
                field="eh_documento_de_retencao_de_imposto"
                header="Documento relativo ao imposto recolhido?"
                body={props.ehDocumentoDeRetencaoDeImpostoTemplate}
            />
            <Column
                data-qa="tabela-col-tipo-documento-acoes"
                field="acoes"
                header="Ações"
                body={props.acoesTemplate}
                style={{width:'80px', textAlign: 'center'}}
            />
        </DataTable>
    );
};
export default memo(Tabela)
