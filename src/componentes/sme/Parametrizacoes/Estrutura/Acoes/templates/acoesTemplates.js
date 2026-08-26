import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faTimesCircle, faCheckCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from "react-router-dom";
import { EditIconButton } from "../../../../../Globais/UI/Button";

/**
 * Template com funções comuns para exibir valores booleanos com ícones na tabela de ações 
 * da página principal e página de ordenação de ações.
 */


// Template base para exibir valores booleanos com ícones
export const booleanTemplate = (value) => {
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

// Template para exibir aceita capital
export const aceitaCapitalTemplate = (rowData) => {
    return booleanTemplate(rowData.aceita_capital);
};

// Template para exibir aceita custeio
export const aceitaCusteioTemplate = (rowData) => {
    return booleanTemplate(rowData.aceita_custeio);
};

// Template para exibir aceita livre aplicação
export const aceitaLivreTemplate = (rowData) => {
    return booleanTemplate(rowData.aceita_livre);
};

// Template para exibir recursos próprios
export const recursosPropriosTemplate = (rowData) => {
    return booleanTemplate(rowData.e_recursos_proprios);
};

// Template para verificar se exibe no PAA
export const exibePaaTemplate = (rowData) => {
    return booleanTemplate(rowData.exibir_paa);
};

// Template para exibir a ordenação
export const ordenacaoTemplate = (rowData) => {
    return (
        <div style={{ textAlign: 'center' }}>
            {rowData.ordem_exibicao}
        </div>
    );
};

// Template do header da ordenação com tooltip
export const ordenacaoHeaderTemplate = (corRecurso) => {
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

// Template para exibir link de conferir unidades educacionais
export const conferirUnidadesTemplate = (rowData, selectedRecursoUuid) => {
    return (
        <div>
            <Link 
                to={`/associacoes-da-acao/${rowData['uuid']}?recurso_uuid=${selectedRecursoUuid}`} 
                className="link-green" 
                onClick={() => {}}
            >
                <FontAwesomeIcon
                    style={{ fontSize: '15px', marginRight: "0" }}
                    icon={faClipboardList}
                />
                <span> Ver UEs vinculadas</span>
            </Link>
        </div>
    )
};


// Template para exibir botão de ações (editar)
export const acoesTemplate = (rowData, onEdit) => {
    return (
        <EditIconButton
            onClick={() => onEdit(rowData)}
        />            
    )
};
