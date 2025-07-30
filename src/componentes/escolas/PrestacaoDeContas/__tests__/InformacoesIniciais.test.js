import { render, screen, waitFor } from '@testing-library/react';
import { InformacoesIniciais } from '../InformacoesIniciais';

// Mock da função de serviço
jest.mock('../../../../services/escolas/PrestacaoDeContas.service', () => ({
  getFiqueDeOlhoPrestacoesDeContas: jest.fn(),
}));

import { getFiqueDeOlhoPrestacoesDeContas } from '../../../../services/escolas/PrestacaoDeContas.service';

describe('InformacoesIniciais', () => {
  it('renderiza o HTML retornado pelo serviço', async () => {
    const mockHtml = '<p><strong>Preste atenção nas pendências</strong></p>';

    getFiqueDeOlhoPrestacoesDeContas.mockResolvedValue({
      detail: mockHtml,
    });

    render(<InformacoesIniciais />);

    await waitFor(() => {
      expect(screen.getByText(/Preste atenção nas pendências/i)).toBeInTheDocument();
    });
  });

  it('lida com erro na chamada do serviço sem quebrar', async () => {
    console.error = jest.fn(); // evitar log no console

    getFiqueDeOlhoPrestacoesDeContas.mockRejectedValue(new Error('Erro na API'));

    render(<InformacoesIniciais />);

  });
});
