import React, { Fragment, useMemo, useRef, useEffect, useContext } from "react";
import { AbasPorRecursosContext } from "./context/Recursos";
import "../../../../../componentes/Globais/MenuInterno";
import "../../../../../componentes/dres/Associacoes/associacoes.scss";
import Loading from "../../../../../utils/Loading";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

export const AbasPorRecurso = ({
    handleChangeFiltros,
}) => {
    const { selectedRecurso, setSelectedRecurso, clickBtnEscolheOpcao, setClickBtnEscolheOpcao } = useContext(AbasPorRecursosContext);
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

    const filteredRecursoTabs = (recursoUUID) => {
        handleChangeFiltros('recurso_uuid', recursoUUID);
    }

    const handleChangeTab = (tab_id) => {
        // Ativa aba de recurso
        setClickBtnEscolheOpcao({
            [tab_id]: true,
        });
        // Atualiza o recurso selecionado no contexto
        const recursoSelecionado = recursos.find(r => r.uuid === tab_id);
        setSelectedRecurso(recursoSelecionado);

        filteredRecursoTabs(recursoSelecionado ? recursoSelecionado.uuid : '');
    }

    // Inicializa primeira aba como ativa - executa apenas uma vez com a primeira aba
    useEffect(() => {
        if (recurso_tabs.length > 0 && !inicializado.current && !selectedRecurso) {
            const primeiroRecurso = recursos.find(r => r.uuid === recurso_tabs[0].id);
            setClickBtnEscolheOpcao({
                [recurso_tabs[0].id]: true,
            });
            setSelectedRecurso(primeiroRecurso);
            inicializado.current = true;
        }
    }, [recurso_tabs]);

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
            {recurso_tabs.map((tab) => {
                return tab.permissao ? (
                    <Fragment key={tab.id}>
                        <li>
                            <a
                                onClick={() => handleChangeTab(tab.id)}
                                className={`nav-link btn-escolhe-aba ${
                                    clickBtnEscolheOpcao[tab.id] ? "btn-escolhe-aba-active" : ""
                                }`}
                                id={`nav-${tab.id}-tab`}
                                data-toggle="tab"
                                href={`#nav-${tab.id}`}
                                role="tab"
                                aria-controls={`nav-${tab.id}`}
                                aria-selected={clickBtnEscolheOpcao[tab.id] ? "true" : "false"}
                            >
                                {tab.nome_exibicao}
                            </a>
                        </li>
                    </Fragment>
                ) : null;
            })}
        </nav>
    );
};