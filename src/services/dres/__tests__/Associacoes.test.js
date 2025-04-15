import api from '../../api';
import { 
    getTabelaAssociacoes,
    getTabelaAssociacoesDre,
    getAnosAnaliseRegularidade,
    getAssociacoesPorUnidade,
    getRegularidadeAssociacoesAno,
    filtrosRegularidadeAssociacoes,
    filtrosAssociacoes,
    getAssociacao,
    getContasAssociacao,
    getContasAssociacaoEncerradas,
    updateAssociacao,
    getProcessosAssociacao,
    aprovarSolicitacaoEncerramentoConta,
    rejeitarSolicitacaoEncerramentoConta,
    getContas,
    getMotivosRejeicaoEncerramentoContas
 } from '../Associacoes.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';
import {visoesService} from "../../visoes.service";

jest.mock('../../visoes.service', () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
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
const associacao_uuid = '1234'

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

    test('getTabelaAssociacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelaAssociacoes();
        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/tabelas`,
            authHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getTabelaAssociacoesDre deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelaAssociacoesDre();
        expect(api.get).toHaveBeenCalledWith(
            `/api/associacoes/tabelas?filtros_informacoes_associacao_dre=True`,
            authHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getAnosAnaliseRegularidade deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAnosAnaliseRegularidade();
        expect(api.get).toHaveBeenCalledWith(
            `/api/anos-analise-regularidade/`,
            authHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getAssociacoesPorUnidade deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getAssociacoesPorUnidade();
        expect(api.get).toHaveBeenCalledWith(
            `api/associacoes/?unidade__dre__uuid=${visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')}`,
            authHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getRegularidadeAssociacoesAno deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getRegularidadeAssociacoesAno();
        const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
        const ano = new Date().getFullYear()
        const url = `api/associacoes/lista-regularidade-ano/?dre_uuid=${dre_uuid}&ano=${ano}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('filtrosRegularidadeAssociacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let nome=''
        let status_regularidade=''
        let tipo_unidade=''
        let ano=''
        const result = await filtrosRegularidadeAssociacoes(nome=null, status_regularidade=null, tipo_unidade=null, ano=null);
        const dre_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
        const url = `api/associacoes/lista-regularidade-ano/?dre_uuid=${dre_uuid}&ano=${ano}&nome=${nome}&status_regularidade=${status_regularidade}&tipo_unidade=${tipo_unidade}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('filtrosAssociacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let nome=''
        let status_regularidade=''
        let unidade__tipo_unidade=''
        let filtro_informacoes=''
        const result = await filtrosAssociacoes(nome=null, status_regularidade=null, unidade__tipo_unidade=null, filtro_informacoes=null);
        const url = `api/associacoes/?unidade__dre__uuid=${visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')}${nome ? `&nome=${nome}` : ''}${status_regularidade ? `&status_regularidade=${status_regularidade}` : ''}${unidade__tipo_unidade ? `&unidade__tipo_unidade=${unidade__tipo_unidade}` : ''}${filtro_informacoes ? `&filtro_informacoes=${filtro_informacoes}` : ''}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_associacao = associacao_uuid
        const result = await getAssociacao(uuid_associacao);
        const url = `api/associacoes/${uuid_associacao}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getContasAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_associacao = associacao_uuid
        const result = await getContasAssociacao(uuid_associacao);
        const url = `api/associacoes/${uuid_associacao}/contas`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getContasAssociacaoEncerradas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_associacao = associacao_uuid
        const result = await getContasAssociacaoEncerradas(uuid_associacao);
        const url = `api/associacoes/${uuid_associacao}/contas/encerradas`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('updateAssociacao deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const uuid_associacao = associacao_uuid
        const payload = { teste: 'testes' }
        const result = await updateAssociacao(uuid_associacao, payload);
        const url = `api/associacoes/${uuid_associacao}/`
        expect(api.patch).toHaveBeenCalledWith( url, payload, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('getProcessosAssociacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_associacao = associacao_uuid
        const result = await getProcessosAssociacao(uuid_associacao);
        const url = `api/associacoes/${uuid_associacao}/processos`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_associacao = associacao_uuid
        const result = await getContas(uuid_associacao);
        const url = `/api/associacoes/${uuid_associacao}/contas/`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getMotivosRejeicaoEncerramentoContas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getMotivosRejeicaoEncerramentoContas();
        const url = `/api/motivos-rejeicao-encerramento-conta/`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('aprovarSolicitacaoEncerramentoConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const id_solicitacao = '1234'
        const result = await aprovarSolicitacaoEncerramentoConta(id_solicitacao);
        const url = `/api/solicitacoes-encerramento-conta/${id_solicitacao}/aprovar/`
        expect(api.patch).toHaveBeenCalledWith( url, {}, authHeader() )
        expect(result).toEqual({ data: mockData});
    });

    test('rejeitarSolicitacaoEncerramentoConta deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const id_solicitacao = '1234'
        const payload = { motivo: 'teste' }
        const result = await rejeitarSolicitacaoEncerramentoConta(payload, id_solicitacao);
        const url = `/api/solicitacoes-encerramento-conta/${id_solicitacao}/rejeitar/`
        expect(api.patch).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(result).toEqual({ data: mockData});
    });
    
    
});
