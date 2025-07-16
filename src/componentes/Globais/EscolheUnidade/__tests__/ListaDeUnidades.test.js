import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListaDeUnidades } from '../ListaDeUnidades';


jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props) => <span data-testid="fa-icon">{props.icon.iconName}</span>
}));

jest.mock('../../TableTags', () => ({
  TableTags: ({ data }) => <div data-testid="table-tags">{data.nome}</div>
}));

jest.mock('../../ModalLegendaInformacao/LegendaInformacao', () => ({
  LegendaInformacao: ({ showModalLegendaInformacao }) =>
    showModalLegendaInformacao ? <div data-testid="modal-legenda">Legenda Ativa</div> : null
}));

const mockUnidades = [
  {
    uuid: '1',
    nome: 'Escola A',
    nome_com_tipo: 'EM Escola A',
    codigo_eol: '123456',
    tipo_unidade: 'EM',
    associacao_nome: 'Assoc A',
    associacao_uuid: 'assoc-1',
    visao: 'visao-1'
  }
];

describe('ListaDeUnidades', () => {
  const mockSetShowModalLegenda = jest.fn();
  const mockAcaoEscolher = jest.fn();

  const renderComponent = (showModalLegenda = false) =>
    render(
      <ListaDeUnidades
        listaUnidades={mockUnidades}
        rowsPerPage={5}
        acaoAoEscolherUnidade={mockAcaoEscolher}
        textoAcaoEscolher="Selecionar"
        showModalLegendaInformacao={showModalLegenda}
        setShowModalLegendaInformacao={mockSetShowModalLegenda}
      />
    );

  it('renderiza colunas e dados da unidade', () => {
    renderComponent();

    expect(screen.getByText('Código Eol')).toBeInTheDocument();
    expect(screen.getByText('Unidade educacional')).toBeInTheDocument();
    expect(screen.getByText('Informações')).toBeInTheDocument();
    expect(screen.getByText('Ação')).toBeInTheDocument();

    expect(screen.getByText('123456')).toBeInTheDocument();
    expect(screen.getByText('EM Escola A')).toBeInTheDocument();
    expect(screen.getByText('Selecionar')).toBeInTheDocument();
  });

  it('renderiza o componente LegendaInformacao quando ativado', () => {
    renderComponent(true);
    expect(screen.getByTestId('modal-legenda')).toBeInTheDocument();
  });

  it('aciona acaoAoEscolherUnidade ao clicar no botão de ação', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Selecionar'));

    expect(mockAcaoEscolher).toHaveBeenCalledTimes(1);
    expect(mockAcaoEscolher).toHaveBeenCalledWith({
      uuid: '1',
      nome: 'Escola A',
      codigo_eol: '123456',
      tipo_unidade: 'EM',
      associacao_nome: 'Assoc A',
      associacao_uuid: 'assoc-1',
      visao: 'visao-1'
    });
  });

  it('renderiza corretamente o ícone de ação', () => {
    renderComponent();
    expect(screen.getByTestId('fa-icon')).toHaveTextContent('key');
  });

  it('renderiza o TableTags com dados corretos', () => {
    renderComponent();
    expect(screen.getByTestId('table-tags')).toHaveTextContent('Escola A');
  });
});
