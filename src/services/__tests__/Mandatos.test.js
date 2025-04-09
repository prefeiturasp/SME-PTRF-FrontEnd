import api from '../api';
import {
    getMandatos,
    postMandato,
    patchMandato,
    deleteMandato,
    getMandatoVigente,
    getCargosDaComposicao,
    getComposicao,
    getCargosComposicaoData,
    getMandatosAnteriores,
    getMandatoAnterior,
    getMandatoMaisRecente,
    postCargoComposicao,
    putCargoComposicao,
    consultarCodEolNoSmeIntegracao,
    consultarRFNoSmeIntegracao,
    getCargosDoRFSmeIntegracao,
    getCargosDaDiretoriaExecutiva
} from '../Mandatos.service.js';
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

    test('getMandatos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const currentPage = '1'
        const referencia = '2025'
        const filter = {
            referencia: referencia,
        }
        const params = {
            referencia: referencia,
            page: currentPage,
        }
        const result = await getMandatos(filter, currentPage);
        const url = `/api/mandatos/`
        expect(api.get).toHaveBeenCalledWith(url, { ...authHeader(), params })
        expect(result).toEqual(result);
    });

    test('getMandatoVigente deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const associacao_uuid = '1234'
        const params = {
            associacao_uuid: associacao_uuid,
        }
        const result = await getMandatoVigente(associacao_uuid);
        const url = `/api/mandatos/mandato-vigente/`
        expect(api.get).toHaveBeenCalledWith(url, { ...authHeader(), params })
        expect(result).toEqual(result);
    });

    test('getCargosDaComposicao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const composicao_uuid = '1234'
        const params = {
            composicao_uuid: composicao_uuid,
        }
        const result = await getCargosDaComposicao(composicao_uuid);
        const url = `/api/cargos-composicao/cargos-da-composicao/`
        expect(api.get).toHaveBeenCalledWith(url, { ...authHeader(), params })
        expect(result).toEqual(result);
    });

    test('postMandato deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postMandato(payload);
        const url = `api/mandatos/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('patchMandato deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const uuidMandato = '1234'
        const result = await patchMandato(uuidMandato, payload);
        const url = `api/mandatos/${uuidMandato}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('deleteMandato deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const uuidMandato = '1234'
        const result = await deleteMandato(uuidMandato);
        const url = `api/mandatos/${uuidMandato}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getComposicao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const composicao_uuid = '1234'
        const result = await getComposicao(composicao_uuid);
        const url = `/api/composicoes/${composicao_uuid}/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getCargosComposicaoData deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const associacao_uuid = '1234'
        const data = '2025-01-01'
        const result = await getCargosComposicaoData(data, associacao_uuid);
        const url = `/api/cargos-composicao/composicao-por-data?data=${data}&associacao_uuid=${associacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getMandatosAnteriores deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getMandatosAnteriores();
        const url = `/api/mandatos/mandatos-anteriores/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getMandatoMaisRecente deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getMandatoMaisRecente();
        const url = `/api/mandatos/mandato-mais-recente/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });
    
    test('getCargosDaDiretoriaExecutiva deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getCargosDaDiretoriaExecutiva();
        const url = `/api/cargos-composicao/cargos-diretoria-executiva/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getMandatoAnterior deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const mandato_uuid = '1234'
        const associacao_uuid = '1234'
        const params = {
            associacao_uuid: associacao_uuid,
        }
        const result = await getMandatoAnterior(mandato_uuid, associacao_uuid);
        const url = `/api/mandatos/${mandato_uuid}/mandato-anterior/`
        expect(api.get).toHaveBeenCalledWith(url, {...authHeader(), params})
        expect(result).toEqual(result);
    });

    test('postCargoComposicao deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postCargoComposicao(payload);
        const url = `api/cargos-composicao/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('putCargoComposicao deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData })
        const uuidCargoComposicao = '1234'
        const result = await putCargoComposicao(uuidCargoComposicao, payload);
        const url = `api/cargos-composicao/${uuidCargoComposicao}/`
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('consultarCodEolNoSmeIntegracao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const cod_eol = '1234'
        const result = await consultarCodEolNoSmeIntegracao(cod_eol);
        const url = `/api/ocupantes-cargos/codigo-identificacao/?codigo-eol=${cod_eol}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('consultarRFNoSmeIntegracao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const rf = '1234'
        const result = await consultarRFNoSmeIntegracao(rf);
        const url = `/api/ocupantes-cargos/codigo-identificacao/?rf=${rf}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getCargosDoRFSmeIntegracao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const rf = '1234'
        const result = await getCargosDoRFSmeIntegracao(rf);
        const url = `/api/ocupantes-cargos/cargos-do-rf/?rf=${rf}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

});
