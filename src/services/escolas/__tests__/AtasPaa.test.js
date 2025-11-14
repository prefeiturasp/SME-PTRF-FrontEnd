import api from '../../api';
import {
  getTabelasAtasPaa,
  getAtaPaa,
  iniciarAtaPaa,
} from '../AtasPaa.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';

jest.mock('../../api', () => ({
  get: jest.fn(),
}));

const mockToken = 'fake-token';
const ataUuid = 'ata-uuid';
const paaUuid = 'paa-uuid';
const mockData = { id: 1, nome: 'Teste' };

describe('AtasPaa.service', () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_ALIAS, mockToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getAuthHeader = () => ({
    headers: {
      Authorization: `JWT ${mockToken}`,
      'Content-Type': 'application/json',
    },
  });

  test('getTabelasAtasPaa deve chamar o endpoint correto', async () => {
    api.get.mockResolvedValue({ data: mockData });

    const result = await getTabelasAtasPaa();

    expect(api.get).toHaveBeenCalledWith(
      `api/atas-paa/tabelas/`,
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });

  test('getAtaPaa deve buscar a ata pelo uuid', async () => {
    api.get.mockResolvedValue({ data: mockData });

    const result = await getAtaPaa(ataUuid);

    expect(api.get).toHaveBeenCalledWith(
      `api/atas-paa/${ataUuid}/`,
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });

  test('iniciarAtaPaa deve chamar o endpoint e retornar os dados', async () => {
    api.get.mockResolvedValue({ data: mockData });

    const result = await iniciarAtaPaa(paaUuid);

    expect(api.get).toHaveBeenCalledWith(
      `api/atas-paa/iniciar-ata/?paa_uuid=${paaUuid}`,
      getAuthHeader()
    );
    expect(result).toEqual(mockData);
  });

  test('iniciarAtaPaa deve lançar erro quando o uuid do PAA não for fornecido', async () => {
    await expect(iniciarAtaPaa()).rejects.toThrow(
      'É necessário informar o uuid do PAA para iniciar a ata.'
    );
    expect(api.get).not.toHaveBeenCalled();
  });
});
