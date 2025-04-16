import api from '../../api';
import { 
    getUnidade,
    salvaDadosDiretoria,
    getUnidades
 } from '../Unidades.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';
import { visoesService } from '../../visoes.service.js';

jest.mock('../../visoes.service.js', ()=>({
    visoesService: {
        getItemUsuarioLogado: jest.fn()
    }
}));

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

    test('getUnidade deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const result = await getUnidade();
        const url = `api/unidades/${visoesService.getItemUsuarioLogado('unidade_selecionada.uuid')}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('salvaDadosDiretoria deve chamar a API corretamente', async () =>{
        api.patch.mockResolvedValue({ data: mockData })
        const uuid_unidade = '1234'
        const result = await salvaDadosDiretoria(uuid_unidade, payload);
        const url = `api/unidades/${uuid_unidade}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });
    
    test('getUnidades deve chamar a API corretamente com dreUuid E search', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const search = 'teste'
        const result = await getUnidades(dreUuid, search);
        let url =  `api/unidades/?dre__uuid=${dreUuid}&search=${search}`
        
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getUnidades deve chamar a API corretamente com dreUuid, apenas', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const search = ''
        const result = await getUnidades(dreUuid, search);
        let url =  `api/unidades/?dre__uuid=${dreUuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getUnidades deve chamar a API corretamente com search, apenas', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = ''
        const search = 'teste'
        const result = await getUnidades(dreUuid, search);
        let url = `api/unidades/?search=${search}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

});