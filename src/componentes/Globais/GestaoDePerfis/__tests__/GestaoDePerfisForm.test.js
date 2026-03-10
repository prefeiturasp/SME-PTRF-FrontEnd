import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GestaoDePerfisForm } from '../GestaoDePerfisForm';
import { visoesService } from '../../../../services/visoes.service';
import {
    getUsuario,
    getUsuarioStatus,
    getCodigoEolUnidade,
    getGrupos,
    getVisoes,
    getUsuarioUnidadesVinculadas,
    getUnidadesPorTipo,
    getUnidadePorUuid,
    getMembroAssociacao,
    postVincularUnidadeUsuario,
    postCriarUsuario,
    putEditarUsuario,
    deleteDesvincularUnidadeUsuario,
    deleteUsuario,
} from '../../../../services/GestaoDePerfis.service';
import { getTabelaAssociacoes } from '../../../../services/dres/Associacoes.service';
import { valida_cpf_cnpj } from '../../../../utils/ValidacoesAdicionaisFormularios';

// ── Capture props passed to child ──────────────────────────────────────────────
let capturedFormikProps = null;

// ── Mocks ──────────────────────────────────────────────────────────────────────
jest.mock('../../../../services/visoes.service', () => ({
    visoesService: { getItemUsuarioLogado: jest.fn() },
}));

jest.mock('../../../../services/GestaoDePerfis.service', () => ({
    getUsuario: jest.fn(),
    getUsuarioStatus: jest.fn(),
    getCodigoEolUnidade: jest.fn(),
    getGrupos: jest.fn(),
    getVisoes: jest.fn(),
    getUsuarioUnidadesVinculadas: jest.fn(),
    getUnidadesPorTipo: jest.fn(),
    getUnidadePorUuid: jest.fn(),
    getMembroAssociacao: jest.fn(),
    postVincularUnidadeUsuario: jest.fn(),
    postCriarUsuario: jest.fn(),
    putEditarUsuario: jest.fn(),
    deleteDesvincularUnidadeUsuario: jest.fn(),
    deleteUsuario: jest.fn(),
}));

jest.mock('../../../../services/dres/Associacoes.service', () => ({
    getTabelaAssociacoes: jest.fn(),
}));

jest.mock('../../../../utils/ValidacoesAdicionaisFormularios', () => ({
    valida_cpf_cnpj: jest.fn(),
}));

jest.mock('../../../../utils/Loading', () => () => <div data-testid="loading">Loading...</div>);

jest.mock('../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock('../GestaoDePerfisFormFormik', () => ({
    GestaoDePerfisFormFormik: (props) => {
        capturedFormikProps = props;
        return <div data-testid="gestao-perfis-formik">FormikMock</div>;
    },
}));

// ── Test data ──────────────────────────────────────────────────────────────────
const MOCK_VISOES_API = [
    { id: '1', nome: 'SME' },
    { id: '2', nome: 'DRE' },
    { id: '3', nome: 'UE' },
];

const MOCK_GRUPOS_SME = [{ id: 1, nome: 'Grupo SME', descricao: 'Desc SME', visao: 'SME' }];
const MOCK_GRUPOS_DRE = [{ id: 2, nome: 'Grupo DRE', descricao: 'Desc DRE', visao: 'DRE' }];
const MOCK_GRUPOS_UE  = [{ id: 3, nome: 'Grupo UE',  descricao: 'Desc UE',  visao: 'UE' }];

const MOCK_UNIDADE = { uuid: 'uuid-unidade-1', codigo_eol: '000001', tipo_unidade: 'EMEF' };
const MOCK_DRE     = { uuid: 'uuid-dre-1',     codigo_eol: '000010', tipo_unidade: 'DRE' };

const MOCK_UNIDADES_VINCULADAS = [
    { uuid: 'uuid-u-1', codigo_eol: '000010', tipo_unidade: 'DRE' },
    { uuid: 'uuid-u-2', codigo_eol: '000001', tipo_unidade: 'EMEF' },
];

const MOCK_USUARIO = {
    id: 99,
    e_servidor: true,
    username: '1234567',
    name: 'Test User',
    email: 'test@test.com',
    groups: [{ id: 1 }],
    visoes: [{ nome: 'SME' }],
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const setVisoesService = (visao = 'SME') => {
    visoesService.getItemUsuarioLogado.mockImplementation((key) => {
        if (key === 'visao_selecionada.nome') return visao;
        if (key === 'unidade_selecionada.uuid') return 'uuid-unidade-1';
        if (key === 'associacao_selecionada.uuid') return 'uuid-associacao-1';
        return null;
    });
};

const setupDefaultMocks = (visao = 'SME') => {
    setVisoesService(visao);
    getGrupos.mockImplementation((v) => {
        if (v === 'SME') return Promise.resolve(MOCK_GRUPOS_SME);
        if (v === 'DRE') return Promise.resolve(MOCK_GRUPOS_DRE);
        if (v === 'UE')  return Promise.resolve(MOCK_GRUPOS_UE);
        return Promise.resolve([]);
    });
    getVisoes.mockResolvedValue(MOCK_VISOES_API);
    getTabelaAssociacoes.mockResolvedValue({ tipos: [] });
    getCodigoEolUnidade.mockResolvedValue(MOCK_UNIDADE);
    getUsuarioUnidadesVinculadas.mockResolvedValue([]);
    getUnidadePorUuid.mockResolvedValue(MOCK_UNIDADE);
    getUnidadesPorTipo.mockResolvedValue([MOCK_UNIDADE]);
    getUsuario.mockResolvedValue(MOCK_USUARIO);
    getMembroAssociacao.mockResolvedValue(null);
    getUsuarioStatus.mockResolvedValue({
        validacao_username: { username_e_valido: true },
        usuario_core_sso: { info_core_sso: null, mensagem: '' },
        usuario_sig_escola: { info_sig_escola: null, associacoes_que_e_membro: [] },
        e_servidor_na_unidade: true,
    });
    valida_cpf_cnpj.mockReturnValue(true);
    postCriarUsuario.mockResolvedValue({ id: 100 });
    putEditarUsuario.mockResolvedValue({});
    deleteUsuario.mockResolvedValue({});
    deleteDesvincularUnidadeUsuario.mockResolvedValue({});
    postVincularUnidadeUsuario.mockResolvedValue({});
};

const renderComponent = (visao = 'SME', idUsuario = null) => {
    const path  = idUsuario ? `/gestao-de-perfis-form/${idUsuario}` : '/gestao-de-perfis-form';
    const route = idUsuario ? '/gestao-de-perfis-form/:id_usuario' : '/gestao-de-perfis-form';
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path={route} element={<GestaoDePerfisForm />} />
            </Routes>
        </MemoryRouter>
    );
};

const waitForRender = () =>
    waitFor(() => expect(screen.getByTestId('gestao-perfis-formik')).toBeInTheDocument());

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('<GestaoDePerfisForm>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedFormikProps = null;
        delete window.location;
        window.location = { assign: jest.fn() };
    });

    // ── Renderização básica ────────────────────────────────────────────────────
    describe('Renderização básica', () => {
        it('renderiza título e formik para visão SME', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(screen.getByText('Gestão de perfis')).toBeInTheDocument();
            expect(screen.getByTestId('gestao-perfis-formik')).toBeInTheDocument();
        });

        it('renderiza para visão DRE chamando getCodigoEolUnidade', async () => {
            setupDefaultMocks('DRE');
            renderComponent('DRE');
            await waitForRender();
            expect(getCodigoEolUnidade).toHaveBeenCalledWith('uuid-unidade-1');
        });

        it('renderiza para visão UE chamando getUnidadePorUuid', async () => {
            setupDefaultMocks('UE');
            renderComponent('UE');
            await waitForRender();
            expect(getUnidadePorUuid).toHaveBeenCalledWith('uuid-unidade-1');
        });

        it('não chama getCodigoEolUnidade para visão SME', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(getCodigoEolUnidade).not.toHaveBeenCalled();
        });

        it('mostra loading state enquanto deleta usuário', async () => {
            setupDefaultMocks('SME');
            deleteUsuario.mockImplementation(() => new Promise(() => {}));
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                capturedFormikProps.onDeletePerfilTrue();
            });
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });
    });

    // ── exibeGrupos ───────────────────────────────────────────────────────────
    describe('exibeGrupos', () => {
        it('chama getGrupos com a visão atual para SME', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(getGrupos).toHaveBeenCalledWith('SME');
        });

        it('chama getGrupos com a visão atual para DRE', async () => {
            setupDefaultMocks('DRE');
            renderComponent('DRE');
            await waitForRender();
            expect(getGrupos).toHaveBeenCalledWith('DRE');
        });

        it('exibeGrupos com array contendo SME, DRE e UE', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.exibeGrupos(['SME', 'DRE', 'UE']);
            });
            expect(getGrupos).toHaveBeenCalledWith('SME');
            expect(getGrupos).toHaveBeenCalledWith('DRE');
            expect(getGrupos).toHaveBeenCalledWith('UE');
        });

        it('exibeGrupos com array vazio não chama getGrupos com array', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const callsBefore = getGrupos.mock.calls.length;
            await act(async () => {
                await capturedFormikProps.exibeGrupos([]);
            });
            // With empty array, falls to else branch: getGrupos(visao_selecionada)
            expect(getGrupos).toHaveBeenCalledTimes(callsBefore + 1);
        });

        it('handleChangeVisao adiciona visão e chama exibeGrupos', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const setFieldValue = jest.fn();
            await act(async () => {
                capturedFormikProps.handleChangeVisao(
                    { target: { checked: true, value: 'DRE' } },
                    setFieldValue,
                    { visoes: ['SME'] }
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith('visoes', ['SME', 'DRE']);
            expect(getGrupos).toHaveBeenCalledWith('DRE');
        });

        it('handleChangeVisao remove visão e atualiza grupos', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const setFieldValue = jest.fn();
            await act(async () => {
                capturedFormikProps.handleChangeVisao(
                    { target: { checked: false, value: 'DRE' } },
                    setFieldValue,
                    { visoes: ['SME', 'DRE'] }
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith('visoes', ['SME']);
        });
    });

    // ── exibeVisoes ───────────────────────────────────────────────────────────
    describe('exibeVisoes', () => {
        it('configura visões corretamente para SME sem unidades vinculadas', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(getVisoes).toHaveBeenCalled();
            // pesquisaVisao retorna visão encontrada
            const ret = capturedFormikProps.pesquisaVisao('SME');
            expect(ret).toBeTruthy();
        });

        it('configura visões para DRE com unidades vinculadas', async () => {
            setupDefaultMocks('DRE');
            getUsuarioUnidadesVinculadas.mockResolvedValue(MOCK_UNIDADES_VINCULADAS);
            renderComponent('DRE', '42');
            await waitForRender();
            expect(getVisoes).toHaveBeenCalled();
        });

        it('configura visões para UE com unidades vinculadas', async () => {
            setupDefaultMocks('UE');
            getUsuarioUnidadesVinculadas.mockResolvedValue(MOCK_UNIDADES_VINCULADAS);
            renderComponent('UE', '42');
            await waitForRender();
            expect(getVisoes).toHaveBeenCalled();
        });

        it('pesquisaVisao retorna true quando visão não encontrada na lista', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const ret = capturedFormikProps.pesquisaVisao('INEXISTENTE');
            expect(ret).toBe(true);
        });
    });

    // ── pesquisaPermissaoExibicaoVisao ────────────────────────────────────────
    describe('pesquisaPermissaoExibicaoVisao', () => {
        it('retorna editavel correto para visão SME (todas editáveis)', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('SME')).toBe(true);
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('DRE')).toBe(true);
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('UE')).toBe(true);
        });

        it('retorna editavel correto para visão DRE (SME não editável)', async () => {
            setupDefaultMocks('DRE');
            renderComponent('DRE');
            await waitForRender();
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('SME')).toBe(false);
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('DRE')).toBe(true);
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('UE')).toBe(true);
        });

        it('retorna editavel correto para visão UE (só UE editável)', async () => {
            setupDefaultMocks('UE');
            renderComponent('UE');
            await waitForRender();
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('SME')).toBe(false);
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('DRE')).toBe(false);
            expect(capturedFormikProps.pesquisaPermissaoExibicaoVisao('UE')).toBe(true);
        });
    });

    // ── serviceTemUnidade ─────────────────────────────────────────────────────
    describe('serviceTemUnidadeDre / serviceTemUnidadeUE', () => {
        it('serviceTemUnidadeDre retorna unidade DRE quando existe', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.serviceTemUnidadeDre(MOCK_UNIDADES_VINCULADAS))
                .toEqual(MOCK_UNIDADES_VINCULADAS[0]);
        });

        it('serviceTemUnidadeDre retorna undefined quando não existe DRE', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.serviceTemUnidadeDre([{ tipo_unidade: 'EMEF' }]))
                .toBeUndefined();
        });

        it('serviceTemUnidadeUE retorna unidade UE quando existe (EMEF)', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.serviceTemUnidadeUE(MOCK_UNIDADES_VINCULADAS))
                .toEqual(MOCK_UNIDADES_VINCULADAS[1]);
        });

        it('serviceTemUnidadeUE retorna undefined quando tipo é SME', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.serviceTemUnidadeUE([{ tipo_unidade: 'SME' }]))
                .toBeUndefined();
        });

        it('serviceTemUnidadeUE retorna undefined quando sem tipo_unidade', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.serviceTemUnidadeUE([{}])).toBeUndefined();
        });
    });

    // ── carregaDadosUsuario ───────────────────────────────────────────────────
    describe('carregaDadosUsuario', () => {
        it('carrega dados do usuário quando id_usuario está presente', async () => {
            setupDefaultMocks('SME');
            getUsuarioUnidadesVinculadas.mockResolvedValue([]);
            renderComponent('SME', '42');
            await waitForRender();
            expect(getUsuario).toHaveBeenCalledWith('42');
        });

        it('não chama getUsuario quando id_usuario está ausente', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(getUsuario).not.toHaveBeenCalled();
        });

        it('carrega grupos com múltiplas visões do usuário', async () => {
            setupDefaultMocks('SME');
            getUsuario.mockResolvedValue({
                ...MOCK_USUARIO,
                groups: [],
                visoes: [{ nome: 'SME' }, { nome: 'DRE' }],
            });
            renderComponent('SME', '42');
            await waitForRender();
            expect(getGrupos).toHaveBeenCalledWith('SME');
            expect(getGrupos).toHaveBeenCalledWith('DRE');
        });

        it('carrega dados do usuário para visão DRE com uuid_unidade', async () => {
            setupDefaultMocks('DRE');
            renderComponent('DRE', '42');
            await waitForRender();
            expect(getUsuarioUnidadesVinculadas).toHaveBeenCalledWith('42', 'DRE', 'uuid-unidade-1');
        });

        it('carrega dados do usuário para visão SME sem uuid_unidade', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME', '42');
            await waitForRender();
            expect(getUsuarioUnidadesVinculadas).toHaveBeenCalledWith('42', 'SME');
        });
    });

    // ── handleCloseUsuarioNaoCadastrado ───────────────────────────────────────
    describe('handleCloseUsuarioNaoCadastrado', () => {
        it('chama resetForm e fecha o modal', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const resetForm = jest.fn();
            act(() => {
                capturedFormikProps.handleCloseUsuarioNaoCadastrado({ resetForm });
            });
            expect(resetForm).toHaveBeenCalled();
            expect(capturedFormikProps.showModalUsuarioNaoCadastrado).toBe(false);
        });
    });

    // ── handleCloseDeletePerfil ───────────────────────────────────────────────
    describe('handleCloseDeletePerfil', () => {
        it('fecha o modal de confirmação de delete', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            act(() => {
                capturedFormikProps.handleCloseDeletePerfil();
            });
            expect(capturedFormikProps.showModalDeletePerfil).toBe(false);
        });
    });

    // ── onDeletePerfilTrue ────────────────────────────────────────────────────
    describe('onDeletePerfilTrue', () => {
        it('chama deleteUsuario e redireciona ao sucesso', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.onDeletePerfilTrue();
            });
            expect(deleteUsuario).toHaveBeenCalled();
            expect(window.location.assign).toHaveBeenCalledWith('/gestao-de-perfis/');
        });

        it('trata erro ao deletar usuário (esconde loading)', async () => {
            setupDefaultMocks('SME');
            deleteUsuario.mockRejectedValue({ response: { data: 'Erro' } });
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.onDeletePerfilTrue();
            });
            expect(deleteUsuario).toHaveBeenCalled();
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
    });

    // ── handleChangeTipoUnidade ───────────────────────────────────────────────
    describe('handleChangeTipoUnidade', () => {
        const emptyValues = { unidades_vinculadas: [] };

        it('DRE com tipo DRE chama getUnidadePorUuid', async () => {
            setupDefaultMocks('DRE');
            getUnidadePorUuid.mockResolvedValue(MOCK_DRE);
            renderComponent('DRE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleChangeTipoUnidade('DRE', emptyValues);
            });
            expect(getUnidadePorUuid).toHaveBeenCalledWith('uuid-unidade-1');
        });

        it('DRE com tipo EMEF chama getUnidadesPorTipo', async () => {
            setupDefaultMocks('DRE');
            renderComponent('DRE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleChangeTipoUnidade('EMEF', emptyValues);
            });
            expect(getUnidadesPorTipo).toHaveBeenCalledWith('EMEF', 'uuid-unidade-1');
        });

        it('SME chama getUnidadesPorTipo sem dre_uuid', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleChangeTipoUnidade('EMEF', emptyValues);
            });
            expect(getUnidadesPorTipo).toHaveBeenCalledWith('EMEF');
        });

        it('UE chama getUnidadePorUuid', async () => {
            setupDefaultMocks('UE');
            renderComponent('UE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleChangeTipoUnidade('UE', emptyValues);
            });
            expect(getUnidadePorUuid).toHaveBeenCalled();
        });

        it('não chama serviço quando tipo_unidade é vazio', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const callsBefore = getUnidadesPorTipo.mock.calls.length;
            await act(async () => {
                await capturedFormikProps.handleChangeTipoUnidade('', emptyValues);
            });
            expect(getUnidadesPorTipo).toHaveBeenCalledTimes(callsBefore);
        });

        it('remove unidades já vinculadas do resultado', async () => {
            setupDefaultMocks('SME');
            getUnidadesPorTipo.mockResolvedValue([MOCK_UNIDADE, { uuid: 'outro', codigo_eol: '999' }]);
            const values = { unidades_vinculadas: [{ uuid: 'uuid-unidade-1' }] };
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleChangeTipoUnidade('EMEF', values);
            });
            expect(capturedFormikProps.unidadesPorTipo).toHaveLength(1);
            expect(capturedFormikProps.unidadesPorTipo[0].uuid).toBe('outro');
        });
    });

    // ── vinculaUnidadeUsuario ─────────────────────────────────────────────────
    describe('vinculaUnidadeUsuario', () => {
        it('vincula unidade ao usuário com sucesso', async () => {
            setupDefaultMocks('SME');
            getUsuarioUnidadesVinculadas.mockResolvedValue([MOCK_UNIDADE]);
            const setFieldValue = jest.fn();
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.vinculaUnidadeUsuario(
                    { codigo_eol: '000001' },
                    { setFieldValue }
                );
            });
            expect(postVincularUnidadeUsuario).toHaveBeenCalledWith('42', { codigo_eol: '000001' });
            expect(setFieldValue).toHaveBeenCalledWith('unidades_vinculadas', [MOCK_UNIDADE]);
        });

        it('trata erro ao vincular unidade', async () => {
            setupDefaultMocks('SME');
            postVincularUnidadeUsuario.mockRejectedValue({ response: { data: 'Erro' } });
            renderComponent('SME', '42');
            await waitForRender();
            const setFieldValue = jest.fn();
            await act(async () => {
                await capturedFormikProps.vinculaUnidadeUsuario(
                    { codigo_eol: '000001' },
                    { setFieldValue }
                );
            });
            expect(postVincularUnidadeUsuario).toHaveBeenCalled();
        });

        it('não vincula quando id_usuario está ausente', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const setFieldValue = jest.fn();
            await act(async () => {
                await capturedFormikProps.vinculaUnidadeUsuario(
                    { codigo_eol: '000001' },
                    { setFieldValue }
                );
            });
            expect(postVincularUnidadeUsuario).not.toHaveBeenCalled();
        });
    });

    // ── desvinculaUnidadeUsuario ──────────────────────────────────────────────
    describe('desvinculaUnidadeUsuario', () => {
        it('desvincula unidade do usuário com sucesso', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.desvinculaUnidadeUsuario(
                    { uuid: 'uuid-u-1', codigo_eol: '000001' }
                );
            });
            expect(deleteDesvincularUnidadeUsuario).toHaveBeenCalledWith('42', '000001');
        });

        it('trata erro ao desvincular unidade', async () => {
            setupDefaultMocks('SME');
            deleteDesvincularUnidadeUsuario.mockRejectedValue({ response: { data: 'Erro' } });
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.desvinculaUnidadeUsuario(
                    { uuid: 'uuid-u-1', codigo_eol: '000001' }
                );
            });
            expect(deleteDesvincularUnidadeUsuario).toHaveBeenCalled();
        });

        it('não chama delete quando unidade não tem uuid', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.desvinculaUnidadeUsuario({ codigo_eol: '000001' });
            });
            expect(deleteDesvincularUnidadeUsuario).not.toHaveBeenCalled();
        });
    });

    // ── handleChangeGrupo ─────────────────────────────────────────────────────
    describe('handleChangeGrupo', () => {
        it('adiciona grupo quando checked=true', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const setFieldValue = jest.fn();
            act(() => {
                capturedFormikProps.handleChangeGrupo(
                    { target: { checked: true, value: '5' } },
                    setFieldValue,
                    { groups: ['3'] }
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith('groups', ['3', '5']);
        });

        it('remove grupo quando checked=false', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const setFieldValue = jest.fn();
            act(() => {
                capturedFormikProps.handleChangeGrupo(
                    { target: { checked: false, value: '3' } },
                    setFieldValue,
                    { groups: ['3', '5'] }
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith('groups', ['5']);
        });
    });

    // ── idUsuarioCondicionalMask ──────────────────────────────────────────────
    describe('idUsuarioCondicionalMask', () => {
        it('retorna mask de 7 dígitos para servidor', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.idUsuarioCondicionalMask('True')).toHaveLength(7);
        });

        it('retorna mask de 11 dígitos para não-servidor', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.idUsuarioCondicionalMask('False')).toHaveLength(11);
        });
    });

    // ── evitaDuplicacao ───────────────────────────────────────────────────────
    describe('evitaDuplicacao', () => {
        it('remove grupos duplicados combinando visões', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const grupos = [
                { id: 1, nome: 'G1', descricao: 'D1', visao: 'SME' },
                { id: 1, nome: 'G1', descricao: 'D1', visao: 'DRE' },
                { id: 2, nome: 'G2', descricao: 'D2', visao: 'UE' },
            ];
            const result = capturedFormikProps.evitaDuplicacao(grupos);
            expect(result).toHaveLength(2);
            expect(result[0].visao).toEqual(['SME', 'DRE']);
            expect(result[1].visao).toEqual(['UE']);
        });

        it('retorna lista vazia para array vazio', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            expect(capturedFormikProps.evitaDuplicacao([])).toHaveLength(0);
        });

        it('mantém único grupo sem duplicata', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            const grupos = [{ id: 1, nome: 'G1', descricao: 'D1', visao: 'SME' }];
            const result = capturedFormikProps.evitaDuplicacao(grupos);
            expect(result).toHaveLength(1);
            expect(result[0].visao).toEqual(['SME']);
        });
    });

    // ── buscaTipoUnidadeVisaoUE ───────────────────────────────────────────────
    describe('buscaTipoUnidadeVisaoUE', () => {
        it('trata erro ao buscar unidade UE sem lançar exceção', async () => {
            setupDefaultMocks('UE');
            getUnidadePorUuid.mockRejectedValue({ response: { data: 'Erro' } });
            renderComponent('UE');
            await waitForRender();
            expect(screen.getByTestId('gestao-perfis-formik')).toBeInTheDocument();
        });
    });

    // ── validacoesPersonalizadas ──────────────────────────────────────────────
    describe('validacoesPersonalizadas', () => {
        it('retorna erro quando username está vazio', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            let erros;
            await act(async () => {
                erros = await capturedFormikProps.validacoesPersonalizadas(
                    { username: '', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(erros.username).toBe('ID de Usuário é um campo obrigatório');
        });

        it('retorna erro de CPF inválido para não-servidor', async () => {
            setupDefaultMocks('SME');
            valida_cpf_cnpj.mockReturnValue(false);
            renderComponent('SME');
            await waitForRender();
            let erros;
            await act(async () => {
                erros = await capturedFormikProps.validacoesPersonalizadas(
                    { username: '123', e_servidor: 'False' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(erros.username).toBe('Digite um CPF válido (apenas dígitos)');
        });

        it('valida CPF válido para não-servidor e prossegue', async () => {
            setupDefaultMocks('SME');
            valida_cpf_cnpj.mockReturnValue(true);
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '12345678901', e_servidor: 'False' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(getUsuarioStatus).toHaveBeenCalledWith('12345678901', 'False');
        });

        it('chama getUsuarioStatus para SME', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(getUsuarioStatus).toHaveBeenCalledWith('1234567', 'True');
        });

        it('chama getUsuarioStatus com uuid_unidade para DRE', async () => {
            setupDefaultMocks('DRE');
            renderComponent('DRE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(getUsuarioStatus).toHaveBeenCalledWith('1234567', 'True', 'uuid-unidade-1');
        });

        it('chama serviceVisaoUE para visão UE', async () => {
            setupDefaultMocks('UE');
            renderComponent('UE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(getUsuarioStatus).toHaveBeenCalledWith('1234567', 'True', 'uuid-unidade-1');
        });

        it('trata erro de busca do usuário', async () => {
            setupDefaultMocks('SME');
            getUsuarioStatus.mockRejectedValue(new Error('Network error'));
            renderComponent('SME');
            await waitForRender();
            let erros;
            await act(async () => {
                erros = await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(erros.username).toBe('Erro ao buscar usuário, tente novamente');
        });

        it('redireciona quando usuário já tem user_id no sistema (SME)', async () => {
            setupDefaultMocks('SME');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: { info_core_sso: null, mensagem: '' },
                usuario_sig_escola: {
                    info_sig_escola: { user_id: 55, visoes: [], unidades: [] },
                    associacoes_que_e_membro: [],
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(window.location.assign).toHaveBeenCalledWith('/gestao-de-perfis-form/55');
        });

        it('redireciona quando usuário já tem user_id no sistema (DRE)', async () => {
            setupDefaultMocks('DRE');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: { info_core_sso: null, mensagem: '' },
                usuario_sig_escola: {
                    info_sig_escola: { user_id: 77, visoes: [], unidades: [] },
                    associacoes_que_e_membro: [],
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('DRE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(window.location.assign).toHaveBeenCalledWith('/gestao-de-perfis-form/77');
        });

        it('exibe modal info quando CoreSSO retorna erro', async () => {
            setupDefaultMocks('SME');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: {
                    info_core_sso: null,
                    mensagem: 'Erro ao buscar usuário no CoreSSO!',
                },
                usuario_sig_escola: { info_sig_escola: null, associacoes_que_e_membro: [] },
                mensagem: 'Mensagem de erro',
                e_servidor_na_unidade: true,
            });
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalInfo).toBe(true);
            expect(capturedFormikProps.tituloModalInfo).toBe('Erro ao criar o usuário');
        });

        it('exibe modal usuário cadastrado e vinculado', async () => {
            setupDefaultMocks('SME');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: {
                    info_core_sso: { nome: 'Test', email: 'test@test.com' },
                    mensagem: '',
                },
                usuario_sig_escola: {
                    info_sig_escola: {
                        user_id: null,
                        visoes: ['SME'],
                        unidades: [],
                    },
                    associacoes_que_e_membro: [],
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalUsuarioCadastradoVinculado).toBe(true);
        });

        it('serviceVisaoUE com não-servidor trata membro da associação', async () => {
            setupDefaultMocks('UE');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: { info_core_sso: null, mensagem: '' },
                usuario_sig_escola: {
                    info_sig_escola: null,
                    associacoes_que_e_membro: ['uuid-associacao-1'],
                },
                e_servidor_na_unidade: false,
            });
            renderComponent('UE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '12345678901', e_servidor: 'False' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            // e_membro = uuid-associacao-1 → membro encontrado, prossegue
            expect(getUsuarioStatus).toHaveBeenCalled();
        });

        it('serviceVisaoUE exibe modal quando usuário não é servidor da escola', async () => {
            setupDefaultMocks('UE');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: { info_core_sso: null, mensagem: '' },
                usuario_sig_escola: {
                    info_sig_escola: null,
                    associacoes_que_e_membro: [],
                },
                e_servidor_na_unidade: false,
            });
            renderComponent('UE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalInfo).toBe(true);
        });
    });

    // ── handleSubmitPerfisForm ────────────────────────────────────────────────
    describe('handleSubmitPerfisForm', () => {
        it('edita usuário com sucesso quando values.id existe', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: 99,
                        e_servidor: 'True',
                        username: '1234567',
                        name: 'Test',
                        email: 'test@test.com',
                        groups: ['1'],
                        visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(putEditarUsuario).toHaveBeenCalledWith(99, expect.objectContaining({
                username: '1234567',
            }));
            expect(window.location.assign).toHaveBeenCalledWith('/gestao-de-perfis/');
        });

        it('edita usuário com payload UE (sem visoes, com unidade)', async () => {
            setupDefaultMocks('UE');
            renderComponent('UE', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: 99,
                        e_servidor: 'True',
                        username: '1234567',
                        name: 'Test',
                        email: '',
                        groups: ['3'],
                        visoes: [],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(putEditarUsuario).toHaveBeenCalledWith(
                99,
                expect.objectContaining({ unidade: '000001' })
            );
        });

        it('não envia quando enviarFormulario=false (username vazio)', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();
            // Force enviarFormulario=false via validação
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    { username: '', groups: [], visoes: [], id: null, e_servidor: 'True' },
                    { resetForm: jest.fn() }
                );
            });
            expect(postCriarUsuario).not.toHaveBeenCalled();
            expect(putEditarUsuario).not.toHaveBeenCalled();
        });

        it('trata erro ao editar com username já existente', async () => {
            setupDefaultMocks('SME');
            putEditarUsuario.mockRejectedValue({
                response: { data: { username: ['Username já existe'] } },
            });
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: 99, e_servidor: 'True', username: '1234567',
                        name: 'Test', email: '', groups: ['1'], visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalInfo).toBe(true);
            expect(capturedFormikProps.textoModalInfo).toBe('Username já existe');
        });

        it('trata erro ao editar com mensagem genérica', async () => {
            setupDefaultMocks('SME');
            putEditarUsuario.mockRejectedValue({
                response: { data: ['Erro genérico do servidor'] },
            });
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: 99, e_servidor: 'True', username: '1234567',
                        name: 'Test', email: '', groups: ['1'], visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalInfo).toBe(true);
        });

        it('trata erro ao editar sem mensagem específica', async () => {
            setupDefaultMocks('SME');
            putEditarUsuario.mockRejectedValue({
                response: { data: {} },
            });
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: 99, e_servidor: 'True', username: '1234567',
                        name: 'Test', email: '', groups: ['1'], visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalInfo).toBe(true);
        });

        it('cria usuário com sucesso após validação (SME)', async () => {
            setupDefaultMocks('SME');
            // Status com info_sig_escola null → não redireciona, não mostra modal vinculado
            // serviceUsuarioNaoCadastrado sem values.username → usuario_nao_cadastrado=true (showModal)
            // Mas usuariosStatus fica setado
            // Para criar, precisa usuariosStatus.usuario_sig_escola.info_sig_escola = null
            renderComponent('SME');
            await waitForRender();

            // Primeiro valida para setar usuariosStatus
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });

            // Fecha modal se abriu
            act(() => { capturedFormikProps.handleCloseUsuarioNaoCadastrado({ resetForm: jest.fn() }); });

            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: null, e_servidor: 'True', username: '1234567',
                        name: 'Test', email: 'test@test.com',
                        groups: ['1'], visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(postCriarUsuario).toHaveBeenCalled();
            expect(window.location.assign).toHaveBeenCalledWith('/gestao-de-perfis-form/100');
        });

        it('trata erro ao criar usuário com username duplicado', async () => {
            setupDefaultMocks('SME');
            postCriarUsuario.mockRejectedValue({
                response: { data: { username: ['Username duplicado'] } },
            });
            renderComponent('SME');
            await waitForRender();

            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });

            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: null, e_servidor: 'True', username: '1234567',
                        name: 'Test', email: '', groups: ['1'], visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalInfo).toBe(true);
            expect(capturedFormikProps.textoModalInfo).toBe('Username duplicado');
        });

        it('trata erro ao criar usuário sem mensagem de username', async () => {
            setupDefaultMocks('SME');
            postCriarUsuario.mockRejectedValue({
                response: { data: {} },
            });
            renderComponent('SME');
            await waitForRender();

            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });

            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: null, e_servidor: 'True', username: '1234567',
                        name: 'Test', email: '', groups: ['1'], visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalInfo).toBe(true);
        });

        it('grupos concatenados sem repetição no payload', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME', '42');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: 99, e_servidor: 'True', username: '1234567',
                        name: 'Test', email: '', groups: ['1', '2', '1'],
                        visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            const payload = putEditarUsuario.mock.calls[0][1];
            const grupos = payload.groups;
            const unique = [...new Set(grupos)];
            expect(grupos).toEqual(unique);
        });

        it('edita via usuariosStatus.user_id quando values.id é nulo', async () => {
            setupDefaultMocks('SME');
            // Validate first to populate usuariosStatus with user_id
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: { info_core_sso: null, mensagem: '' },
                usuario_sig_escola: {
                    info_sig_escola: { user_id: 88, visoes: [], unidades: [] },
                    associacoes_que_e_membro: [],
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('SME');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            // Now submit without values.id — uses usuariosStatus.user_id (line 557)
            await act(async () => {
                await capturedFormikProps.handleSubmitPerfisForm(
                    {
                        id: null, e_servidor: 'True', username: '1234567',
                        name: 'Test', email: '', groups: ['1'], visoes: ['SME'],
                    },
                    { resetForm: jest.fn() }
                );
            });
            expect(putEditarUsuario).toHaveBeenCalledWith(88, expect.any(Object));
        });
    });

    // ── serviceUsuarioCadastrado com info_core_sso (linhas 365-367) ───────────
    describe('serviceUsuarioCadastrado com info_core_sso preenchido', () => {
        it('SME: preenche name e email quando info_core_sso existe', async () => {
            setupDefaultMocks('SME');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: {
                    info_core_sso: { nome: 'Fulano', email: 'fulano@test.com' },
                    mensagem: '',
                },
                usuario_sig_escola: { info_sig_escola: null, associacoes_que_e_membro: [] },
                e_servidor_na_unidade: true,
            });
            renderComponent('SME');
            await waitForRender();
            const setFieldValue = jest.fn();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue, resetForm: jest.fn() }
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith('name', 'Fulano');
            expect(setFieldValue).toHaveBeenCalledWith('email', 'fulano@test.com');
        });

        it('DRE: preenche name e email via serviceVisaoDre (linha 434)', async () => {
            setupDefaultMocks('DRE');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: {
                    info_core_sso: { nome: 'Ciclano', email: 'ciclano@test.com' },
                    mensagem: '',
                },
                usuario_sig_escola: { info_sig_escola: null, associacoes_que_e_membro: [] },
                e_servidor_na_unidade: true,
            });
            renderComponent('DRE');
            await waitForRender();
            const setFieldValue = jest.fn();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue, resetForm: jest.fn() }
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith('name', 'Ciclano');
            expect(setFieldValue).toHaveBeenCalledWith('email', 'ciclano@test.com');
        });

        it('DRE: serviceVisaoDre com usuário cadastrado e vinculado (linha 433)', async () => {
            setupDefaultMocks('DRE');
            getCodigoEolUnidade.mockResolvedValue({ codigo_eol: '000001' });
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: {
                    info_core_sso: { nome: 'Beltrano', email: 'b@t.com' },
                    mensagem: '',
                },
                usuario_sig_escola: {
                    info_sig_escola: {
                        user_id: null,
                        visoes: ['DRE'],
                        unidades: ['000001'],
                    },
                    associacoes_que_e_membro: [],
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('DRE');
            await waitForRender();
            const resetForm = jest.fn();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue: jest.fn(), resetForm }
                );
            });
            expect(capturedFormikProps.showModalUsuarioCadastradoVinculado).toBe(true);
        });
    });

    // ── serviceVisaoUE branches ───────────────────────────────────────────────
    describe('serviceVisaoUE branches adicionais', () => {
        it('não-servidor + não membro da associação exibe modal (linhas 397-401)', async () => {
            setupDefaultMocks('UE');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: { info_core_sso: null, mensagem: '' },
                usuario_sig_escola: {
                    info_sig_escola: null,
                    associacoes_que_e_membro: [], // não é membro
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('UE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '12345678901', e_servidor: 'False' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            expect(capturedFormikProps.showModalInfo).toBe(true);
            expect(capturedFormikProps.tituloModalInfo).toBe('Erro ao criar o usuário');
        });

        it('não-servidor + membro + não cadastrado: exibe modal usuário não cadastrado (linha 424)', async () => {
            setupDefaultMocks('UE');
            getMembroAssociacao.mockResolvedValue(null); // não é membro na associação (getMembroAssociacao)
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: { info_core_sso: null, mensagem: '' },
                usuario_sig_escola: {
                    info_sig_escola: null,
                    associacoes_que_e_membro: ['uuid-associacao-1'], // é membro
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('UE');
            await waitForRender();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '12345678901', e_servidor: 'False' },
                    { setFieldValue: jest.fn(), resetForm: jest.fn() }
                );
            });
            // serviceUsuarioNaoCadastrado returns true → showModalUsuarioNaoCadastrado
            expect(capturedFormikProps.showModalUsuarioNaoCadastrado).toBe(true);
        });

        it('não-servidor + membro + cadastrado como membro associação: preenche campos (linhas 373-375)', async () => {
            setupDefaultMocks('UE');
            getMembroAssociacao.mockResolvedValue([{ nome: 'Membro', email: 'm@m.com' }]);
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: { info_core_sso: null, mensagem: '' },
                usuario_sig_escola: {
                    info_sig_escola: null,
                    associacoes_que_e_membro: ['uuid-associacao-1'],
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('UE');
            await waitForRender();
            const setFieldValue = jest.fn();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '12345678901', e_servidor: 'False' },
                    { setFieldValue, resetForm: jest.fn() }
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith('name', 'Membro');
            expect(setFieldValue).toHaveBeenCalledWith('email', 'm@m.com');
        });

        it('servidor + é servidor da escola + não cadastrado/vinculado: chama serviceUsuarioCadastrado (UE)', async () => {
            setupDefaultMocks('UE');
            getUsuarioStatus.mockResolvedValue({
                validacao_username: { username_e_valido: true },
                usuario_core_sso: {
                    info_core_sso: { nome: 'Servidor', email: 's@s.com' },
                    mensagem: '',
                },
                usuario_sig_escola: {
                    info_sig_escola: null,
                    associacoes_que_e_membro: [],
                },
                e_servidor_na_unidade: true,
            });
            renderComponent('UE');
            await waitForRender();
            const setFieldValue = jest.fn();
            await act(async () => {
                await capturedFormikProps.validacoesPersonalizadas(
                    { username: '1234567', e_servidor: 'True' },
                    { setFieldValue, resetForm: jest.fn() }
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith('name', 'Servidor');
        });
    });

    // ── getEstadoInicialVisoesChecked e acessoCadastrarUnidade ────────────────
    describe('getEstadoInicialVisoesChecked / getEstadoInicialGruposChecked / acessoCadastrarUnidade', () => {
        it('getEstadoInicialVisoesChecked percorre elementos name=visoes (linhas 717-718)', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();

            // Add fake visoes inputs to the document
            const input1 = document.createElement('input');
            input1.setAttribute('name', 'visoes');
            input1.setAttribute('id', 'SME');
            input1.checked = true;
            document.body.appendChild(input1);

            const input2 = document.createElement('input');
            input2.setAttribute('name', 'visoes');
            input2.setAttribute('id', 'DRE');
            input2.checked = false;
            document.body.appendChild(input2);

            let result;
            act(() => {
                result = capturedFormikProps.getEstadoInicialVisoesChecked();
            });

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ nome: 'SME', checked: true });
            expect(result[1]).toEqual({ nome: 'DRE', checked: false });

            // Cleanup
            document.body.removeChild(input1);
            document.body.removeChild(input2);
        });

        it('getEstadoInicialGruposChecked percorre elementos name=groups (linhas 746-747)', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();

            const input1 = document.createElement('input');
            input1.setAttribute('name', 'groups');
            input1.setAttribute('id', 'grupo-1');
            input1.checked = true;
            document.body.appendChild(input1);

            let result;
            act(() => {
                result = capturedFormikProps.getEstadoInicialGruposChecked();
            });

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ nome: 'grupo-1', checked: true });

            document.body.removeChild(input1);
        });

        it('acessoCadastrarUnidade retorna checked quando visoesChecked é não-vazio (linhas 760-762)', async () => {
            setupDefaultMocks('SME');
            renderComponent('SME');
            await waitForRender();

            // Populate visoesChecked via getEstadoInicialVisoesChecked
            const input = document.createElement('input');
            input.setAttribute('name', 'visoes');
            input.setAttribute('id', 'SME');
            input.checked = true;
            document.body.appendChild(input);

            act(() => { capturedFormikProps.getEstadoInicialVisoesChecked(); });

            const resultado = capturedFormikProps.acessoCadastrarUnidade('SME');
            expect(resultado).toBe(true);

            document.body.removeChild(input);
        });
    });
});
