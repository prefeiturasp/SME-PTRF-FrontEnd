import React, { useEffect, useState } from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { TagInformacao } from "../../Globais/TagInformacao";

export const TabelaAssociacoes = ({associacoes, rowsPerPage, unidadeEscolarTemplate, acoesTemplate, setShowModalLegendaInformacao}) =>{
    const [associacaoComTag, setAssociacaoComTag] = useState([]);

    const adicionaTagsNasAssociacoes = (associacoesSemTags) => {
        let tagsTabelaAssociacao = ["Encerrada"]

        if(associacoesSemTags.length > 0) {
            let assComTag = associacoesSemTags.map((ass) => {
                ass.informacoes = []

                tagsTabelaAssociacao.forEach(tag => {
                    if(tag === "Encerrada" && ass.data_de_encerramento && ass.tooltip_data_encerramento) {
                        ass.informacoes.push({
                            tag_id: 7,
                            tag_nome: "Associação encerrada",
                            tag_hint: ass.tooltip_data_encerramento
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
        let associacoesTags = adicionaTagsNasAssociacoes(associacoes);
        setAssociacaoComTag(associacoesTags)
    }, [associacoes])


  return(
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
            value={associacaoComTag}
            className="mt-3 container-tabela-associacoes"
            paginator={associacaoComTag.length > rowsPerPage}
            rows={rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            autoLayout={true}
            selectionMode="single"
        >
            <Column field="unidade.codigo_eol" header="Código Eol" />
            <Column
                field="unidade.nome_com_tipo"
                header="Unidade educacional"
                body={unidadeEscolarTemplate}
            />
            <Column
                field="informacao"
                header="Informações"
                style={{width: '15%'}}
                className="align-middle text-center"
                body={(rowData) => TagInformacao(rowData)}
            />
            <Column
                field="uuid"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
    </>
  );
};