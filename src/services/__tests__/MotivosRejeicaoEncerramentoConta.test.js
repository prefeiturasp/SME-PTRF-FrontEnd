import api from '../api';
import {
    getMotivosRejeicaoEncerramentoConta,
    postMotivosRejeicaoEncerramentoConta,
    patchMotivosRejeicaoEncerramentoConta,
    deleteMotivoRejeicaoEncerramentoConta
} from '../MotivosRejeicaoEncerramentoConta.service.js';
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

    test('getMotivosRejeicaoEncerramentoConta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const nome = 'teste'
        const currentPage = '1'
        const filter = {
            nome: nome,
        }
        const params = {
            nome: nome,
            page: currentPage,
        }
        const result = await getMotivosRejeicaoEncerramentoConta(filter, currentPage);
        const url = `/api/motivos-rejeicao-encerramento-conta/`
        expect(api.get).toHaveBeenCalledWith(url, { ...authHeader(), params })
        expect(result).toEqual(result);
    });

    test('postMotivosRejeicaoEncerramentoConta deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMotivosRejeicaoEncerramentoConta(payload);
        const url = `api/motivos-rejeicao-encerramento-conta/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });
    
    test('patchMotivosRejeicaoEncerramentoConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const uuidMotivoRejeicaoEncerramentoConta = '1234'
        const result = await patchMotivosRejeicaoEncerramentoConta(uuidMotivoRejeicaoEncerramentoConta, payload);
        const url = `api/motivos-rejeicao-encerramento-conta/${uuidMotivoRejeicaoEncerramentoConta}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });
    
    test('deleteMotivoRejeicaoEncerramentoConta deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const uuidMotivoRejeicaoEncerramentoConta = '1234'
        const result = await deleteMotivoRejeicaoEncerramentoConta(uuidMotivoRejeicaoEncerramentoConta, payload);
        const url = `api/motivos-rejeicao-encerramento-conta/${uuidMotivoRejeicaoEncerramentoConta}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

});
