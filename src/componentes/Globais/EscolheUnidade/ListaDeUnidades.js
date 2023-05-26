import React, { useEffect, useState } from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { TagInformacao } from "../TagInformacao";

export const ListaDeUnidades = ({listaUnidades, rowsPerPage, acaoAoEscolherUnidade, textoAcaoEscolher, setShowModalLegendaInformacao}) => {
    const [unidadesComTag, setUnidadesComTag] = useState([]);

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

    const adicionaTagsNasUnidades = (unidadesSemTags) => {
        let tagsTabelaUnidade = ["Encerrada"]

        if(unidadesSemTags.length > 0) {
            let assComTag = unidadesSemTags.map((ass) => {
                ass.informacoes = []

                tagsTabelaUnidade.forEach(tag => {
                    if(tag === "Encerrada" && ass.data_de_encerramento_associacao && ass.tooltip_associacao_encerrada) {
                        ass.informacoes.push({
                            tag_id: 7,
                            tag_nome: "Associação encerrada",
                            tag_hint: ass.tooltip_associacao_encerrada
                        })
                    }
                    
                });

                return ass;
            })

            return assComTag;
        }
        return []
    }

    useEffect(() => {
        let unidadesTags = adicionaTagsNasUnidades(listaUnidades);
        setUnidadesComTag(unidadesTags)
    }, [listaUnidades])

    useEffect(() => {

    }, [listaUnidades])

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
            value={unidadesComTag}
            className="mt-3"
            paginator={unidadesComTag.length > rowsPerPage}
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
                body={(rowData) => TagInformacao(rowData)}
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