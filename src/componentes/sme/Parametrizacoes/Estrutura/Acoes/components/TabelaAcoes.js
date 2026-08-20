import React from "react";
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faTimesCircle, faCheckCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { useAcoesContext } from "../hooks/useAcoesContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { TotalRegistros } from "../../../componentes/TotalRegistros";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

export const TabelaAcoes = () => {
    const navigate = useNavigate();
    const { results, handleOpenModalForm } = useAcoesContext();
    const { recursoSelecionado } = useRecursoSelecionadoContext();
    const { selectedRecurso } = useAbasPorRecursoContext();
    // const rowsPerPage = 20;

    const acoesTemplate = (rowData) => {
        return (
            <EditIconButton
                onClick={() => handleOpenModalForm(rowData)}
            />            
        )
    };

    const conferirUnidadesTemplate = (rowData) => {
        return (
            <div>
                <Link to={`/associacoes-da-acao/${rowData['uuid']}?recurso_uuid=${selectedRecurso?.uuid}`} className="link-green" onClick={() => {}}>
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "0"}}
                        icon={faClipboardList}
                    />
                    <span> Ver UEs vinculadas</span>
                </Link>
            </div>
        )
    };

    const booleanTemplate = (value) => {
        const opcoes = {
          true: { icone: faCheckCircle, cor: "#297805", texto: "Sim" },
          false: { icone: faTimesCircle, cor: "#B40C02", texto: "Não" },
        };
        const iconeData = opcoes[value];
        const estiloFlag = {
          fontSize: "14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: iconeData.cor,
        };
        return (
          <div style={estiloFlag}>
            <FontAwesomeIcon
              style={{ fontSize: "16px", marginRight: "5px", color: iconeData.cor }}
              icon={iconeData.icone}
            />
          </div>
        );
    };

    const aceitaCapitalTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_capital);
    };

    const aceitaCusteioTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_custeio);
    };

    const aceitaLivreTemplate = (rowData) => {
        return booleanTemplate(rowData.aceita_livre);
    };

    const recursosPropriosTemplate = (rowData) => {
        return booleanTemplate(rowData.e_recursos_proprios);
    };

    const exibePaa = (rowData) => {
        return booleanTemplate(rowData.exibir_paa);
    };

    const ordenacaoTemplate = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                {rowData.ordem_exibicao}
            </div>
        );
    };

    const ordenacaoHeaderTemplate = () => {
        const corRecurso = recursoSelecionado?.cor;
        const tooltipId = "ordenacao-header-tooltip";
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Ordenação</span>
                <FontAwesomeIcon 
                    id={tooltipId}
                    icon={faInfoCircle}
                    style={{ fontSize: '12px', color: corRecurso, cursor: 'pointer' }}
                />
                <ReactTooltip 
                    anchorId={tooltipId}
                    content="Ordem de exibição da ação nas pesquisas"
                    place="top"
                    className="p-tooltip-text-white"
                />
            </div>
        );
    };

    const handleAlterarOrdenacao = () => {
        navigate('/parametro-acoes/reordenar');
    };

    return(
        <>
            <div className="d-flex justify-content-end">
                <button 
                    type="button" 
                    className="btn btn btn-success mt-4"
                    onClick={handleAlterarOrdenacao}
                >
                    Alterar ordenação
                </button>
            </div>
            <TotalRegistros 
                titulo="Ações"
                total_registros={results.length}
            />
            <DataTable
                value={results}
                // paginator={results.length > rowsPerPage}
                // paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                // rows={rowsPerPage}
            >
                <Column field="nome" header="Nome"/>

                <Column body={ordenacaoTemplate} header={ordenacaoHeaderTemplate()} />

                <Column body={conferirUnidadesTemplate} header='UEs vinculadas'
                                                    style={{textAlign: 'center', width:'140px',}}/>
                <Column body={aceitaCapitalTemplate} header='Aceita Capital?'
                                                    style={{textAlign: 'center', width:'110px',}}/>
                <Column body={aceitaCusteioTemplate} header='Aceita Custeio?'
                                                    style={{textAlign: 'center', width:'110px',}}/>
                <Column body={aceitaLivreTemplate} header='Aceita Livre Aplicação?'
                                                    style={{textAlign: 'center', width:'110px',}}/>
                <Column body={recursosPropriosTemplate} header='Recursos externos?'
                                                    style={{textAlign: 'center', width:'110px',}}/>
                <Column body={exibePaa} header='Exibe no PAA?'
                                                    style={{textAlign: 'center', width:'110px',}}/>

                <Column
                    field="acoes"
                    header="Ações"
                    body={acoesTemplate}
                    style={{width:'80px', textAlign: 'center'}}
                />
            </DataTable>
        </>
    )
};
