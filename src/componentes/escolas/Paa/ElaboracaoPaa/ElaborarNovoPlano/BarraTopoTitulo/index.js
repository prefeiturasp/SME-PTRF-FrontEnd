import React from 'react';
import {useNavigate} from "react-router-dom-v5-compat";

const BarraTopoTitulo = () => {
  const navigate = useNavigate();

  return (
    <div className="barra-topo-lista-usuarios d-flex bd-highlight align-items-center">
      <div className="py-2 flex-grow-1 bd-highlight">
        <h2>Plano Anual 2022</h2>
      </div>
      <div className="p-2 bd-highlight">
        <button className="btn btn-outline-success" onClick={() => navigate('/paa')}>Voltar</button>
      </div>
    </div>
  );
};

export default BarraTopoTitulo;