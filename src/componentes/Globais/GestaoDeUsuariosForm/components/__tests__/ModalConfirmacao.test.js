import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalConfirmacao } from '../ModalConfirmacao';

// ── ModalBootstrap mock ───────────────────────────────────────────────────────
jest.mock('../../../ModalBootstrap', () => ({
    ModalBootstrap: ({
        show,
        onHide,
        titulo,
        bodyText,
        primeiroBotaoTexto,
        primeiroBotaoCss,
        primeiroBotaoOnclick,
        segundoBotaoTexto,
        segundoBotaoCss,
        segundoBotaoOnclick,
    }) =>
        show ? (
            <div data-testid="modal-bootstrap">
                <span data-testid="titulo">{titulo}</span>
                <span data-testid="body">{bodyText}</span>
                <button
                    data-testid="btn-cancelar"
                    className={primeiroBotaoCss}
                    onClick={primeiroBotaoOnclick}
                >
                    {primeiroBotaoTexto}
                </button>
                <button
                    data-testid="btn-confirmar"
                    className={segundoBotaoCss}
                    onClick={segundoBotaoOnclick}
                >
                    {segundoBotaoTexto}
                </button>
                <button data-testid="btn-hide" onClick={onHide}>Hide</button>
            </div>
        ) : null,
}));

const defaultProps = {
    show: true,
    titulo: 'Confirmar ação',
    texto: 'Tem certeza que deseja continuar?',
    botaoCancelarTexto: 'Cancelar',
    botaoCancelarHandle: jest.fn(),
    botaoConfirmarTexto: 'Confirmar',
    botaoConfirmarHandle: jest.fn(),
};

describe('ModalConfirmacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza o modal quando show=true', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        expect(screen.getByTestId('modal-bootstrap')).toBeInTheDocument();
    });

    it('não renderiza o modal quando show=false', () => {
        render(<ModalConfirmacao {...defaultProps} show={false} />);
        expect(screen.queryByTestId('modal-bootstrap')).not.toBeInTheDocument();
    });

    it('exibe o título correto', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        expect(screen.getByTestId('titulo')).toHaveTextContent('Confirmar ação');
    });

    it('exibe o texto do corpo correto', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        expect(screen.getByTestId('body')).toHaveTextContent('Tem certeza que deseja continuar?');
    });

    it('exibe o texto do botão cancelar', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        expect(screen.getByTestId('btn-cancelar')).toHaveTextContent('Cancelar');
    });

    it('exibe o texto do botão confirmar', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        expect(screen.getByTestId('btn-confirmar')).toHaveTextContent('Confirmar');
    });

    it('chama botaoCancelarHandle ao clicar em cancelar', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-cancelar'));
        expect(defaultProps.botaoCancelarHandle).toHaveBeenCalledTimes(1);
    });

    it('chama botaoConfirmarHandle ao clicar em confirmar', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-confirmar'));
        expect(defaultProps.botaoConfirmarHandle).toHaveBeenCalledTimes(1);
    });

    it('chama botaoCancelarHandle ao fechar o modal (onHide)', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-hide'));
        expect(defaultProps.botaoCancelarHandle).toHaveBeenCalledTimes(1);
    });

    it('usa css "outline-success" no botão cancelar', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        expect(screen.getByTestId('btn-cancelar')).toHaveClass('outline-success');
    });

    it('usa css "success" no botão confirmar', () => {
        render(<ModalConfirmacao {...defaultProps} />);
        expect(screen.getByTestId('btn-confirmar')).toHaveClass('success');
    });
});
