import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GestaoDePerfis } from '../index';
import { getGrupos, getUsuarios, getUsuariosFiltros } from '../../../../services/GestaoDePerfis.service';
import { visoesService } from '../../../../services/visoes.service';
import { barraMensagemCustom } from '../../BarraMensagem';

// ── Captured props ─────────────────────────────────────────────────────────────
let mockFormFiltrosProps = null;
let mockBodyFns = {};

// ── Mocks ─────────────────────────────────────────────────────────────────────
jest.mock('../../../../services/GestaoDePerfis.service', () => ({
    getGrupos: jest.fn(),
    getUsuarios: jest.fn(),
    getUsuariosFiltros: jest.fn(),
}));

jest.mock('../../../../services/visoes.service', () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
        featureFlagAtiva: jest.fn(),
    },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../AccordionInfo', () => ({
    // eslint-disable-next-line react/prop-types
    AccordionInfo: () => <div data-testid="accordion-info" />,
}));

jest.mock('../FormFiltros', () => ({
    FormFiltros: (props) => {
        mockFormFiltrosProps = props;
        return <div data-testid="form-filtros" />;
    },
}));

jest.mock('../../MenuInterno', () => ({
    MenuInterno: () => <div data-testid="menu-interno" />,
}));

jest.mock('../../../../utils/Loading', () => () => <div data-testid="loading" />);

jest.mock('react-tooltip', () => ({
    Tooltip: () => null,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    // eslint-disable-next-line react/prop-types
    FontAwesomeIcon: ({ icon }) => <span data-testid={`fa-icon-${icon?.iconName || 'unknown'}`} />,
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faKey: { iconName: 'key' },
    faPlus: { iconName: 'plus' },
}));

jest.mock('primereact/datatable', () => ({
    DataTable: ({ children }) => <div data-testid="datatable">{children}</div>,
}));

jest.mock('primereact/column', () => ({
    Column: ({ header, body }) => {
        if (body && header) mockBodyFns[header] = body;
        return null;
    },
}));

jest.mock('../../BarraMensagem', () => ({
    barraMensagemCustom: {
        BarraMensagemAcertoExterno: jest.fn((msg) => (
            <div data-testid="barra-mensagem">{msg}</div>
        )),
    },
}));

jest.mock('../../UI/Button/EditIconButton', () => ({
    EditIconButton: ({ onClick }) => (
        <button data-testid="edit-btn" onClick={onClick}>Editar</button>
    ),
}));

// ── Test data ──────────────────────────────────────────────────────────────────
const UNIDADE_UUID = 'unidade-uuid-123';

const GRUPOS_MOCK = [
    { id: 1, name: 'Administradores', nome: 'Administradores' },
    { id: 2, name: 'Leitores', nome: 'Leitores' },
];

const USUARIOS_MOCK = [
    {
        id: 42,
        name: 'Maria Oliveira',
        username: 'maria.oliveira',
        e_servidor: true,
        groups: [{ id: 1, name: 'Administradores' }],
        unidades: [
            { uuid: UNIDADE_UUID, tipo_unidade: 'EMEF', nome: 'Escola Teste', acesso_de_suporte: false },
        ],
    },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const renderComponent = (visao = 'UE') => {
    visoesService.getItemUsuarioLogado.mockImplementation((key) => {
        if (key === 'visao_selecionada.nome') return visao;
        if (key === 'unidade_selecionada.uuid') return UNIDADE_UUID;
        return null;
    });
    return render(
        <MemoryRouter>
            <GestaoDePerfis />
        </MemoryRouter>
    );
};

const renderAndWaitForLoad = async (visao = 'UE', usuarios = USUARIOS_MOCK) => {
    getUsuarios.mockResolvedValue(usuarios);
    getGrupos.mockResolvedValue(GRUPOS_MOCK);
    const result = renderComponent(visao);
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
    return result;
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('GestaoDePerfis', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFormFiltrosProps = null;
        mockBodyFns = {};
        getUsuarios.mockResolvedValue([]);
        getGrupos.mockResolvedValue([]);
        visoesService.featureFlagAtiva.mockReturnValue(false);
    });

    describe('inicialização', () => {
        it('mostra Loading no render inicial', () => {
            getUsuarios.mockImplementation(() => new Promise(() => {}));
            getGrupos.mockResolvedValue([]);
            renderComponent();
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });

        it('chama getGrupos com visao_selecionada no mount', async () => {
            await renderAndWaitForLoad('UE');
            expect(getGrupos).toHaveBeenCalledWith('UE');
        });

        it('chama getUsuarios com visao_selecionada e unidade_selecionada no mount', async () => {
            await renderAndWaitForLoad('UE');
            expect(getUsuarios).toHaveBeenCalledWith('UE', UNIDADE_UUID);
        });

        it('esconde Loading após carregar usuários', async () => {
            await renderAndWaitForLoad('UE');
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        it('renderiza o texto introdutório', async () => {
            await renderAndWaitForLoad();
            expect(
                screen.getByText('Faça a gestão dos seus usuários e determine seus perfis atrelando-os aos grupos de acesso.')
            ).toBeInTheDocument();
        });

        it('renderiza o heading "Lista de perfis com acesso"', async () => {
            await renderAndWaitForLoad();
            expect(screen.getByText('Lista de perfis com acesso')).toBeInTheDocument();
        });

        it('renderiza o link "adicionar"', async () => {
            await renderAndWaitForLoad();
            expect(screen.getByText(/adicionar/i)).toBeInTheDocument();
        });

        it('renderiza AccordionInfo', async () => {
            await renderAndWaitForLoad();
            expect(screen.getByTestId('accordion-info')).toBeInTheDocument();
        });

        it('renderiza FormFiltros', async () => {
            await renderAndWaitForLoad();
            expect(screen.getByTestId('form-filtros')).toBeInTheDocument();
        });
    });

    describe('DataTable', () => {
        it('renderiza DataTable quando há usuários', async () => {
            await renderAndWaitForLoad('UE', USUARIOS_MOCK);
            expect(screen.getByTestId('datatable')).toBeInTheDocument();
        });

        it('não renderiza DataTable quando não há usuários (array vazio)', async () => {
            await renderAndWaitForLoad('UE', []);
            expect(screen.queryByTestId('datatable')).not.toBeInTheDocument();
        });

        it('não renderiza DataTable quando usuarios é objeto vazio', async () => {
            getUsuarios.mockResolvedValue({});
            getGrupos.mockResolvedValue([]);
            renderComponent('UE');
            await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
            expect(screen.queryByTestId('datatable')).not.toBeInTheDocument();
        });
    });

    describe('visão SME', () => {
        it('renderiza MenuInterno para visão SME', async () => {
            await renderAndWaitForLoad('SME');
            expect(screen.getByTestId('menu-interno')).toBeInTheDocument();
        });

        it('chama getGrupos e getUsuarios com visão SME', async () => {
            await renderAndWaitForLoad('SME');
            expect(getGrupos).toHaveBeenCalledWith('SME');
            expect(getUsuarios).toHaveBeenCalledWith('SME', UNIDADE_UUID);
        });
    });

    describe('visão DRE', () => {
        it('não renderiza MenuInterno para visão DRE', async () => {
            await renderAndWaitForLoad('DRE');
            expect(screen.queryByTestId('menu-interno')).not.toBeInTheDocument();
        });
    });

    describe('visão UE', () => {
        it('não renderiza MenuInterno para visão UE', async () => {
            await renderAndWaitForLoad('UE');
            expect(screen.queryByTestId('menu-interno')).not.toBeInTheDocument();
        });
    });

    describe('feature flag', () => {
        it('chama featureFlagAtiva com "teste-flag"', async () => {
            await renderAndWaitForLoad();
            expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('teste-flag');
        });

        it('chama BarraMensagemAcertoExterno com a mensagem correta', async () => {
            visoesService.featureFlagAtiva.mockReturnValue(true);
            await renderAndWaitForLoad();
            expect(barraMensagemCustom.BarraMensagemAcertoExterno).toHaveBeenCalledWith(
                'Feature flag teste-flag ativa.'
            );
        });

        it('não mostra BarraMensagem quando feature flag está inativa', async () => {
            visoesService.featureFlagAtiva.mockReturnValue(false);
            await renderAndWaitForLoad();
            expect(screen.queryByTestId('barra-mensagem')).not.toBeInTheDocument();
        });
    });

    describe('grupoTemplate', () => {
        const getBodyFn = async () => {
            await renderAndWaitForLoad('UE', USUARIOS_MOCK);
            return mockBodyFns['Grupo de acesso'];
        };

        it('renderiza os nomes dos grupos do rowData', async () => {
            const bodyFn = await getBodyFn();
            expect(bodyFn).toBeDefined();
            const { getByText } = render(
                <>{bodyFn({ groups: [{ name: 'Admin' }, { name: 'Editor' }] })}</>
            );
            expect(getByText('Admin')).toBeInTheDocument();
            expect(getByText('Editor')).toBeInTheDocument();
        });

        it('não renderiza nada quando groups é array vazio', async () => {
            const bodyFn = await getBodyFn();
            const result = bodyFn({ groups: [] });
            expect(result).toBeUndefined();
        });

        it('não renderiza nada quando groups é undefined', async () => {
            const bodyFn = await getBodyFn();
            const result = bodyFn({ groups: undefined });
            expect(result).toBeUndefined();
        });
    });

    describe('unidadesTemplate (DRE/SME)', () => {
        const getBodyFn = async () => {
            await renderAndWaitForLoad('DRE', USUARIOS_MOCK);
            return mockBodyFns['Unid. correspondente'];
        };

        it('captura a função de corpo da coluna de unidades', async () => {
            const bodyFn = await getBodyFn();
            expect(bodyFn).toBeDefined();
        });

        it('renderiza tipo e nome da unidade', async () => {
            const bodyFn = await getBodyFn();
            const { getByText } = render(
                <>
                    {bodyFn({
                        unidades: [{ tipo_unidade: 'EMEF', nome: 'Escola A', acesso_de_suporte: false }],
                    })}
                </>
            );
            expect(getByText(/EMEF Escola A/)).toBeInTheDocument();
        });

        it('renderiza múltiplas unidades', async () => {
            const bodyFn = await getBodyFn();
            const { getByText } = render(
                <>
                    {bodyFn({
                        unidades: [
                            { tipo_unidade: 'EMEF', nome: 'Escola A', acesso_de_suporte: false },
                            { tipo_unidade: 'CEI', nome: 'Escola B', acesso_de_suporte: false },
                        ],
                    })}
                </>
            );
            expect(getByText(/EMEF Escola A/)).toBeInTheDocument();
            expect(getByText(/CEI Escola B/)).toBeInTheDocument();
        });

        it('mostra ícone quando acesso_de_suporte é true', async () => {
            const bodyFn = await getBodyFn();
            const { getByTestId } = render(
                <>
                    {bodyFn({
                        unidades: [{ tipo_unidade: 'EMEF', nome: 'Escola', acesso_de_suporte: true }],
                    })}
                </>
            );
            expect(getByTestId('fa-icon-key')).toBeInTheDocument();
        });

        it('não mostra ícone quando acesso_de_suporte é false', async () => {
            const bodyFn = await getBodyFn();
            const { queryByTestId } = render(
                <>
                    {bodyFn({
                        unidades: [{ tipo_unidade: 'EMEF', nome: 'Escola', acesso_de_suporte: false }],
                    })}
                </>
            );
            expect(queryByTestId('fa-icon-key')).not.toBeInTheDocument();
        });

        it('não renderiza nada quando unidades é undefined', async () => {
            const bodyFn = await getBodyFn();
            const result = bodyFn({ unidades: undefined });
            expect(result).toBeUndefined();
        });

        it('não renderiza nada quando unidades é array vazio', async () => {
            const bodyFn = await getBodyFn();
            const result = bodyFn({ unidades: [] });
            expect(result).toBeUndefined();
        });
    });

    describe('nomeUsuarioComIconeDeAcessoSuporteTemplate (UE)', () => {
        const getBodyFn = async () => {
            await renderAndWaitForLoad('UE', USUARIOS_MOCK);
            return mockBodyFns['Nome completo'];
        };

        it('renderiza o nome do usuário', async () => {
            const bodyFn = await getBodyFn();
            expect(bodyFn).toBeDefined();
            const { getByText } = render(
                <>
                    {bodyFn({
                        name: 'Ana Paula',
                        unidades: [{ uuid: UNIDADE_UUID, acesso_de_suporte: false }],
                    })}
                </>
            );
            expect(getByText('Ana Paula')).toBeInTheDocument();
        });

        it('mostra ícone quando a unidade logada tem acesso_de_suporte', async () => {
            const bodyFn = await getBodyFn();
            const { getByTestId } = render(
                <>
                    {bodyFn({
                        name: 'Ana Paula',
                        unidades: [{ uuid: UNIDADE_UUID, acesso_de_suporte: true }],
                    })}
                </>
            );
            expect(getByTestId('fa-icon-key')).toBeInTheDocument();
        });

        it('não mostra ícone quando a unidade logada não tem acesso_de_suporte', async () => {
            const bodyFn = await getBodyFn();
            const { queryByTestId } = render(
                <>
                    {bodyFn({
                        name: 'Ana Paula',
                        unidades: [{ uuid: UNIDADE_UUID, acesso_de_suporte: false }],
                    })}
                </>
            );
            expect(queryByTestId('fa-icon-key')).not.toBeInTheDocument();
        });
    });

    describe('tipoUsuarioTemplate', () => {
        const getBodyFn = async () => {
            await renderAndWaitForLoad('UE', USUARIOS_MOCK);
            return mockBodyFns['Tipo de usuário'];
        };

        it('retorna "Servidor" quando e_servidor é true', async () => {
            const bodyFn = await getBodyFn();
            expect(bodyFn).toBeDefined();
            expect(bodyFn({ e_servidor: true })).toBe('Servidor');
        });

        it('retorna "Não Servidor" quando e_servidor é false', async () => {
            const bodyFn = await getBodyFn();
            expect(bodyFn({ e_servidor: false })).toBe('Não Servidor');
        });
    });

    describe('acoesTemplate', () => {
        it('navega para /gestao-de-perfis-form/:id ao clicar no botão de editar', async () => {
            await renderAndWaitForLoad('UE', USUARIOS_MOCK);
            const bodyFn = mockBodyFns['Editar'];
            expect(bodyFn).toBeDefined();
            const { getByTestId } = render(
                <MemoryRouter>{bodyFn({ id: 99 })}</MemoryRouter>
            );
            fireEvent.click(getByTestId('edit-btn'));
            expect(mockNavigate).toHaveBeenCalledWith('/gestao-de-perfis-form/99');
        });
    });

    describe('FormFiltros - props repassadas', () => {
        it('passa visao_selecionada para FormFiltros', async () => {
            await renderAndWaitForLoad('SME');
            expect(mockFormFiltrosProps.visao_selecionada).toBe('SME');
        });

        it('passa grupos para FormFiltros', async () => {
            await renderAndWaitForLoad('UE');
            expect(mockFormFiltrosProps.grupos).toEqual(GRUPOS_MOCK);
        });

        it('passa stateFiltros inicial para FormFiltros', async () => {
            await renderAndWaitForLoad('UE');
            expect(mockFormFiltrosProps.stateFiltros).toEqual({
                filtrar_por_nome: '',
                filtrar_por_grupo: '',
                filtrar_tipo_de_usuario: '',
                filtrar_por_nome_unidade: '',
            });
        });
    });

    describe('handleChangeFiltros', () => {
        it('atualiza stateFiltros ao chamar handleChangeFiltros', async () => {
            await renderAndWaitForLoad('UE');
            act(() => {
                mockFormFiltrosProps.handleChangeFiltros('filtrar_por_nome', 'João');
            });
            await waitFor(() => {
                expect(mockFormFiltrosProps.stateFiltros.filtrar_por_nome).toBe('João');
            });
        });

        it('preserva outros campos do stateFiltros ao atualizar um campo', async () => {
            await renderAndWaitForLoad('UE');
            act(() => {
                mockFormFiltrosProps.handleChangeFiltros('filtrar_por_grupo', '1');
            });
            await waitFor(() => {
                expect(mockFormFiltrosProps.stateFiltros.filtrar_por_grupo).toBe('1');
                expect(mockFormFiltrosProps.stateFiltros.filtrar_por_nome).toBe('');
            });
        });
    });

    describe('limpaFiltros', () => {
        it('reseta stateFiltros ao chamar limpaFiltros', async () => {
            await renderAndWaitForLoad('UE');
            act(() => {
                mockFormFiltrosProps.handleChangeFiltros('filtrar_por_nome', 'João');
            });
            await waitFor(() => {
                expect(mockFormFiltrosProps.stateFiltros.filtrar_por_nome).toBe('João');
            });

            await act(async () => {
                await mockFormFiltrosProps.limpaFiltros();
            });

            await waitFor(() => {
                expect(mockFormFiltrosProps.stateFiltros.filtrar_por_nome).toBe('');
                expect(mockFormFiltrosProps.stateFiltros.filtrar_por_grupo).toBe('');
            });
        });

        it('chama getUsuarios novamente ao chamar limpaFiltros', async () => {
            await renderAndWaitForLoad('UE');
            const callsBefore = getUsuarios.mock.calls.length;

            await act(async () => {
                await mockFormFiltrosProps.limpaFiltros();
            });

            expect(getUsuarios.mock.calls.length).toBeGreaterThan(callsBefore);
        });
    });

    describe('handleSubmitFiltros', () => {
        it('chama getUsuariosFiltros ao submeter filtros', async () => {
            getUsuariosFiltros.mockResolvedValue([]);
            await renderAndWaitForLoad('UE');

            await act(async () => {
                await mockFormFiltrosProps.handleSubmitFiltros({ preventDefault: jest.fn() });
            });

            expect(getUsuariosFiltros).toHaveBeenCalledTimes(1);
        });

        it('chama getUsuariosFiltros com visao, filtros e unidade_selecionada', async () => {
            getUsuariosFiltros.mockResolvedValue([]);
            await renderAndWaitForLoad('UE');

            act(() => {
                mockFormFiltrosProps.handleChangeFiltros('filtrar_por_nome', 'Teste');
            });
            await waitFor(() =>
                expect(mockFormFiltrosProps.stateFiltros.filtrar_por_nome).toBe('Teste')
            );

            await act(async () => {
                await mockFormFiltrosProps.handleSubmitFiltros({ preventDefault: jest.fn() });
            });

            expect(getUsuariosFiltros).toHaveBeenCalledWith(
                'UE',
                'Teste',
                '',
                '',
                '',
                UNIDADE_UUID
            );
        });

        it('atualiza usuários com o retorno de getUsuariosFiltros', async () => {
            const usuariosFiltrados = [{ ...USUARIOS_MOCK[0], id: 99, name: 'Resultado Filtro' }];
            getUsuariosFiltros.mockResolvedValue(usuariosFiltrados);
            await renderAndWaitForLoad('UE');

            await act(async () => {
                await mockFormFiltrosProps.handleSubmitFiltros({ preventDefault: jest.fn() });
            });

            await waitFor(() => {
                expect(screen.getByTestId('datatable')).toBeInTheDocument();
            });
        });

        it('mostra Loading durante handleSubmitFiltros e esconde após', async () => {
            let resolveGetUsuariosFiltros;
            getUsuariosFiltros.mockImplementation(
                () => new Promise((resolve) => { resolveGetUsuariosFiltros = resolve; })
            );
            await renderAndWaitForLoad('UE');

            act(() => {
                mockFormFiltrosProps.handleSubmitFiltros({ preventDefault: jest.fn() });
            });

            await waitFor(() => expect(screen.getByTestId('loading')).toBeInTheDocument());

            await act(async () => {
                resolveGetUsuariosFiltros([]);
            });

            await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
        });
    });
});
