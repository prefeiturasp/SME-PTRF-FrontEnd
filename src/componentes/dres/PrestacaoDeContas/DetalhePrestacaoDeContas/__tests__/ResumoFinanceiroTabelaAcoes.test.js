import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumoFinanceiroTabelaAcoes } from '../ResumoFinanceiroTabelaAcoes';
import { useRecursoSelecionadoContext } from '../../../../../context/RecursoSelecionado';

jest.mock('../../../../../context/RecursoSelecionado', () => ({
    useRecursoSelecionadoContext: jest.fn(),
}));

const valorTemplate = (valor) => `R$ ${valor ?? 0}`;

describe('ResumoFinanceiroTabelaAcoes', () => {
    beforeEach(() => {
        useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: null });
    });

    it('não renderiza nada quando infoAta não possui ações', () => {
        const { container } = render(
            <ResumoFinanceiroTabelaAcoes infoAta={{}} valorTemplate={valorTemplate} toggleBtnTabelaAcoes={jest.fn()} clickBtnTabelaAcoes={{}} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('não renderiza nada quando infoAta é null', () => {
        const { container } = render(
            <ResumoFinanceiroTabelaAcoes infoAta={null} valorTemplate={valorTemplate} toggleBtnTabelaAcoes={jest.fn()} clickBtnTabelaAcoes={{}} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renderiza um card por ação com o nome da ação e os totais calculados', () => {
        const infoAta = {
            acoes: [
                {
                    acao_associacao_uuid: 'acao-1',
                    acao_associacao_nome: 'Ação PTRF',
                    saldo_atual_custeio: 100, despesas_nao_conciliadas_custeio: 5,
                    saldo_atual_capital: 50, despesas_nao_conciliadas_capital: 2,
                    saldo_atual_livre: 20,
                    saldo_atual_total: 170, despesas_nao_conciliadas: 7,
                },
            ],
        };
        render(
            <ResumoFinanceiroTabelaAcoes infoAta={infoAta} valorTemplate={valorTemplate} toggleBtnTabelaAcoes={jest.fn()} clickBtnTabelaAcoes={{}} />
        );
        expect(screen.getByText('Ação PTRF')).toBeInTheDocument();
        expect(screen.getByText('R$ 105')).toBeInTheDocument();
        expect(screen.getByText(/Saldo inicial/)).toHaveTextContent('(do período anterior)');
    });

    it('exibe "reprogramado" nos rótulos quando existe saldo reprogramado', () => {
        useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: { existe_saldo_reprogramado: true } });
        const infoAta = { acoes: [{ acao_associacao_uuid: 'acao-1', acao_associacao_nome: 'Ação PTRF' }] };
        render(
            <ResumoFinanceiroTabelaAcoes infoAta={infoAta} valorTemplate={valorTemplate} toggleBtnTabelaAcoes={jest.fn()} clickBtnTabelaAcoes={{}} />
        );
        expect(screen.getByText(/Saldo inicial/)).toHaveTextContent('(reprogramado do período anterior)');
    });

    it('chama toggleBtnTabelaAcoes ao clicar no botão do título ou no ícone, e exibe a seção quando ativa', () => {
        const toggleBtnTabelaAcoes = jest.fn();
        const infoAta = { acoes: [{ acao_associacao_uuid: 'acao-1', acao_associacao_nome: 'Ação PTRF' }] };
        const { container, rerender } = render(
            <ResumoFinanceiroTabelaAcoes infoAta={infoAta} valorTemplate={valorTemplate} toggleBtnTabelaAcoes={toggleBtnTabelaAcoes} clickBtnTabelaAcoes={{}} />
        );
        expect(container.querySelector('#collapse0')).not.toHaveClass('show');

        fireEvent.click(screen.getByText('Ação PTRF'));
        expect(toggleBtnTabelaAcoes).toHaveBeenCalledWith('acao-1');

        const botoes = container.querySelectorAll('button');
        fireEvent.click(botoes[1]);
        expect(toggleBtnTabelaAcoes).toHaveBeenCalledTimes(2);

        rerender(
            <ResumoFinanceiroTabelaAcoes infoAta={infoAta} valorTemplate={valorTemplate} toggleBtnTabelaAcoes={toggleBtnTabelaAcoes} clickBtnTabelaAcoes={{ 'acao-1': true }} />
        );
        expect(container.querySelector('#collapse0')).toHaveClass('show');
        expect(container.querySelector('svg[data-icon="chevron-up"]')).toBeInTheDocument();
    });
});
