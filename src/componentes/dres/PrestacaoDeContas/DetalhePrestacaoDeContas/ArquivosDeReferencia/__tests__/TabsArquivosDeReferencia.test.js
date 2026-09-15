import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabsArquivosDeReferencia } from '../TabsArquivosDeReferencia';

jest.mock('../TabsArquivosDeReferenciaAccordion', () => ({
    TabsArquivosDeReferenciaAccordion: ({ titulo, children }) => (
        <div data-testid={`accordion-${titulo}`}>{children}</div>
    ),
}));
jest.mock('../../ResumoFinanceiroTabelaAcoes', () => ({
    ResumoFinanceiroTabelaAcoes: () => <div data-testid="resumo-tabela-acoes" />,
}));
jest.mock('../../AnalisesDeContaDaPrestacao', () => ({
    AnalisesDeContaDaPrestacao: () => <div data-testid="analises-de-conta" />,
}));
jest.mock('../../ResumoFinanceiroTabelaTotais', () => ({
    ResumoFinanceiroTabelaTotais: () => <div data-testid="resumo-tabela-totais" />,
}));
jest.mock('../../../../../../utils/Loading', () => () => <div data-testid="loading" />);
jest.mock('../ArquivosDeReferenciaVisualizacaoDownload', () => () => <div data-testid="download" />);

describe('TabsArquivosDeReferencia', () => {
    const infoAtaPorConta = { conta_associacao: { uuid: 'conta-1', nome: 'Conta 1' } };

    it('exibe o Loading quando infoAtaPorConta ainda não foi carregado', () => {
        render(<TabsArquivosDeReferencia infoAta={null} infoAtaPorConta={null} prestacaoDeContas={{}} clickBtnEscolheConta={{}} />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.queryByTestId('analises-de-conta')).not.toBeInTheDocument();
    });

    it('exibe o Loading quando infoAtaPorConta não possui conta_associacao com uuid', () => {
        render(<TabsArquivosDeReferencia infoAta={null} infoAtaPorConta={{ conta_associacao: {} }} prestacaoDeContas={{}} clickBtnEscolheConta={{}} />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('renderiza o conteúdo das abas quando infoAtaPorConta está carregado', () => {
        render(
            <TabsArquivosDeReferencia
                infoAta={null}
                infoAtaPorConta={infoAtaPorConta}
                prestacaoDeContas={{}}
                clickBtnEscolheConta={{}}
            />
        );
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        expect(screen.getByTestId('analises-de-conta')).toBeInTheDocument();
        expect(screen.getByTestId('resumo-tabela-totais')).toBeInTheDocument();
        expect(screen.getByTestId('resumo-tabela-acoes')).toBeInTheDocument();
        expect(screen.getByTestId('download')).toBeInTheDocument();
        expect(screen.getByTestId('accordion-Síntese do período de realização da despesa')).toBeInTheDocument();
        expect(screen.getByTestId('accordion-Síntese do período por ação')).toBeInTheDocument();
    });

    it('não renderiza abas de contas quando infoAta.contas está vazio', () => {
        const { container } = render(
            <TabsArquivosDeReferencia infoAta={{ contas: [] }} infoAtaPorConta={infoAtaPorConta} prestacaoDeContas={{}} clickBtnEscolheConta={{}} />
        );
        expect(container.querySelectorAll('a.btn-escolhe-acao').length).toBe(0);
    });

    it('renderiza uma aba por conta e destaca a conta selecionada ao clicar', () => {
        const toggleBtnEscolheConta = jest.fn();
        const exibeAtaPorConta = jest.fn();
        const infoAta = {
            contas: [
                { conta_associacao: { uuid: 'c1', nome: 'Conta A' } },
                { conta_associacao: { uuid: 'c2', nome: 'Conta B' } },
            ],
        };
        render(
            <TabsArquivosDeReferencia
                infoAta={infoAta}
                infoAtaPorConta={infoAtaPorConta}
                prestacaoDeContas={{}}
                clickBtnEscolheConta={{ 0: true }}
                toggleBtnEscolheConta={toggleBtnEscolheConta}
                exibeAtaPorConta={exibeAtaPorConta}
            />
        );
        const abaA = screen.getByText('Conta Conta A');
        const abaB = screen.getByText('Conta Conta B');
        expect(abaA).toHaveClass('btn-escolhe-acao-active');
        expect(abaB).not.toHaveClass('btn-escolhe-acao-active');

        fireEvent.click(abaB);
        expect(toggleBtnEscolheConta).toHaveBeenCalledWith(1);
        expect(exibeAtaPorConta).toHaveBeenCalledWith('Conta B');
    });
});
