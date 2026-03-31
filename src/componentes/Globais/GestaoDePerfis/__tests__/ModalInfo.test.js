import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalInfo } from '../ModalInfo';

// ── Mocks ──────────────────────────────────────────────────────────────────────
jest.mock('../../ModalBootstrap', () => ({
    ModalBootstrap: ({
        show,
        onHide,
        titulo,
        bodyText,
        primeiroBotaoOnclick,
        primeiroBotaoTexto,
        primeiroBotaoCss,
    }) =>
        show ? (
            <div data-testid="modal-info">
                <div data-testid="modal-titulo">{titulo}</div>
                <div data-testid="modal-body">{bodyText}</div>
                <button
                    data-testid="btn-primeiro"
                    className={primeiroBotaoCss}
                    onClick={primeiroBotaoOnclick}
                >
                    {primeiroBotaoTexto}
                </button>
                <button data-testid="btn-on-hide" onClick={onHide}>
                    Fechar
                </button>
            </div>
        ) : null,
}));

// ── Helpers ────────────────────────────────────────────────────────────────────
const renderComponent = (overrides = {}) => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: 'Informação',
        texto: 'Texto informativo.',
        primeiroBotaoTexto: 'OK',
        primeiroBotaoCss: 'outline-primary',
        ...overrides,
    };
    const result = render(<ModalInfo {...props} />);
    return { props, ...result };
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('<ModalInfo>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ── Renderização básica ────────────────────────────────────────────────────
    describe('Renderização básica', () => {
        it('renderiza o modal quando show=true', () => {
            renderComponent();
            expect(screen.getByTestId('modal-info')).toBeInTheDocument();
        });

        it('não renderiza nada quando show=false', () => {
            renderComponent({ show: false });
            expect(screen.queryByTestId('modal-info')).not.toBeInTheDocument();
        });

        it('exibe o título passado via prop titulo', () => {
            renderComponent({ titulo: 'Aviso importante' });
            expect(screen.getByTestId('modal-titulo')).toHaveTextContent('Aviso importante');
        });

        it('exibe o texto do corpo passado via prop texto', () => {
            renderComponent({ texto: 'Este é um aviso.' });
            expect(screen.getByTestId('modal-body')).toHaveTextContent('Este é um aviso.');
        });

        it('exibe o texto do primeiro botão', () => {
            renderComponent({ primeiroBotaoTexto: 'Entendi' });
            expect(screen.getByTestId('btn-primeiro')).toHaveTextContent('Entendi');
        });

        it('aplica a classe CSS do primeiro botão', () => {
            renderComponent({ primeiroBotaoCss: 'btn-success' });
            expect(screen.getByTestId('btn-primeiro')).toHaveClass('btn-success');
        });
    });

    // ── Interações ─────────────────────────────────────────────────────────────
    describe('Interações', () => {
        it('chama handleClose ao clicar no primeiro botão', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-primeiro'));
            expect(props.handleClose).toHaveBeenCalledTimes(1);
        });

        it('chama handleClose ao acionar onHide do modal', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-on-hide'));
            expect(props.handleClose).toHaveBeenCalledTimes(1);
        });

        it('chama handleClose apenas uma vez ao clicar no primeiro botão', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-primeiro'));
            expect(props.handleClose).toHaveBeenCalledTimes(1);
        });
    });
});
