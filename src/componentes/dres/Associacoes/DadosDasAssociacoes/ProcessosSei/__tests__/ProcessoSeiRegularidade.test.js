import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

jest.mock('react-text-mask', () => ({
  __esModule: true,
  default: ({ mask, guide, showMask, ...props }) => <input {...props} />,
}));

jest.mock('../../../../../../services/dres/Associacoes.service');
jest.mock('../../../../../../services/visoes.service');

jest.mock('../../../../../../utils/Loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

/* eslint-disable-next-line import/first */
import { ProcessoSeiRegularidade } from '../ProcessoSeiRegularidade';
/* eslint-disable-next-line import/first */
import { updateAssociacao } from '../../../../../../services/dres/Associacoes.service';
/* eslint-disable-next-line import/first */
import { visoesService } from '../../../../../../services/visoes.service';

const baseDadosDaAssociacao = {
  dados_da_associacao: {
    uuid: 'a1',
    processo_regularidade: '1234.5678/0000001-0',
  },
};

const setupDefaultMocks = () => {
  visoesService.getPermissoes = jest.fn().mockReturnValue(true);
  updateAssociacao.mockResolvedValue({ status: 200 });
};

// Helper: aguarda o input estar visível (loading=false)
const getInput = () => screen.getByPlaceholderText('Número do processo SEI');

describe('ProcessoSeiRegularidade Testes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  test('1. Renderiza sem erros', async () => {
    const { container } = render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);
    expect(container).toBeDefined();
    await waitFor(() => {
      expect(getInput()).toBeInTheDocument();
    });
  });

  test('2. Exibe o Loading momentaneamente e depois o formulário', async () => {
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(getInput()).toBeInTheDocument();
    });
  });

  test('3. Exibe o título "Processos SEI"', async () => {
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(screen.getByText('Processos SEI')).toBeInTheDocument();
    });
  });

  test('4. Input exibe o valor inicial de processo_regularidade', async () => {
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(getInput()).toHaveValue('1234.5678/0000001-0');
    });
  });

  test('5. Input fica desabilitado quando getPermissoes retorna false', async () => {
    visoesService.getPermissoes = jest.fn().mockReturnValue(false);
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(getInput()).toBeDisabled();
    });
  });

  test('6. Botão Salvar fica desabilitado quando getPermissoes retorna false', async () => {
    visoesService.getPermissoes = jest.fn().mockReturnValue(false);
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      const botao = screen.getByRole('button', { name: 'Salvar' });
      expect(botao).toBeDisabled();
    });
  });

  test('7. Input e botão habilitados quando getPermissoes retorna true', async () => {
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(getInput()).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Salvar' })).not.toBeDisabled();
    });
  });

  test('8. Submeter o form chama updateAssociacao com uuid e payload corretos', async () => {
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(getInput()).toBeInTheDocument();
    });

    const input = getInput();
    fireEvent.change(input, { target: { name: 'processo_regularidade', value: '9999.8888/0000002-1' } });

    const form = input.closest('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(updateAssociacao).toHaveBeenCalledWith('a1', {
        processo_regularidade: '9999.8888/0000002-1',
      });
    });
  });

  test('9. Sucesso (status 200) atualiza o estado local sem erros', async () => {
    updateAssociacao.mockResolvedValue({ status: 200 });
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(getInput()).toBeInTheDocument();
    });

    const form = getInput().closest('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(updateAssociacao).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(getInput()).toBeInTheDocument();
    });
  });

  test('10. Resposta com status diferente de 200 não quebra a aplicação', async () => {
    updateAssociacao.mockResolvedValue({ status: 400 });
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(getInput()).toBeInTheDocument();
    });

    const form = getInput().closest('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(updateAssociacao).toHaveBeenCalled();
    });
  });

  test.skip('11. Erro (rejeição da promise) é tratado sem crash', async () => {
    updateAssociacao.mockRejectedValue(new Error('Erro de rede'));
    render(<ProcessoSeiRegularidade dadosDaAssociacao={baseDadosDaAssociacao} />);

    await waitFor(() => {
      expect(getInput()).toBeInTheDocument();
    });

    const form = getInput().closest('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(updateAssociacao).toHaveBeenCalled();
    });

    expect(getInput()).toBeInTheDocument();
  });

  test('12. Renderiza com processo_regularidade indefinido (campo vazio)', async () => {
    const dados = { dados_da_associacao: { uuid: 'a2', processo_regularidade: undefined } };
    render(<ProcessoSeiRegularidade dadosDaAssociacao={dados} />);

    await waitFor(() => {
      expect(getInput()).toBeInTheDocument();
    });
  });
});
