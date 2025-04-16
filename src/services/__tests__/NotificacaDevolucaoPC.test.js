// src/services/NotificacaDevolucaoPC.service.test.js

import { notificaDevolucaoPCService } from '../NotificacaDevolucaoPC.service';
import { visoesService } from "../visoes.service";
import { setNotificacaoMarcarDesmarcarLida } from "../Notificacoes.service";
import { getPeriodoPorReferencia } from "../sme/Parametrizacoes.service";

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

  
jest.mock('../visoes.service', () => ({
  visoesService: {
    getDadosDoUsuarioLogado: jest.fn(),
    setDadosDoUsuarioLogado: jest.fn(),
  }
}));

jest.mock('../Notificacoes.service', () => ({
  setNotificacaoMarcarDesmarcarLida: jest.fn(),
}));

jest.mock('../sme/Parametrizacoes.service', () => ({
  getPeriodoPorReferencia: jest.fn(),
}));

describe('NotificaDevolucaoPC Service', () => {

  const mockHistory = {
    push: jest.fn(),
  };

  const mockNotificacaoUuid = 'notif-uuid-123';
  const mockPcUuid = 'pc-uuid-456';
  const mockPeriodoRef = '2023-10';
  const mockUnitUuid = 'unit-uuid-789';

  const mockUserData = {
    unidade_selecionada: {
      uuid: mockUnitUuid,
      notificar_devolucao_referencia: mockPeriodoRef,
      notificar_devolucao_pc_uuid: mockPcUuid,
      notificacao_uuid: mockNotificacaoUuid,
    },
    unidades: [
      {
        uuid: mockUnitUuid,
        notificar_devolucao_referencia: mockPeriodoRef,
        notificar_devolucao_pc_uuid: mockPcUuid,
        notificacao_uuid: mockNotificacaoUuid,
      },
      {
        uuid: 'other-unit-uuid',
        notificar_devolucao_referencia: 'other-ref',
        notificar_devolucao_pc_uuid: 'other-pc',
        notificacao_uuid: 'other-notif',
      }
    ],
};

  const mockPeriodoData = [
    {
      referencia: '2023-10',
      data_inicio_realizacao_despesas: '2023-10-01',
      data_fim_realizacao_despesas: '2023-10-31',
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    visoesService.getDadosDoUsuarioLogado.mockReturnValue(JSON.parse(JSON.stringify(mockUserData)));
    setNotificacaoMarcarDesmarcarLida.mockResolvedValue({});
    getPeriodoPorReferencia.mockResolvedValue(mockPeriodoData);
  });

  describe('marcaNotificacaoComoLidaERedirecianaParaVerAcertos', () => {

    it('should call getDadosDoUsuarioLogado to fetch user data', async () => {
      notificaDevolucaoPCService.marcaNotificacaoComoLidaERedirecianaParaVerAcertos(mockHistory);
      expect(visoesService.getDadosDoUsuarioLogado).toHaveBeenCalled();
    });

    it('should call setNotificacaoMarcarDesmarcarLida with correct parameters', async () => {
      notificaDevolucaoPCService.marcaNotificacaoComoLidaERedirecianaParaVerAcertos(mockHistory);
      expect(setNotificacaoMarcarDesmarcarLida).toHaveBeenCalledTimes(1);
      expect(setNotificacaoMarcarDesmarcarLida).toHaveBeenCalledWith({
        uuid: mockNotificacaoUuid,
        lido: true,
      });
    });
  });
});
