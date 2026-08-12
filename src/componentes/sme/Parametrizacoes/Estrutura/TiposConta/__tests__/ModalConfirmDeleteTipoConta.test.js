import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalConfirmDeleteTipoConta } from '../ModalConfirmDeleteTipoConta';

// Mock do ModalBootstrap para isolar o teste e validar o repasse exato das props
jest.mock('../../../../../Globais/ModalBootstrap', () => ({
    ModalBootstrap: ({
        show,
        titulo,
        bodyText,
        primeiroBotaoTexto,
        primeiroBotaoCss,
        primeiroBotaoOnclick,
        segundoBotaoTexto,
        segundoBotaoCss,
        segundoBotaoOnclick,
        onHide
    }) => show ? (
        <div data-testid="modal-bootstrap-mock">
            <h2>{titulo}</h2>
            <p>{bodyText}</p>
            <button 
                data-testid="primeiro-botao" 
                className={primeiroBotaoCss} 
                onClick={primeiroBotaoOnclick}
            >
                {primeiroBotaoTexto}
            </button>
            <button 
                data-testid="segundo-botao" 
                className={segundoBotaoCss} 
                onClick={segundoBotaoOnclick}
            >
                {segundoBotaoTexto}
            </button>
            <button data-testid="btn-on-hide" onClick={onHide}>Fechar OnHide</button>
        </div>
    ) : null
}));

describe('Componente <ModalConfirmDeleteTipoConta />', () => {
    const mockHandleClose = jest.fn();
    const mockOnDeleteTipoContaTrue = jest.fn();

    const defaultProps = {
        show: true,
        handleClose: mockHandleClose,
        titulo: 'Excluir Tipo de Conta',
        texto: 'Deseja realmente excluir este tipo de conta?',
        primeiroBotaoTexto: 'Cancelar',
        primeiroBotaoCss: 'btn-secondary',
        onDeleteTipoContaTrue: mockOnDeleteTipoContaTrue,
        segundoBotaoTexto: 'Confirmar Exclusão',
        segundoBotaoCss: 'btn-danger',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('não deve renderizar nada quando show for falso', () => {
        render(
            <ModalConfirmDeleteTipoConta 
                {...defaultProps} 
                show={false} 
            />
        );

        expect(screen.queryByTestId('modal-bootstrap-mock')).not.toBeInTheDocument();
    });

    it('deve renderizar o modal e repassar todos os textos e estilos para os botões', () => {
        render(<ModalConfirmDeleteTipoConta {...defaultProps} />);

        // Valida título e texto
        expect(screen.getByText('Excluir Tipo de Conta')).toBeInTheDocument();
        expect(screen.getByText('Deseja realmente excluir este tipo de conta?')).toBeInTheDocument();

        // Valida primeiro botão (Cancelar)
        const primeiroBotao = screen.getByTestId('primeiro-botao');
        expect(primeiroBotao).toHaveTextContent('Cancelar');
        expect(primeiroBotao).toHaveClass('btn-secondary');

        // Valida segundo botão (Confirmar)
        const segundoBotao = screen.getByTestId('segundo-botao');
        expect(segundoBotao).toHaveTextContent('Confirmar Exclusão');
        expect(segundoBotao).toHaveClass('btn-danger');
    });

    it('deve acionar handleClose ao clicar no primeiro botão (Cancelar)', async () => {
        const user = userEvent.setup();
        render(<ModalConfirmDeleteTipoConta {...defaultProps} />);

        const primeiroBotao = screen.getByTestId('primeiro-botao');
        await user.click(primeiroBotao);

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
        expect(mockOnDeleteTipoContaTrue).not.toHaveBeenCalled();
    });

    it('deve acionar onDeleteTipoContaTrue ao clicar no segundo botão (Confirmar Exclusão)', async () => {
        const user = userEvent.setup();
        render(<ModalConfirmDeleteTipoConta {...defaultProps} />);

        const segundoBotao = screen.getByTestId('segundo-botao');
        await user.click(segundoBotao);

        expect(mockOnDeleteTipoContaTrue).toHaveBeenCalledTimes(1);
        expect(mockHandleClose).not.toHaveBeenCalled();
    });

    it('deve repassar handleClose para a prop onHide do ModalBootstrap', async () => {
        const user = userEvent.setup();
        render(<ModalConfirmDeleteTipoConta {...defaultProps} />);

        const btnOnHide = screen.getByTestId('btn-on-hide');
        await user.click(btnOnHide);

        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
});