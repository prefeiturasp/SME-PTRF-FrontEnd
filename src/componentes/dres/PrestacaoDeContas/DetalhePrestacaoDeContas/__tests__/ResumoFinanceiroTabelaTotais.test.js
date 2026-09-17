import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResumoFinanceiroTabelaTotais } from '../ResumoFinanceiroTabelaTotais';
import { useRecursoSelecionadoContext } from '../../../../../context/RecursoSelecionado';

jest.mock('../../../../../context/RecursoSelecionado', () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

const valorTemplate = (valor) => `R$ ${valor ?? 0}`;

describe('ResumoFinanceiroTabelaTotais', () => {
    beforeEach(() => {
        useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: null });
    });

    it('não renderiza a tabela quando infoAta não possui totais', () => {
        const { container } = render(<ResumoFinanceiroTabelaTotais infoAta={{}} valorTemplate={valorTemplate} />);
        expect(container.querySelector('table')).not.toBeInTheDocument();
    });

    it('renderiza a tabela de totais com os rótulos padrão quando não há saldo reprogramado', () => {
        render(<ResumoFinanceiroTabelaTotais infoAta={{ totais: { saldo_reprogramado_custeio: 10 } }} valorTemplate={valorTemplate} />);
        expect(screen.getByText(/Saldo inicial/)).toHaveTextContent('(do período anterior)');
        const saldoFinal = screen.getByText(/^Saldo\s*\(para o próximo período\)$/);
        expect(saldoFinal).toBeInTheDocument();
    });

    it('exibe rótulos de "reprogramado" quando existe saldo reprogramado', () => {
        useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: { existe_saldo_reprogramado: true } });
        render(<ResumoFinanceiroTabelaTotais infoAta={{ totais: { saldo_reprogramado_custeio: 10 } }} valorTemplate={valorTemplate} />);
        expect(screen.getByText(/Saldo inicial/)).toHaveTextContent('(reprogramado do período anterior)');
        expect(screen.getByText(/^Saldo reprogramado \(para o próximo período\)$/)).toBeInTheDocument();
    });

    it('calcula saldo final somando saldo atual e despesas não conciliadas', () => {
        render(<ResumoFinanceiroTabelaTotais infoAta={{ totais: {
            saldo_atual_custeio: 100, despesas_nao_conciliadas_custeio: 5,
            saldo_atual_capital: 50, despesas_nao_conciliadas_capital: 2,
            saldo_atual_livre: 20,
            saldo_atual_total: 170, despesas_nao_conciliadas: 7,
        } }} valorTemplate={valorTemplate} />);
        expect(screen.getByText('R$ 105')).toBeInTheDocument();
        expect(screen.getByText('R$ 52')).toBeInTheDocument();
        expect(screen.getByText('R$ 177')).toBeInTheDocument();
    });
});
