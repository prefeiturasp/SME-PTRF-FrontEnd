import React from 'react';
import ListaVaziaImg from '../../../../../../assets/img/lista-vazia.svg';
import './PaaListaVazia.scss';

export const PaaListaVazia = ({ children }) => (
  <>
    <h4 className="mt-3 text-center paa-lista-vazia__mensagem">
      {children}
    </h4>
    <div className="d-flex justify-content-center">
      <img src={ListaVaziaImg} alt="Lista vazia" className="img-fluid" />
    </div>
  </>
);
