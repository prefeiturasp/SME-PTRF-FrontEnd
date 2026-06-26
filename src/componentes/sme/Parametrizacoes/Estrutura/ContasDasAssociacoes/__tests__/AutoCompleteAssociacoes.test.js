import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AutoCompleteAssociacoes from '../AutoCompleteAssociacoes';

const mockAssociacoes = [
  {
    nome: 'Associação AAA',
    uuid: "ba8b96ef-f05c-41f3-af10-73753490c545",
    unidade: {
      nome_com_tipo: 'EMEF AAA',
      codigo_eol: '100001',
    },
  },
  {
    nome: 'Associação BBB',
    uuid: "ba8b96ef-f05c-41f3-af10-73753490c544",
    unidade: {
      nome_com_tipo: 'EMEF BBB',
      codigo_eol: '100002',
    },
  },
  {
    nome: 'Associação CCCC',
    uuid: "ba8b96ef-f05c-41f3-af10-73753490c543",
    unidade: {
      nome_com_tipo: 'EMEF CCCC',
      codigo_eol: '100003',
    },
  }
];

const mockRecebeAutoComplete = jest.fn();

describe('AutoCompleteAssociacoes', () => {
  it('should render correctly with initial state', () => {
    render(
      <AutoCompleteAssociacoes
        todasAsAssociacoesAutoComplete={mockAssociacoes}
        recebeAutoComplete={mockRecebeAutoComplete}
      />
    );

    expect(screen.getByPlaceholderText('')).toBeInTheDocument(); // Verifica se o componente está renderizado
  });

  it('filtrar associações ao iniciar a digitação o nome da unidade', async () => {
    render(
      <AutoCompleteAssociacoes
        todasAsAssociacoesAutoComplete={mockAssociacoes}
        recebeAutoComplete={mockRecebeAutoComplete}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'AAA');
    
    // Aguarda a aparição do listbox após a digitação
    await waitFor(() => {
      const listbox = document.querySelector('[role="listbox"]');
      expect(listbox).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('EMEF AAA')).toBeInTheDocument();
  });

});
