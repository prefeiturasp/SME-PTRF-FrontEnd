import React, {useState} from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import useTagInformacaoAssociacaoEncerradaTemplate from "../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate";
import { LegendaInformacao } from "../../../../Globais/ModalLegendaInformacao/LegendaInformacao";

export const TabelaAssociacaoAcao = ({
    unidades, 
    rowsPerPage, 
    selecionarHeader, 
    selecionarTemplate, 
    acoesTemplate, 
    autoLayout=true,
    caminhoUnidade=""
}) => {
    const tagInformacaoAssociacaoEncerrada = useTagInformacaoAssociacaoEncerradaTemplate();
    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false);
    return(
        <>
            <LegendaInformacao
                showModalLegendaInformacao={showModalLegendaInformacao}
                setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                entidadeDasTags="associacao"
            />
            <DataTable
                value={unidades}
                className="datatable-footer-coad"
                paginator={unidades.length > rowsPerPage}
                rows={rowsPerPage}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                autoLayout={autoLayout}
                selectionMode="single"
            >
                <Column header={selecionarHeader()} body={selecionarTemplate}/>
                <Column field={`${caminhoUnidade}.codigo_eol`} header='Código Eol'/>
                <Column field={`${caminhoUnidade}.nome_com_tipo`} header='Nome UE'/>
                <Column
                    field="informacao"
                    header="Informações"
                    style={{width: '15%'}}
                    className="align-middle text-center"
                    body={tagInformacaoAssociacaoEncerrada}
                />                                                            
                <Column
                    field="acoes"
                    header="Ações"
                    body={acoesTemplate}
                />
            </DataTable>
        </>
    )
};