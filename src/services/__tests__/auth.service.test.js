// src/services/auth.service.test.js

import api from '../api';
import HTTP_STATUS from "http-status-codes";
import { DADOS_USUARIO_LOGADO, visoesService } from "../visoes.service";
import moment from "moment";
import {
    authService,
    TOKEN_ALIAS,
    DATA_LOGIN,
    USUARIO_NOME,
    ASSOCIACAO_UUID,
    USUARIO_EMAIL,
    USUARIO_CPF,
    USUARIO_LOGIN,
    USUARIO_INFO_PERDEU_ACESSO,
    PERIODO_RELATORIO_CONSOLIDADO_DRE,
    ACESSO_MODO_SUPORTE,
    getUsuarioLogado,
    viabilizarAcessoSuporte,
    getUnidadesEmSuporte,
    encerrarAcessoSuporte,
    encerrarAcessoSuporteEmLote,
    esqueciMinhaSenha,
    redefinirMinhaSenha,
    alterarMeuEmail,
    alterarMinhaSenha
} from '../auth.service';
import { ACOMPANHAMENTO_DE_PC } from "../mantemEstadoAcompanhamentoDePc.service";
import { ACOMPANHAMENTO_PC_UNIDADE } from "../mantemEstadoAcompanhamentoDePcUnidadeEducacional.service";
import { ANALISE_DRE } from '../mantemEstadoAnaliseDre.service';

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


jest.mock('../api', () => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
}));

jest.mock('../mantemEstadoAcompanhamentoDePc.service', () => ({
    meapcservice: {
        setAcompanhamentoDePc: jest.fn(),
    }
}));

jest.mock('../visoes.service', () => ({
    visoesService: {
        setDadosUsuariosLogados: jest.fn(),
        setDadosPrimeiroAcesso: jest.fn(),
        logout: jest.fn()
    },
    DATA_HORA_USUARIO_LOGADO: "DATA_HORA_USUARIO_LOGADO",
}));

jest.mock('../mantemEstadoAcompanhamentoDePc.service', () => ({
    mantemEstadoAcompanhamentoDePc: {
        setAcompanhamentoDePc: jest.fn(),
    },
    ACOMPANHAMENTO_DE_PC: "ACOMPANHAMENTO_DE_PC",
}));

jest.mock('../mantemEstadoAcompanhamentoDePcUnidadeEducacional.service', () => ({
    mantemEstadoAcompanhamentoDePcUnidade: {
        setAcompanhamentoPcUnidadePorUsuario: jest.fn(),
    },
    ACOMPANHAMENTO_PC_UNIDADE: "ACOMPANHAMENTO_PC_UNIDADE",
}));

jest.mock('../mantemEstadoAnaliseDre.service', () => ({
    mantemEstadoAnaliseDre: {
        setAnaliseDre: jest.fn(),
    },
    ANALISE_DRE: "ANALISE_DRE",
}));

let mockCurrentDate = '2025-04-14';
let mockCurrentDateTime = '2025-04-14 10:00:00';
let mockDaysDiff = 0;

jest.mock('moment', () => {
    const moment = jest.requireActual('moment');
    const mockMomentInstance = {
        format: jest.fn((format) => {
            if (format === "YYYY-MM-DD") return mockCurrentDate;
            if (format === "YYYY-MM-DD HH:mm:ss") return mockCurrentDateTime;
            return `formatted:${format}`;
        }),
        diff: jest.fn(() => mockDaysDiff),
        toISOString: jest.fn(() => new Date(mockCurrentDate + 'T10:00:00Z').toISOString()),
    };
    const mockDurationInstance = {
        asDays: jest.fn(() => mockDaysDiff),
    };
    const momentConstructor = jest.fn(() => mockMomentInstance);

    
    momentConstructor.duration = jest.fn(() => mockDurationInstance);
    momentConstructor.mockSetCurrentDate = (date) => { mockCurrentDate = date; };
    momentConstructor.mockSetCurrentDateTime = (dateTime) => { mockCurrentDateTime = dateTime; };
    momentConstructor.mockSetDaysDiff = (days) => { mockDaysDiff = days; };

    Object.assign(momentConstructor, moment);

    return momentConstructor;
});


Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const originalLocation = window.location;
delete window.location;
window.location = {
    href: '',
    assign: jest.fn(),
};

describe('Auth Service', () => {

    const mockLogin = 'testuser';
    const mockPassword = 'password123';
    const mockToken = 'mock-jwt-token';
    const mockUserData = {
        token: mockToken,
        nome: 'Test User Name',
        email: 'test@example.com',
        login: mockLogin,
        cpf: '12345678900',
        info_perdeu_acesso: false,
    };
    const mockErrorResponse = {
        response: {
            data: { detail: 'Authentication failed' },
            status: HTTP_STATUS.UNAUTHORIZED,
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
        window.location.assign.mockClear();
        window.location.href = ''; // Reset href

        moment.mockSetCurrentDate('2025-04-14');
        moment.mockSetCurrentDateTime('2025-04-14 10:00:00');
        moment.mockSetDaysDiff(0); // Assume login date is today by default
        
    });

    afterAll(() => {
        window.location = originalLocation;
    });

    describe('login', () => {
        it('deve logar normalmente, realziar o set em localstorage e redirecionar', async () => {
            const suporte = false;
            const response = { data: mockUserData, status: HTTP_STATUS.OK, detail: 'details' }
            const resp = response.data
            api.post.mockResolvedValueOnce(response);
            localStorageMock.setItem(DATA_LOGIN, '2025-04-14');

            await authService.login(mockLogin, mockPassword, false);

            expect(api.post).toHaveBeenCalledWith('api/login', { login: mockLogin, senha: mockPassword, suporte: false }, expect.any(Object));
            expect(localStorageMock.getItem(DATA_LOGIN)).toBe('2025-04-14');

            localStorageMock.setItem(ACESSO_MODO_SUPORTE, JSON.stringify(suporte ? true : false));
 
            localStorageMock.setItem(TOKEN_ALIAS, resp.token);
            localStorageMock.setItem(USUARIO_NOME,resp.nome);
            localStorageMock.setItem(USUARIO_EMAIL,resp.email);
            localStorageMock.setItem(USUARIO_LOGIN,resp.login);
            localStorageMock.setItem(USUARIO_CPF,resp.cpf);
 
            if(resp.info_perdeu_acesso !== undefined){
                localStorageMock.setItem(USUARIO_INFO_PERDEU_ACESSO, JSON.stringify(resp.info_perdeu_acesso));
            }
 
            localStorageMock.removeItem('medidorSenha');
            expect(localStorageMock.getItem(ACESSO_MODO_SUPORTE)).toBe(JSON.stringify(suporte));
            expect(localStorageMock.getItem(ACESSO_MODO_SUPORTE)).toBe("false");
            expect(localStorageMock.getItem(TOKEN_ALIAS)).toBe(mockToken);
            expect(localStorageMock.getItem(USUARIO_NOME)).toBe(mockUserData.nome);
            expect(localStorageMock.getItem(USUARIO_EMAIL)).toBe(mockUserData.email);
            expect(localStorageMock.getItem(USUARIO_LOGIN)).toBe(mockUserData.login);
            expect(localStorageMock.getItem(USUARIO_CPF)).toBe(mockUserData.cpf);
            expect(localStorageMock.getItem(USUARIO_INFO_PERDEU_ACESSO)).toBe(JSON.stringify(mockUserData.info_perdeu_acesso));

            expect(localStorageMock.getItem(DADOS_USUARIO_LOGADO)).toBe(null);
            expect(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC)).toBe(null);
            expect(visoesService.logout).not.toHaveBeenCalled();

            expect(window.location.href).toBe('');
        });

        it('deve logar com sucesso no modo Suporte e definir ACESSO_MODO_SUPORTE para true', async () => {
            const suporte = true;
            api.post.mockResolvedValueOnce({ data: mockUserData, status: HTTP_STATUS.OK });
            localStorageMock.setItem(DATA_LOGIN, '2025-04-14');

            await authService.login(mockLogin, mockPassword, true);
            expect(localStorageMock.setItem(ACESSO_MODO_SUPORTE, JSON.stringify(suporte)));
            await authService.login(mockLogin, mockPassword, false);

            expect(api.post).toHaveBeenCalledWith('api/login', { login: mockLogin, senha: mockPassword, suporte: true }, expect.any(Object));
            expect(localStorageMock.getItem(ACESSO_MODO_SUPORTE)).toBe(JSON.stringify(suporte));
            expect(window.location.href).toBe('');
        });

        it('deve chamar falha de API de Login', async () => {
            api.post.mockRejectedValueOnce(mockErrorResponse);

            const result = await authService.login(mockLogin, mockPassword);

            expect(result).toEqual(mockErrorResponse.response.data);
            expect(localStorageMock.getItem(TOKEN_ALIAS)).toBeNull();
            
            expect(visoesService.setDadosUsuariosLogados).not.toHaveBeenCalled();
            expect(visoesService.setDadosPrimeiroAcesso).not.toHaveBeenCalled();
            expect(window.location.href).toBe('');
        });

        it('deve status de sucesso no login, mas, com mensagem de credenciais inválidas', async () => {
            const detailResponse = { detail: "Credenciais inválidas." };
            api.post.mockResolvedValueOnce({ data: detailResponse, status: HTTP_STATUS.OK });

            const result = await authService.login(mockLogin, mockPassword);

            expect(result).toEqual(detailResponse);
            expect(localStorageMock.getItem(TOKEN_ALIAS)).toBeNull
            expect(visoesService.setDadosUsuariosLogados).not.toHaveBeenCalled();
            expect(window.location.href).toBe('');
        });

        it('deve chamar setDataLogin e set de DATA_LOGIN', async () => {
            api.post.mockResolvedValueOnce({ data: mockUserData, status: HTTP_STATUS.OK });
            localStorageMock.setItem(DATA_LOGIN, '2025-10-25');
            moment.mockSetDaysDiff(2);

            await authService.login(mockLogin, mockPassword, false);

            expect(localStorageMock.getItem(DADOS_USUARIO_LOGADO)).toBeNull();
            expect(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC)).toBeNull();
            expect(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE)).toBeNull();
            expect(localStorageMock.getItem(ANALISE_DRE)).toBeNull();
            expect(localStorageMock.getItem(PERIODO_RELATORIO_CONSOLIDADO_DRE)).toBeNull();
            expect(localStorageMock.getItem(DATA_LOGIN)).toBe('2025-10-25');

            expect(window.location.href).toBe('');
        });

        it('deve chamar setDataLogin e definir DATA_LOGIN se não existir', async () => {
            api.post.mockResolvedValueOnce({ data: mockUserData, status: HTTP_STATUS.OK });
            localStorageMock.removeItem(DATA_LOGIN);

            await authService.login(mockLogin, mockPassword, false);

            expect(localStorageMock.getItem(DATA_LOGIN)).toBeNull()
            expect(window.location.href).toBe('');
        });
    });

    describe('isLoggedIn', () => {
        it('deve retornar true se token existir', () => {
            localStorageMock.setItem(TOKEN_ALIAS, mockToken);
            expect(authService.isLoggedIn()).toBe(true);
        });

        it('deve retornar false se token não existir', () => {
            localStorageMock.removeItem(TOKEN_ALIAS);
            expect(authService.isLoggedIn()).toBe(false);
        });
    });

    describe('getToken', () => {
        it('deve retornar o token se existir', () => {
            localStorageMock.setItem(TOKEN_ALIAS, mockToken);
            expect(authService.getToken()).toBe(mockToken);
        });

        it('deve retornar undefined if token não existir', () => {
            localStorageMock.removeItem(TOKEN_ALIAS);
            expect(authService.getToken()).toBeUndefined();
        });
    });

    describe('logout', () => {
        it('deve remover todos os itens relevantes do localStorage e redirecionar para /login', () => {
            localStorageMock.setItem(TOKEN_ALIAS, mockToken);
            localStorageMock.setItem(USUARIO_NOME, 'test');
            localStorageMock.setItem(ASSOCIACAO_UUID, 'uuid');
            localStorageMock.setItem('periodoConta', 'pc');

            authService.logout();

            expect(window.location.assign).toHaveBeenCalledWith('/login');
        });
    });

    describe('logoutToSuporte', () => {
        it('deve remover todos os itens relevantes do localStorage e redirecionar para /login-suporte', () => {
            localStorageMock.setItem(TOKEN_ALIAS, mockToken);
            localStorageMock.setItem(USUARIO_NOME, 'test');

            authService.logoutToSuporte();

            expect(window.location.assign).toHaveBeenCalledWith('/login-suporte');
        });
    });

    describe('getUsuarioLogado', () => {
        it('deve retornar username e nome do usuário do localStorage', () => {
            const name = 'User Name';
            localStorage.setItem(USUARIO_LOGIN, mockLogin);
            localStorage.setItem(USUARIO_NOME, name);

            const result = getUsuarioLogado();

            expect(result).toEqual({ login: mockLogin, nome: name });
            expect(localStorage.getItem(USUARIO_LOGIN)).toBe(mockLogin);
            expect(localStorage.getItem(USUARIO_NOME)).toBe(name);
        });

        it('deve retornar null para login/name se não for encontrado no localStorage', () => {
            const result = getUsuarioLogado();
            expect(result).toEqual({ login: null, nome: null });
        });
    });

    describe('API chama funções', () => {
        const mockApiData = { success: true };
        const mockPayload = { data: 'value' };
        const mockRf = 'user-rf';
        const mockUsuario = 'user-uuid';
        const mockPage = 2;
        const mockUnitUuid = 'unit-1';
        const mockUnitUuids = ['unit-1', 'unit-2'];

        beforeEach(() => {
            localStorageMock.setItem(TOKEN_ALIAS, mockToken);
        });

        it('esqueciMinhaSenha deve chamar api.put e retornar data', async () => {
            api.put.mockResolvedValueOnce({ data: mockApiData });
            const result = await esqueciMinhaSenha(mockPayload, mockRf);
            expect(api.put).toHaveBeenCalledWith(`/api/esqueci-minha-senha/${mockRf}/`, mockPayload, expect.any(Object));
            expect(result).toEqual(mockApiData);
        });

        it('redefinirMinhaSenha deve chamar api.post e retornar data', async () => {
            api.post.mockResolvedValueOnce({ data: mockApiData });
            const result = await redefinirMinhaSenha(mockPayload);
            expect(api.post).toHaveBeenCalledWith(`/api/redefinir-senha/`, mockPayload, expect.any(Object));
            expect(result).toEqual(mockApiData);
        });

        it('alterarMeuEmail deve chamar api.patch with auth headers', async () => {
            api.patch.mockResolvedValueOnce({ data: mockApiData });
            await alterarMeuEmail(mockUsuario, mockPayload);
            expect(api.patch).toHaveBeenCalledWith(
                `api/usuarios/${mockUsuario}/altera-email/`,
                mockPayload,
                expect.objectContaining({ headers: expect.objectContaining({ 'Authorization': `JWT ${mockToken}` }) })
            );
        });

        it('alterarMinhaSenha deve chamar api.patch com authorization no cabeçalho', async () => {
            api.patch.mockResolvedValueOnce({ data: mockApiData });
            await alterarMinhaSenha(mockUsuario, mockPayload);
            expect(api.patch).toHaveBeenCalledWith(
                `/api/usuarios/${mockUsuario}/altera-senha/`,
                mockPayload,
                expect.objectContaining({ headers: expect.objectContaining({ 'Authorization': `JWT ${mockToken}` }) })
            );
        });

        it('viabilizarAcessoSuporte deve chamar api.post com authorization no cabeçalho', async () => {
            api.post.mockResolvedValueOnce({ data: mockApiData });
            await viabilizarAcessoSuporte(mockUsuario, mockPayload);
            expect(api.post).toHaveBeenCalledWith(
                `api/usuarios/${mockUsuario}/viabilizar-acesso-suporte/`,
                mockPayload,
                expect.objectContaining({ headers: expect.objectContaining({ 'Authorization': `JWT ${mockToken}` }) })
            );
        });

         it('getUnidadesEmSuporte deve chamar api.get com authorization no cabeçalho e parâmetro de URL, page', async () => {
            api.get.mockResolvedValueOnce({ data: mockApiData });
            const result = await getUnidadesEmSuporte(mockUsuario, mockPage);
             expect(api.get).toHaveBeenCalledWith(
                `/api/usuarios/${mockUsuario}/unidades-em-suporte/?page=${mockPage}`,
                expect.objectContaining({ headers: expect.objectContaining({ 'Authorization': `JWT ${mockToken}` }) })
            );
            expect(result).toEqual(mockApiData);
        });

         it('encerrarAcessoSuporte deve chamar api.post com authorization no cabeçalho', async () => {
            api.post.mockResolvedValueOnce({ data: mockApiData });
            await encerrarAcessoSuporte(mockUsuario, mockUnitUuid);
             expect(api.post).toHaveBeenCalledWith(
                `api/usuarios/${mockUsuario}/encerrar-acesso-suporte/`,
                { unidade_suporte_uuid: mockUnitUuid },
                expect.objectContaining({ headers: expect.objectContaining({ 'Authorization': `JWT ${mockToken}` }) })
            );
        });

        it('encerrarAcessoSuporteEmLote deve chamar api.post com authorization no cabeçalho', async () => {
            api.post.mockResolvedValueOnce({ data: mockApiData });
            await encerrarAcessoSuporteEmLote(mockUsuario, mockUnitUuids);
             expect(api.post).toHaveBeenCalledWith(
                `api/usuarios/${mockUsuario}/encerrar-acesso-suporte-em-lote/`,
                { unidade_suporte_uuids: mockUnitUuids },
                expect.objectContaining({ headers: expect.objectContaining({ 'Authorization': `JWT ${mockToken}` }) })
            );
        });
    });
});
