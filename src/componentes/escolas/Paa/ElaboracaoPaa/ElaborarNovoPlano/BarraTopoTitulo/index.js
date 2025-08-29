import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'

const BarraTopoTitulo = () => {
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

  return (
    <div className="barra-topo-lista-usuarios d-flex bd-highlight align-items-center">
      <div className="py-2 flex-grow-1 bd-highlight">
        <h2>{headerPaaReferencia()}</h2>
      </div>
      <div className="p-2 bd-highlight">
        <button className="btn btn-outline-success" onClick={() => navigate('/paa')}>Voltar</button>
      </div>
    </div>
  );
};

export default BarraTopoTitulo;