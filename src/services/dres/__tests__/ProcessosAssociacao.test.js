import api from '../../api';
import { 
    updateProcessoAssociacao,
    createProcessoAssociacao,
    deleteProcessoAssociacao,
    getPeriodosDisponiveis
 } from '../ProcessosAssociacao.service.js';
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
const associacao_uuid = '1234'
const payload = { nome: 'Teste 1' }


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

    test('createProcessoAssociacao deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await createProcessoAssociacao(payload);
        const url = `api/processos-associacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('updateProcessoAssociacao deve chamar a API corretamente', async () =>{
        api.patch.mockResolvedValue({ data: mockData })
        const uuid_processo = '1234'
        const result = await updateProcessoAssociacao(uuid_processo, payload);
        const url = `api/processos-associacao/${uuid_processo}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('deleteProcessoAssociacao deve chamar a API corretamente', async () =>{
        api.delete.mockResolvedValue({ data: mockData })
        const uuid_processo = '1234'
        const result = await deleteProcessoAssociacao(uuid_processo);
        const url = `api/processos-associacao/${uuid_processo}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('getPeriodosDisponiveis deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        let processo_uuid = '1234'
        let ano = '2025'
        const result = await getPeriodosDisponiveis(associacao_uuid, ano, processo_uuid);
        const url = `api/processos-associacao/periodos-disponiveis/?associacao_uuid=${associacao_uuid}&ano=${ano}${processo_uuid ? "&processo_uuid="+processo_uuid : ""}`
        
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

});