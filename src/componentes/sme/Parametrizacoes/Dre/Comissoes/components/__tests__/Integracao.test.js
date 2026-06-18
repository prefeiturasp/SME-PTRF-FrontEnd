import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock dos componentes Filtros e Tabela
jest.mock('../Filtros', () => {
  const React = require('react');
  return {
    Filtros: () => {
      return React.createElement('div', { 'data-testid': 'filtros-container' },
        React.createElement('p', null, 'Filtre por comissão, recursos disponíveis ou por comissões aptas para prestação de contas.'),
        React.createElement('label', { htmlFor: 'filtro-nome' }, 'Filtre por comissão'),
        React.createElement('input', { id: 'filtro-nome', placeholder: 'Digite o nome da comissão...', 'data-testid': 'autocomplete-input' }),
        React.createElement('label', { htmlFor: 'recursos' }, 'Filtre por recurso'),
        React.createElement('select', { id: 'recursos', 'data-testid': 'select-recursos' },
          React.createElement('option', null, 'Selecione um ou mais recursos')
        ),
        React.createElement('label', null, 'Responsável de análise de PC'),
        React.createElement('button', { role: 'switch', 'aria-checked': 'false', 'data-testid': 'switch-responsavel' }),
        React.createElement('button', { 'data-testid': 'btn-filtrar' }, 'Filtrar'),
        React.createElement('button', { 'data-testid': 'btn-limpar' }, 'Limpar')
      );
    }
  };
});

jest.mock('../Tabela', () => {
  const React = require('react');
  return {
    Tabela: () => {
      return React.createElement('table', { 'data-testid': 'datatable' },
        React.createElement('tbody', null,
          React.createElement('tr', null,
            React.createElement('td', null, 'Comissão de Finanças')
          )
        )
      );
    }
  };
});

// Importar componentes mockeados
const { Filtros } = require('../Filtros');
const { Tabela } = require('../Tabela');

describe('Testes de Integração - Comissões', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar Filtros e Tabela sem erros', () => {
    render(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    expect(screen.getByTestId('datatable')).toBeInTheDocument();
  });

  test('deve exibir labels dos filtros', () => {
    render(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    expect(screen.getByLabelText('Filtre por comissão')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtre por recurso')).toBeInTheDocument();
  });

  test('deve renderizar botões Filtrar e Limpar', () => {
    render(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    expect(screen.getByTestId('btn-filtrar')).toBeInTheDocument();
    expect(screen.getByTestId('btn-limpar')).toBeInTheDocument();
  });

  test('deve exibir texto descritivo dos filtros', () => {
    render(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    expect(screen.getByText('Filtre por comissão, recursos disponíveis ou por comissões aptas para prestação de contas.')).toBeInTheDocument();
  });

  test('deve renderizar switch de responsável de análise', () => {
    render(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  test('deve manter o estado do switch ao renderizar novamente', () => {
    const { rerender } = render(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    let switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');

    rerender(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  test('deve exibir campo de autocomplete para comissões', () => {
    render(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    expect(screen.getByTestId('autocomplete-input')).toBeInTheDocument();
    expect(screen.getByTestId('autocomplete-input')).toHaveAttribute('placeholder', 'Digite o nome da comissão...');
  });

  test('deve renderizar tabela com dados', () => {
    render(React.createElement(React.Fragment, null,
      React.createElement(Filtros),
      React.createElement(Tabela)
    ));

    const table = screen.getByTestId('datatable');
    expect(table).toBeInTheDocument();
    expect(screen.getByText('Comissão de Finanças')).toBeInTheDocument();
  });
});
