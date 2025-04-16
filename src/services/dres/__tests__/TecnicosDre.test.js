import api from '../../api';
import { 
    getTecnicosDre,
    createTecnicoDre,
    deleteTecnicoDre,
    getTecnicoDre,
    getTecnicoDrePorRf,
    updateTecnicoDre
 } from '../TecnicosDre.service.js';
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

    test('getTecnicoDre deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const uuid_tecnico = '1234'
        const result = await getTecnicoDre(uuid_tecnico);
        const url = `api/tecnicos-dre/${uuid_tecnico}/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTecnicoDrePorRf deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const rf = '1234'
        const result = await getTecnicoDrePorRf(rf);
        const url = `api/tecnicos-dre/?rf=${rf}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTecnicosDre deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const uuid_dre = '1234'
        const result = await getTecnicosDre(uuid_dre);
        const url = `api/tecnicos-dre/?dre__uuid=${uuid_dre}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('createTecnicoDre deve chamar a API corretamente', async () =>{
        api.post.mockResolvedValue({ data: mockData })
        const result = await createTecnicoDre(payload);
        const url = `api/tecnicos-dre/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('createTecnicoDre deve chamar a API com error', async () =>{
        api.post.mockRejectedValue(new Error("erro na API"))
        const result = await createTecnicoDre(payload);
        const url = `api/tecnicos-dre/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(api.post).rejects.toThrow("erro na API");
    });

    test('updateTecnicoDre deve chamar a API corretamente', async () =>{
        api.patch.mockResolvedValue({ data: mockData })
        const uuid_tecnico = '1234'
        const result = await updateTecnicoDre(uuid_tecnico,payload);
        const url = `api/tecnicos-dre/${uuid_tecnico}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('deleteTecnicoDre deve chamar a API corretamente', async () =>{
        api.delete.mockResolvedValue({ data: mockData })
        const transferir_para = '1234'
        const uuid_tecnico = '1234'
        const result = await deleteTecnicoDre(uuid_tecnico, transferir_para);
        const url = `api/tecnicos-dre/${uuid_tecnico}${transferir_para ? "?transferir_para="+transferir_para : ''}`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });

});