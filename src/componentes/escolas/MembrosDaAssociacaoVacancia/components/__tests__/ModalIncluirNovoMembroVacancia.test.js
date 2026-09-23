import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ModalIncluirNovoMembroVacancia } from '../ModalIncluirNovoMembroVacancia';

describe('ModalIncluirNovoMembroVacancia', () => {
    const setup = (props = {}) => {
        const handleClose = jest.fn();
        const handleConfirm = jest.fn();

        render(
            <ModalIncluirNovoMembroVacancia
                show
                handleClose={handleClose}
                handleConfirm={handleConfirm}
                {...props}
            />
        );

        return { handleClose, handleConfirm };
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('não deve renderizar o conteúdo quando show for false', () => {
        setup({ show: false });

        expect(screen.queryByText(/deseja incluir um novo membro/i)).not.toBeInTheDocument();
    });

    it('deve renderizar o título, a mensagem e os dois botões', () => {
        setup();

        expect(screen.getByText('Importante')).toBeInTheDocument();
        expect(screen.getByText(/deseja incluir um novo membro para o cargo/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /não incluir/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /incluir novo membro/i })).toBeInTheDocument();
    });

    it('deve chamar handleClose ao clicar em "Não incluir"', () => {
        const { handleClose, handleConfirm } = setup();

        fireEvent.click(screen.getByRole('button', { name: /não incluir/i }));

        expect(handleClose).toHaveBeenCalledTimes(1);
        expect(handleConfirm).not.toHaveBeenCalled();
    });

    it('deve chamar handleConfirm ao clicar em "Incluir novo membro"', () => {
        const { handleClose, handleConfirm } = setup();

        fireEvent.click(screen.getByRole('button', { name: /incluir novo membro/i }));

        expect(handleConfirm).toHaveBeenCalledTimes(1);
        expect(handleClose).not.toHaveBeenCalled();
    });
});
