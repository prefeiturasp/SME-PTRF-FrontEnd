import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalUsuarioNaoCadastrado } from '../ModalUsuarioNaoCadastrado';

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
        segundoBotaoOnclick,
        segundoBotaoTexto,
        segundoBotaoCss,
    }) =>
        show ? (
            <div data-testid="modal-usuario-nao-cadastrado">
                <div data-testid="modal-titulo">{titulo}</div>
                <div data-testid="modal-body">{bodyText}</div>
                <button
                    data-testid="btn-primeiro"
                    className={primeiroBotaoCss}
                    onClick={primeiroBotaoOnclick}
                >
                    {primeiroBotaoTexto}
                </button>
                <button
                    data-testid="btn-segundo"
                    className={segundoBotaoCss}
                    onClick={segundoBotaoOnclick}
                >
                    {segundoBotaoTexto}
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
        onCadastrarTrue: jest.fn(),
        titulo: 'Usuário não cadastrado',
        texto: 'O usuário não está cadastrado.',
        primeiroBotaoTexto: 'Cancelar',
        primeiroBotaoCss: 'outline-primary',
        segundoBotaoTexto: 'Cadastrar',
        segundoBotaoCss: 'btn-primary',
        ...overrides,
    };
    const result = render(<ModalUsuarioNaoCadastrado {...props} />);
    return { props, ...result };
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('<ModalUsuarioNaoCadastrado>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ── Renderização básica ────────────────────────────────────────────────────
    describe('Renderização básica', () => {
        it('renderiza o modal quando show=true', () => {
            renderComponent();
            expect(screen.getByTestId('modal-usuario-nao-cadastrado')).toBeInTheDocument();
        });

        it('não renderiza nada quando show=false', () => {
            renderComponent({ show: false });
            expect(screen.queryByTestId('modal-usuario-nao-cadastrado')).not.toBeInTheDocument();
        });

        it('exibe o título passado via prop titulo', () => {
            renderComponent({ titulo: 'Usuário inexistente' });
            expect(screen.getByTestId('modal-titulo')).toHaveTextContent('Usuário inexistente');
        });

        it('exibe o texto do corpo passado via prop texto', () => {
            renderComponent({ texto: 'Este usuário não foi encontrado.' });
            expect(screen.getByTestId('modal-body')).toHaveTextContent('Este usuário não foi encontrado.');
        });

        it('exibe o texto do primeiro botão', () => {
            renderComponent({ primeiroBotaoTexto: 'Fechar' });
            expect(screen.getByTestId('btn-primeiro')).toHaveTextContent('Fechar');
        });

        it('aplica a classe CSS do primeiro botão', () => {
            renderComponent({ primeiroBotaoCss: 'btn-danger' });
            expect(screen.getByTestId('btn-primeiro')).toHaveClass('btn-danger');
        });

        it('exibe o texto do segundo botão', () => {
            renderComponent({ segundoBotaoTexto: 'Confirmar cadastro' });
            expect(screen.getByTestId('btn-segundo')).toHaveTextContent('Confirmar cadastro');
        });

        it('aplica a classe CSS do segundo botão', () => {
            renderComponent({ segundoBotaoCss: 'btn-success' });
            expect(screen.getByTestId('btn-segundo')).toHaveClass('btn-success');
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

        it('chama onCadastrarTrue ao clicar no segundo botão', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-segundo'));
            expect(props.onCadastrarTrue).toHaveBeenCalledTimes(1);
        });

        it('não chama onCadastrarTrue ao clicar no primeiro botão', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-primeiro'));
            expect(props.onCadastrarTrue).not.toHaveBeenCalled();
        });

        it('não chama handleClose ao clicar no segundo botão', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-segundo'));
            expect(props.handleClose).not.toHaveBeenCalled();
        });
    });
});
