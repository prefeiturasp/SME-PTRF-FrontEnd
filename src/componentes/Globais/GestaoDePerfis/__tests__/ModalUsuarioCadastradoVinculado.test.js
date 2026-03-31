import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalUsuarioCadastradoVinculado } from '../ModalUsuarioCadastradoVinculado';

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
            <div data-testid="modal-usuario-cadastrado">
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
        titulo: 'Usuário cadastrado',
        texto: 'O usuário já está cadastrado e vinculado.',
        primeiroBotaoTexto: 'OK',
        primeiroBotaoCss: 'outline-primary',
        ...overrides,
    };
    const result = render(<ModalUsuarioCadastradoVinculado {...props} />);
    return { props, ...result };
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('<ModalUsuarioCadastradoVinculado>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ── Renderização básica ────────────────────────────────────────────────────
    describe('Renderização básica', () => {
        it('renderiza o modal quando show=true', () => {
            renderComponent();
            expect(screen.getByTestId('modal-usuario-cadastrado')).toBeInTheDocument();
        });

        it('não renderiza nada quando show=false', () => {
            renderComponent({ show: false });
            expect(screen.queryByTestId('modal-usuario-cadastrado')).not.toBeInTheDocument();
        });

        it('exibe o título passado via prop titulo', () => {
            renderComponent({ titulo: 'Usuário vinculado' });
            expect(screen.getByTestId('modal-titulo')).toHaveTextContent('Usuário vinculado');
        });

        it('exibe o texto do corpo passado via prop texto', () => {
            renderComponent({ texto: 'Este usuário já existe.' });
            expect(screen.getByTestId('modal-body')).toHaveTextContent('Este usuário já existe.');
        });

        it('exibe o texto do primeiro botão', () => {
            renderComponent({ primeiroBotaoTexto: 'Entendi' });
            expect(screen.getByTestId('btn-primeiro')).toHaveTextContent('Entendi');
        });

        it('aplica a classe CSS do primeiro botão', () => {
            renderComponent({ primeiroBotaoCss: 'btn-danger' });
            expect(screen.getByTestId('btn-primeiro')).toHaveClass('btn-danger');
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

        it('primeiroBotaoOnclick e onHide apontam para o mesmo handleClose', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-primeiro'));
            fireEvent.click(screen.getByTestId('btn-on-hide'));
            expect(props.handleClose).toHaveBeenCalledTimes(2);
        });
    });
});
