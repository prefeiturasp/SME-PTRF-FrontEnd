import React from 'react';
import chevronUp from '../../../../../../assets/img/icone-chevron-up.svg';
import chevronDown from '../../../../../../assets/img/icone-chevron-down.svg';
import './PaaCardBarraTitulo.scss';

export const PaaCardBarraTitulo = ({ titulo, isAberto, onToggle, acoesExtras }) => (
  <div className="paa-card-barra-titulo d-flex justify-content-between align-items-center w-100">
    <span className="paa-card-barra-titulo__texto">{titulo}</span>
    <div className="d-flex align-items-center">
      {acoesExtras}
      <button
        type="button"
        className="paa-card-barra-titulo__toggle d-flex align-items-center justify-content-center"
        onClick={onToggle}
        aria-expanded={isAberto}
      >
        <img
          src={isAberto ? chevronUp : chevronDown}
          alt={isAberto ? 'Fechar' : 'Abrir'}
          className="paa-card-barra-titulo__chevron"
        />
      </button>
    </div>
  </div>
);
