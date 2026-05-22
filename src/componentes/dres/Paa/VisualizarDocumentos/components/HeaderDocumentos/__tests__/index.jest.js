import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { HeaderDocumentos } from '../index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../../../Globais/UI/Icon', () => ({
    Icon: ({ icon }) => <span data-testid='icon'>{icon}</span>,
}));

describe('HeaderDocumentos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('renderização inicial', () => {
        it('deve renderizar corretamente as informações da unidade', () => {
            render(
                <HeaderDocumentos
                    unidadeTipo='EMEF'
                    unidadeNome='Escola ABC'
                    codigoEol={123456}
                    referencia='01/2024'
                />,
            );

            expect(
                screen.getByRole('heading', {
                    name: /EMEF Escola ABC/i,
                }),
            ).toBeInTheDocument();

            expect(screen.getByText('Código EOL:')).toBeInTheDocument();
            expect(screen.getByText('123456')).toBeInTheDocument();

            expect(screen.getByText('Vigência:')).toBeInTheDocument();
            expect(screen.getByText('01/2024')).toBeInTheDocument();

            expect(screen.getByText('Status:')).toBeInTheDocument();
            expect(screen.getByText('Gerado')).toBeInTheDocument();
        });

        it('deve renderizar o status "Em Retificação" quando estaEmRetificacao for true', () => {
            render(
                <HeaderDocumentos
                    unidadeTipo='CEI'
                    unidadeNome='Unidade XPTO'
                    codigoEol={999}
                    referencia='02/2024'
                    estaEmRetificacao
                />,
            );

            expect(screen.getByText('Em Retificação')).toBeInTheDocument();
        });

        it('deve renderizar o status "Gerado" por padrão quando estaEmRetificacao não for informado', () => {
            render(
                <HeaderDocumentos
                    unidadeTipo='DRE'
                    unidadeNome='Diretoria Regional'
                    codigoEol={111}
                    referencia='03/2024'
                />,
            );

            expect(screen.getByText('Gerado')).toBeInTheDocument();
        });

        it('deve renderizar o botão de voltar com ícone', () => {
            render(<HeaderDocumentos unidadeTipo='EMEI' unidadeNome='Escola Infantil' />);

            const botaoVoltar = screen.getByRole('button', {
                name: /voltar/i,
            });

            expect(botaoVoltar).toBeInTheDocument();

            expect(screen.getByTestId('icon')).toHaveTextContent('faArrowLeft');
        });

        it('deve renderizar valores vazios quando props opcionais não forem informadas', () => {
            render(<HeaderDocumentos />);

            expect(screen.getByRole('heading')).toBeInTheDocument();

            expect(screen.getByText('Código EOL:')).toBeInTheDocument();
            expect(screen.getByText('Vigência:')).toBeInTheDocument();
            expect(screen.getByText('Status:')).toBeInTheDocument();

            expect(screen.getByText('Gerado')).toBeInTheDocument();
        });
    });

    describe('interações do usuário', () => {
        it('deve navegar para a página anterior ao clicar no botão voltar', async () => {
            const user = userEvent.setup();

            render(<HeaderDocumentos unidadeTipo='EMEF' unidadeNome='Escola ABC' />);

            const botaoVoltar = screen.getByRole('button', {
                name: /voltar/i,
            });

            await user.click(botaoVoltar);

            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    describe('cenários condicionais', () => {
        it('deve alternar corretamente entre os status "Gerado" e "Em Retificação"', () => {
            const { rerender } = render(<HeaderDocumentos estaEmRetificacao={false} />);

            expect(screen.getByText('Gerado')).toBeInTheDocument();
            expect(screen.queryByText('Em Retificação')).not.toBeInTheDocument();

            rerender(<HeaderDocumentos estaEmRetificacao />);

            expect(screen.getByText('Em Retificação')).toBeInTheDocument();
            expect(screen.queryByText('Gerado')).not.toBeInTheDocument();
        });

        it('deve aceitar codigoEol como string', () => {
            render(<HeaderDocumentos codigoEol='ABC123' referencia='04/2024' />);

            expect(screen.getByText('ABC123')).toBeInTheDocument();
        });
    });
});
