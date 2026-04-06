import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalConfirmDeletePerfil } from '../ModalConfirmDeletePerfil';

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
        segundoBotaoCss,
        segundoBotaoTexto,
    }) =>
        show ? (
            <div data-testid="modal-confirm-delete">
                <div data-testid="modal-titulo">{titulo}</div>
                <div data-testid="modal-body">{bodyText}</div>
                <button
                    data-testid="btn-primeiro"
                    className={primeiroBotaoCss}
                    onClick={primeiroBotaoOnclick}
                >
                    {primeiroBotaoTexto}
                </button>
                {segundoBotaoOnclick && segundoBotaoTexto ? (
                    <button
                        data-testid="btn-segundo"
                        className={segundoBotaoCss}
                        onClick={segundoBotaoOnclick}
                    >
                        {segundoBotaoTexto}
                    </button>
                ) : null}
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
        titulo: 'Excluir perfil',
        texto: 'Deseja realmente excluir este perfil?',
        primeiroBotaoTexto: 'Cancelar',
        primeiroBotaoCss: 'outline-primary',
        onDeletePerfilTrue: jest.fn(),
        segundoBotaoCss: 'danger',
        segundoBotaoTexto: 'Excluir',
        ...overrides,
    };
    const result = render(<ModalConfirmDeletePerfil {...props} />);
    return { props, ...result };
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('<ModalConfirmDeletePerfil>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ── Renderização básica ────────────────────────────────────────────────────
    describe('Renderização básica', () => {
        it('renderiza o modal quando show=true', () => {
            renderComponent();
            expect(screen.getByTestId('modal-confirm-delete')).toBeInTheDocument();
        });

        it('não renderiza nada quando show=false', () => {
            renderComponent({ show: false });
            expect(screen.queryByTestId('modal-confirm-delete')).not.toBeInTheDocument();
        });

        it('exibe o título passado via prop titulo', () => {
            renderComponent({ titulo: 'Confirmar exclusão' });
            expect(screen.getByTestId('modal-titulo')).toHaveTextContent('Confirmar exclusão');
        });

        it('exibe o texto do corpo passado via prop texto', () => {
            renderComponent({ texto: 'Tem certeza que deseja excluir?' });
            expect(screen.getByTestId('modal-body')).toHaveTextContent(
                'Tem certeza que deseja excluir?'
            );
        });

        it('exibe o texto do primeiro botão', () => {
            renderComponent({ primeiroBotaoTexto: 'Cancelar' });
            expect(screen.getByTestId('btn-primeiro')).toHaveTextContent('Cancelar');
        });

        it('exibe o texto do segundo botão', () => {
            renderComponent({ segundoBotaoTexto: 'Excluir' });
            expect(screen.getByTestId('btn-segundo')).toHaveTextContent('Excluir');
        });

        it('não renderiza segundo botão quando onDeletePerfilTrue não é fornecido', () => {
            renderComponent({ onDeletePerfilTrue: undefined });
            expect(screen.queryByTestId('btn-segundo')).not.toBeInTheDocument();
        });

        it('não renderiza segundo botão quando segundoBotaoTexto não é fornecido', () => {
            renderComponent({ segundoBotaoTexto: undefined });
            expect(screen.queryByTestId('btn-segundo')).not.toBeInTheDocument();
        });

        it('aplica a classe CSS do primeiro botão', () => {
            renderComponent({ primeiroBotaoCss: 'outline-secondary' });
            expect(screen.getByTestId('btn-primeiro')).toHaveClass('outline-secondary');
        });

        it('aplica a classe CSS do segundo botão', () => {
            renderComponent({ segundoBotaoCss: 'danger' });
            expect(screen.getByTestId('btn-segundo')).toHaveClass('danger');
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

        it('chama onDeletePerfilTrue ao clicar no segundo botão', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-segundo'));
            expect(props.onDeletePerfilTrue).toHaveBeenCalledTimes(1);
        });

        it('não chama onDeletePerfilTrue ao clicar no primeiro botão', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-primeiro'));
            expect(props.onDeletePerfilTrue).not.toHaveBeenCalled();
        });

        it('não chama handleClose ao clicar no segundo botão', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByTestId('btn-segundo'));
            expect(props.handleClose).not.toHaveBeenCalled();
        });
    });
});
