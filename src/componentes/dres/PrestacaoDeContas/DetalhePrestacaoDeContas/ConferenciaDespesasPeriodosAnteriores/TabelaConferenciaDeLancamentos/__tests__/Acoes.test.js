import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Acoes } from '../Acoes';

describe('Acoes (ConferenciaDespesasPeriodosAnteriores)', () => {
    const defaultProps = {
        totalLancamentosSelecionados: 2,
        totalLancamentos: 10,
        exibirBtnMarcarComoCorreto: true,
        exibirBtnMarcarComoNaoConferido: true,
        desmarcarTodos: jest.fn(),
        marcarComoCorreto: jest.fn(),
        marcarComoNaoConferido: jest.fn(),
        detalharAcertos: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('exibe a contagem de lançamentos selecionados no plural e o total', () => {
        render(<Acoes {...defaultProps} />);
        expect(screen.getByText(/2 lançamentos selecionados \/ 10 totais/)).toBeInTheDocument();
    });

    it('exibe a contagem no singular quando há apenas 1 lançamento selecionado', () => {
        render(<Acoes {...defaultProps} totalLancamentosSelecionados={1} />);
        expect(screen.getByText(/1 lançamento selecionado \/ 10 totais/)).toBeInTheDocument();
    });

    it('renderiza os botões "Marcar como Correto" e "Marcar como não conferido" quando habilitados', () => {
        render(<Acoes {...defaultProps} />);
        expect(screen.getByText('Marcar como Correto')).toBeInTheDocument();
        expect(screen.getByText('Marcar como não conferido')).toBeInTheDocument();
    });

    it('não renderiza os botões condicionais quando desabilitados', () => {
        render(<Acoes {...defaultProps} exibirBtnMarcarComoCorreto={false} exibirBtnMarcarComoNaoConferido={false} />);
        expect(screen.queryByText('Marcar como Correto')).not.toBeInTheDocument();
        expect(screen.queryByText('Marcar como não conferido')).not.toBeInTheDocument();
    });

    it('chama os callbacks correspondentes ao clicar em cada botão', () => {
        render(<Acoes {...defaultProps} />);

        fireEvent.click(screen.getByText('Cancelar'));
        expect(defaultProps.desmarcarTodos).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText('Marcar como Correto'));
        expect(defaultProps.marcarComoCorreto).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText('Marcar como não conferido'));
        expect(defaultProps.marcarComoNaoConferido).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText('Detalhar acertos'));
        expect(defaultProps.detalharAcertos).toHaveBeenCalledTimes(1);
    });

    it('sempre renderiza os botões "Cancelar" e "Detalhar acertos"', () => {
        render(<Acoes {...defaultProps} exibirBtnMarcarComoCorreto={false} exibirBtnMarcarComoNaoConferido={false} />);
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
        expect(screen.getByText('Detalhar acertos')).toBeInTheDocument();
    });
});
