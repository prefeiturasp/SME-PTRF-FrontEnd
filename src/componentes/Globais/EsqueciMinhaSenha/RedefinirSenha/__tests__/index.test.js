import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RedefinirSenha } from '../index';

let capturedFormRedefinirSenhaProps = {};

jest.mock('../../../EdicaoDeSenha/FormRedefinirSenha', () => ({
    FormRedefinirSenha: (props) => {
        capturedFormRedefinirSenhaProps = props;
        return <div data-testid="form-redefinir-senha" />;
    },
}));

describe('RedefinirSenha', () => {
    beforeEach(() => {
        capturedFormRedefinirSenhaProps = {};
    });

    describe('Renderização', () => {
        it('renderiza o componente sem erros', () => {
            const { container } = render(<RedefinirSenha />);
            expect(container).toBeInTheDocument();
        });

        it('renderiza o container principal com a classe correta', () => {
            const { container } = render(<RedefinirSenha />);
            expect(container.querySelector('.container-esqueci-minha-senha')).toBeInTheDocument();
        });

        it('renderiza a div de texto interno com a classe correta', () => {
            const { container } = render(<RedefinirSenha />);
            expect(container.querySelector('.esqueci-minha-senha-inner-texto')).toBeInTheDocument();
        });

        it('renderiza o título "Nova Senha"', () => {
            render(<RedefinirSenha />);
            expect(screen.getByText('Nova Senha')).toBeInTheDocument();
        });

        it('o título tem a classe correta', () => {
            render(<RedefinirSenha />);
            const titulo = screen.getByText('Nova Senha');
            expect(titulo.tagName).toBe('H1');
            expect(titulo).toHaveClass('titulo-services');
            expect(titulo).toHaveClass('mb-3');
        });

        it('renderiza o texto informativo', () => {
            render(<RedefinirSenha />);
            expect(
                screen.getByText(/Identificamos que você ainda não definiu uma senha pessoal/i)
            ).toBeInTheDocument();
        });

        it('renderiza o FormRedefinirSenha', () => {
            render(<RedefinirSenha />);
            expect(screen.getByTestId('form-redefinir-senha')).toBeInTheDocument();
        });
    });

    describe('Props repassadas ao FormRedefinirSenha', () => {
        it('repassa textoValidacaoDentroDoForm=true', () => {
            render(<RedefinirSenha />);
            expect(capturedFormRedefinirSenhaProps.textoValidacaoDentroDoForm).toBe(true);
        });

        it('repassa redirectUrlSucesso="/login"', () => {
            render(<RedefinirSenha />);
            expect(capturedFormRedefinirSenhaProps.redirectUrlSucesso).toBe('/login');
        });

        it('repassa textoSucesso="Senha redefinida com sucesso"', () => {
            render(<RedefinirSenha />);
            expect(capturedFormRedefinirSenhaProps.textoSucesso).toBe('Senha redefinida com sucesso');
        });

        it('repassa cssAlertSucesso="alert alert-success"', () => {
            render(<RedefinirSenha />);
            expect(capturedFormRedefinirSenhaProps.cssAlertSucesso).toBe('alert alert-success');
        });

        it('repassa cssAlertErro="alert alert-danger"', () => {
            render(<RedefinirSenha />);
            expect(capturedFormRedefinirSenhaProps.cssAlertErro).toBe('alert alert-danger');
        });
    });
});
