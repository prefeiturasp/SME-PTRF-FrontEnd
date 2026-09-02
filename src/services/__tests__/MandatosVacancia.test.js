import api from '../api';
import {
    getMandatoVigente,
    getMandatosAnterioresVacancia,
    getComposicaoVigenteVacancia,
    getCargosComposicaoVacanciaPorData,
    getCargosDaComposicaoVacancia,
    getTimelineCargoComposicaoVacancia,
    postCargoComposicaoVacancia,
    postRegistrarSaidaCargoComposicaoVacancia,
    patchCancelarSaidaCargoComposicaoVacancia,
    patchCorrigirSaidaCargoComposicaoVacancia,
    patchEditarOcupanteCargoComposicaoVacancia,
    getDatasDeAlteracaoDaComposicaoVacancia,
    patchCancelarEntradaCargoComposicaoVacancia,
} from '../MandatosVacancia.service.js';
import { TOKEN_ALIAS } from '../auth.service.js';

jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    registerUnauthorizedHandler: jest.fn(),
}));

const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];

describe('MandatosVacancia.service', () => {

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

    test('getMandatoVigente deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });

        const result = await getMandatoVigente();

        expect(api.get).toHaveBeenCalledWith(
            '/api/mandatos-vacancia/mandato-vigente/',
            authHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getMandatosAnterioresVacancia deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });

        const result = await getMandatosAnterioresVacancia();

        expect(api.get).toHaveBeenCalledWith(
            '/api/mandatos-vacancia/mandatos-anteriores/',
            authHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getComposicaoVigenteVacancia deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const associacao_uuid = 'associacao-1';
        const mandato_uuid = 'mandato-1';

        const result = await getComposicaoVigenteVacancia(associacao_uuid, mandato_uuid);

        expect(api.get).toHaveBeenCalledWith(
            '/api/cargos-composicao-vacancia/composicao-vigente/',
            { ...authHeader(), params: { associacao_uuid, mandato_uuid } }
        );
        expect(result).toEqual(mockData);
    });

    test('getCargosComposicaoVacanciaPorData deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const composicao_uuid = 'composicao-1';
        const data = '2026-06-01';

        const result = await getCargosComposicaoVacanciaPorData(composicao_uuid, data);

        expect(api.get).toHaveBeenCalledWith(
            '/api/cargos-composicao-vacancia/composicao-por-data/',
            { ...authHeader(), params: { composicao_uuid, data } }
        );
        expect(result).toEqual(mockData);
    });

    test('getCargosDaComposicaoVacancia deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const composicao_uuid = 'composicao-1';
        const data = '2026-06-01';

        const result = await getCargosDaComposicaoVacancia(composicao_uuid, data);

        expect(api.get).toHaveBeenCalledWith(
            '/api/cargos-composicao-vacancia/cargos-da-composicao/',
            { ...authHeader(), params: { composicao_uuid, data } }
        );
        expect(result).toEqual(mockData);
    });

    test('getTimelineCargoComposicaoVacancia deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const composicao_uuid = 'composicao-1';
        const cargo_associacao = 'PRESIDENTE_DIRETORIA_EXECUTIVA';

        const result = await getTimelineCargoComposicaoVacancia(composicao_uuid, cargo_associacao);

        expect(api.get).toHaveBeenCalledWith(
            '/api/cargos-composicao-vacancia/timeline/',
            { ...authHeader(), params: { composicao_uuid, cargo_associacao_uuid: cargo_associacao } }
        );
        expect(result).toEqual(mockData);
    });

    test('postCargoComposicaoVacancia deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { cargo_associacao: 'TESOUREIRO' };

        await postCargoComposicaoVacancia(payload);

        expect(api.post).toHaveBeenCalledWith(
            '/api/cargos-composicao-vacancia/',
            { ...payload },
            authHeader(),
        );
    });

    test('postRegistrarSaidaCargoComposicaoVacancia deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const uuid = 'cargo-1';
        const data_saida = '2026-06-01';

        await postRegistrarSaidaCargoComposicaoVacancia(uuid, data_saida);

        expect(api.post).toHaveBeenCalledWith(
            `/api/cargos-composicao-vacancia/${uuid}/registrar-saida/`,
            { data_saida },
            authHeader(),
        );
    });

    test('patchCancelarSaidaCargoComposicaoVacancia deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const uuid = 'cargo-1';

        await patchCancelarSaidaCargoComposicaoVacancia(uuid);

        expect(api.patch).toHaveBeenCalledWith(
            `/api/cargos-composicao-vacancia/${uuid}/cancelar-saida/`,
            {},
            authHeader(),
        );
    });

    test('patchCorrigirSaidaCargoComposicaoVacancia deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const uuid = 'cargo-1';
        const data_saida = '2026-07-01';

        await patchCorrigirSaidaCargoComposicaoVacancia(uuid, data_saida);

        expect(api.patch).toHaveBeenCalledWith(
            `/api/cargos-composicao-vacancia/${uuid}/corrigir-saida/`,
            { data_saida },
            authHeader(),
        );
    });

    test('patchEditarOcupanteCargoComposicaoVacancia deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const uuid = 'cargo-1';
        const payload = { ocupante_do_cargo: { nome: 'Novo Nome' } };

        await patchEditarOcupanteCargoComposicaoVacancia(uuid, payload);

        expect(api.patch).toHaveBeenCalledWith(
            `/api/cargos-composicao-vacancia/${uuid}/`,
            { ...payload },
            authHeader(),
        );
    });

    test('getDatasDeAlteracaoDaComposicaoVacancia deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: ['2026-01-01', '2026-02-01'] });
        const composicao_uuid = 'composicao-1';

        const result = await getDatasDeAlteracaoDaComposicaoVacancia(composicao_uuid);

        expect(api.get).toHaveBeenCalledWith(
            '/api/cargos-composicao-vacancia/datas-de-alteracao/',
            { ...authHeader(), params: { composicao_uuid } }
        );
        expect(result).toEqual(['2026-01-01', '2026-02-01']);
    });

    test('patchCancelarEntradaCargoComposicaoVacancia deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const uuid = 'cargo-1';

        await patchCancelarEntradaCargoComposicaoVacancia(uuid);

        expect(api.patch).toHaveBeenCalledWith(
            `/api/cargos-composicao-vacancia/${uuid}/cancelar-entrada/`,
            {},
            authHeader(),
        );
    });
});
