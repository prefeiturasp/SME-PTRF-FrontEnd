import React, { useContext } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
    GestaoDeUsuariosFormProvider,
    GestaoDeUsuariosFormContext,
} from '../GestaoDeUsuariosFormProvider';
import { visoesService } from '../../../../../services/visoes.service';

jest.mock('../../../../../services/visoes.service', () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
    },
}));

const ConsumerComponent = () => {
    const ctx = useContext(GestaoDeUsuariosFormContext);
    return (
        <div>
            <span data-testid="visaoBase">{ctx.visaoBase}</span>
            <span data-testid="uuidUnidadeBase">{ctx.uuidUnidadeBase}</span>
            <span data-testid="modo">{ctx.modo}</span>
            <span data-testid="usuarioId">{ctx.usuarioId}</span>
            <span data-testid="modos-insert">{ctx.Modos.INSERT}</span>
            <span data-testid="modos-edit">{ctx.Modos.EDIT}</span>
            <span data-testid="modos-view">{ctx.Modos.VIEW}</span>
            <button onClick={() => ctx.setModo(ctx.Modos.INSERT)}>Set Insert</button>
            <button onClick={() => ctx.setModo(ctx.Modos.EDIT)}>Set Edit</button>
            <button onClick={() => ctx.setUsuarioId('user-123')}>Set UserId</button>
            <button onClick={() => ctx.setUsuarioId('')}>Clear UserId</button>
        </div>
    );
};

const renderProvider = () =>
    render(
        <GestaoDeUsuariosFormProvider>
            <ConsumerComponent />
        </GestaoDeUsuariosFormProvider>
    );

describe('GestaoDeUsuariosFormProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.getItemUsuarioLogado.mockReturnValue('');
    });

    describe('visaoBase e uuidUnidadeBase', () => {
        it('lê visao_selecionada.nome e unidade_selecionada.uuid do visoesService', () => {
            visoesService.getItemUsuarioLogado.mockImplementation((key) => {
                if (key === 'visao_selecionada.nome') return 'DRE';
                if (key === 'unidade_selecionada.uuid') return 'uuid-dre-123';
                return '';
            });

            renderProvider();

            expect(screen.getByTestId('visaoBase')).toHaveTextContent('DRE');
            expect(screen.getByTestId('uuidUnidadeBase')).toHaveTextContent('uuid-dre-123');
        });

        it('define uuidUnidadeBase como "SME" quando visao selecionada é SME', () => {
            visoesService.getItemUsuarioLogado.mockImplementation((key) => {
                if (key === 'visao_selecionada.nome') return 'SME';
                if (key === 'unidade_selecionada.uuid') return 'uuid-nao-usado';
                return '';
            });

            renderProvider();

            expect(screen.getByTestId('visaoBase')).toHaveTextContent('SME');
            expect(screen.getByTestId('uuidUnidadeBase')).toHaveTextContent('SME');
        });

        it('usa uuid da unidade quando visao não é SME', () => {
            visoesService.getItemUsuarioLogado.mockImplementation((key) => {
                if (key === 'visao_selecionada.nome') return 'UE';
                if (key === 'unidade_selecionada.uuid') return 'uuid-ue-456';
                return '';
            });

            renderProvider();

            expect(screen.getByTestId('uuidUnidadeBase')).toHaveTextContent('uuid-ue-456');
        });

        it('aceita visaoBase vazia quando visoesService retorna string vazia', () => {
            renderProvider();

            expect(screen.getByTestId('visaoBase')).toHaveTextContent('');
            expect(screen.getByTestId('uuidUnidadeBase')).toHaveTextContent('');
        });
    });

    describe('modo inicial e constantes Modos', () => {
        it('inicia modo como "Visualizar Usuário"', () => {
            renderProvider();

            expect(screen.getByTestId('modo')).toHaveTextContent('Visualizar Usuário');
        });

        it('expõe constante Modos.INSERT como "Adicionar Usuário"', () => {
            renderProvider();

            expect(screen.getByTestId('modos-insert')).toHaveTextContent('Adicionar Usuário');
        });

        it('expõe constante Modos.EDIT como "Editar Usuário"', () => {
            renderProvider();

            expect(screen.getByTestId('modos-edit')).toHaveTextContent('Editar Usuário');
        });

        it('expõe constante Modos.VIEW como "Visualizar Usuário"', () => {
            renderProvider();

            expect(screen.getByTestId('modos-view')).toHaveTextContent('Visualizar Usuário');
        });
    });

    describe('usuarioId inicial', () => {
        it('inicia usuarioId como string vazia', () => {
            renderProvider();

            expect(screen.getByTestId('usuarioId')).toHaveTextContent('');
        });
    });

    describe('setModo', () => {
        it('atualiza modo para INSERT via setModo', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set Insert'));
            });

            expect(screen.getByTestId('modo')).toHaveTextContent('Adicionar Usuário');
        });

        it('atualiza modo para EDIT via setModo', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set Edit'));
            });

            expect(screen.getByTestId('modo')).toHaveTextContent('Editar Usuário');
        });
    });

    describe('setUsuarioId', () => {
        it('atualiza usuarioId via setUsuarioId', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set UserId'));
            });

            expect(screen.getByTestId('usuarioId')).toHaveTextContent('user-123');
        });

        it('limpa usuarioId via setUsuarioId com string vazia', () => {
            renderProvider();

            act(() => {
                fireEvent.click(screen.getByText('Set UserId'));
            });
            act(() => {
                fireEvent.click(screen.getByText('Clear UserId'));
            });

            expect(screen.getByTestId('usuarioId')).toHaveTextContent('');
        });
    });

    describe('renderização de filhos', () => {
        it('renderiza os filhos dentro do provider', () => {
            render(
                <GestaoDeUsuariosFormProvider>
                    <span data-testid="filho">filho</span>
                </GestaoDeUsuariosFormProvider>
            );

            expect(screen.getByTestId('filho')).toBeInTheDocument();
        });
    });

    describe('GestaoDeUsuariosFormContext — valores padrão do createContext', () => {
        it('expõe visaoBase vazia no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(GestaoDeUsuariosFormContext);
                return <span data-testid="visao">{ctx.visaoBase}</span>;
            };
            render(<Consumer />);
            expect(screen.getByTestId('visao')).toHaveTextContent('');
        });

        it('expõe modo VIEW no contexto padrão (sem provider)', () => {
            const Consumer = () => {
                const ctx = useContext(GestaoDeUsuariosFormContext);
                return <span data-testid="modo">{ctx.modo}</span>;
            };
            render(<Consumer />);
            expect(screen.getByTestId('modo')).toHaveTextContent('Visualizar Usuário');
        });
    });
});
