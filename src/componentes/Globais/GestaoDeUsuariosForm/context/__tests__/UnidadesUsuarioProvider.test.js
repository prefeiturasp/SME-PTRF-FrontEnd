import React, { useContext } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
    UnidadesUsuarioProvider,
    UnidadesUsuarioContext,
} from '../UnidadesUsuarioProvider';

const TEXTO_PADRAO_MODAL =
    '<span>Ao desativar essa unidade ela será excluída automaticamente da listagem de acesso para este usuário, pois se trata de uma unidade adicionada manualmente.</br>Caso este usuário precise ter acesso novamente a esta unidade, será necessário realizar um novo cadastro da unidade</span>';

const ConsumerComponent = () => {
    const ctx = useContext(UnidadesUsuarioContext);
    return (
        <div>
            <span data-testid="currentPage">{String(ctx.currentPage)}</span>
            <span data-testid="firstPage">{String(ctx.firstPage)}</span>
            <span data-testid="showFaixaIndicativa">{String(ctx.showFaixaIndicativa)}</span>
            <span data-testid="showModalRemoverAcesso">{String(ctx.showModalRemoverAcesso)}</span>
            <span data-testid="textoModalRemoverAcesso">{ctx.textoModalRemoverAcesso}</span>
            <span data-testid="payloadRemoveAcessoConcedidoSme">
                {JSON.stringify(ctx.payloadRemoveAcessoConcedidoSme)}
            </span>

            <button onClick={() => ctx.setCurrentPage(5)}>Set CurrentPage 5</button>
            <button onClick={() => ctx.setCurrentPage(1)}>Set CurrentPage 1</button>
            <button onClick={() => ctx.setFirstPage(10)}>Set FirstPage 10</button>
            <button onClick={() => ctx.setShowFaixaIndicativa(true)}>Show Faixa</button>
            <button onClick={() => ctx.setShowFaixaIndicativa(false)}>Hide Faixa</button>
            <button onClick={() => ctx.setShowModalRemoverAcesso(true)}>Show Modal</button>
            <button onClick={() => ctx.setShowModalRemoverAcesso(false)}>Hide Modal</button>
            <button onClick={() => ctx.setTextoModalEncerramentoConta('novo texto')}>Set Texto</button>
            <button
                onClick={() =>
                    ctx.setPayloadRemoveAcessoConcedidoSme({ uuid: 'abc', nome: 'Escola X' })
                }
            >
                Set Payload
            </button>
        </div>
    );
};

const renderProvider = () =>
    render(
        <UnidadesUsuarioProvider>
            <ConsumerComponent />
        </UnidadesUsuarioProvider>
    );

describe('UnidadesUsuarioProvider', () => {
    describe('valores iniciais', () => {
        it('inicia currentPage como 1', () => {
            renderProvider();
            expect(screen.getByTestId('currentPage')).toHaveTextContent('1');
        });

        it('inicia firstPage como 1', () => {
            renderProvider();
            expect(screen.getByTestId('firstPage')).toHaveTextContent('1');
        });

        it('inicia showFaixaIndicativa como false', () => {
            renderProvider();
            expect(screen.getByTestId('showFaixaIndicativa')).toHaveTextContent('false');
        });

        it('inicia showModalRemoverAcesso como false', () => {
            renderProvider();
            expect(screen.getByTestId('showModalRemoverAcesso')).toHaveTextContent('false');
        });

        it('inicia textoModalRemoverAcesso com o texto padrão', () => {
            renderProvider();
            expect(screen.getByTestId('textoModalRemoverAcesso')).toHaveTextContent(
                TEXTO_PADRAO_MODAL
            );
        });

        it('inicia payloadRemoveAcessoConcedidoSme como objeto vazio', () => {
            renderProvider();
            expect(screen.getByTestId('payloadRemoveAcessoConcedidoSme')).toHaveTextContent('{}');
        });
    });

    describe('setCurrentPage', () => {
        it('atualiza currentPage para o novo valor', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set CurrentPage 5'));
            });

            expect(screen.getByTestId('currentPage')).toHaveTextContent('5');
        });

        it('permite voltar currentPage ao valor original', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set CurrentPage 5'));
            });
            act(() => {
                fireEvent.click(screen.getByText('Set CurrentPage 1'));
            });

            expect(screen.getByTestId('currentPage')).toHaveTextContent('1');
        });
    });

    describe('setFirstPage', () => {
        it('atualiza firstPage para o novo valor', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set FirstPage 10'));
            });

            expect(screen.getByTestId('firstPage')).toHaveTextContent('10');
        });
    });

    describe('setShowFaixaIndicativa', () => {
        it('ativa showFaixaIndicativa', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Show Faixa'));
            });

            expect(screen.getByTestId('showFaixaIndicativa')).toHaveTextContent('true');
        });

        it('desativa showFaixaIndicativa após ativar', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Show Faixa'));
            });
            act(() => {
                fireEvent.click(screen.getByText('Hide Faixa'));
            });

            expect(screen.getByTestId('showFaixaIndicativa')).toHaveTextContent('false');
        });
    });

    describe('setShowModalRemoverAcesso', () => {
        it('ativa showModalRemoverAcesso', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Show Modal'));
            });

            expect(screen.getByTestId('showModalRemoverAcesso')).toHaveTextContent('true');
        });

        it('desativa showModalRemoverAcesso após ativar', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Show Modal'));
            });
            act(() => {
                fireEvent.click(screen.getByText('Hide Modal'));
            });

            expect(screen.getByTestId('showModalRemoverAcesso')).toHaveTextContent('false');
        });
    });

    describe('setTextoModalEncerramentoConta', () => {
        it('atualiza textoModalRemoverAcesso via setTextoModalEncerramentoConta', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set Texto'));
            });

            expect(screen.getByTestId('textoModalRemoverAcesso')).toHaveTextContent('novo texto');
        });
    });

    describe('setPayloadRemoveAcessoConcedidoSme', () => {
        it('atualiza payloadRemoveAcessoConcedidoSme com o objeto fornecido', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set Payload'));
            });

            expect(screen.getByTestId('payloadRemoveAcessoConcedidoSme')).toHaveTextContent(
                JSON.stringify({ uuid: 'abc', nome: 'Escola X' })
            );
        });
    });

    describe('renderização de filhos', () => {
        it('renderiza os filhos dentro do provider', () => {
            render(
                <UnidadesUsuarioProvider>
                    <span data-testid="filho">filho</span>
                </UnidadesUsuarioProvider>
            );

            expect(screen.getByTestId('filho')).toBeInTheDocument();
        });
    });

    describe('UnidadesUsuarioContext — valores padrão do createContext', () => {
        it('expõe currentPage como 1 no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(UnidadesUsuarioContext);
                return <span data-testid="currentPage">{String(ctx.currentPage)}</span>;
            };
            render(<Consumer />);
            expect(screen.getByTestId('currentPage')).toHaveTextContent('1');
        });

        it('expõe showFaixaIndicativa como false no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(UnidadesUsuarioContext);
                return (
                    <span data-testid="faixa">{String(ctx.showFaixaIndicativa)}</span>
                );
            };
            render(<Consumer />);
            expect(screen.getByTestId('faixa')).toHaveTextContent('false');
        });

        it('expõe showModalRemoverAcesso como false no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(UnidadesUsuarioContext);
                return (
                    <span data-testid="modal">{String(ctx.showModalRemoverAcesso)}</span>
                );
            };
            render(<Consumer />);
            expect(screen.getByTestId('modal')).toHaveTextContent('false');
        });
    });
});
