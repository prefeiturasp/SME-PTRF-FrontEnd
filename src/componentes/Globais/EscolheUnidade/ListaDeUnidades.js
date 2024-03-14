import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { TableTags } from "../TableTags";
import { LegendaInformacao } from "../ModalLegendaInformacao/LegendaInformacao";
import { coresTagsAssociacoes } from "../../../utils/CoresTags";
import ReactTooltip from "react-tooltip";
import {Button, Tooltip} from "antd";

export const ListaDeUnidades = ({
    listaUnidades, 
    rowsPerPage, 
    acaoAoEscolherUnidade, 
    textoAcaoEscolher, 
    showModalLegendaInformacao,
    setShowModalLegendaInformacao
}) => {

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

                    <Tooltip title="Viabilizar acesso">
                        <Button
                            type="text"
                            onClick={() => handleAcaoEscolher(rowData)}
                            className="btn btn-link link-green"
                            icon={
                                <FontAwesomeIcon
                                    style={{fontSize: '15px', marginRight: "0"}}
                                    icon={faKey}
                                />
                            }
                        >
                        </Button>
                    </Tooltip>
                </>
        )
    };

    return (
        <>
            <LegendaInformacao
                showModalLegendaInformacao={showModalLegendaInformacao}
            setShowModalLegendaInformacao={setShowModalLegendaInformacao}
            entidadeDasTags="associacao"
            excludedTags={["Encerramento de conta pendente"]}
        />

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
                body={(rowData) => <TableTags data={rowData} coresTags={coresTagsAssociacoes} excludeTags={["Encerramento de conta pendente"]}/>}
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