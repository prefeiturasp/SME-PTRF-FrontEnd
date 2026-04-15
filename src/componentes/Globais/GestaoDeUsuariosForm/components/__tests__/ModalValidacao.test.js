import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalValidacao } from '../ModalValidacao';

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
    }) =>
        show ? (
            <div data-testid="modal-bootstrap">
                <span data-testid="titulo">{titulo}</span>
                <span data-testid="body">{bodyText}</span>
                <button
                    data-testid="btn-fechar"
                    className={primeiroBotaoCss}
                    onClick={primeiroBotaoOnclick}
                >
                    {primeiroBotaoTexto}
                </button>
                <button data-testid="btn-hide" onClick={onHide}>Hide</button>
            </div>
        ) : null,
}));

const defaultProps = {
    show: true,
    titulo: 'Validação',
    texto: 'Ocorreu um erro de validação.',
    botaoCancelarHandle: jest.fn(),
    botaoFecharHandle: jest.fn(),
};

describe('ModalValidacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza o modal quando show=true', () => {
        render(<ModalValidacao {...defaultProps} />);
        expect(screen.getByTestId('modal-bootstrap')).toBeInTheDocument();
    });

    it('não renderiza o modal quando show=false', () => {
        render(<ModalValidacao {...defaultProps} show={false} />);
        expect(screen.queryByTestId('modal-bootstrap')).not.toBeInTheDocument();
    });

    it('exibe o título correto', () => {
        render(<ModalValidacao {...defaultProps} />);
        expect(screen.getByTestId('titulo')).toHaveTextContent('Validação');
    });

    it('exibe o texto do corpo correto', () => {
        render(<ModalValidacao {...defaultProps} />);
        expect(screen.getByTestId('body')).toHaveTextContent('Ocorreu um erro de validação.');
    });

    it('o botão de fechar possui o texto fixo "Fechar"', () => {
        render(<ModalValidacao {...defaultProps} />);
        expect(screen.getByTestId('btn-fechar')).toHaveTextContent('Fechar');
    });

    it('usa css "success" no botão fechar', () => {
        render(<ModalValidacao {...defaultProps} />);
        expect(screen.getByTestId('btn-fechar')).toHaveClass('success');
    });

    it('chama botaoFecharHandle ao clicar em fechar', () => {
        render(<ModalValidacao {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-fechar'));
        expect(defaultProps.botaoFecharHandle).toHaveBeenCalledTimes(1);
    });

    it('chama botaoCancelarHandle ao fechar o modal (onHide)', () => {
        render(<ModalValidacao {...defaultProps} />);
        fireEvent.click(screen.getByTestId('btn-hide'));
        expect(defaultProps.botaoCancelarHandle).toHaveBeenCalledTimes(1);
    });
});
