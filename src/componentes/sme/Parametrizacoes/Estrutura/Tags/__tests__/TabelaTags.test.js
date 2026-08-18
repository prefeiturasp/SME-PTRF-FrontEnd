import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabelaTags from '../components/TabelaTags';
import { useTagsContext } from '../hooks/useTagsContext';

// Mock do Custom Hook
jest.mock('../hooks/useTagsContext');

// Mock auxiliar para simplificar a criação do contexto nos testes
const mockUseTagsContext = useTagsContext;

describe('Componente <TabelaTags />', () => {
    // Funções mock padronizadas
    const mockHandleOpenModalForm = jest.fn();
    const mockHandleDelete = jest.fn();
    const mockHandleCloseModalConfirmDeleteTag = jest.fn();

    // Valores padrão do contexto para reutilização nos testes
    const defaultContextValues = {
        results: [
            { uuid: '1', nome: 'Tag Ativa', status: 'ATIVO' },
            { uuid: '2', nome: 'Tag Inativa', status: 'INATIVO' },
        ],
        handleOpenModalForm: mockHandleOpenModalForm,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: true,
        showModalConfirmDeleteTag: { open: false, tag_uuid: null },
        handleDelete: mockHandleDelete,
        handleCloseModalConfirmDeleteTag: mockHandleCloseModalConfirmDeleteTag,
        isLoading: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTagsContext.mockReturnValue(defaultContextValues);
    });

    it('deve exibir o componente de Loading quando isLoading for verdadeiro', () => {
        mockUseTagsContext.mockReturnValue({
            ...defaultContextValues,
            isLoading: true,
        });

        render(<TabelaTags />);

        // Verifica se a tabela/total não são exibidos e se o indicador de loading aparece
        expect(screen.queryByText('Etiqueta(s)/Tag(s)')).not.toBeInTheDocument();
        expect(document.querySelector('.mt-5')).toBeInTheDocument();
    });

    it('deve renderizar a tabela e o total de registros corretamente quando não estiver carregando', () => {
        render(<TabelaTags />);

        // Total de registros
        expect(screen.getByText(/etiqueta\(s\)\/tag\(s\)/i)).toBeInTheDocument();

        // Dados da tabela
        expect(screen.getByText('Tag Ativa')).toBeInTheDocument();
        expect(screen.getByText('Tag Inativa')).toBeInTheDocument();

        // Status formatados pelo statusTemplate
        expect(screen.getByText('Ativo')).toBeInTheDocument();
        expect(screen.getByText('Inativo')).toBeInTheDocument();
    });

    it('deve chamar handleOpenModalForm com os dados da linha ao clicar no botão de edição', async () => {
        const user = userEvent.setup();
        render(<TabelaTags />);

        // Seleciona os botões de edição (primeira linha)
        const editButtons = screen.getAllByRole('button');
        await user.click(editButtons[0]);

        expect(mockHandleOpenModalForm).toHaveBeenCalledTimes(1);
        expect(mockHandleOpenModalForm).toHaveBeenCalledWith(defaultContextValues.results[0]);
    });

    it('deve desabilitar os botões de edição se o usuário não tiver permissão', () => {
        mockUseTagsContext.mockReturnValue({
            ...defaultContextValues,
            TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: false,
        });

        render(<TabelaTags />);

        const editButtons = screen.getAllByRole('button');
        // Verifica se o botão de edição está desabilitado
        expect(editButtons[0]).toBeDisabled();
    });

    describe('Modal de Confirmação de Exclusão', () => {
        it('deve exibir o modal de exclusão quando showModalConfirmDeleteTag.open for verdadeiro', () => {
            mockUseTagsContext.mockReturnValue({
                ...defaultContextValues,
                showModalConfirmDeleteTag: { open: true, tag_uuid: '123' },
            });

            render(<TabelaTags />);

            expect(screen.getByText('Excluir etiqueta/tag')).toBeInTheDocument();
            expect(screen.getByText('Deseja realmente excluir esta etiqueta/tag?')).toBeInTheDocument();
        });

        it('deve chamar handleDelete e fechar o modal ao confirmar a exclusão', async () => {
            const user = userEvent.setup();
            const tagUuidToExcluir = '123-abc';

            mockUseTagsContext.mockReturnValue({
                ...defaultContextValues,
                showModalConfirmDeleteTag: { open: true, tag_uuid: tagUuidToExcluir },
            });

            render(<TabelaTags />);

            const botaoExcluir = screen.getByRole('button', { name: /Excluir/i });
            await user.click(botaoExcluir);

            expect(mockHandleDelete).toHaveBeenCalledWith(tagUuidToExcluir);
            expect(mockHandleCloseModalConfirmDeleteTag).toHaveBeenCalledTimes(1);
        });

        it('deve apenas fechar o modal ao clicar em Cancelar', async () => {
            const user = userEvent.setup();

            mockUseTagsContext.mockReturnValue({
                ...defaultContextValues,
                showModalConfirmDeleteTag: { open: true, tag_uuid: '123-abc' },
            });

            render(<TabelaTags />);

            const botaoCancelar = screen.getByRole('button', { name: /Cancelar/i });
            await user.click(botaoCancelar);

            expect(mockHandleDelete).not.toHaveBeenCalled();
            expect(mockHandleCloseModalConfirmDeleteTag).toHaveBeenCalledTimes(1);
        });
    });
});