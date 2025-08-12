import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EscolheUnidade } from '../index';
import { getUnidades } from '../../../../services/dres/Unidades.service';


jest.mock('../../../../services/dres/Unidades.service', () => ({
  getUnidades: jest.fn()
}));

jest.mock('../ListaDeUnidades', () => ({
  ListaDeUnidades: ({ listaUnidades, acaoAoEscolherUnidade }) => (
    <div data-testid="lista-unidades">
      Lista com {listaUnidades.length} unidades
      <button onClick={() => acaoAoEscolherUnidade(listaUnidades[0])}>Escolher</button>
    </div>
  )
}));

jest.mock('../FiltroDeUnidades', () => ({
  FiltroDeUnidades: ({ handleSubmitFiltros }) => (
    <form onSubmit={(e) => handleSubmitFiltros(e, { nome_ou_codigo: 'Escola A' })}>
      <button type="submit">Filtrar</button>
    </form>
  )
}));

jest.mock('../../../../utils/Loading', () => () => <div data-testid="loading">Loading...</div>);

jest.mock('../../Mensagens/MsgImgCentralizada', () => ({
  MsgImgCentralizada: ({ texto }) => <div data-testid="mensagem-vazia">{texto}</div>
}));

describe('EscolheUnidade', () => {
  const mockLista = [
    {
      uuid: '1',
      nome: 'EM Escola A',
      nome_com_tipo: 'EM Escola A',
      codigo_eol: '123456',
      tipo_unidade: 'EM',
      associacao_nome: 'Assoc A',
      associacao_uuid: 'assoc-1',
      visao: 'visao-1'
    }
  ];

  const renderComponent = (visao = 'DRE', onSelecionaUnidade = jest.fn()) =>
    render(
      <EscolheUnidade
        dre_uuid="dre-uuid"
        visao={visao}
        onSelecionaUnidade={onSelecionaUnidade}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mostra mensagem inicial de instrução quando filtro está vazio', async () => {
    renderComponent();

    const mensagem = await screen.findByTestId('mensagem-vazia');
    expect(mensagem).toHaveTextContent('Use parte do nome ou código EOL');
  });

  it('Carrega unidades, com erro', async () => {
    getUnidades.mockRejectedValue({})

    renderComponent();

    await waitFor(() => {
      expect(getUnidades).not.toHaveBeenCalled();
    });
  });

  it('mostra loading, chama API e renderiza lista se resultado encontrado', async () => {
    getUnidades.mockResolvedValueOnce(mockLista);

    renderComponent();

    fireEvent.click(screen.getByText('Filtrar'));

    await waitFor(() => {
      expect(getUnidades).toHaveBeenCalledWith('dre-uuid', 'Escola A');
    });

    expect(await screen.findByTestId('lista-unidades')).toHaveTextContent('Lista com 1 unidades');
  });

  it('mostra mensagem de vazio após filtro com nenhum resultado', async () => {
    getUnidades.mockResolvedValueOnce([]);

    renderComponent();

    fireEvent.click(screen.getByText('Filtrar'));

    await waitFor(() => {
      expect(getUnidades).toHaveBeenCalledWith('dre-uuid', 'Escola A');
    });

    expect(await screen.findByTestId('mensagem-vazia')).toHaveTextContent('Não foi encontrada nenhuma unidade');
  });

  it('executa callback ao escolher unidade', async () => {
    getUnidades.mockResolvedValueOnce(mockLista);
    const onSelecionaUnidade = jest.fn();

    renderComponent('DRE', onSelecionaUnidade);

    fireEvent.click(screen.getByText('Filtrar'));

    const btnEscolher = await screen.findByText('Escolher');
    fireEvent.click(btnEscolher);

    expect(onSelecionaUnidade).toHaveBeenCalledWith(mockLista[0]);
  });

  it('atualiza mensagem corretamente quando visao for SME', async () => {
    renderComponent('SME');

    fireEvent.click(screen.getByText('Filtrar'));

    const mensagem = await screen.findByTestId('mensagem-vazia');
    expect(mensagem).toHaveTextContent('Não foi encontrada nenhuma unidade que corresponda ao filtro aplicado.');
  });
});
