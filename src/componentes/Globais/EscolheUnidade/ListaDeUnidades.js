import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";

export const ListaDeUnidades = ({listaUnidades, rowsPerPage, acaoAoEscolherUnidade}) => {

    const unidadeEscolarTemplate = (rowData) => {
        return (
            <div>
                {rowData['nome_com_tipo'] ? <strong>{rowData['nome_com_tipo']}</strong> : ''}
            </div>
        )
    };

    const acoesTemplate = (rowData) =>{
        return (
                <>

                    <button
                        onClick={()=>acaoAoEscolherUnidade(rowData.uuid)}
                        className="btn btn-link link-green"
                    >
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "0"}}
                            icon={faKey}
                        />
                        <span> Viabilizar acesso</span>

                    </button>

                </>
        )
    };

    return (
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
                header="Unidade escolar"
                body={unidadeEscolarTemplate}
            />
            <Column
                field="uuid"
                header="Ação"
                body={acoesTemplate}
                className="text-center"
                style={{width: '20%'}}
            />
        </DataTable>
    );
};