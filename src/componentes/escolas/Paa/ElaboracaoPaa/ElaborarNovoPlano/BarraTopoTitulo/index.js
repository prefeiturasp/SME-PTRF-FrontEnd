import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BarraTopoTitulo = ({ origem = null }) => {
  const navigate = useNavigate();

  const [paa, setPaa] = useState(() => {
    // inicializar valor padrão
    const stored = localStorage.getItem("DADOS_PAA");
    return stored ? JSON.parse(stored) : null;
  });

  const headerPaaReferencia = useCallback(() => {
    // retornar o texto completo(com referência de período) do header
    return `Plano Anual ${paa?.periodo_paa_objeto?.referencia}`;
  }, [paa]);

  useEffect(() => {
    // Incluído para reflexo direto no header quando houver alteração no PAA
    const handleStorageChange = () => {
      const stored = localStorage.getItem("DADOS_PAA");
      setPaa(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const obterConfiguracaoVoltar = () => {
    if (origem === "plano-aplicacao") {
      return {
        className: "btn btn-success",
        label: "Voltar ao Plano de Aplicação",
        destino: "/relatorios-componentes/plano-aplicacao",
      };
    }

    if (origem === "plano-orcamentario") {
      return {
        className: "btn btn-success",
        label: "Voltar ao Plano Orçamentário",
        destino: "/relatorios-componentes/plano-orcamentario",
      };
    }

    if (origem === "atividades-previstas") {
      return {
        className: "btn btn-outline-success",
        label: "Voltar para atividades previstas",
        destino: "/relatorios-componentes/atividades-previstas",
      };
    }

    return {
      className: "btn btn-outline-success",
      label: "Voltar",
      destino: null,
    };
  };

  const { className, label, destino } = obterConfiguracaoVoltar();

  return (
    <div className="barra-topo-lista-usuarios d-flex bd-highlight align-items-center">
      <div className="py-2 flex-grow-1 bd-highlight">
        <h2>{headerPaaReferencia()}</h2>
      </div>
      {destino && <div className="p-2 bd-highlight">
        <button
          className={className}
          onClick={() => navigate(destino)}
        >
          {label}
        </button>
      </div>}
    </div>
  );
};

export default BarraTopoTitulo;
