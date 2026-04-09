import api from '../../api';
import { getUuidAssociacao } from '../../../utils/AssociacaoUtils';
import {
    getAssociacao,
    getAssociacaoByUUID,
    getAcoesAssociacao,
    getContasAtivasDaAssociacaoNoPeriodo,
    alterarAssociacao,
    getPeriodoFechado,
    getMembrosAssociacao,
    criarMembroAssociacao,
    editarMembroAssociacao,
    deleteMembroAssociacao,
    getStatusPresidenteAssociacao,
    patchStatusPresidenteAssociacao,
    getCargosDaDiretoriaExecutiva,
    consultarRF,
    consultarListaCargos,
    consultarCodEol,
    consultarCpfResponsavel,
    getContas,
    getContasEncerradas,
    salvarContas,
    encerrarConta,
    reenviarSolicitacaoEncerramentoConta,
    cancelarSolicitacaoEncerramentoConta,
    exportarDadosAssociacao,
    exportarDadosAssociacaoPdf,
    getPeriodosDePrestacaoDeContasDaAssociacao,
    getUsuarios,
    getUsuarioPeloUsername,
    getDataPreenchimentoPreviaAta,
    getTagInformacaoAssociacao,
    getStatusCadastroAssociacao,
} from '../Associacao.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));

jest.mock('../../../utils/AssociacaoUtils.js', () => ({
    getUuidAssociacao: jest.fn(),
}));

const mockToken = 'fake-token';
const associacao_uuid = '12345';
const periodo_uuid = '67890';
const mockData = [{ id: 1, nome: 'Teste 1' }];

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
        localStorage.setItem(TOKEN_ALIAS, mockToken);
        getUuidAssociacao.mockReturnValue(associacao_uuid);
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });
    const getAuthHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test('getAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getAssociacao();

        expect(api.get).toHaveBeenCalledWith(
            `api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getAssociacaoByUUID deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getAssociacaoByUUID(associacao_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/associacoes/${associacao_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getContasAtivasDaAssociacaoNoPeriodo deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getContasAtivasDaAssociacaoNoPeriodo(periodo_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas-do-periodo/?periodo_uuid=${periodo_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('alterarAssociacao deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await alterarAssociacao(payload);

        expect(api.put).toHaveBeenCalledWith(
            `api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({data: mockData});
    });

    test('alterarAssociacao deve chamar a API com erro', async () => {
        api.put.mockRejectedValue(new Error("Erro na API"));
        const payload = { teste: 'testes'}
        await alterarAssociacao(payload);

        expect(api.put).toHaveBeenCalledWith(
            `api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/`,
            payload,
            getAuthHeader()
        );
        expect(api.put).rejects.toThrow("Erro na API")
    });

    test('getPeriodoFechado deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const data_verificacao = '2023-01-01';
        const result = await getPeriodoFechado(data_verificacao);

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${associacao_uuid}/status-periodo/?data=${data_verificacao}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getMembrosAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getMembrosAssociacao();

        expect(api.get).toHaveBeenCalledWith(
            `/api/membros-associacao/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('criarMembroAssociacao deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await criarMembroAssociacao(payload);

        expect(api.post).toHaveBeenCalledWith(
            `api/membros-associacao/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData });
    });

    test('editarMembroAssociacao deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData });
        const uuid = 1
        const payload = { teste: 'testes'}
        const result = await editarMembroAssociacao(payload, uuid);

        expect(api.put).toHaveBeenCalledWith(
            `/api/membros-associacao/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData });
    });

    test('deleteMembroAssociacao deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const uuid = 1
        const result = await deleteMembroAssociacao( uuid);

        expect(api.delete).toHaveBeenCalledWith(
            `api/membros-associacao/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData });
    });

    test('deleteMembroAssociacao deve chamar a API com erro', async () => {
        api.delete.mockRejectedValue(new Error("Erro na API"));
        const uuid = 1
        const result = await deleteMembroAssociacao( uuid);

        expect(api.delete).toHaveBeenCalledWith(
            `api/membros-associacao/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(api.delete).rejects.toThrow("Erro na API")
    });

    test('getStatusPresidenteAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getStatusPresidenteAssociacao();

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/status-presidente`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('patchStatusPresidenteAssociacao deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await patchStatusPresidenteAssociacao(associacao_uuid, payload);
        
        expect(api.patch).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/update-status-presidente/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getCargosDaDiretoriaExecutiva deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getCargosDaDiretoriaExecutiva();

        expect(api.get).toHaveBeenCalledWith(
            `/api/membros-associacao/cargos-diretoria-executiva/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('consultarRF deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const rf = '1234'
        const result = await consultarRF(rf);

        expect(api.get).toHaveBeenCalledWith(
            `/api/membros-associacao/codigo-identificacao/?rf=${rf}&associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData});
    });
    
    test('consultarListaCargos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const rf = '1234'
        const result = await consultarListaCargos(rf);

        expect(api.get).toHaveBeenCalledWith(
            `/api/membros-associacao/lista-cargos/?rf=${rf}`,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData});
    });
    
    test('consultarCodEol deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const cod_eol = '1234'
        const result = await consultarCodEol(cod_eol);

        expect(api.get).toHaveBeenCalledWith(
            `/api/membros-associacao/codigo-identificacao/?codigo-eol=${cod_eol}&associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData});
    });
    
    test('consultarCpfResponsavel deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const cpf = '1234'
        const result = await consultarCpfResponsavel(cpf);

        expect(api.get).toHaveBeenCalledWith(
            `/api/membros-associacao/cpf-responsavel/?cpf=${cpf}&associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData});
    });
    
    test('getContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getContas(periodo_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas/?periodo_uuid=${periodo_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getContasEncerradas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getContasEncerradas();

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas/encerradas/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('salvarContas deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await salvarContas(payload);

        expect(api.post).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas-update/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData });
    });

    test('encerrarConta deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const result = await encerrarConta(payload);

        expect(api.post).toHaveBeenCalledWith(
            `/api/solicitacoes-encerramento-conta/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData });
    });

    test('reenviarSolicitacaoEncerramentoConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData });
        const payload = { teste: 'testes'}
        const idSolicitacao = 1
        const result = await reenviarSolicitacaoEncerramentoConta(payload, idSolicitacao);

        expect(api.patch).toHaveBeenCalledWith(
            `/api/solicitacoes-encerramento-conta/${idSolicitacao}/reenviar/`,
            payload,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData });
    });

    test('cancelarSolicitacaoEncerramentoConta deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const solicitacaoUUID = '12345'
        const result = await cancelarSolicitacaoEncerramentoConta(solicitacaoUUID);

        expect(api.delete).toHaveBeenCalledWith(
            `/api/solicitacoes-encerramento-conta/${solicitacaoUUID}/`,
            getAuthHeader()
        );
        expect(result).toEqual({ data: mockData });
    });

    it('deve baixar o arquivo corretamente', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
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

        await exportarDadosAssociacao();

        expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/api\/associacoes\/.*\/exportar/), expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...getAuthHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

    it('deve baixar o arquivo corretamente na API de PDF', async () => {
        const mockBlob = new Blob(['dummy content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const mockResponse = { data: mockBlob };
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

        await exportarDadosAssociacaoPdf();

        expect(api.get).toHaveBeenCalledWith(
            expect.stringMatching(/\/api\/associacoes\/.*\/exportar-pdf/), expect.objectContaining({
            responseType: 'blob',
            timeout: 30000,
            ...getAuthHeader()
        }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateElement).toHaveBeenCalledWith('a');

        mockCreateObjectURL.mockRestore();
        mockCreateElement.mockRestore();
    });

    
    test('getPeriodosDePrestacaoDeContasDaAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const ignorar_devolvidas = true
        const result = await getPeriodosDePrestacaoDeContasDaAssociacao(ignorar_devolvidas);

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/periodos-para-prestacao-de-contas/?ignorar_devolvidas=${ignorar_devolvidas}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getUsuarios deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getUsuarios();

        expect(api.get).toHaveBeenCalledWith(
            `/api/usuarios/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getUsuarioPeloUsername deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const username = true
        const result = await getUsuarioPeloUsername(username);

        expect(api.get).toHaveBeenCalledWith(
            `/api/usuarios/?username=${username}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getDataPreenchimentoPreviaAta deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const uuidPeriodo = periodo_uuid
        const result = await getDataPreenchimentoPreviaAta(uuidPeriodo);
        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/previa-ata/?periodo_uuid=${uuidPeriodo}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getTagInformacaoAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getTagInformacaoAssociacao();
        expect(api.get).toHaveBeenCalledWith(
            `api/associacoes/tags-informacoes/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
    
    test('getStatusCadastroAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getStatusCadastroAssociacao();
        expect(api.get).toHaveBeenCalledWith(
            `api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/status-cadastro/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAcoesAssociacao deve chamar a API sem page_size quando não fornecido', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getAcoesAssociacao();

        expect(api.get).toHaveBeenCalledWith(
            `api/acoes-associacoes/?associacao__uuid=${associacao_uuid}`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getAcoesAssociacao deve incluir page_size na URL quando fornecido', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getAcoesAssociacao(undefined, 50);

        expect(api.get).toHaveBeenCalledWith(
            `api/acoes-associacoes/?associacao__uuid=${associacao_uuid}&page_size=50`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getContas deve chamar a API sem query string quando nenhum parâmetro é fornecido', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getContas();

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${associacao_uuid}/contas/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getContas deve incluir all=true quando getAllContas=true', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getContas("", true);

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${associacao_uuid}/contas/?all=true`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getContas deve incluir periodo_uuid e all quando ambos fornecidos', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const result = await getContas(periodo_uuid, true);

        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/${associacao_uuid}/contas/?periodo_uuid=${periodo_uuid}&all=true`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    it('exportarDadosAssociacao deve executar click no link ao baixar com sucesso', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/xlsx' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:assoc-url');
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});

        await exportarDadosAssociacao();

        expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'associacao.xlsx');
        expect(mockLink.click).toHaveBeenCalled();

        jest.restoreAllMocks();
    });

    it('exportarDadosAssociacao deve retornar erro quando a API falha', async () => {
        const mockError = { response: { status: 500 } };
        api.get.mockRejectedValue(mockError);

        const result = await exportarDadosAssociacao();

        expect(result).toEqual(mockError.response);
    });

    it('exportarDadosAssociacaoPdf deve executar click no link ao baixar com sucesso', async () => {
        const mockBlob = new Blob(['content'], { type: 'application/pdf' });
        api.get.mockResolvedValue({ data: mockBlob });
        window.URL.createObjectURL = jest.fn(() => 'blob:assoc-pdf-url');
        const mockLink = { setAttribute: jest.fn(), click: jest.fn(), href: '' };
        jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});

        await exportarDadosAssociacaoPdf();

        expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'associacao.pdf');
        expect(mockLink.click).toHaveBeenCalled();

        jest.restoreAllMocks();
    });

    it('exportarDadosAssociacaoPdf deve retornar erro quando a API falha', async () => {
        const mockError = { response: { status: 500 } };
        api.get.mockRejectedValue(mockError);

        const result = await exportarDadosAssociacaoPdf();

        expect(result).toEqual(mockError.response);
    });
});
