import api from '../../api';
import { 
    getAtaParecerTecnico,
    getInfoContas,
    getListaPresentesPadrao,
    postEdicaoAtaParecerTecnico,
    getDownloadAtaParecerTecnico
 } from '../AtasParecerTecnico.service.js';
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
const uuid_ata = '1234'
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

    test('getAtaParecerTecnico deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAtaParecerTecnico(uuid_ata);
        const url = `api/ata-parecer-tecnico/${uuid_ata}/`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getInfoContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const periodo_uuid = '1234'
        const result = await getInfoContas(dre_uuid, periodo_uuid, uuid_ata);
        const url = `api/ata-parecer-tecnico/info-ata/?dre=${dre_uuid}&periodo=${periodo_uuid}&ata=${uuid_ata}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getListaPresentesPadrao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dre_uuid = '1234'
        const ata_uuid = uuid_ata
        const result = await getListaPresentesPadrao(dre_uuid, ata_uuid);
        const url = `api/ata-parecer-tecnico/membros-comissao-exame-contas/?dre=${dre_uuid}&ata=${ata_uuid}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    it('getDownloadAtaParecerTecnico deve baixar o arquivo corretamente na API', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
        const ata_uuid = uuid_ata;
        api.get.mockResolvedValue(mockResponse);
        const mockCreateObjectURL = jest.fn(() => 'blob:http://dummy-url');
        window.URL.createObjectURL = mockCreateObjectURL;

        const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation(() => {
            return {
                setAttribute: jest.fn(),
                click: jest.fn(),
                href: '',
            };
        });

        await getDownloadAtaParecerTecnico(uuid_ata);

        expect(api.get).toHaveBeenCalledWith(
            `api/consolidados-dre/download-ata-parecer-tecnico/?ata=${ata_uuid}`,
            expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

    test('postEdicaoAtaParecerTecnico deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const ata_uuid = uuid_ata
        const payload = { teste: 'testes' }
        const result = await postEdicaoAtaParecerTecnico(ata_uuid, payload);
        const url = `/api/ata-parecer-tecnico/${ata_uuid}/`
        expect(api.patch).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(result).toEqual(mockData);
    });
    
});
