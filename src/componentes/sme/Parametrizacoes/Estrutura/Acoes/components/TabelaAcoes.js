import React from "react";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { MsgImgCentralizada } from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import { TotalRegistros } from "../../../componentes/TotalRegistros";
import Img404 from "../../../../../../assets/img/img-404.svg";
import { useAcoesContext } from "../hooks/useAcoesContext";
import Loading from "../../../../../../utils/Loading";
import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import {
    aceitaCapitalTemplate,
    aceitaCusteioTemplate,
    aceitaLivreTemplate,
    recursosPropriosTemplate,
    exibePaaTemplate,
    ordenacaoTemplate,
    ordenacaoHeaderTemplate,
    conferirUnidadesTemplate,
    acoesTemplate
} from "../templates/acoesTemplates";

export const TabelaAcoes = () => {
    const navigate = useNavigate();
    const { results, handleOpenModalForm, isLoading } = useAcoesContext();
    const { recursoSelecionado } = useRecursoSelecionadoContext();
    const { selectedRecurso } = useAbasPorRecursoContext();

    const handleAlterarOrdenacao = () => {
        navigate(`/parametro-acoes/reordenar?recurso_uuid=${selectedRecurso?.uuid}`);
    };

    return(
        <>
            { isLoading ? (
                <div className="mt-5">
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                </div>
            ) : (
                <>
                    {(results || []).length ? (
                        <>
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <TotalRegistros 
                                    titulo="Ações"
                                    total_registros={results.length}
                                />

                                <button 
                                    type="button" 
                                    className="btn btn btn-success mb-3"
                                    onClick={handleAlterarOrdenacao}
                                >
                                    Alterar ordenação
                                </button>
                            </div>

                            <DataTable
                                value={results}
                            >
                                <Column field="nome" header="Nome"/>

                                <Column body={ordenacaoTemplate} header={ordenacaoHeaderTemplate(recursoSelecionado?.cor)} />

                                <Column body={(rowData) => conferirUnidadesTemplate(rowData, selectedRecurso?.uuid)} header='UEs vinculadas'
                                                                    style={{textAlign: 'center', width:'140px',}}/>
                                <Column body={aceitaCapitalTemplate} header='Aceita Capital?'
                                                                    style={{textAlign: 'center', width:'110px',}}/>
                                <Column body={aceitaCusteioTemplate} header='Aceita Custeio?'
                                                                    style={{textAlign: 'center', width:'110px',}}/>
                                <Column body={aceitaLivreTemplate} header='Aceita Livre Aplicação?'
                                                                    style={{textAlign: 'center', width:'110px',}}/>
                                <Column body={recursosPropriosTemplate} header='Recursos externos?'
                                                                    style={{textAlign: 'center', width:'110px',}}/>
                                <Column body={exibePaaTemplate} header='Exibe no PAA?'
                                                                    style={{textAlign: 'center', width:'110px',}}/>

                                <Column
                                    field="acoes"
                                    header="Ações"
                                    body={(rowData) => acoesTemplate(rowData, handleOpenModalForm)}
                                    style={{width:'80px', textAlign: 'center'}}
                                />
                            </DataTable>
                        </>
                    ) : (
                        <MsgImgCentralizada
                            data-qa="imagem-lista-sem-acoes"
                            texto="Nenhum resultado encontrado."
                            img={Img404}
                        />
                    )}
                </>
            ) }
            
        </>
    )
};
