import api from '../api';
import {
    getUsuario,
    getMembroAssociacao,
    getUsuarioStatus,
    getCodigoEolUnidade,
    getGrupos,
    getVisoes,
    getConsultarUsuario,
    getUsuariosFiltros,
    getUsuarios,
    getUsuarioUnidadesVinculadas,
    getUnidadesPorTipo,
    getUnidadePorUuid,
    postCriarUsuario,
    postVincularUnidadeUsuario,
    putEditarUsuario,
    deleteUsuario,
    deleteDesvincularUnidadeUsuario
} from '../GestaoDePerfis.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../auth.service.js';

jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


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

    test('getUsuario deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const id_usuario = '1234'
        const result = await getUsuario(id_usuario);
        const url = `/api/usuarios/${id_usuario}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getMembroAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const membro_associacao_cpf = '1234'
        const result = await getMembroAssociacao(associacao_uuid, membro_associacao_cpf);
        const url = `/api/membros-associacao/?associacao_uuid=${associacao_uuid}&cpf=${membro_associacao_cpf}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getUsuarioStatus deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const username = 'teste'
        const e_servidor = 'teste'
        const uuid_unidade = 'teste'
        const result = await getUsuarioStatus(username, e_servidor, uuid_unidade);
        const url = `/api/usuarios/status/?username=${username}&servidor=${e_servidor}${uuid_unidade ? "&unidade=" + uuid_unidade : "" }`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getCodigoEolUnidade deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_unidade = 'teste'
        const result = await getCodigoEolUnidade(uuid_unidade);
        const url = `/api/unidades/${uuid_unidade}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getGrupos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const visao_selecionada = 'SME'
        const result = await getGrupos(visao_selecionada);
        const url = `/api/usuarios/grupos/?visao=${visao_selecionada}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getVisoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getVisoes();
        const url = `/api/usuarios/visoes/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getConsultarUsuario deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const visao_selecionada = 'teste'
        const username = 'teste'
        const result = await getConsultarUsuario(visao_selecionada, username);
        const url = `/api/usuarios/consultar/?visao=${visao_selecionada}&username=${username}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getUsuarioUnidadesVinculadas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const usuario_id = 'teste'
        const visao = 'teste'
        const unidade_logada_uuid = 'teste'
        const result = await getUsuarioUnidadesVinculadas(usuario_id, visao, unidade_logada_uuid);
        const url = `/api/usuarios/${usuario_id}/unidades-e-permissoes-na-visao/${visao}/${unidade_logada_uuid ? "?unidade_logada_uuid="+unidade_logada_uuid : ""}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getUnidadesPorTipo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const tipo_unidade = 'teste'
        const dre_uuid = 'teste'
        const result = await getUnidadesPorTipo(tipo_unidade, dre_uuid);
        const url = `/api/unidades/?tipo_unidade=${tipo_unidade}${dre_uuid ? "&dre__uuid=" + dre_uuid : ""}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getUnidadePorUuid deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_unidade = 'teste'
        const result = await getUnidadePorUuid(uuid_unidade);
        const url = `api/unidades/${uuid_unidade}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('postCriarUsuario deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postCriarUsuario(payload);
        const url = `/api/usuarios/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('postVincularUnidadeUsuario deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const usuario_id = '1234'
        const result = await postVincularUnidadeUsuario(usuario_id, payload);
        const url = `/api/usuarios/${usuario_id}/unidades/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('putEditarUsuario deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData })
        const usuario_id = '1234'
        const result = await putEditarUsuario(usuario_id, payload);
        const url = `/api/usuarios/${usuario_id}/`
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('deleteUsuario deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const usuario_id = '1234'
        const result = await deleteUsuario(usuario_id);
        const url = `/api/usuarios/${usuario_id}`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('deleteDesvincularUnidadeUsuario deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const usuario_id = '1234'
        const unidade_codigo_eol = '1234'
        const result = await deleteDesvincularUnidadeUsuario(usuario_id, unidade_codigo_eol);
        const url = `/api/usuarios/${usuario_id}/unidades/${unidade_codigo_eol}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getUsuariosFiltros deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const visao_selecionada='DRE'
        const nome="teste"
        const group="teste"
        const tipo_de_usuario="teste"
        const unidade_nome="teste"
        const unidade_selecionada="teste"
        const result = await getUsuariosFiltros(visao_selecionada, nome, group, tipo_de_usuario, unidade_nome, unidade_selecionada);
        const url = `/api/usuarios/?visao=${visao_selecionada}${'&unidade_uuid='+unidade_selecionada}${nome ? '&search='+nome : ''}${group ? '&groups__id='+group : ''}${tipo_de_usuario ? '&servidor='+tipo_de_usuario : ''}${unidade_nome ? '&unidade_nome='+unidade_nome : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getUsuarios deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const visao_selecionada='DRE'
        const nome="teste"
        const group="teste"
        const tipo_de_usuario="teste"
        const unidade_nome="teste"
        const unidade_selecionada="teste"
        const result = await getUsuarios(visao_selecionada, nome, group, tipo_de_usuario, unidade_nome, unidade_selecionada);
        const url = `/api/usuarios/?visao=${visao_selecionada}${'&unidade_uuid='+unidade_selecionada}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

});
