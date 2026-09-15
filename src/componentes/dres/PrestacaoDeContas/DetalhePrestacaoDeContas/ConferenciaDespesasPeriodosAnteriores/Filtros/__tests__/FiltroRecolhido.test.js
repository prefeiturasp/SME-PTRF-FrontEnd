import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltroRecolhido } from '../FiltroRecolhido';

describe('FiltroRecolhido (ConferenciaDespesasPeriodosAnteriores)', () => {
    const defaultProps = {
        stateFiltros: { filtrar_por_acao: '' },
        tabelasDespesa: {
            acoes_associacao: [
                { uuid: 'uuid-1', nome: 'Ação 1' },
                { uuid: 'uuid-2', nome: 'Ação 2' },
            ],
        },
        handleChangeFiltros: jest.fn(),
        btnMaisFiltros: false,
        setBtnMaisFiltros: jest.fn(),
        limpaFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza o select de ação com as opções da tabela e propaga a seleção', async () => {
        const user = userEvent.setup();
        const handleChangeFiltros = jest.fn();
        render(<FiltroRecolhido {...defaultProps} handleChangeFiltros={handleChangeFiltros} />);

        expect(screen.getByRole('option', { name: 'Ação 1' })).toBeInTheDocument();
        await user.selectOptions(screen.getByLabelText('Ação'), 'uuid-1');
        expect(handleChangeFiltros).toHaveBeenCalledWith('filtrar_por_acao', 'uuid-1');
    });

    it('renderiza apenas a opção padrão quando não há acoes_associacao', () => {
        const { rerender } = render(<FiltroRecolhido {...defaultProps} tabelasDespesa={{ acoes_associacao: [] }} />);
        expect(screen.getByLabelText('Ação').querySelectorAll('option').length).toBe(1);

        rerender(<FiltroRecolhido {...defaultProps} tabelasDespesa={{}} />);
        expect(screen.getByLabelText('Ação').querySelectorAll('option').length).toBe(1);
    });

    it('mantém o valor selecionado a partir de stateFiltros', () => {
        render(<FiltroRecolhido {...defaultProps} stateFiltros={{ filtrar_por_acao: 'uuid-2' }} />);
        expect(screen.getByLabelText('Ação')).toHaveValue('uuid-2');
    });

    it('renderiza o componente Botoes e propaga seus cliques', async () => {
        const user = userEvent.setup();
        const setBtnMaisFiltros = jest.fn();
        const limpaFiltros = jest.fn();
        const handleSubmitFiltros = jest.fn();

        const { container } = render(
            <FiltroRecolhido
                {...defaultProps}
                setBtnMaisFiltros={setBtnMaisFiltros}
                limpaFiltros={limpaFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
            />
        );

        const buttons = container.querySelectorAll('button');
        expect(buttons.length).toBe(3);

        await user.click(buttons[0]);
        expect(setBtnMaisFiltros).toHaveBeenCalledWith(true);

        await user.click(buttons[1]);
        expect(limpaFiltros).toHaveBeenCalledTimes(1);

        await user.click(buttons[2]);
        expect(handleSubmitFiltros).toHaveBeenCalledTimes(1);
    });
});
