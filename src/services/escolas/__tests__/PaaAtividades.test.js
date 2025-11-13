import api from '../../api';
import {
  getAtividadesEstatutariasPrevistas,
  createAtividadeEstatutariaPaa,
  linkAtividadeEstatutariaExistentePaa,
  updateAtividadeEstatutariaPaa,
  deleteAtividadeEstatutariaPaa,
  getRecursosPropriosPrevistos,
} from '../Paa.service';
import { TOKEN_ALIAS } from '../../auth.service';

jest.mock('../../api', () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste' }];

describe('Paa.service - atividades estatutárias e recursos próprios previstos', () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_ALIAS, mockToken);
    jest.clearAllMocks();
  });

  const getAuthHeader = () => ({
    headers: {
      Authorization: `JWT ${mockToken}`,
      'Content-Type': 'application/json',
    },
  });

  test('getAtividadesEstatutariasPrevistas retorna vazio sem PAA', async () => {
    const result = await getAtividadesEstatutariasPrevistas();
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual({ results: [] });
  });

  test('getAtividadesEstatutariasPrevistas chama API quando há PAA', async () => {
    api.get.mockResolvedValueOnce({ data: mockData });
    const paaUuid = 'paa-123';

    const result = await getAtividadesEstatutariasPrevistas(paaUuid);

    expect(api.get).toHaveBeenCalledWith(
      `api/paa/${paaUuid}/atividades-estatutarias-previstas/`,
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });

  test('createAtividadeEstatutariaPaa envia payload correto', async () => {
    api.patch.mockResolvedValueOnce({ data: mockData });
    const paaUuid = 'paa-123';
    const atividade = { nome: 'Atividade', tipo: 'ORDINARIA', data: '2025-01-01' };

    const result = await createAtividadeEstatutariaPaa(paaUuid, atividade);

    expect(api.patch).toHaveBeenCalledWith(
      `api/paa/${paaUuid}/`,
      {
        atividades_estatutarias: [
          { nome: atividade.nome, tipo: atividade.tipo, data: atividade.data },
        ],
      },
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });

  test('linkAtividadeEstatutariaExistentePaa envia payload correto', async () => {
    api.patch.mockResolvedValueOnce({ data: mockData });
    const paaUuid = 'paa-123';
    const atividade = { atividade_estatutaria: 'atividade-uuid', data: '2025-02-01' };

    const result = await linkAtividadeEstatutariaExistentePaa(paaUuid, atividade);

    expect(api.patch).toHaveBeenCalledWith(
      `api/paa/${paaUuid}/`,
      {
        atividades_estatutarias: [
          {
            atividade_estatutaria: atividade.atividade_estatutaria,
            data: atividade.data,
          },
        ],
      },
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });

  test('updateAtividadeEstatutariaPaa envia payload correto', async () => {
    api.patch.mockResolvedValueOnce({ data: mockData });
    const paaUuid = 'paa-123';
    const atividade = {
      atividade_estatutaria: 'atividade-uuid',
      nome: 'Atualizada',
      tipo: 'EXTRAORDINARIA',
      data: '2025-03-10',
    };

    const result = await updateAtividadeEstatutariaPaa(paaUuid, atividade);

    expect(api.patch).toHaveBeenCalledWith(
      `api/paa/${paaUuid}/`,
      {
        atividades_estatutarias: [
          {
            atividade_estatutaria: atividade.atividade_estatutaria,
            nome: atividade.nome,
            tipo: atividade.tipo,
            data: atividade.data,
          },
        ],
      },
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });

  test('deleteAtividadeEstatutariaPaa envia payload com _destroy', async () => {
    api.patch.mockResolvedValueOnce({ data: mockData });
    const paaUuid = 'paa-123';
    const atividadeUuid = 'atividade-uuid';

    const result = await deleteAtividadeEstatutariaPaa(paaUuid, atividadeUuid);

    expect(api.patch).toHaveBeenCalledWith(
      `api/paa/${paaUuid}/`,
      {
        atividades_estatutarias: [
          { atividade_estatutaria: atividadeUuid, _destroy: true },
        ],
      },
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });

  test('getRecursosPropriosPrevistos retorna vazio sem PAA', async () => {
    const result = await getRecursosPropriosPrevistos();
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('getRecursosPropriosPrevistos chama API com PAA', async () => {
    api.get.mockResolvedValueOnce({ data: mockData });
    const paaUuid = 'paa-123';

    const result = await getRecursosPropriosPrevistos(paaUuid);

    expect(api.get).toHaveBeenCalledWith(
      `api/paa/${paaUuid}/recursos-proprios-previstos/`,
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });
});
