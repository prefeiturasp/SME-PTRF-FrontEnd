import React, { Fragment, useMemo, useRef, useEffect } from "react";
import "../../../../../componentes/Globais/MenuInterno";
import "../../../../../componentes/dres/Associacoes/associacoes.scss";
import { Divider } from 'primereact/divider';
import Loading from "../../../../../utils/Loading";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";
import { useAbasPorRecursoContext } from "./hooks/useAbasPorRecursoContext";
import { useNavigate } from "react-router-dom";

export const AbasPorRecurso = ({
    extra_abas = [], 
    extra_handle_click_tab_recurso = () => {},
    tab_initial_active = null
}) => {
    const navigate = useNavigate();
    const { selectedRecurso, setSelectedRecurso, clickBtnEscolheOpcao, setClickBtnEscolheOpcao } = useAbasPorRecursoContext();
    const { isLoading, recursos } = useRecursoSelecionadoContext();
    // Ref para garantir que a inicialização da aba ativa ocorra apenas uma vez
    const inicializado = useRef(false);

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

    const handleChangeTab = (tab_id) => {
        // Ativa aba de recurso
        setClickBtnEscolheOpcao({
            [tab_id]: true,
        });
        // Atualiza o recurso selecionado no contexto
        const recursoSelecionado = recursos.find(r => r.uuid === tab_id);
        setSelectedRecurso(recursoSelecionado);

        extra_handle_click_tab_recurso()
    }

    const handleClickExtraTab = ({
        tab_id,
        url,
    }) => {
        setClickBtnEscolheOpcao({
            [tab_id]: true,
        });
        setSelectedRecurso(null);

        navigate(url);
    }

    const liItemTemplate = ({
        handleClick,
        tab_id,
        label,
    }) => {
        const classNameActive = clickBtnEscolheOpcao[tab_id] ? "btn-escolhe-aba-active" : "";

        return (
            <li key={tab_id}>
                <a
                    onClick={handleClick}
                    className={`nav-link btn-escolhe-aba ${classNameActive}`}
                    id={`nav-${tab_id}-tab`}
                    data-toggle="tab"
                    href={`#nav-${tab_id}`}
                    role="tab"
                    aria-controls={`nav-${tab_id}`}
                    aria-selected={classNameActive ? "true" : "false"}
                >
                    {label}
                </a>
            </li>
        )
    }

    const renderTabsRecursos = () => {
        const tabsRecursos = recurso_tabs.filter(tab => tab.permissao).map(tab => {
            return liItemTemplate({
                handleClick: () => handleChangeTab(tab.id),
                tab_id: tab.id,
                label: tab.nome_exibicao,
            });
        });

        return tabsRecursos;
    }

    const renderExtraAbas = () => {
        return extra_abas.map((tab, index) => {
            const tab_id = `extra-tab-${index}`;

            return liItemTemplate({
                handleClick: () => handleClickExtraTab({ tab_id, url: `/${tab.url}/${tab.origem}/` }),
                tab_id: tab_id,
                label: tab.label,
            });
        });
    }

    // Inicializa primeira aba como ativa - executa apenas uma vez com a primeira aba
    useEffect(() => {
        if (tab_initial_active) {
            setClickBtnEscolheOpcao({
                [tab_initial_active]: true,
            });
        } else if (recurso_tabs.length > 0 && !inicializado.current && !selectedRecurso) {
            const primeiroRecurso = recursos.find(r => r.uuid === recurso_tabs[0].id);
            setClickBtnEscolheOpcao({
                [recurso_tabs[0].id]: true,
            });
            setSelectedRecurso(primeiroRecurso);
            inicializado.current = true;
        }
    }, [recurso_tabs, tab_initial_active]);

    // Sincroniza o recurso selecionado quando a aba ativa muda
    useEffect(() => {
        const abaAtivaId = Object.keys(clickBtnEscolheOpcao).find(key => clickBtnEscolheOpcao[key]);
        if (abaAtivaId && !selectedRecurso) {
            const recursoAtivo = recursos.find(r => r.uuid === abaAtivaId);
            if (recursoAtivo) {
                setSelectedRecurso(recursoAtivo);
            }
        }
    }, [clickBtnEscolheOpcao, recursos]);

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