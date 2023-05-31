import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { TagInformacao } from "../TagInformacao";

export const ListaDeUnidades = ({listaUnidades, rowsPerPage, acaoAoEscolherUnidade, textoAcaoEscolher, setShowModalLegendaInformacao}) => {

    const unidadeEscolarTemplate = (rowData) => {
        return (
            <div>
                {rowData['nome_com_tipo'] ? <strong>{rowData['nome_com_tipo']}</strong> : ''}
            </div>
        )
    };

    const handleAcaoEscolher = (rowData) => {
        const unidadeSelecionada = {
            uuid: rowData.uuid,
            nome: rowData.nome,
            codigo_eol: rowData.codigo_eol,
            tipo_unidade: rowData.tipo_unidade,
            associacao_nome: rowData.associacao_nome,
            associacao_uuid: rowData.associacao_uuid,
            visao: rowData.visao
        }
        acaoAoEscolherUnidade(unidadeSelecionada)
    };

    const acoesTemplate = (rowData) =>{
        return (
                <>

                    <button
                        onClick={()=>handleAcaoEscolher(rowData)}
                        className="btn btn-link link-green"
                    >
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "0"}}
                            icon={faKey}
                        />
                        <span> {textoAcaoEscolher} </span>

                    </button>

                </>
        )
    };

    return (
        <>
        <div className="d-flex justify-content-end">
            <button
                onClick={()=> setShowModalLegendaInformacao(true)}
                className="btn btn-link link-green"
                style={{padding: '0px', textDecoration: 'none'}}
            >
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "4px", paddingTop: "2px"}}
                    icon={faInfoCircle}
                />
                <span>Legenda informação</span>
            </button>
        </div>

        <DataTable
            value={listaUnidades}
            className="mt-3"
            paginator={listaUnidades.length > rowsPerPage}
            rows={rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            autoLayout={true}
        >
            <Column
                field="codigo_eol"
                header="Código Eol"
                className="text-center"
                style={{width: '15%'}}
            />
            <Column
                field="nome_com_tipo"
                header="Unidade educacional"
                body={unidadeEscolarTemplate}
            />
            <Column
                field="informacao"
                header="Informações"
                className="align-middle text-center"
                body={(rowData) => <TagInformacao data={rowData} />}
                style={{width: '15%'}}
            />
            <Column
                field="uuid"
                header="Ação"
                body={acoesTemplate}
                className="text-center"
                style={{width: '20%'}}
            />
        </DataTable>
        </>
    );
};