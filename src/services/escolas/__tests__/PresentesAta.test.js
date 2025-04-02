import api from '../../api';
import { 
    getListaPresentesAgrupados,
    getListaPresentes,
    getListaPresentesPadrao,
    getMembroPorIdentificador,
    postEdicaoAta,
    getParticipantesOrdenadosPorCargo
 } from '../PresentesAta.service.js';
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
    const getAuthHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test ('getListaPresentesAgrupados deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });

        const result = await getListaPresentesAgrupados(uuid_ata);

        expect(api.get).toHaveBeenCalledWith(
            `api/presentes-ata/membros-e-nao-membros/?ata_uuid=${uuid_ata}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test ('getListaPresentes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getListaPresentes(uuid_ata);

        expect(api.get).toHaveBeenCalledWith(
            `api/presentes-ata/?ata__uuid=${uuid_ata}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test ('getListaPresentesPadrao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getListaPresentesPadrao(uuid_ata);

        expect(api.get).toHaveBeenCalledWith(
            `api/presentes-ata/padrao-de-presentes/?ata_uuid=${uuid_ata}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test ('getMembroPorIdentificador deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const identificador = '1234';
        const data = '';
        const result = await getMembroPorIdentificador(uuid_ata, identificador, data);

        expect(api.get).toHaveBeenCalledWith(
            `api/presentes-ata/get-nome-cargo-membro-associacao/?ata_uuid=${uuid_ata}&identificador=${identificador}&data=${data}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test ('postEdicaoAta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const ata_uuid = uuid_ata
        const result = await postEdicaoAta(ata_uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `/api/atas-associacao/${ata_uuid}/`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    test ('getParticipantesOrdenadosPorCargo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getParticipantesOrdenadosPorCargo(uuid_ata);

        expect(api.get).toHaveBeenCalledWith(
            `api/presentes-ata/get-participantes-ordenados-por-cargo/?ata_uuid=${uuid_ata}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

});
