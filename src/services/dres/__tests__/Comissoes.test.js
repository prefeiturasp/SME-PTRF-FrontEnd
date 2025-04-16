import api from '../../api';
import { 
    getMembrosComissao,
    getComissoes,
    getMembrosComissaoFiltro,
    postMembroComissao,
    patchMembroComissao,
    deleteMembroComissao
 } from '../Comissoes.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
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

    test('getMembrosComissao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const result = await getMembrosComissao(dreUuid);
        const url = `api/membros-comissoes/?dre__uuid=${dreUuid}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getComissoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const result = await getComissoes();
        const url = `api/comissoes/`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getMembrosComissaoFiltro deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const comissaoUuid = 'teste'
        const nomeOuRf = 'teste'
        const result = await getMembrosComissaoFiltro(dreUuid, comissaoUuid, nomeOuRf);
        const url = `api/membros-comissoes/?dre__uuid=${dreUuid}&comissao_uuid=${comissaoUuid}&nome_ou_rf=${nomeOuRf}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getMembrosComissaoFiltro deve chamar a API quando comissaoUuid for null', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const comissaoUuid = null
        const nomeOuRf = 'teste'
        const result = await getMembrosComissaoFiltro(dreUuid, comissaoUuid, nomeOuRf);
        const url = `api/membros-comissoes/?dre__uuid=${dreUuid}&nome_ou_rf=${nomeOuRf}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('postMembroComissao deve chamar a API quando comissaoUuid for null', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes'}
        const result = await postMembroComissao(payload);
        const url = `/api/membros-comissoes/`
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(result).toEqual({data: mockData});
    });

    test('patchMembroComissao deve chamar a API quando comissaoUuid for null', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const membro_comissao_uuid = '1234'
        const payload = { teste: 'testes'}
        const result = await patchMembroComissao(membro_comissao_uuid, payload);
        const url = `/api/membros-comissoes/${membro_comissao_uuid}/`
        expect(api.patch).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('deleteMembroComissao deve chamar a API quando comissaoUuid for null', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const membro_comissao_uuid = '1234'
        const result = await deleteMembroComissao(membro_comissao_uuid);
        const url = `/api/membros-comissoes/${membro_comissao_uuid}/`
        expect(api.delete).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

});
