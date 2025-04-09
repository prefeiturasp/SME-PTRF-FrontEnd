import api from '../../api';
import { 
    getListaValoresReprogramados,
    filtrosListaValoresReprogramados,
    getTabelaValoresReprogramados
 } from '../ValoresReprogramadosDre.service.js';
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

    test('getListaValoresReprogramados deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const status_padrao = 'STATUS'
        const result = await getListaValoresReprogramados(dreUuid, status_padrao);
        const url = `api/valores-reprogramados/lista-associacoes/?dre_uuid=${dreUuid}&status=${status_padrao}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('filtrosListaValoresReprogramados deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const status_valores = 'STATUS'
        const tipo_unidade = 'teste'
        const search = 'teste'
        const result = await filtrosListaValoresReprogramados(dreUuid, search, tipo_unidade, status_valores);
        const url = `api/valores-reprogramados/lista-associacoes/?dre_uuid=${dreUuid}&search=${search}&tipo_unidade=${tipo_unidade}&status=${status_valores}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getTabelaValoresReprogramados deve chamar a API corretamente', async () =>{
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelaValoresReprogramados();
        const url = `/api/valores-reprogramados/tabelas`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
  

});