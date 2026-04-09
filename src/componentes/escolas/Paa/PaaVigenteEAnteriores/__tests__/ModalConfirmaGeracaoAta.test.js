import { render, screen, fireEvent } from '@testing-library/react';
import { ModalConfirmaGeracaoAta } from '../ModalConfirmaGeracaoAta';

const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
};

describe('ModalConfirmaGeracaoAta', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o modal quando open=true', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} />);
        expect(screen.getByText('Confirmar geração da Ata')).toBeInTheDocument();
    });

    it('não deve renderizar o modal quando open=false', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} open={false} />);
        expect(screen.queryByText('Confirmar geração da Ata')).not.toBeInTheDocument();
    });

    it('deve exibir a mensagem de confirmação no corpo do modal', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} />);
        expect(screen.getByText(
            'Ao gerar a Ata de Apresentação, não será mais possível editá-la. Deseja continuar?'
        )).toBeInTheDocument();
    });

    it('deve exibir os botões Cancelar e Confirmar', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} />);
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    });

    it('deve chamar onClose ao clicar em Cancelar', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onClose ao clicar no botão Fechar do header', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onConfirm ao clicar em Confirmar', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onConfirm ao clicar em Cancelar', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
        expect(defaultProps.onConfirm).not.toHaveBeenCalled();
    });

    it('não deve chamar onClose ao clicar em Confirmar', () => {
        render(<ModalConfirmaGeracaoAta {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
});
