import api from '../../api';
import { 
    salvarItensRegularidade,
    verificacaoRegularidade
 } from '../RegularidadeUnidadeEducaional.service.js';
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

    test('salvarItensRegularidade  deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await salvarItensRegularidade (associacao_uuid, payload);
        const url = `/api/associacoes/${associacao_uuid}/atualiza-itens-verificacao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('verificacaoRegularidade  deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const result = await verificacaoRegularidade (associacao_uuid);
        let ano;
        if (!ano){
            ano = new Date().getFullYear()
        }
        const url = `/api/associacoes/${associacao_uuid}/verificacao-regularidade/?ano=${ano}`
        
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

});