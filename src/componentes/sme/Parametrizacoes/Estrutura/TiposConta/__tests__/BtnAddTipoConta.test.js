import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BtnAddTipoConta } from '../BtnAddTipoConta';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

// Mock da função de verificação de permissão
jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes');

describe('Componente <BtnAddTipoConta />', () => {
    const mockSetShowModalForm = jest.fn();
    const mockSetStateFormModal = jest.fn();
    const mockFontAwesomeIcon = ({ icon, style }) => (
        <span data-testid="font-awesome-icon" data-icon={icon} style={style} />
    );

    const defaultProps = {
        FontAwesomeIcon: mockFontAwesomeIcon,
        faPlus: 'fa-plus-mock',
        setShowModalForm: mockSetShowModalForm,
        initialStateFormModal: { id: null, nome: '' },
        setStateFormModal: mockSetStateFormModal,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o botão habilitado e o ícone quando tiver permissão de edição', () => {
        // Simula que o usuário tem permissão
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<BtnAddTipoConta {...defaultProps} />);

        const botao = screen.getByRole('button', { name: /adicionar tipo de conta/i });
        const icone = screen.getByTestId('font-awesome-icon');

        expect(botao).toBeInTheDocument();
        expect(botao).not.toBeDisabled();
        expect(icone).toBeInTheDocument();
        expect(icone).toHaveAttribute('data-icon', 'fa-plus-mock');
    });

    it('deve renderizar o botão desabilitado (disabled) quando não tiver permissão de edição', () => {
        // Simula que o usuário NÃO tem permissão
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

        render(<BtnAddTipoConta {...defaultProps} />);

        const botao = screen.getByRole('button', { name: /adicionar tipo de conta/i });

        expect(botao).toBeInTheDocument();
        expect(botao).toBeDisabled();
    });

    it('deve chamar setStateFormModal com initialStateFormModal e setShowModalForm(true) ao clicar no botão', async () => {
        const user = userEvent.setup();
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<BtnAddTipoConta {...defaultProps} />);

        const botao = screen.getByRole('button', { name: /adicionar tipo de conta/i });
        await user.click(botao);

        expect(mockSetStateFormModal).toHaveBeenCalledTimes(1);
        expect(mockSetStateFormModal).toHaveBeenCalledWith(defaultProps.initialStateFormModal);

        expect(mockSetShowModalForm).toHaveBeenCalledTimes(1);
        expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
    });
});