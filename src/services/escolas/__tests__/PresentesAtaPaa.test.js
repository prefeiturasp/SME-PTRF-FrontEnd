import api from "../../api";
import {
  getListaPresentesPaa,
  getListaPresentesPadraoPaa,
  getMembroPorIdentificadorPaa,
  getProfessorGremioInfo,
  postEdicaoAtaPaa,
  getParticipantesOrdenadosPorCargoPaa,
} from "../PresentesAtaPaa.service";
import { TOKEN_ALIAS } from "../../auth.service";

jest.mock("../../api", () => ({
  get: jest.fn(),
  patch: jest.fn(),
  registerUnauthorizedHandler: jest.fn(),
}));

const mockToken = "fake-token";
const mockData = [{ id: 1, nome: "Presente" }];
const uuidAta = "ata-uuid";

describe("PresentesAtaPaa.service", () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_ALIAS, mockToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const authHeader = () => ({
    headers: {
      Authorization: `JWT ${mockToken}`,
      "Content-Type": "application/json",
    },
  });

  test("getListaPresentesPaa", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getListaPresentesPaa(uuidAta);
    expect(api.get).toHaveBeenCalledWith(
      `api/presentes-ata-paa/?ata_paa__uuid=${uuidAta}`,
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("getListaPresentesPadraoPaa", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getListaPresentesPadraoPaa(uuidAta);
    expect(api.get).toHaveBeenCalledWith(
      `api/presentes-ata-paa/padrao-de-presentes/?ata_paa_uuid=${uuidAta}`,
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("getMembroPorIdentificadorPaa", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getMembroPorIdentificadorPaa(
      uuidAta,
      "12345678901",
      "2024-01-01"
    );
    expect(api.get).toHaveBeenCalledWith(
      `api/presentes-ata-paa/get-nome-cargo-membro-associacao/?ata_paa_uuid=${uuidAta}&identificador=12345678901&data=2024-01-01`,
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("getProfessorGremioInfo", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getProfessorGremioInfo("123456");
    expect(api.get).toHaveBeenCalledWith(
      "api/presentes-ata-paa/buscar-informacao-professor-gremio/?rf=123456",
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("postEdicaoAtaPaa", async () => {
    api.patch.mockResolvedValue({ data: mockData });
    const payload = { comentarios: "ok" };
    const result = await postEdicaoAtaPaa(uuidAta, payload);
    expect(api.patch).toHaveBeenCalledWith(
      `/api/atas-paa/${uuidAta}/`,
      payload,
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("getParticipantesOrdenadosPorCargoPaa", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getParticipantesOrdenadosPorCargoPaa(uuidAta);
    expect(api.get).toHaveBeenCalledWith(
      `api/presentes-ata-paa/get-participantes-ordenados-por-cargo/?ata_paa_uuid=${uuidAta}`,
      authHeader()
    );
    expect(result).toEqual(mockData);
  });
});
