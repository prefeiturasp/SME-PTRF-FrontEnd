import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LevantamentoDePrioridades from '../index';
import { downloadPdfLevantamentoPrioridades } from '../../../../../../../services/escolas/Paa.service';
import { ASSOCIACAO_UUID } from '../../../../../../../services/auth.service';

// Mock dos serviços externos
jest.mock('../../../../../../../services/escolas/Paa.service', () => ({
  downloadPdfLevantamentoPrioridades: jest.fn(),
}));

jest.mock('../../../../../../../services/auth.service', () => ({
  ASSOCIACAO_UUID: 'ASSOCIACAO_UUID',
}));

// Mock do FontAwesomeIcon (para não depender de ícones reais)
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, spin }) => (
    <span data-testid="fa-icon" data-icon={icon?.iconName || 'mock'} data-spin={spin ? 'true' : 'false'} />
  ),
}));

describe('LevantamentoDePrioridades', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('ASSOCIACAO_UUID', 'uuid-mockado');
  });

  it('renderiza corretamente o conteúdo estático e o botão de download', () => {
    render(<LevantamentoDePrioridades />);

    expect(
      screen.getByText(/A etapa do levantamento de atividades e prioridades/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Após esta etapa, a APM realiza um trabalho de previsão/i)
    ).toBeInTheDocument();

    const botao = screen.getByRole('button', { name: /faça download do pdf/i });
    expect(botao).toBeInTheDocument();
    expect(botao).not.toBeDisabled();

    const icone = screen.getByTestId('fa-icon');
    expect(icone).toHaveAttribute('data-icon', expect.stringContaining('download'));
  });

  it('chama downloadPdfLevantamentoPrioridades com UUID do localStorage ao clicar', async () => {
    downloadPdfLevantamentoPrioridades.mockResolvedValueOnce();

    render(<LevantamentoDePrioridades />);

    const botao = screen.getByRole('button', { name: /faça download do pdf/i });
    fireEvent.click(botao);

    await waitFor(() => {
      expect(downloadPdfLevantamentoPrioridades).toHaveBeenCalledWith('uuid-mockado');
    });
  });

  it('exibe o spinner enquanto faz o download e desativa o botão', async () => {
    let resolver;
    const promise = new Promise((resolve) => (resolver = resolve));
    downloadPdfLevantamentoPrioridades.mockReturnValue(promise);

    render(<LevantamentoDePrioridades />);

    const botao = screen.getByRole('button', { name: /faça download do pdf/i });
    fireEvent.click(botao);

    expect(botao).toBeDisabled();
    expect(screen.getByTestId('fa-icon')).toHaveAttribute('data-spin', 'true');

    resolver();
    await waitFor(() => expect(botao).not.toBeDisabled());
    expect(screen.getByTestId('fa-icon')).toHaveAttribute('data-spin', 'false');
  });

  it('lida com erro ao baixar o PDF sem quebrar o componente', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    downloadPdfLevantamentoPrioridades.mockRejectedValueOnce(new Error('Falha no download'));

    render(<LevantamentoDePrioridades />);

    const botao = screen.getByRole('button', { name: /faça download do pdf/i });
    fireEvent.click(botao);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/Erro ao baixar PDF/), expect.any(Error));
    });

    expect(botao).not.toBeDisabled();
    consoleSpy.mockRestore();
  });
});
