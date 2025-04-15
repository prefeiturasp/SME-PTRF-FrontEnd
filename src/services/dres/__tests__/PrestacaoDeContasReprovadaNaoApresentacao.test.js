import api from '../../api';
import { 
    postPrestacaoContaReprovadaNaoApresentacao,
    getPrestacaoContaReprovadaNaoApresentacao,
    postNotificarPrestacaoContaReprovadaNaoApresentacao
 } from '../PrestacaoDeContasReprovadaNaoApresentacao.service.js';
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

    test('postPrestacaoContaReprovadaNaoApresentacao deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postPrestacaoContaReprovadaNaoApresentacao(payload);
        const url = `api/prestacoes-contas-reprovadas-nao-apresentacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('postNotificarPrestacaoContaReprovadaNaoApresentacao deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await postNotificarPrestacaoContaReprovadaNaoApresentacao(payload);
        const url = `/api/notificacoes/notificar-prestacao-conta-reprovada-nao-apresentacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('getPrestacaoContaReprovadaNaoApresentacao deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const prestacao_conta_uuid = '1234'
        const result = await getPrestacaoContaReprovadaNaoApresentacao(prestacao_conta_uuid);
        const url = `api/prestacoes-contas-reprovadas-nao-apresentacao/${prestacao_conta_uuid}/`
        
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
   
});