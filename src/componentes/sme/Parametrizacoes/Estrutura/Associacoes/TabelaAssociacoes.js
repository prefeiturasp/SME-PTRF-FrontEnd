import React, { useEffect, useState } from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import { TagInformacao } from "../../../../Globais/TagInformacao";

export const TabelaAssociacoes = ({listaDeAssociacoes, rowsPerPage, acoesTemplate}) => {
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
        let associacoesTags = adicionaTagsNasAssociacoes(listaDeAssociacoes);
        setAssociacaoComTag(associacoesTags)
    }, [listaDeAssociacoes])

    return(
        <DataTable
            value={associacaoComTag}
            paginator={associacaoComTag.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="nome" header="Nome da Associação"/>
            <Column field="unidade.nome_com_tipo" header="Unidade educacional"/>
            <Column
                field="informacao"
                header="Informações"
                className="align-middle text-center"
                body={(rowData) => TagInformacao(rowData)}
                style={{width: '15%'}}
            />
            <Column field="unidade.nome_dre" header="DRE"/>
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
    )
};