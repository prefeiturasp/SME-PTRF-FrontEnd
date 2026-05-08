import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopoComBotoes } from '../TopoComBotoes';
import { ValidarParcialTesouro } from '../../../../../../../context/DetalharAcertos';

jest.mock('../../../AssociacaoEPeriodoDoCabecalho', () => ({
    __esModule: true,
    default: ({ prestacaoDeContas }) => (
        <div data-testid='associacao-periodo'>Associacao / Periodo</div>
    ),
}));

const renderComponent = ({
    isValorParcialValido = false,
    validaContaAoSalvar = jest.fn(),
    onClickBtnVoltar = jest.fn(),
    prestacaoDeContas = {},
} = {}) => {
    render(
        <ValidarParcialTesouro.Provider value={{ isValorParcialValido }}>
            <TopoComBotoes
                validaContaAoSalvar={validaContaAoSalvar}
                onClickBtnVoltar={onClickBtnVoltar}
                prestacaoDeContas={prestacaoDeContas}
            />
        </ValidarParcialTesouro.Provider>,
    );

    return { validaContaAoSalvar, onClickBtnVoltar };
};

describe('TopoComBotoes', () => {
    describe('renderização inicial', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('deve renderizar o cabeçalho e os botões principais', () => {
            renderComponent();

            expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();

            expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();

            expect(screen.getByText('Lançamentos selecionados')).toBeInTheDocument();
        });

        it('deve renderizar o componente de associação e período', () => {
            renderComponent();

            expect(screen.getByTestId('associacao-periodo')).toBeInTheDocument();
        });
    });

    describe('interações do usuário', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('deve executar a ação de voltar ao clicar no botão Voltar', async () => {
            const user = userEvent.setup();
            const { onClickBtnVoltar } = renderComponent();

            await user.click(screen.getByRole('button', { name: /voltar/i }));

            expect(onClickBtnVoltar).toHaveBeenCalledTimes(1);
        });

        it('deve executar a ação de salvar ao clicar no botão Salvar quando habilitado', async () => {
            const user = userEvent.setup();
            const { validaContaAoSalvar } = renderComponent({
                isValorParcialValido: false,
            });

            await user.click(screen.getByRole('button', { name: /salvar/i }));

            expect(validaContaAoSalvar).toHaveBeenCalledTimes(1);
        });
    });

    describe('branches condicionais (contexto)', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('deve desabilitar o botão Salvar quando isValorParcialValido é true', () => {
            renderComponent({ isValorParcialValido: true });

            expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled();
        });

        it('deve manter o botão Salvar habilitado quando isValorParcialValido é false', () => {
            renderComponent({ isValorParcialValido: false });

            expect(screen.getByRole('button', { name: /salvar/i })).toBeEnabled();
        });
    });
});
