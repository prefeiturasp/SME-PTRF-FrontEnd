import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BotaoGerarComponent } from '../BotaoGerarComponent';

const DEFAULT_PROPS = {
    botaoProps: {
        disabled: false,
        onClick: jest.fn(),
        title: 'Título do botão',
    },
    texto: 'Texto do Botão',
};

describe('BotaoGerarComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza o botão com o texto fornecido', () => {
        render(<BotaoGerarComponent {...DEFAULT_PROPS} texto="Gerar Orig" />);
        expect(screen.getByRole('button', { name: 'Gerar Orig' })).toBeInTheDocument();
    });

    it('renderiza "-" quando texto não é fornecido', () => {
        render(
            <BotaoGerarComponent
                botaoProps={{ disabled: false, onClick: jest.fn(), title: 'Test' }}
            />
        );
        expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    });

    it('chama onClick ao clicar no botão', () => {
        const onClick = jest.fn();
        render(
            <BotaoGerarComponent
                texto="Clique"
                botaoProps={{ disabled: false, onClick, title: 'Test' }}
            />
        );
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('botão fica desabilitado quando disabled=true', () => {
        render(
            <BotaoGerarComponent
                texto="Gerar"
                botaoProps={{ disabled: true, onClick: jest.fn(), title: 'Test' }}
            />
        );
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('botão fica habilitado quando disabled=false', () => {
        render(
            <BotaoGerarComponent
                texto="Gerar"
                botaoProps={{ disabled: false, onClick: jest.fn(), title: 'Test' }}
            />
        );
        expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('aplica o atributo title do botaoProps', () => {
        render(
            <BotaoGerarComponent
                texto="Gerar"
                botaoProps={{ disabled: false, onClick: jest.fn(), title: 'Meu Título' }}
            />
        );
        expect(screen.getByRole('button')).toHaveAttribute('title', 'Meu Título');
    });

    it('aplica className do botaoProps', () => {
        render(
            <BotaoGerarComponent
                texto="Gerar"
                botaoProps={{
                    disabled: false,
                    onClick: jest.fn(),
                    title: 'Test',
                    className: 'btn-custom-class',
                }}
            />
        );
        expect(screen.getByRole('button')).toHaveClass('btn-custom-class');
    });

    it('possui classes base btn e btn-outline-success', () => {
        render(<BotaoGerarComponent {...DEFAULT_PROPS} />);
        expect(screen.getByRole('button')).toHaveClass('btn', 'btn-outline-success');
    });

    it('sobrescreve a classe base com className do botaoProps', () => {
        render(
            <BotaoGerarComponent
                texto="Gerar"
                botaoProps={{
                    disabled: false,
                    onClick: jest.fn(),
                    title: 'Test',
                    className: 'btn btn-success',
                }}
            />
        );
        expect(screen.getByRole('button')).toHaveClass('btn', 'btn-success');
    });
});
