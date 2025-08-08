import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { FiltroDeUnidades } from '../FiltroDeUnidades';

const mockHandleSubmitFiltros = jest.fn();
const mockLimpaFiltros = jest.fn();

const defaultProps = {
    stateFiltros: { nome_ou_codigo: 'Valor Inicial' },
    handleSubmitFiltros: mockHandleSubmitFiltros,
    limpaFiltros: mockLimpaFiltros,
    filtroInicial: { nome_ou_codigo: '' },
};

describe('FiltroDeUnidades', () => {

    beforeEach(() => {
        mockHandleSubmitFiltros.mockClear();
        mockLimpaFiltros.mockClear();
    });

    const renderComponent = (props = {}) => {
        return render(<FiltroDeUnidades {...defaultProps} {...props} />);
    };

    test('deve renderizar corretamente com os valores iniciais', async () => {
        renderComponent();
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(defaultProps.stateFiltros.nome_ou_codigo);
        expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();

    });

    test('deve atualizar o valor do input ao digitar', () => {
        renderComponent();
        const inputElement = screen.getByRole('textbox');

        fireEvent.change(inputElement, { target: { name: 'nome_ou_codigo', value: 'Novo Valor' } });
        expect(inputElement).toHaveValue('Novo Valor');
    });

    test('deve chamar limpaFiltros e resetar o input ao clicar em "Limpar"', () => {
        renderComponent();
        const inputElement = screen.getByRole('textbox');
        const limparButton = screen.getByRole('button', { name: /Limpar/i });

        fireEvent.change(inputElement, { target: { name: 'nome_ou_codigo', value: 'Valor para limpar' } });
        expect(inputElement).toHaveValue('Valor para limpar');

        fireEvent.click(limparButton);

        expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
        expect(inputElement).toHaveValue(defaultProps.filtroInicial.nome_ou_codigo); // Espera o valor de filtroInicial
    });

    test('deve chamar handleSubmitFiltros com os filtros atuais ao clicar em "Filtrar"', () => {
        renderComponent();
        const inputElement = screen.getByRole('textbox');
        const filtrarButton = screen.getByRole('button', { name: /Filtrar/i });

        const valorFiltrado = 'Valor Filtrado Teste';
        fireEvent.change(inputElement, { target: { name: 'nome_ou_codigo', value: valorFiltrado } });
        fireEvent.click(filtrarButton);

        expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);
        expect(mockHandleSubmitFiltros).toHaveBeenCalledWith(
            expect.anything(),
            { ...defaultProps.stateFiltros, nome_ou_codigo: valorFiltrado }
        );
    });

    test('deve chamar handleSubmitFiltros ao submeter o formulário (ex: pressionar Enter no input)', () => {
        renderComponent();
        const inputElement = screen.getByRole('textbox');
        const formElement = screen.getByRole('button', { name: /Filtrar/i }).closest('form');


        const valorFiltradoEnter = 'Valor Filtrado Enter';
        fireEvent.change(inputElement, { target: { name: 'nome_ou_codigo', value: valorFiltradoEnter } });
        
        fireEvent.submit(formElement);

        expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);
        expect(mockHandleSubmitFiltros).toHaveBeenCalledWith(
            expect.anything(),
            { ...defaultProps.stateFiltros, nome_ou_codigo: valorFiltradoEnter }
        );
    });
});