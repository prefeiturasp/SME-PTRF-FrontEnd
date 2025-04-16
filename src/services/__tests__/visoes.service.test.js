import { visoesService } from '../visoes.service';
import { authService } from '../auth.service';
import { redirect } from '../../utils/redirect';
import moment from 'moment';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = (value||'').toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    getStore: () => store
  };
})();

const setUserData = (key, data) => {
    const fullData = { [`usuario_${testUser}`]: data };
    localStorageMock.setItem(key, JSON.stringify(fullData));
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const USUARIO_LOGIN = "USUARIO_LOGIN";
const ASSOCIACAO_UUID = "ASSOCIACAO_UUID";
const ASSOCIACAO_TIPO_ESCOLA = "ASSOCIACAO_TIPO_ESCOLA";
const ASSOCIACAO_NOME_ESCOLA = "ASSOCIACAO_NOME_ESCOLA";
const ASSOCIACAO_NOME = "ASSOCIACAO_NOME";
const DATA_LOGIN = "DATA_LOGIN";
const PERIODO_RELATORIO_CONSOLIDADO_DRE = "PERIODO_RELATORIO_CONSOLIDADO_DRE";
const DADOS_USUARIO_LOGADO = "DADOS_USUARIO_LOGADO";
const DADOS_USUARIO_LOGADO_NORMAL = "DADOS_USUARIO_LOGADO_NORMAL";
const DADOS_USUARIO_LOGADO_SUPORTE = "DADOS_USUARIO_LOGADO_SUPORTE";
const DATA_HORA_USUARIO_LOGADO = "DATA_HORA_USUARIO_LOGADO";
const ACESSO_MODO_SUPORTE = "ACESSO_MODO_SUPORTE";
const ACOMPANHAMENTO_DE_PC = "ACOMPANHAMENTO_DE_PC";
const ANALISE_DRE = "ANALISE_DRE";
const ACOMPANHAMENTO_PC_UNIDADE = "ACOMPANHAMENTO_PC_UNIDADE";

jest.mock('../auth.service', () => ({
  authService: {
    logout: jest.fn(),
    isLoggedIn: jest.fn(),
  },
  USUARIO_LOGIN: "USUARIO_LOGIN",
  ASSOCIACAO_UUID: "ASSOCIACAO_UUID",
  ASSOCIACAO_TIPO_ESCOLA: "ASSOCIACAO_TIPO_ESCOLA",
  ASSOCIACAO_NOME_ESCOLA: "ASSOCIACAO_NOME_ESCOLA",
  ASSOCIACAO_NOME: "ASSOCIACAO_NOME",
  DATA_LOGIN: "DATA_LOGIN",
  PERIODO_RELATORIO_CONSOLIDADO_DRE: "PERIODO_RELATORIO_CONSOLIDADO_DRE",
}));

jest.mock('../../utils/redirect', () => ({
  redirect: jest.fn(),
}));

jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  const mockMoment = jest.fn();
  mockMoment.format = jest.fn().mockReturnThis();
  mockMoment.diff = jest.fn();

  mockMoment.now = () => Date.now();
  mockMoment.currentTime = (time) => {
    mockMoment.now = jest.fn(() => new Date(time).valueOf());
  };

  const momentInstance = {
    format: jest.fn((formatString) => moment(mockMoment.now()).format(formatString)),
    diff: jest.fn((otherMoment, unit) => {
      const actualMoment = moment(mockMoment.now());
      const actualOtherMoment = moment(otherMoment.valueOf());
      return actualMoment.diff(actualOtherMoment, unit);
    }),
    valueOf: jest.fn(() => mockMoment.now()),
    subtract: jest.fn().mockReturnThis()
  };

  const momentConstructor = (...args) => {
    if (args.length === 0 || args[0] === mockMoment.now()) {
       momentInstance.valueOf = jest.fn(() => mockMoment.now());
       return momentInstance;
    }
    const specificTime = new Date(args[0]).valueOf();
    const specificInstance = {
        ...momentInstance,
        valueOf: jest.fn(() => specificTime),
        format: jest.fn((formatString) => moment(specificTime).format(formatString)),
        diff: jest.fn((otherMoment, unit) => {
            const actualMoment = moment(specificTime);
            const actualOtherMoment = moment(otherMoment.valueOf());
            return actualMoment.diff(actualOtherMoment, unit);
        }),
    };
    return specificInstance;
  };

  Object.assign(momentConstructor, moment);
  momentConstructor.mock = mockMoment;

  return momentConstructor;
});

const testUser = 'testuser123';
const mockNow = '2023-10-27T12:00:00.000Z';
const mockNowFormatted = '2023-10-27 12:00:00';

describe('Visoes Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.setItem(USUARIO_LOGIN, testUser);
    moment.mock.currentTime(mockNow);
    moment().format.mockReturnValue(mockNowFormatted);
  });

    describe('forcarNovoLogin', () => {
        it('assumir o timestamp inicial quando null existir', () => {
            visoesService.forcarNovoLogin();
            expect(localStorageMock.getItem(DATA_HORA_USUARIO_LOGADO)).toBe(mockNowFormatted);
            expect(authService.logout).not.toHaveBeenCalled();
        });

        it('Não deve deslogar se a diferença do time é menor que  10 hours (600 min)', () => {
            const tenHoursLessOneMinute = `2023-10-27 12:00:00`;
            localStorageMock.setItem(DATA_HORA_USUARIO_LOGADO, tenHoursLessOneMinute);

            visoesService.forcarNovoLogin();

            expect(localStorageMock.getItem(DATA_HORA_USUARIO_LOGADO)).toBe(tenHoursLessOneMinute);
            expect(authService.logout).not.toHaveBeenCalled();
        });

        it('deve realizar o logout e atualizar timestamp se a diferença  estiver entre 10 e 24 horas', () => {
            const twelveHoursAgo = '2023-10-27 00:00:00'
            localStorageMock.setItem(DATA_HORA_USUARIO_LOGADO, twelveHoursAgo);
            moment().diff.mockReturnValue(720);

            visoesService.forcarNovoLogin();

            expect(localStorageMock.getItem(DATA_HORA_USUARIO_LOGADO)).toBe(mockNowFormatted);
            expect(authService.logout).toHaveBeenCalledTimes(1);
            expect(localStorageMock.getItem(DADOS_USUARIO_LOGADO)).toBeNull();
        });

        it('Deve realizar o Logout, atualizar timestamp, limpar localstorage e definir DATA_LOGIN se diff >= 24 hours', () => {
            const twentyFiveHoursAgo = '2023-10-26 12:00:00'
            localStorageMock.setItem(DATA_HORA_USUARIO_LOGADO, twentyFiveHoursAgo);
            localStorageMock.setItem(DADOS_USUARIO_LOGADO, '{}');
            localStorageMock.setItem(ACOMPANHAMENTO_DE_PC, '{}');
            localStorageMock.setItem(ACOMPANHAMENTO_PC_UNIDADE, '{}');
            localStorageMock.setItem(ANALISE_DRE, '{}');
            localStorageMock.setItem(PERIODO_RELATORIO_CONSOLIDADO_DRE, '{}');

            moment().diff.mockReturnValue(1500); // 25 * 60 (maior que 24 horas)

            visoesService.forcarNovoLogin();

            expect(localStorageMock.getItem(DATA_HORA_USUARIO_LOGADO)).toBe(mockNowFormatted);
            expect(authService.logout).toHaveBeenCalledTimes(1);
            expect(localStorageMock.getItem(DADOS_USUARIO_LOGADO)).toBeNull();
            expect(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC)).toBeNull();
            expect(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE)).toBeNull();
            expect(localStorageMock.getItem(ANALISE_DRE)).toBeNull();
            expect(localStorageMock.getItem(PERIODO_RELATORIO_CONSOLIDADO_DRE)).toBeNull();
            expect(localStorageMock.getItem(DATA_LOGIN)).toBe(moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"));
        });
    });

    describe('getUsuarioLogin', () => {
        it('deve retornar username do localStorage', () => {
            expect(visoesService.getUsuarioLogin()).toBe(testUser);
        });

        it('deve retornar null se username não estiver no localstorage', () => {
            localStorageMock.removeItem(USUARIO_LOGIN);
            expect(visoesService.getUsuarioLogin()).toBeNull();
        });
    });

    describe('getDadosDoUsuarioLogado / Normal / Suporte', () => {
        const mockData = { nome: 'Test User', visao: 'UE' };

        it('getDadosDoUsuarioLogado deve retornar dados do usuário', () => {
            setUserData(DADOS_USUARIO_LOGADO, mockData);
            expect(visoesService.getDadosDoUsuarioLogado()).toEqual(mockData);
        });
        
        it('getDadosDoUsuarioLogadoNormal deve retornar dados do usuário normal', () => {
            setUserData(DADOS_USUARIO_LOGADO_NORMAL, mockData);
            expect(visoesService.getDadosDoUsuarioLogadoNormal()).toEqual(mockData);
        });
        
        it('getDadosDoUsuarioLogadoSuporte deve retornar dados do usuário suporte', () => {
            setUserData(DADOS_USUARIO_LOGADO_SUPORTE, mockData);
            expect(visoesService.getDadosDoUsuarioLogadoSuporte()).toEqual(mockData);
        });

        it('deve retornar null se o index não existir', () => {
            expect(visoesService.getDadosDoUsuarioLogado()).toBeNull();
        });

        it('Prop deve retornar undefined se um usuário não existir', () => {
            localStorageMock.setItem(DADOS_USUARIO_LOGADO, JSON.stringify({ usuario_otheruser: {} }));
            expect(visoesService.getDadosDoUsuarioLogado()?.nome).toBeUndefined();
        });

    });

    describe('setDadosDoUsuarioLogado', () => {
        const initialData = { setting: 'initial' };
        const newData = { setting: 'new', extra: 'data' };

        it('Deve adicionar os dods do usuário se não existir', () => {
            visoesService.setDadosDoUsuarioLogado(newData);
            const storedData = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO));
            expect(storedData).toEqual({ [`usuario_${testUser}`]: newData });
        });

        it('deve autualizar dados do usuário se existente', () => {
            setUserData(DADOS_USUARIO_LOGADO, initialData);
            visoesService.setDadosDoUsuarioLogado(newData);
            const storedData = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO));
            expect(storedData[`usuario_${testUser}`]).toEqual(newData);
        });

        it('deve preservar dados de outros usuários', () => {
            localStorageMock.setItem(DADOS_USUARIO_LOGADO, JSON.stringify({ usuario_other: { data: 'other' } }));
            visoesService.setDadosDoUsuarioLogado(newData);
            const storedData = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO));
            expect(storedData).toEqual({
                usuario_other: { data: 'other' },
                [`usuario_${testUser}`]: newData
            });
        });
    });

    describe('salva_dados_ultimo_acesso', () => {
        const inputData = {
            visao: 'CURRENT_VIS',
            uuid_unidade: 'CURRENT_UNIT_UUID',
            unidade_tipo: 'CURRENT_UNIT_TYPE',
            unidade_nome: 'CURRENT_UNIT_NAME',
            uuid_associacao: 'CURRENT_ASSOC_UUID',
            nome_associacao: 'CURRENT_ASSOC_NAME',

            visao_acesso_normal: 'NORMAL_VIS',
            uuid_unidade_normal: 'NORMAL_UNIT_UUID',
            unidade_tipo_normal: 'NORMAL_UNIT_TYPE',
            unidade_nome_normal: 'NORMAL_UNIT_NAME',
            uuid_associacao_normal: 'NORMAL_ASSOC_UUID',
            nome_associacao_normal: 'NORMAL_ASSOC_NAME',

            visao_suporte: 'SUPPORT_VIS',
            uuid_unidade_suporte: 'SUPPORT_UNIT_UUID',
            unidade_tipo_suporte: 'SUPPORT_UNIT_TYPE',
            unidade_nome_suporte: 'SUPPORT_UNIT_NAME',
            uuid_associacao_suporte: 'SUPPORT_ASSOC_UUID',
            nome_associacao_suporte: 'SUPPORT_ASSOC_NAME',
        };

        const expectedStructure = (data) => ({
            [`usuario_${testUser}`]: {
                visao_selecionada: { nome: data.visao },
                unidade_selecionada: {
                    uuid: data.uuid_unidade,
                    tipo_unidade: data.unidade_tipo,
                    nome: data.unidade_nome,
                },
                associacao_selecionada: {
                    uuid: data.uuid_associacao,
                    nome: data.nome_associacao,
                },
            }
        });
        it('Deve salvar  CURRENT data em NORMAL storage se ACESSO_MODO_SUPORTE="false" e atualizar_dados_alternancia_unidade=true', () => {
            localStorageMock.setItem(ACESSO_MODO_SUPORTE, "false");

            visoesService.salva_dados_ultimo_acesso({
                ...inputData,
                atualizar_dados_alternancia_unidade: true
            });

            const storedNormal = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO_NORMAL));
            const storedSupport = localStorageMock.getItem(DADOS_USUARIO_LOGADO_SUPORTE);

            const expectedData = {
                visao: 'CURRENT_VIS', uuid_unidade: 'CURRENT_UNIT_UUID', unidade_tipo: 'CURRENT_UNIT_TYPE', unidade_nome: 'CURRENT_UNIT_NAME', uuid_associacao: 'CURRENT_ASSOC_UUID', nome_associacao: 'CURRENT_ASSOC_NAME'
            };

            expect(storedNormal).toEqual(expectedStructure(expectedData));
            expect(storedSupport).toBeNull();
        });

        it('Deve salvar NORMAL data em NORMAL storage se ACESSO_MODO_SUPORTE="false" e atualizar_dados_alternancia_unidade=false', () => {
            localStorageMock.setItem(ACESSO_MODO_SUPORTE, "false");

            visoesService.salva_dados_ultimo_acesso({
                ...inputData,
                atualizar_dados_alternancia_unidade: false
            });

            const storedNormal = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO_NORMAL));
            const storedSupport = localStorageMock.getItem(DADOS_USUARIO_LOGADO_SUPORTE);

            const expectedData = {
                visao: 'NORMAL_VIS', uuid_unidade: 'NORMAL_UNIT_UUID', unidade_tipo: 'NORMAL_UNIT_TYPE', unidade_nome: 'NORMAL_UNIT_NAME', uuid_associacao: 'NORMAL_ASSOC_UUID', nome_associacao: 'NORMAL_ASSOC_NAME'
            };

            expect(storedNormal).toEqual(expectedStructure(expectedData));
            expect(storedSupport).toBeNull();
        });

        it('Deve salvar CURRENT data em SUPPORT storage se ACESSO_MODO_SUPORTE="true" e atualizar_dados_alternancia_unidade=true', () => {
            localStorageMock.setItem(ACESSO_MODO_SUPORTE, "true");

            visoesService.salva_dados_ultimo_acesso({
                ...inputData,
                atualizar_dados_alternancia_unidade: true
            });

            const storedNormal = localStorageMock.getItem(DADOS_USUARIO_LOGADO_NORMAL);
            const storedSupport = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO_SUPORTE));

            const expectedData = {
                visao: 'CURRENT_VIS', uuid_unidade: 'CURRENT_UNIT_UUID', unidade_tipo: 'CURRENT_UNIT_TYPE', unidade_nome: 'CURRENT_UNIT_NAME', uuid_associacao: 'CURRENT_ASSOC_UUID', nome_associacao: 'CURRENT_ASSOC_NAME'
            };

            expect(storedNormal).toBeNull();
            expect(storedSupport).toEqual(expectedStructure(expectedData));
        });

        it('Deve salvar SUPPORT data em SUPPORT storage se ACESSO_MODO_SUPORTE="true" e atualizar_dados_alternancia_unidade=false', () => {
            localStorageMock.setItem(ACESSO_MODO_SUPORTE, "true");

            visoesService.salva_dados_ultimo_acesso({
                ...inputData,
                atualizar_dados_alternancia_unidade: false
            });

            const storedNormal = localStorageMock.getItem(DADOS_USUARIO_LOGADO_NORMAL);
            const storedSupport = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO_SUPORTE));

            const expectedData = {
                visao: 'SUPPORT_VIS', uuid_unidade: 'SUPPORT_UNIT_UUID', unidade_tipo: 'SUPPORT_UNIT_TYPE', unidade_nome: 'SUPPORT_UNIT_NAME', uuid_associacao: 'SUPPORT_ASSOC_UUID', nome_associacao: 'SUPPORT_ASSOC_NAME'
            };

            expect(storedNormal).toBeNull();
            expect(storedSupport).toEqual(expectedStructure(expectedData));
        });

        it('Deve lidar com dados de entrada ausentes (saving undefined/null)', () => {
            localStorageMock.setItem(ACESSO_MODO_SUPORTE, "false");

            visoesService.salva_dados_ultimo_acesso({
                visao: 'CURRENT_VIS', uuid_unidade: 'CURRENT_UNIT_UUID', unidade_tipo: 'CURRENT_UNIT_TYPE', unidade_nome: 'CURRENT_UNIT_NAME', uuid_associacao: 'CURRENT_ASSOC_UUID', nome_associacao: 'CURRENT_ASSOC_NAME',
                atualizar_dados_alternancia_unidade: false
            });

            const storedNormal = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO_NORMAL));
            const storedSupport = localStorageMock.getItem(DADOS_USUARIO_LOGADO_SUPORTE);

            expect(storedNormal[`usuario_${testUser}`].visao_selecionada.nome).toBeUndefined();
            expect(storedNormal[`usuario_${testUser}`].unidade_selecionada.uuid).toBeUndefined();
            expect(storedNormal[`usuario_${testUser}`].associacao_selecionada.uuid).toBeUndefined();
            expect(storedSupport).toBeNull();
        });
    });

    describe('getPermissoes', () => {
        const userDataWithPerms = { permissoes: ['perm1', 'perm2', 'admin'] };

        beforeEach(() => {
            setUserData(DADOS_USUARIO_LOGADO, userDataWithPerms);
        });

        it('deve retornar false se não estiver logado', () => {
            authService.isLoggedIn.mockReturnValue(false);
            expect(visoesService.getPermissoes(['perm1'])).toBeUndefined();
        });

        it('deve retornar true se usuário tem pelo menos uma permissão', () => {
            authService.isLoggedIn.mockReturnValue(true);
            expect(visoesService.getPermissoes(['perm1', 'perm_other'])).toBe(true);
        });

        it('deve retornar true se usuário tem todas as permissões', () => {
            authService.isLoggedIn.mockReturnValue(true);
            expect(visoesService.getPermissoes(['perm1', 'perm2'])).toBe(true);
        });

        it('deve retornar false se usuário não tem nenhuma permissão', () => {
            authService.isLoggedIn.mockReturnValue(true);
            expect(visoesService.getPermissoes(['perm_other', 'perm_another'])).toBe(false);
        });

         it('deve retornar false se a lista de permissões for vazia', () => {
            authService.isLoggedIn.mockReturnValue(true);
            expect(visoesService.getPermissoes([])).toBe(false);
        });

        it('deve retornar false se as permissoes requeridas forem null/undefined', () => {
            authService.isLoggedIn.mockReturnValue(true);
            expect(visoesService.getPermissoes(null)).toBeUndefined();
             expect(visoesService.getPermissoes(undefined)).toBeUndefined();
        });

         it('deve retornar false se user nao tiver permissoes', () => {
            authService.isLoggedIn.mockReturnValue(true);
            setUserData(DADOS_USUARIO_LOGADO, { permissoes: null });
            expect(() => visoesService.getPermissoes(['perm1'])).toThrow();
            setUserData(DADOS_USUARIO_LOGADO, {});
            expect(() => visoesService.getPermissoes(['perm1'])).toThrow();
        });
    });

     describe('featureFlagAtiva', () => {
        const userDataWithFlags = { feature_flags: ['flagA', 'flagB'] };

        beforeEach(() => {
            setUserData(DADOS_USUARIO_LOGADO, userDataWithFlags);
        });

        it('deve retornar false se nao tiver logado', () => {
            authService.isLoggedIn.mockReturnValue(false);
            expect(visoesService.featureFlagAtiva('flagA')).toBe(false);
        });

        it('deve retornar false se a flag é null ou empty', () => {
            authService.isLoggedIn.mockReturnValue(true);
            expect(visoesService.featureFlagAtiva(null)).toBe(false);
            expect(visoesService.featureFlagAtiva('')).toBe(false);
        });

        it('deve retornar true se a flag existir para o usuário', () => {
            authService.isLoggedIn.mockReturnValue(true);
            expect(visoesService.featureFlagAtiva('flagA')).toBe(true);
            expect(visoesService.featureFlagAtiva('flagB')).toBe(true);
        });

        it('deve retornar false se a flag nao existir para o usuário', () => {
            authService.isLoggedIn.mockReturnValue(true);
            expect(visoesService.featureFlagAtiva('flagC')).toBe(false);
        });

        it('deve retornar false se usuario não tiver flags', () => {
            authService.isLoggedIn.mockReturnValue(true);
            setUserData(DADOS_USUARIO_LOGADO, { feature_flags: null });
            expect(() => visoesService.featureFlagAtiva('flagA')).toThrow();
            setUserData(DADOS_USUARIO_LOGADO, {});
            expect(() => visoesService.featureFlagAtiva('flagA')).toThrow();
        });
    });

    describe('setDadosUsuariosLogados', () => {
        const respData = {
            login: testUser,
            nome: 'Updated Name',
            visoes: ['UE', 'DRE'],
            unidades: [{ uuid: 'unit1', nome: 'Unit 1', tipo_unidade: 'CEI' }],
            permissoes: ['p1', 'p2'],
            feature_flags: ['f1']
        };
        const normalData = {
            visao_selecionada: { nome: 'UE' },
            unidade_selecionada: { uuid: 'unitN', tipo_unidade: 'CEI', nome: 'Normal Unit' },
            associacao_selecionada: { uuid: 'assocN', nome: 'Normal Assoc' }
        };
         const supportData = {
            visao_selecionada: { nome: 'DRE' },
            unidade_selecionada: { uuid: 'unitS', tipo_unidade: 'DRE', nome: 'Support Unit' },
            associacao_selecionada: { uuid: 'assocS', nome: 'Support Assoc' }
        };

        it('deve unificar o response data com os dados do usuário normal quando suporte é false', () => {
            setUserData(DADOS_USUARIO_LOGADO_NORMAL, normalData);
            visoesService.setDadosUsuariosLogados(respData, false);
            const result = visoesService.getDadosDoUsuarioLogado();

            expect(result.usuario_logado.nome).toBe('Updated Name');
            expect(result.visoes).toEqual(['UE', 'DRE']);
            expect(result.unidades).toEqual(respData.unidades);
            expect(result.permissoes).toEqual(['p1', 'p2']);
            expect(result.feature_flags).toEqual(['f1']);
            expect(result.visao_selecionada.nome).toBe('UE');
            expect(result.unidade_selecionada.uuid).toBe('unitN');
            expect(result.associacao_selecionada.uuid).toBe('assocN');
        });

         it('deve unificar o response data com os dados do usuário quando suporte é trueshould merge response data with support data when suporte is true', () => {
            setUserData(DADOS_USUARIO_LOGADO_SUPORTE, supportData);
            visoesService.setDadosUsuariosLogados(respData, true);
            const result = visoesService.getDadosDoUsuarioLogado();

            expect(result.usuario_logado.nome).toBe('Updated Name');
            expect(result.visao_selecionada.nome).toBe('DRE');
            expect(result.unidade_selecionada.uuid).toBe('unitS');
            expect(result.associacao_selecionada.uuid).toBe('assocS');
        });

        it('deve lidar com dados normais/de suporte ausentes', () => {
            visoesService.setDadosUsuariosLogados(respData, false); 
            const result = visoesService.getDadosDoUsuarioLogado();

            expect(result.usuario_logado.nome).toBe('Updated Name');
            expect(result.visao_selecionada.nome).toBe('');
            expect(result.unidade_selecionada.uuid).toBe('');
            expect(result.associacao_selecionada.uuid).toBe('');
        });
    });

    describe('converteNomeVisao', () => {
        it('deve retornar de acordo com a visaos', () => {
            expect(visoesService.converteNomeVisao('UE')).toBe('UE');
            expect(visoesService.converteNomeVisao('DRE')).toBe('DRE');
            expect(visoesService.converteNomeVisao('SME')).toBe('SME');
        });

        it('deve retornar UE para visoes null/undefined ou inválidas', () => {
            expect(visoesService.converteNomeVisao('INVALID')).toBe('UE');
            expect(visoesService.converteNomeVisao('')).toBe('UE');
            expect(visoesService.converteNomeVisao(null)).toBe('UE');
            expect(visoesService.converteNomeVisao(undefined)).toBe('UE');
        });
    });

    describe('alternaVisoes', () => {
        const baseUserData = {
            usuario_logado: { login: testUser, nome: 'Test' },
            visoes: ['UE', 'DRE'],
            unidades: [{ uuid: 'ue1', nome: 'UE 1', tipo_unidade: 'CEI' }, { uuid: 'dre1', nome: 'DRE 1', tipo_unidade: 'DRE' }],
            visao_selecionada: { nome: 'UE' },
            unidade_selecionada: { uuid: 'ue1', tipo_unidade: 'CEI', nome: 'UE 1' },
            associacao_selecionada: { uuid: 'assoc1', nome: 'Assoc 1' },
            permissoes: [], feature_flags: []
        };

        beforeEach(() => {
            setUserData(DADOS_USUARIO_LOGADO, baseUserData);
            localStorageMock.setItem(ACESSO_MODO_SUPORTE, "false"); 
        });

        it('Deve atualizar DADOS_USUARIO_LOGADO com a nova seleção', () => {
            visoesService.alternaVisoes('DRE', 'dre1', 'dre1', 'DRE 1', 'DRE', 'DRE 1', null, null, null);
            const updatedData = visoesService.getDadosDoUsuarioLogado();
            expect(updatedData.visao_selecionada.nome).toBe('DRE');
            expect(updatedData.unidade_selecionada.uuid).toBe('dre1');
            expect(updatedData.unidade_selecionada.tipo_unidade).toBe('DRE');
            expect(updatedData.unidade_selecionada.nome).toBe('DRE 1');
            expect(updatedData.associacao_selecionada.uuid).toBe('dre1');
            expect(updatedData.associacao_selecionada.nome).toBe('DRE 1');
            expect(updatedData.unidade_selecionada.notificar_devolucao_referencia).toBeNull();
        });

        it('Deve atualizar itens específicos do localStorage', () => {
            visoesService.alternaVisoes('DRE', 'dre1', 'dre1', 'DRE 1', 'DRE', 'DRE 1', 'REF02', 'PC02', 'NOTIF02');
            expect(localStorageMock.getItem(ASSOCIACAO_UUID)).toBe('dre1');
            expect(localStorageMock.getItem(ASSOCIACAO_NOME)).toBe('DRE 1');
            expect(localStorageMock.getItem(ASSOCIACAO_TIPO_ESCOLA)).toBe('DRE');
            expect(localStorageMock.getItem(ASSOCIACAO_NOME_ESCOLA)).toBe('DRE 1');
            expect(localStorageMock.getItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")).toBe('REF02');
        });

        it('Deve remover itens específicos do localStorage', () => {
            localStorageMock.setItem('periodoConta', 'test');
            localStorageMock.setItem('acaoLancamento', 'test');
            localStorageMock.setItem('periodoPrestacaoDeConta', 'test');
            localStorageMock.setItem('statusPrestacaoDeConta', 'test');
            localStorageMock.setItem('contaPrestacaoDeConta', 'test');
            localStorageMock.setItem('uuidPrestacaoConta', 'test');
            localStorageMock.setItem('uuidAta', 'test');
            localStorageMock.setItem('prestacao_de_contas_nao_apresentada', 'test');
            localStorageMock.setItem(PERIODO_RELATORIO_CONSOLIDADO_DRE, 'test');

            visoesService.alternaVisoes('DRE', 'dre1', 'dre1', 'DRE 1', 'DRE', 'DRE 1', null, null, null);

            expect(localStorageMock.getItem('periodoConta')).toBeNull();
            expect(localStorageMock.getItem('acaoLancamento')).toBeNull();
            expect(localStorageMock.getItem('periodoPrestacaoDeConta')).toBeNull();
            expect(localStorageMock.getItem('statusPrestacaoDeConta')).toBeNull();
            expect(localStorageMock.getItem('contaPrestacaoDeConta')).toBeNull();
            expect(localStorageMock.getItem('uuidPrestacaoConta')).toBeNull();
            expect(localStorageMock.getItem('uuidAta')).toBeNull();
            expect(localStorageMock.getItem('prestacao_de_contas_nao_apresentada')).toBeNull();
            expect(localStorageMock.getItem(PERIODO_RELATORIO_CONSOLIDADO_DRE)).toBeNull();
        });

        it('Deve chamar salva_dados_ultimo_acesso com os parâmetros corretos', () => {
            visoesService.alternaVisoes('DRE', 'dre1', 'dre1', 'DRE 1', 'DRE', 'DRE 1', 'REF02', 'PC02', 'NOTIF02');

            const normalData = JSON.parse(localStorageMock.getItem(DADOS_USUARIO_LOGADO_NORMAL));
            expect(normalData[`usuario_${testUser}`].visao_selecionada.nome).toBe('DRE');
            expect(normalData[`usuario_${testUser}`].unidade_selecionada.uuid).toBe('dre1');
        });

        it('Deve chamar redirectVisao com o novo visto', () => {
            visoesService.alternaVisoes('DRE', 'dre1', 'dre1', 'DRE 1', 'DRE', 'DRE 1', null, null, null);
            expect(redirect).toHaveBeenCalledWith('/dre-dashboard');
        });

         it('Deve converter o nome do visto inválido para UE antes de salvar e redirecionar', () => {
            visoesService.alternaVisoes('INVALID', 'ue1', 'assoc1', 'Assoc 1', 'CEI', 'UE 1', null, null, null);
            const updatedData = visoesService.getDadosDoUsuarioLogado();
            expect(updatedData.visao_selecionada.nome).toBe('UE');
            expect(redirect).toHaveBeenCalledWith('/dados-da-associacao');
        });

        it('Não deve prosseguir se os dados do usuário não estiverem disponíveis', () => {
             localStorageMock.removeItem(DADOS_USUARIO_LOGADO);
             visoesService.alternaVisoes('DRE', 'dre1', 'dre1', 'DRE 1', 'DRE', 'DRE 1', null, null, null);
             expect(localStorageMock.getItem(ASSOCIACAO_UUID)).toBeNull();
             expect(redirect).not.toHaveBeenCalled();
        });

    });

    describe('setarUnidadeProximoLoginAcessoSuporte', () => {
         const baseUserData = {
            usuario_logado: { login: testUser, nome: 'Test' },
            visoes: ['UE', 'DRE'],
            unidades: [{ uuid: 'ue1', nome: 'UE 1', tipo_unidade: 'CEI' }, { uuid: 'dre1', nome: 'DRE 1', tipo_unidade: 'DRE' }],
            visao_selecionada: { nome: 'UE' },
            unidade_selecionada: { uuid: 'ue1', tipo_unidade: 'CEI', nome: 'UE 1' },
            associacao_selecionada: { uuid: 'assoc1', nome: 'Assoc 1' },
            permissoes: [], feature_flags: []
        };

        beforeEach(() => {
            setUserData(DADOS_USUARIO_LOGADO, baseUserData);
        });

        it('Deve atualizar DADOS_USUARIO_LOGADO para a seleção de UE', () => {
            visoesService.setarUnidadeProximoLoginAcessoSuporte('UE', 'new-ue', 'new-assoc', 'New Assoc', 'EMEF', 'New UE');
            const updatedData = visoesService.getDadosDoUsuarioLogado();
            expect(updatedData.visao_selecionada.nome).toBe('UE');
            expect(updatedData.unidade_selecionada.uuid).toBe('new-ue');
            expect(updatedData.unidade_selecionada.tipo_unidade).toBe('EMEF');
            expect(updatedData.unidade_selecionada.nome).toBe('New UE');
            expect(updatedData.associacao_selecionada.uuid).toBe('new-assoc');
            expect(updatedData.associacao_selecionada.nome).toBe('New Assoc');
            expect(updatedData.unidade_selecionada.notificar_devolucao_referencia).toBeNull();
        });

        it('Deve atualizar DADOS_USUARIO_LOGADO para a seleção de DRE (a associação usa dados da unidade)', () => {
            visoesService.setarUnidadeProximoLoginAcessoSuporte('DRE', 'new-dre', 'ignored-assoc-uuid', 'Ignored Assoc Name', 'DRE', 'New DRE');
            const updatedData = visoesService.getDadosDoUsuarioLogado();
            expect(updatedData.visao_selecionada.nome).toBe('DRE');
            expect(updatedData.unidade_selecionada.uuid).toBe('new-dre');
            expect(updatedData.unidade_selecionada.tipo_unidade).toBe('DRE');
            expect(updatedData.unidade_selecionada.nome).toBe('New DRE');
            expect(updatedData.associacao_selecionada.uuid).toBe('new-dre');
            expect(updatedData.associacao_selecionada.nome).toBe('New DRE');
        });

         it('Deve converter o nome do visto inválido para UE', () => {
            visoesService.setarUnidadeProximoLoginAcessoSuporte('INVALID', 'new-ue', 'new-assoc', 'New Assoc', 'EMEF', 'New UE');
            const updatedData = visoesService.getDadosDoUsuarioLogado();
            expect(updatedData.visao_selecionada.nome).toBe('UE');
        });

        it('Não deve chamar redirect ou limpar outros itens do localStorage', () => {
             localStorageMock.setItem('periodoConta', 'keep');
             visoesService.setarUnidadeProximoLoginAcessoSuporte('UE', 'new-ue', 'new-assoc', 'New Assoc', 'EMEF', 'New UE');
             expect(redirect).not.toHaveBeenCalled();
             expect(localStorageMock.getItem('periodoConta')).toBe('keep');
        });

         it('Não deve prosseguir se os dados do usuário não estiverem disponíveis', () => {
             localStorageMock.removeItem(DADOS_USUARIO_LOGADO);
             const initialStore = { ...localStorageMock.getStore() };
             visoesService.setarUnidadeProximoLoginAcessoSuporte('UE', 'new-ue', 'new-assoc', 'New Assoc', 'EMEF', 'New UE');
             expect(localStorageMock.getStore()).toEqual(initialStore);
        });
        
    });

    describe('redirectVisao', () => {
         const userDataSME = { visoes: [{tipo: 'SME'}] };
         const userDataDRE = { visoes: [{tipo: 'DRE'}] };
         const userDataUE = { visoes: [{tipo: 'UE'}] };
         const userDataDREUE = { visoes: [{tipo:'DRE'}, {tipo: 'UE'}] };
         const userDataNone = { visoes: [] };

        it('deve redirecionar para painel PME se visao é PME', () => {
            setUserData(DADOS_USUARIO_LOGADO, userDataSME);
            visoesService.redirectVisao('SME');
            expect(redirect).toHaveBeenCalledWith('/painel-parametrizacoes');
        });

        it('deve redirecionar para o painel do DRE se o visto é DRE', () => {
            setUserData(DADOS_USUARIO_LOGADO, userDataDRE);
            visoesService.redirectVisao('DRE');
            expect(redirect).toHaveBeenCalledWith('/dre-dashboard');
        });

        it('deve redirecionar para os dados da associação UE se visao é UE', () => {
            setUserData(DADOS_USUARIO_LOGADO, userDataUE);
            visoesService.redirectVisao('UE');
            expect(redirect).toHaveBeenCalledWith('/dados-da-associacao');
        });

        it('deve redirecionar para painel SME se visao é nulo e usuário tem SME', () => {
            setUserData(DADOS_USUARIO_LOGADO, userDataSME);
            visoesService.redirectVisao(null);
            expect(redirect).toHaveBeenCalledWith('/painel-parametrizacoes');
        });

        it('deve redirecionar para o painel do DRE se o visto for nulo e o usuário tiver DRE (sem SME)', () => {
            setUserData(DADOS_USUARIO_LOGADO, userDataDREUE);
            visoesService.redirectVisao(null);
            expect(redirect).toHaveBeenCalledWith('/dre-dashboard');
        });

         it('deve redirecionar para dados de associação UE se visao é nulo e usuário tem UE (sem SME/DRE)', () => {
            setUserData(DADOS_USUARIO_LOGADO, userDataUE);
            visoesService.redirectVisao(null);
            expect(redirect).toHaveBeenCalledWith('/dados-da-associacao');
        });

        it('deve redirecionar para os dados da associação UE se o visto for nulo e o usuário não tiver visões', () => {
            setUserData(DADOS_USUARIO_LOGADO, userDataNone);
            visoesService.redirectVisao(null);
            expect(redirect).toHaveBeenCalledWith('/dados-da-associacao');
        });

         it('deve redirecionar para os dados da associação UE se o visto for inválido', () => {
            setUserData(DADOS_USUARIO_LOGADO, userDataDRE);
            visoesService.redirectVisao('INVALID');
            expect(redirect).toHaveBeenCalledWith('/dre-dashboard');
        });
    });

    describe('getItemUsuarioLogado', () => {
        const userData = {
            nome: 'Test User',
            config: { theme: 'dark' },
            permissoes: ['read']
        };

        beforeEach(() => {
            setUserData(DADOS_USUARIO_LOGADO, userData);
        });

        it('deve retornar um item de nível superior', () => {
            expect(visoesService.getItemUsuarioLogado('nome')).toBe('Test User');
        });

        it('deve retornar um item aninhado', () => {
            expect(visoesService.getItemUsuarioLogado('config.theme')).toBe('dark');
        });

        it('deve retornar um item do array', () => {
            expect(visoesService.getItemUsuarioLogado('permissoes')).toEqual(['read']);
        });

        it('deve retornar indefinido para um item inexistente', () => {
            expect(visoesService.getItemUsuarioLogado('nonexistent')).toBeUndefined();
        });

        it('deve retornar indefinido para um item aninhado inexistente', () => {
            expect(visoesService.getItemUsuarioLogado('config.layout')).toBeUndefined();
        });

        it('deve gerar erro se os dados do usuário forem nulos', () => {
             localStorageMock.removeItem(DADOS_USUARIO_LOGADO);
             expect(() => visoesService.getItemUsuarioLogado('nome')).toThrow(TypeError);
        });
    });

});

describe('setDadosPrimeiroAcesso', () => {
    
    const respUE = {
        login: testUser,
        nome: 'Test User UE',
        visoes: ['UE'],
        unidades: [
            { 
                uuid: 'ue-uuid',
                nome: 'Escola Teste',
                tipo_unidade: 'CEI',
                associacao: {
                    uuid: 'assoc-uuid',
                    nome: 'APM Teste'
                },
                notificar_devolucao_referencia: 'REF01',
                notificar_devolucao_pc_uuid: 'PCUUID01',
                notificacao_uuid: 'NOTIFUUID01'
            }
        ],
        permissoes: [], feature_flags: []
    };

    beforeEach(() => {
        jest.spyOn(visoesService, 'alternaVisoes').mockImplementation(() => {});
        visoesService.setDadosUsuariosLogados(respUE, false);
    });

    it('should use notification fields from resp.unidades when re-selecting existing unit', async () => {
        const existingUserData = {
            ...visoesService.getDadosDoUsuarioLogado(),
            visao_selecionada: { nome: 'UE' },
            unidade_selecionada: {"uuid":"ue-uuid","tipo_unidade":"CEI","nome":"Escola Teste","notificar_devolucao_referencia":"REF01","notificar_devolucao_pc_uuid":"PCUUID01","notificacao_uuid":"NOTIFUUID01"},
            associacao_selecionada: { uuid: 'assoc-uuid', nome: 'APM Teste' },
            unidades: respUE.unidades
        };
        setUserData(DADOS_USUARIO_LOGADO, existingUserData);
        localStorageMock.setItem(ACESSO_MODO_SUPORTE, "false");

        await visoesService.setDadosPrimeiroAcesso(respUE, false);
        expect(localStorageMock.getItem(DADOS_USUARIO_LOGADO)).toBe(JSON.stringify({[`usuario_${testUser}`]: existingUserData}))
        expect(localStorageMock.getItem(ACESSO_MODO_SUPORTE)).toBe("false")

    });
});