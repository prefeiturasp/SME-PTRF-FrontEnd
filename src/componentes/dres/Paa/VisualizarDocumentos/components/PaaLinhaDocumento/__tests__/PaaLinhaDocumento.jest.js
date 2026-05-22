import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PaaLinhaDocumento } from '../PaaLinhaDocumento';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ title }) => (
        <svg role='img' aria-label={title}>
            <title>{title}</title>
        </svg>
    ),
}));

describe('PaaLinhaDocumento', () => {
    const defaultProps = {
        titulo: 'Plano anual',
        bloco: {
            existe_arquivo: true,
            url: 'https://arquivo.pdf',

            status: {
                mensagem: 'Documento disponível',
                cor_mensagem: 'green',
            },
        },
        onVisualizar: jest.fn(),
        onDownload: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('renderização inicial', () => {
        it('deve renderizar o título corretamente', () => {
            render(<PaaLinhaDocumento {...defaultProps} />);

            expect(
                screen.getByRole('heading', {
                    level: 4,
                    name: 'Plano anual',
                }),
            ).toBeInTheDocument();
        });

        it('deve renderizar a mensagem de status', () => {
            render(<PaaLinhaDocumento {...defaultProps} />);

            expect(screen.getByText('Documento disponível')).toBeInTheDocument();
        });

        it('deve renderizar os botões de visualizar e download quando existir arquivo e url', () => {
            render(<PaaLinhaDocumento {...defaultProps} />);

            expect(
                screen.getByRole('button', {
                    name: /visualizar/i,
                }),
            ).toBeInTheDocument();

            expect(
                screen.getByRole('button', {
                    name: /download/i,
                }),
            ).toBeInTheDocument();
        });

        it('não deve renderizar os botões quando existe_arquivo for false', () => {
            render(
                <PaaLinhaDocumento
                    {...defaultProps}
                    bloco={{
                        ...defaultProps.bloco,
                        existe_arquivo: false,
                    }}
                />,
            );

            expect(
                screen.queryByRole('button', {
                    name: /visualizar/i,
                }),
            ).not.toBeInTheDocument();

            expect(
                screen.queryByRole('button', {
                    name: /download/i,
                }),
            ).not.toBeInTheDocument();
        });

        it('não deve renderizar os botões quando url não existir', () => {
            render(
                <PaaLinhaDocumento
                    {...defaultProps}
                    bloco={{
                        ...defaultProps.bloco,
                        url: null,
                    }}
                />,
            );

            expect(
                screen.queryByRole('button', {
                    name: /visualizar/i,
                }),
            ).not.toBeInTheDocument();

            expect(
                screen.queryByRole('button', {
                    name: /download/i,
                }),
            ).not.toBeInTheDocument();
        });

        it('deve utilizar o testIdPrefix customizado', () => {
            render(<PaaLinhaDocumento {...defaultProps} testIdPrefix='custom-doc' />);

            expect(screen.getByTestId('custom-doc-mensagem')).toBeInTheDocument();
        });

        it('deve utilizar o testIdPrefix padrão quando não informado', () => {
            render(<PaaLinhaDocumento {...defaultProps} />);

            expect(screen.getByTestId('paa-doc-mensagem')).toBeInTheDocument();
        });
    });

    describe('interações do usuário', () => {
        it('deve chamar onVisualizar ao clicar no botão visualizar', async () => {
            const user = userEvent.setup();

            render(<PaaLinhaDocumento {...defaultProps} />);

            await user.click(
                screen.getByRole('button', {
                    name: /visualizar/i,
                }),
            );

            expect(defaultProps.onVisualizar).toHaveBeenCalledTimes(1);
        });

        it('deve chamar onDownload ao clicar no botão download', async () => {
            const user = userEvent.setup();

            render(<PaaLinhaDocumento {...defaultProps} />);

            await user.click(
                screen.getByRole('button', {
                    name: /download/i,
                }),
            );

            expect(defaultProps.onDownload).toHaveBeenCalledTimes(1);
        });

        it('não deve permitir clique quando carregandoVisualizar for true', async () => {
            const user = userEvent.setup();

            render(<PaaLinhaDocumento {...defaultProps} carregandoVisualizar />);

            const botaoVisualizar = screen.getByRole('button', {
                name: /visualizar/i,
            });

            const botaoDownload = screen.getByRole('button', {
                name: /download/i,
            });

            expect(botaoVisualizar).toBeDisabled();
            expect(botaoDownload).toBeDisabled();

            await user.click(botaoVisualizar);
            await user.click(botaoDownload);

            expect(defaultProps.onVisualizar).not.toHaveBeenCalled();

            expect(defaultProps.onDownload).not.toHaveBeenCalled();
        });
    });

    describe('estados condicionais', () => {
        it('deve aplicar a cor verde corretamente', () => {
            render(<PaaLinhaDocumento {...defaultProps} />);

            expect(screen.getByTestId('paa-doc-mensagem')).toHaveStyle({
                color: '#0F7A6C',
            });
        });

        it('deve aplicar a cor vermelha corretamente', () => {
            render(
                <PaaLinhaDocumento
                    {...defaultProps}
                    bloco={{
                        ...defaultProps.bloco,
                        status: {
                            mensagem: 'Erro',
                            cor_mensagem: 'red',
                        },
                    }}
                />,
            );

            expect(screen.getByTestId('paa-doc-mensagem')).toHaveStyle({
                color: '#C22D2D',
            });
        });

        it('deve aplicar a cor laranja corretamente', () => {
            render(
                <PaaLinhaDocumento
                    {...defaultProps}
                    bloco={{
                        ...defaultProps.bloco,
                        status: {
                            mensagem: 'Atenção',
                            cor_mensagem: 'orange',
                        },
                    }}
                />,
            );

            expect(screen.getByTestId('paa-doc-mensagem')).toHaveStyle({
                color: '#D06D12',
            });
        });

        it('deve aplicar a cor cinza quando a cor for desconhecida', () => {
            render(
                <PaaLinhaDocumento
                    {...defaultProps}
                    bloco={{
                        ...defaultProps.bloco,
                        status: {
                            mensagem: 'Desconhecido',
                            cor_mensagem: 'purple',
                        },
                    }}
                />,
            );

            expect(screen.getByTestId('paa-doc-mensagem')).toHaveStyle({
                color: '#60686A',
            });
        });

        it('deve aplicar a cor cinza quando cor_mensagem for undefined', () => {
            render(
                <PaaLinhaDocumento
                    {...defaultProps}
                    bloco={{
                        ...defaultProps.bloco,
                        status: {
                            mensagem: 'Sem cor',
                        },
                    }}
                />,
            );

            expect(screen.getByTestId('paa-doc-mensagem')).toHaveStyle({
                color: '#60686A',
            });
        });

        it('deve renderizar mensagem vazia quando status não existir', () => {
            render(
                <PaaLinhaDocumento
                    {...defaultProps}
                    bloco={{
                        existe_arquivo: true,
                        url: 'arquivo.pdf',
                    }}
                />,
            );

            expect(screen.getByTestId('paa-doc-mensagem')).toHaveTextContent('');
        });

        it('deve renderizar mensagem vazia quando mensagem for nullish', () => {
            render(
                <PaaLinhaDocumento
                    {...defaultProps}
                    bloco={{
                        ...defaultProps.bloco,
                        status: {
                            mensagem: undefined,
                            cor_mensagem: 'green',
                        },
                    }}
                />,
            );

            expect(screen.getByTestId('paa-doc-mensagem')).toHaveTextContent('');
        });
    });

    describe('acessibilidade', () => {
        it('deve renderizar ícone de visualizar acessível', () => {
            render(<PaaLinhaDocumento {...defaultProps} />);

            expect(
                screen.getByRole('img', {
                    name: /visualizar/i,
                }),
            ).toBeInTheDocument();
        });

        it('deve renderizar ícone de download acessível', () => {
            render(<PaaLinhaDocumento {...defaultProps} />);

            expect(
                screen.getByRole('img', {
                    name: /download/i,
                }),
            ).toBeInTheDocument();
        });
    });
});
