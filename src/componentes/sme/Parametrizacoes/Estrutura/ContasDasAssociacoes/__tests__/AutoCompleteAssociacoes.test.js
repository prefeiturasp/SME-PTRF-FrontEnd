import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AutoCompleteAssociacoes from '../AutoCompleteAssociacoes';

const mockAssociacoes = [
  { nome: 'Associação AAA', uuid: "ba8b96ef-f05c-41f3-af10-73753490c545" },
  { nome: 'Associação BBB', uuid: "ba8b96ef-f05c-41f3-af10-73753490c544"},
  { nome: 'Associação CCCC', uuid: "ba8b96ef-f05c-41f3-af10-73753490c543"}
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

  it('filtrar associações ao iniciar a digitação o nome da associação', async () => {
    render(
      <AutoCompleteAssociacoes
        todasAsAssociacoesAutoComplete={mockAssociacoes}
        recebeAutoComplete={mockRecebeAutoComplete}
      />
    );

    const input = screen.getByRole('searchbox');
    userEvent.type(input, 'AAA');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('should handle selected associacao', async () => {
    render(
      <AutoCompleteAssociacoes
        todasAsAssociacoesAutoComplete={mockAssociacoes}
        recebeAutoComplete={mockRecebeAutoComplete}
      />
    );

    const input = screen.getByRole('searchbox');
    // userEvent.type(input, 'AAA');
    await waitFor(()=> fireEvent.change(input, { target: { value: 'AAA' } }));
    
    const listbox = screen.getByRole('listbox');
    // await waitFor(()=> console.log(listbox.querySelectorAll('li')));

    // const optionsItems = screen.getAllByRole('option');
    // expect(screen.getByRole('listbox')).toBeInTheDocument();
    // console.log(optionsItems);
    // expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

});