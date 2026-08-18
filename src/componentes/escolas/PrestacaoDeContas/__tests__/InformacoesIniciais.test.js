import { render, screen } from '@testing-library/react';
import { InformacoesIniciais } from '../InformacoesIniciais';
import { getFiqueDeOlhoPrestacoesDeContas } from '../../../../services/escolas/PrestacaoDeContas.service';
import { useRecursoSelecionadoContext } from '../../../../context/RecursoSelecionado';

// Mock da função de serviço
jest.mock('../../../../services/escolas/PrestacaoDeContas.service', () => ({
  getFiqueDeOlhoPrestacoesDeContas: jest.fn(),
}));
jest.mock('../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

describe('Componente <InformacoesIniciais />', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Valor padrão do contexto para os testes
        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: { uuid: 'recurso-uuid-123' },
        });
    });

    it('renderiza o HTML retornado pelo serviço', async () => {
        const mockHtml = '<p><strong>Preste atenção nas pendências</strong></p>';

        // Mock com a estrutura exata esperada pelo componente: response.results[0].texto
        getFiqueDeOlhoPrestacoesDeContas.mockResolvedValue({
            results: [
                { texto: mockHtml }
            ]
        });

        render(<InformacoesIniciais />);

        // findByText aguarda a resolução do useEffect e a renderização do HTML
        const textoRenderizado = await screen.findByText(/Preste atenção nas pendências/i);

        expect(textoRenderizado).toBeInTheDocument();
        expect(getFiqueDeOlhoPrestacoesDeContas).toHaveBeenCalledWith(
            expect.anything(),
            'recurso-uuid-123'
        );
    });

    it('não deve renderizar nada se o retorno estiver vazio', async () => {
        getFiqueDeOlhoPrestacoesDeContas.mockResolvedValue({
            results: [{ texto: '' }]
        });

        const { container } = render(<InformacoesIniciais />);

        // Garante que nada é renderizado no DOM além do wrapper
        expect(container.firstChild).toBeNull();
    });
});
