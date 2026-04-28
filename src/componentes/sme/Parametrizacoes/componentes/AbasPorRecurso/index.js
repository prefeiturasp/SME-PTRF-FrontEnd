import React, { Fragment, useMemo, useRef, useEffect, useContext } from "react";
import { useGetRecursos } from "./hooks/useGetRecursos";
import { RecursosContext } from "./context/Recursos";
import "../../../../../componentes/Globais/MenuInterno";
import "../../../../../componentes/dres/Associacoes/associacoes.scss";
import Loading from "../../../../../utils/Loading";

export const AbasPorRecurso = () => {
    const { selectedRecurso, setSelectedRecurso, clickBtnEscolheOpcao, setClickBtnEscolheOpcao } = useContext(RecursosContext);
    const { data: recursos, isLoading, isError, error } = useGetRecursos();
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

    // Inicializa primeira aba como ativa - executa apenas uma vez com a primeira aba
    useEffect(() => {
        if (recurso_tabs.length > 0 && !inicializado.current) {
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
        if (abaAtivaId) {
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

    if (isError) {
        return (
            <div className="alert alert-danger mt-3">
                Erro ao carregar recursos: {error?.message || "Erro desconhecido"}
            </div>
        );
    }

    if (recurso_tabs.length === 0) {
        return <div className="alert alert-info mt-3">Nenhum recurso disponível</div>;
    }

    return (
        <nav className="nav mb-4 mt-2 menu-interno">
            {recurso_tabs.map((tab, index) => {
                return tab.permissao ? (
                    <Fragment key={index}>
                        <li>
                        <a
                            onClick={() => {
                                // Ativa aba de recurso
                                setClickBtnEscolheOpcao({
                                    [tab.id]: true,
                                });
                                // Atualiza o recurso selecionado no contexto
                                const recursoSelecionado = recursos.find(r => r.uuid === tab.id);
                                setSelectedRecurso(recursoSelecionado);
                            }}
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