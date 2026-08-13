/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import "../../../../../componentes/Globais/MenuInterno";
import "../../../../../componentes/dres/Associacoes/associacoes.scss";
import Loading from "../../../../../utils/Loading";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";
import { useAbasPorRecursoContext } from "./hooks/useAbasPorRecursoContext";
import { useNavigate, useLocation } from "react-router-dom";

export const AbasPorRecurso = ({
    extra_abas = [], 
    extra_handle_click_tab_recurso = () => {},
    tab_initial_active = null
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { selectedRecurso, setSelectedRecurso, clickBtnEscolheOpcao, setClickBtnEscolheOpcao } = useAbasPorRecursoContext();
    const { isLoading, recursos } = useRecursoSelecionadoContext();

    // Transformar dados dos recursos em abas
    const recurso_tabs = useMemo(() => {
      return recursos
        .sort((a, b) => (b.legado === true) - (a.legado === true))
        .map((recurso) => ({
            ...recurso,
            id: recurso.uuid,
            nome: recurso.nome,
            nome_exibicao: recurso.nome_exibicao,
            permissao: true,
        }));
    }, [recursos]);

    // Identifica a aba extra ativa com base na URL atual, priorizando a correspondência mais longa
    const activeExtraTab = useMemo(() => {
        if (!extra_abas || extra_abas.length === 0) return null;

        const currentPath = location.pathname.toLowerCase().replace(/\/$/, "");
        let bestTab = null;
        let maxLength = 0;

        extra_abas.forEach((tab, index) => {
            if (!tab.url) return;
            
            const cleanUrl = [tab.url, tab.origem].filter(Boolean).join("/").toLowerCase().replace(/\/+/g, "/").replace(/\/$/, "");
            const fullPath = `/${cleanUrl}`;

            if (currentPath === fullPath || currentPath.endsWith(fullPath) || (cleanUrl.length > 1 && currentPath.includes(cleanUrl))) {
                if (cleanUrl.length > maxLength) {
                    maxLength = cleanUrl.length;
                    bestTab = { ...tab, id: tab.id || `extra-tab-${index}` };
                }
            }
        });

        return bestTab;
    }, [extra_abas, location.pathname]);

    // Cálculo direto da aba ativa para garantir estilização correta
    const activeTabId = useMemo(() => {
        if (activeExtraTab) {
            return activeExtraTab.id;
        }
        if (selectedRecurso?.uuid && recurso_tabs.some(r => r.id === selectedRecurso.uuid)) {
            return selectedRecurso.uuid;
        }
        if (tab_initial_active && recurso_tabs.some(r => r.id === tab_initial_active)) {
            return tab_initial_active;
        }
        return recurso_tabs[0]?.id || null;
    }, [activeExtraTab, selectedRecurso?.uuid, recurso_tabs, tab_initial_active]);

    const handleChangeTab = (tab_id) => {
        setClickBtnEscolheOpcao({ [tab_id]: true });
        const recursoSelecionado = recursos.find(r => r.uuid === tab_id);
        if (recursoSelecionado) {
            setSelectedRecurso(recursoSelecionado);
        }

        extra_handle_click_tab_recurso();
    };

    const handleClickExtraTab = ({ tab_id, url }) => {
        setSelectedRecurso(null);
        setClickBtnEscolheOpcao({ [tab_id]: true });
        navigate(url);
    };

    // Template de item das abas (Usa estritamente activeTabId para definir a classe ativa)
    const liItemTemplate = ({ handleClick, tab_id, label }) => {
        const isTabActive = tab_id === activeTabId;
        const classNameActive = isTabActive ? "btn-escolhe-aba-active" : "";

        return (
            <li key={tab_id}>
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                    }}
                    className={`nav-link btn-escolhe-aba ${classNameActive}`}
                    id={`nav-${tab_id}-tab`}
                    data-toggle="tab"
                    href="#"
                    role="tab"
                    aria-selected={isTabActive ? "true" : "false"}
                >
                    {label}
                </a>
            </li>
        );
    };

    const renderTabsRecursos = () => {
        return recurso_tabs.filter(tab => tab.permissao).map(tab => {
            return liItemTemplate({
                handleClick: () => handleChangeTab(tab.id),
                tab_id: tab.id,
                label: tab.nome_exibicao,
            });
        });
    };

    const renderExtraAbas = () => {
        return extra_abas.map((tab, index) => {
            const tab_id = tab.id || `extra-tab-${index}`;
            const urlLimpa = [tab.url, tab.origem].filter(Boolean).join("/");
            const urlFinal = `/${urlLimpa}/`.replace(/\/+/g, "/");

            return liItemTemplate({
                handleClick: () => handleClickExtraTab({ tab_id, url: urlFinal }),
                tab_id: tab_id,
                label: tab.label,
            });
        });
    };

    // Limpeza de estado ao sair da tela (ex: Dashboard/Menu) - preserva estado se voltando para uma aba de recurso
    useEffect(() => {
        const currentPath = location.pathname;
        const estavaEmAbaExtra = activeExtraTab !== null;

        return () => {
            const nextPath = window.location.pathname;

            if (nextPath !== currentPath) {
                const indoParaAbaExtra = extra_abas.some(tab => 
                    tab.url && nextPath.toLowerCase().includes(tab.url.toLowerCase())
                );

                // Só limpa se formos para OUTRA tela (ex: painel-parametrizacoes)
                // Se estávamos em uma aba extra e voltamos para uma aba de recurso, PRESERVA o recurso clicado
                if (!estavaEmAbaExtra && !indoParaAbaExtra) {
                    setSelectedRecurso(null);
                    setClickBtnEscolheOpcao({});
                }
            }
        };
    }, [location.pathname, activeExtraTab, extra_abas, setSelectedRecurso, setClickBtnEscolheOpcao]);

    // Sincronização de estado do contexto (Usando apenas primitivos nas dependências para evitar loops)
    useEffect(() => {
        if (isLoading) return;

        // CENÁRIO A: Estamos em uma rota de Aba Extra
        if (activeExtraTab) {
            if (selectedRecurso !== null) {
                setSelectedRecurso(null);
            }
            if (!clickBtnEscolheOpcao[activeExtraTab.id]) {
                setClickBtnEscolheOpcao({ [activeExtraTab.id]: true });
            }
            return;
        }

        // CENÁRIO B: Estamos em Abas de Recurso Normais
        if (recurso_tabs.length > 0) {
            const recursoExiste = selectedRecurso && recurso_tabs.some(r => r.id === selectedRecurso.uuid);

            if (!recursoExiste) {
                // Primeira carga ou retorno de outra tela -> seleciona a 1ª aba
                const targetId = tab_initial_active || recurso_tabs[0].id;
                const targetResource = recursos.find(r => r.uuid === targetId);

                if (targetResource) {
                    setSelectedRecurso(targetResource);
                    setClickBtnEscolheOpcao({ [targetId]: true });
                }
            } else {
                if (!clickBtnEscolheOpcao[selectedRecurso.uuid]) {
                    setClickBtnEscolheOpcao({ [selectedRecurso.uuid]: true });
                }
            }
        }
    }, [
        isLoading,
        activeExtraTab,
        recurso_tabs,
        selectedRecurso?.uuid,
        tab_initial_active,
        recursos,
        clickBtnEscolheOpcao,
        setSelectedRecurso,
        setClickBtnEscolheOpcao
    ]);

    if (isLoading) {
        return (
            <div className="mt-5">
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            </div>
        );
    }

    if (recurso_tabs.length === 0) {
        return <div className="alert alert-info mt-3">Nenhum recurso disponível</div>;
    }

    return (
        <nav className="nav mt-2 menu-interno">
            {renderTabsRecursos()}

            { extra_abas.length > 0 && recurso_tabs.length > 0 &&
                <div
                    style={{
                        height: 20,
                        width: 2,
                        backgroundColor: "#cccccc",
                        margin: "0.6rem 1.6rem 1rem 0px",
                    }}
                />
            }

            { renderExtraAbas() }
        </nav>
    );
};