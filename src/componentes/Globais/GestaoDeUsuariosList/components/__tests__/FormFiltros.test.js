import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormFiltros } from '../FormFiltros';
import { GestaoDeUsuariosListContext } from '../../context/GestaoDeUsuariosListProvider';

const mockSetFilter = jest.fn();

const initialFilter = {
    search: '',
    grupo: '',
    tipoUsuario: '',
    nomeUnidade: '',
    apenasUsuariosDaUnidade: false,
};

const GRUPOS = [
    { id: 10, name: 'Grupo Alpha' },
    { id: 20, name: 'Grupo Beta' },
];

const renderFormFiltros = (grupos = [], ctxOverride = {}) => {
    const contextValue = {
        setFilter: mockSetFilter,
        initialFilter,
        visaoBase: 'UE',
        ...ctxOverride,
    };
    return render(
        <GestaoDeUsuariosListContext.Provider value={contextValue}>
            <FormFiltros grupos={grupos} />
        </GestaoDeUsuariosListContext.Provider>
    );
};

describe('FormFiltros', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('campos básicos sempre visíveis', () => {
        it('renderiza o campo de busca por nome ou id', () => {
            renderFormFiltros();
            expect(screen.getByPlaceholderText('Escreva o nome ou id')).toBeInTheDocument();
        });

        it('renderiza o select de grupo com opção padrão', () => {
            renderFormFiltros();
            expect(screen.getByRole('option', { name: 'Selecione um grupo' })).toBeInTheDocument();
        });

        it('renderiza os grupos como opções do select', () => {
            renderFormFiltros(GRUPOS);
            expect(screen.getByRole('option', { name: 'Grupo Alpha' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Grupo Beta' })).toBeInTheDocument();
        });

        it('renderiza o select de tipo de usuário com opções corretas', () => {
            renderFormFiltros();
            expect(screen.getByRole('option', { name: 'Selecione um tipo' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Servidor' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Não Servidor' })).toBeInTheDocument();
        });

        it('renderiza os botões Limpar e Filtrar', () => {
            renderFormFiltros();
            expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument();
        });
    });

    describe('campos exclusivos de DRE e SME', () => {
        it('exibe campo de unidade educacional para visão DRE', () => {
            renderFormFiltros([], { visaoBase: 'DRE' });
            expect(screen.getByPlaceholderText('Escreva qualquer parte do nome da unidade')).toBeInTheDocument();
        });

        it('exibe campo de unidade educacional para visão SME', () => {
            renderFormFiltros([], { visaoBase: 'SME' });
            expect(screen.getByPlaceholderText('Escreva qualquer parte do nome da unidade')).toBeInTheDocument();
        });

        it('não exibe campo de unidade educacional para visão UE', () => {
            renderFormFiltros([], { visaoBase: 'UE' });
            expect(screen.queryByPlaceholderText('Escreva qualquer parte do nome da unidade')).not.toBeInTheDocument();
        });

        it('exibe checkbox "apenasUsuariosDaUnidade" para visão DRE', () => {
            renderFormFiltros([], { visaoBase: 'DRE' });
            expect(screen.getByLabelText('Selecionar usuários da própria unidade.')).toBeInTheDocument();
        });

        it('exibe checkbox "apenasUsuariosDaUnidade" para visão SME', () => {
            renderFormFiltros([], { visaoBase: 'SME' });
            expect(screen.getByLabelText('Selecionar usuários da própria unidade.')).toBeInTheDocument();
        });

        it('não exibe checkbox "apenasUsuariosDaUnidade" para visão UE', () => {
            renderFormFiltros([], { visaoBase: 'UE' });
            expect(screen.queryByLabelText('Selecionar usuários da própria unidade.')).not.toBeInTheDocument();
        });
    });

    describe('atualização do formulário', () => {
        it('atualiza o campo search ao digitar', () => {
            renderFormFiltros();
            const input = screen.getByPlaceholderText('Escreva o nome ou id');
            fireEvent.change(input, { target: { name: 'search', value: 'Maria' } });
            expect(input.value).toBe('Maria');
        });

        it('atualiza o select de grupo ao selecionar opção', () => {
            renderFormFiltros(GRUPOS);
            const select = screen.getByRole('combobox', { name: /Filtrar por grupo/i });
            fireEvent.change(select, { target: { name: 'grupo', value: '10' } });
            expect(select.value).toBe('10');
        });

        it('atualiza o select de tipoUsuario ao selecionar opção', () => {
            renderFormFiltros();
            const selects = screen.getAllByRole('combobox');
            const tipoSelect = selects[1];
            fireEvent.change(tipoSelect, { target: { name: 'tipoUsuario', value: 'servidor' } });
            expect(tipoSelect.value).toBe('servidor');
        });

        it('atualiza campo nomeUnidade ao digitar (visão DRE)', () => {
            renderFormFiltros([], { visaoBase: 'DRE' });
            const input = screen.getByPlaceholderText('Escreva qualquer parte do nome da unidade');
            fireEvent.change(input, { target: { name: 'nomeUnidade', value: 'Escola Central' } });
            expect(input.value).toBe('Escola Central');
        });

        it('atualiza checkbox apenasUsuariosDaUnidade ao marcar (visão SME)', () => {
            renderFormFiltros([], { visaoBase: 'SME' });
            const checkbox = screen.getByLabelText('Selecionar usuários da própria unidade.');
            fireEvent.change(checkbox, { target: { name: 'apenasUsuariosDaUnidade', checked: true } });
            expect(checkbox.checked).toBe(true);
        });
    });

    describe('submissão do formulário', () => {
        it('chama setFilter com os valores do formulário ao submeter', () => {
            const { container } = renderFormFiltros(GRUPOS);
            const input = screen.getByPlaceholderText('Escreva o nome ou id');
            fireEvent.change(input, { target: { name: 'search', value: 'João' } });
            fireEvent.submit(container.querySelector('form'));
            expect(mockSetFilter).toHaveBeenCalledWith(expect.objectContaining({ search: 'João' }));
        });

        it('chama setFilter ao clicar em Filtrar', () => {
            renderFormFiltros();
            fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }));
            expect(mockSetFilter).toHaveBeenCalledWith(initialFilter);
        });
    });

    describe('limpar filtros', () => {
        it('reseta o formulário e chama setFilter com initialFilter ao clicar em Limpar', () => {
            renderFormFiltros();
            const input = screen.getByPlaceholderText('Escreva o nome ou id');
            fireEvent.change(input, { target: { name: 'search', value: 'João' } });

            fireEvent.click(screen.getByRole('button', { name: 'Limpar' }));

            expect(input.value).toBe('');
            expect(mockSetFilter).toHaveBeenCalledWith(initialFilter);
        });
    });
});
