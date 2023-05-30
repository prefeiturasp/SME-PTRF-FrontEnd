import React, {useState} from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import useTagInformacaoAssociacaoEncerradaTemplate from "../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate";
import { ModalLegendaInformacaoAssociacao } from "../../../../Globais/LegendaInformaçãoAssociacao/ModalLegendaInformacaoAssociacao";

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
            <section>
                <ModalLegendaInformacaoAssociacao
                    show={showModalLegendaInformacao}
                    primeiroBotaoOnclick={() => setShowModalLegendaInformacao(false)}
                    titulo="Legenda Informação"
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="outline-success"                            
                />
            </section>        
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