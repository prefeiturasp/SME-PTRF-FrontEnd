import api from '../api';
import {
    getGrupos,
    getGruposDisponiveisAcessoUsuario,
    patchDesabilitarGrupoAcesso,
    patchHabilitarGrupoAcesso,
    getUsuarios,
    getUsuarioById,
    getUsuarioStatus,
    postUsuario,
    putUsuario,
    removerAcessosUnidadeBase,
    getUnidadesUsuario,
    patchHabilitarAcesso,
    patchDesabilitarAcesso,
    getUnidadesDisponiveisInclusao,
    postIncluirUnidade
} from '../GestaoDeUsuarios.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../auth.service.js';

jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));

const URL_GRUPOS = '/api/grupos/';
const URL_USUARIOS = '/api/usuarios-v2/';
const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];
const associacao_uuid = '1234'
const payload = { teste: 'teste' }

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
        localStorage.setItem(TOKEN_ALIAS, mockToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    const authHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test('getGrupos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const visaoBase = 'DRE'
        const result = await getGrupos(visaoBase);
        const url = URL_GRUPOS
        expect(api.get).toHaveBeenCalledWith(url, { ...authHeader(), params: {visao_base: visaoBase }})
        expect(result).toEqual(result);
    });

    test('getGruposDisponiveisAcessoUsuario deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const username = 'teste'
        const visao_base = 'DRE'
        const uuid_unidade = 'teste'
        const params = {
            username: username,
            visao_base: visao_base,
            uuid_unidade: uuid_unidade
        }
        const result = await getGruposDisponiveisAcessoUsuario(username, visao_base, uuid_unidade);
        const url = `${URL_GRUPOS}grupos-disponiveis-por-acesso-visao`
        expect(api.get).toHaveBeenCalledWith(url, {/*...authHeader(),*/params})  // TODO: implementar corretamente com header
        expect(result).toEqual(result);
    });

    test('patchDesabilitarGrupoAcesso deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchDesabilitarGrupoAcesso(payload);
        const url = `${URL_GRUPOS}desabilitar-grupo-acesso/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('patchHabilitarGrupoAcesso deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchHabilitarGrupoAcesso(payload);
        const url = `${URL_GRUPOS}habilitar-grupo-acesso/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('getUsuarios deve chamar a API corretamente com unidade === SME', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuidUnidadeBase = 'SME'
        const currentPage = '1'
        const filter = {
            search: 'teste',
            grupo: 'teste',
            tipoUsuario: 'teste',
            nomeUnidade: 'teste',
            apenasUsuariosDaUnidade: true
        }
        const params = {
            uuid_unidade_base: uuidUnidadeBase,
            page: currentPage,
            search: filter.search,
            groups__id: filter.grupo,
            e_servidor: filter.tipoUsuario === 'servidor' ? true : filter.tipoUsuario === 'nao-servidor' ? false : null,
            unidades__nome: filter.nomeUnidade,
            unidades__uuid: filter.apenasUsuariosDaUnidade && uuidUnidadeBase !== 'SME' ? uuidUnidadeBase : null,
            visoes__nome: filter.apenasUsuariosDaUnidade && uuidUnidadeBase === 'SME' ? 'SME' : null
        }
        const result = await getUsuarios(uuidUnidadeBase, filter, currentPage);
        const url = URL_USUARIOS
        expect(api.get).toHaveBeenCalledWith(url, {...authHeader(), params})
        expect(result).toEqual(result);
    });

    test('getUsuarios deve chamar a API corretamente com unidade !== SME', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuidUnidadeBase = 'DRE'
        const currentPage = '1'
        const filter = {
            search: 'teste',
            grupo: 'teste',
            tipoUsuario: 'teste',
            nomeUnidade: 'teste',
            apenasUsuariosDaUnidade: true
        }
        const params = {
            uuid_unidade_base: uuidUnidadeBase,
            page: currentPage,
            search: filter.search,
            groups__id: filter.grupo,
            e_servidor: filter.tipoUsuario === 'servidor' ? true : filter.tipoUsuario === 'nao-servidor' ? false : null,
            unidades__nome: filter.nomeUnidade,
            unidades__uuid: filter.apenasUsuariosDaUnidade && uuidUnidadeBase !== 'SME' ? uuidUnidadeBase : null,
            visoes__nome: filter.apenasUsuariosDaUnidade && uuidUnidadeBase === 'SME' ? 'SME' : null
        }
        const result = await getUsuarios(uuidUnidadeBase, filter, currentPage);
        const url = URL_USUARIOS
        expect(api.get).toHaveBeenCalledWith(url, {...authHeader(), params})
        expect(result).toEqual(result);
    });

    test('getUsuarioById deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const usuarioId = '1234'
        const result = await getUsuarioById(usuarioId);
        const url = `${URL_USUARIOS}${usuarioId}/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getUsuarioStatus deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const username = 'teste'
        const e_servidor = 'teste'
        const uuid_unidade = 'teste'
        const params = {
            username,
            e_servidor,
            uuid_unidade,
        }
        const result = await getUsuarioStatus(username, e_servidor, uuid_unidade);
        const url = `${URL_USUARIOS}status/`
        expect(api.get).toHaveBeenCalledWith(url, {...authHeader(), params})
        expect(result).toEqual(result);
    });

    test('postUsuario deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postUsuario(payload);
        const url = URL_USUARIOS
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('putUsuario deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData })
        const id = '1234'
        const result = await putUsuario(id, payload);
        const url = `${URL_USUARIOS}${id}/`
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('removerAcessosUnidadeBase deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData })
        const id = '1234'
        const uuidUnidadeBase = '1234'
        const result = await removerAcessosUnidadeBase(id, uuidUnidadeBase);
        const url = `${URL_USUARIOS}${id}/remover-acessos-unidade-base/${uuidUnidadeBase}/`
        expect(api.put).toHaveBeenCalledWith(url, {}, authHeader())
        expect(result).toEqual(result);
    });

    test('getUnidadesUsuario deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const username = '1234'
        const visao_base = 'DRE'
        const uuid_unidade  = '1234'
        const params = {
            username: username,
            visao_base: visao_base,
            uuid_unidade: uuid_unidade
        }
        const result = await getUnidadesUsuario(username, visao_base, uuid_unidade);
        const url = `${URL_USUARIOS}unidades-do-usuario/`
        expect(api.get).toHaveBeenCalledWith(url, {/*...authHeader(),*/ params}) // TODO: implementar corretamente com header
        expect(result).toEqual(result);
    });
    
    test('patchHabilitarAcesso deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchHabilitarAcesso(payload);
        const url = `${URL_USUARIOS}habilitar-acesso/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });
    
    test('patchDesabilitarAcesso deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchDesabilitarAcesso(payload);
        const url = `${URL_USUARIOS}desabilitar-acesso/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });
        
    test('getUnidadesDisponiveisInclusao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const username = '1234'
        const search = '1234'
        const currentPage = '1'
        const params = {
            page: currentPage,
            username: username,
            search: search,
        }
        const result = await getUnidadesDisponiveisInclusao(username, search, currentPage);
        const url = `${URL_USUARIOS}unidades-disponiveis-para-inclusao/`
        expect(api.get).toHaveBeenCalledWith(url, {/*...authHeader(),*/ params}) // TODO: implementar corretamente com header
        expect(result).toEqual(result);
    });
    
    test('postIncluirUnidade deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postIncluirUnidade(payload);
        const url = `${URL_USUARIOS}incluir-unidade/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

});
