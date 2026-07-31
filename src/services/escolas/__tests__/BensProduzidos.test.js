import api from "../../api";
import {
  getBemProduzido,
  postBemProduzido,
  patchBemProduzido,
  patchBemProduzidoRascunho,
  postBemProduzidoRascunho,
  postExluirDespesaBemProduzidoEmLote,
  postVerificarSePodeInformarValores,
  getBemProduzidosComAdquiridos,
  getTodosPeriodosComPC,
  getExportarBensProduzidos,
} from "../BensProduzidos.service";
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from "../../auth.service";
import { getUuidAssociacao } from "../../../utils/AssociacaoUtils";

jest.mock("../../api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
}));

jest.mock("../../../utils/AssociacaoUtils", () => ({
  getUuidAssociacao: jest.fn(),
}));

const mockToken = "fake-token";
const associacaoUuid = "assoc-uuid";
const mockData = { id: 1 };

describe("BensProduzidos.service", () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_ALIAS, mockToken);
    localStorage.setItem(ASSOCIACAO_UUID, associacaoUuid);
    getUuidAssociacao.mockReturnValue(associacaoUuid);
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

  test("getBemProduzido", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getBemProduzido("bem-1");
    expect(api.get).toHaveBeenCalledWith(
      "api/bens-produzidos/bem-1/",
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("postBemProduzido inclui associacao do localStorage", async () => {
    api.post.mockResolvedValue({ data: mockData });
    const result = await postBemProduzido({ nome: "Bem" });
    expect(api.post).toHaveBeenCalledWith(
      "api/bens-produzidos/",
      { nome: "Bem", associacao: associacaoUuid },
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("patchBemProduzido", async () => {
    api.patch.mockResolvedValue({ data: mockData });
    const result = await patchBemProduzido("bem-1", { nome: "Novo" });
    expect(api.patch).toHaveBeenCalledWith(
      "api/bens-produzidos/bem-1/",
      { nome: "Novo" },
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("patchBemProduzidoRascunho", async () => {
    api.patch.mockResolvedValue({ data: mockData });
    const result = await patchBemProduzidoRascunho("bem-1", { rascunho: true });
    expect(api.patch).toHaveBeenCalledWith(
      "api/bens-produzidos-rascunho/bem-1/",
      { rascunho: true },
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("postBemProduzidoRascunho inclui associacao", async () => {
    api.post.mockResolvedValue({ data: mockData });
    const result = await postBemProduzidoRascunho({ nome: "Rascunho" });
    expect(api.post).toHaveBeenCalledWith(
      "api/bens-produzidos-rascunho/",
      { nome: "Rascunho", associacao: associacaoUuid },
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("postExluirDespesaBemProduzidoEmLote", async () => {
    api.post.mockResolvedValue({ data: mockData });
    const payload = { despesas: ["d1"] };
    const result = await postExluirDespesaBemProduzidoEmLote("bem-1", payload);
    expect(api.post).toHaveBeenCalledWith(
      "api/bens-produzidos/bem-1/excluir-lote/",
      payload,
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("postVerificarSePodeInformarValores", async () => {
    api.post.mockResolvedValue({ data: { pode: true } });
    const payload = { uuids: ["d1"] };
    const result = await postVerificarSePodeInformarValores(payload);
    expect(api.post).toHaveBeenCalledWith(
      "api/bens-produzidos/verificar_se_pode_informar_valores/",
      payload,
      authHeader()
    );
    expect(result).toEqual({ pode: true });
  });

  test("getBemProduzidosComAdquiridos com filtros e visao_dre", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getBemProduzidosComAdquiridos(
      { nome: "teste" },
      2,
      true
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(
        `api/bens-produzidos-e-adquiridos/?associacao_uuid=${associacaoUuid}&page=2&visao_dre=true`
      ),
      authHeader()
    );
    expect(api.get.mock.calls[0][0]).toContain("nome=teste");
    expect(result).toEqual(mockData);
  });

  test("getBemProduzidosComAdquiridos sem visao_dre", async () => {
    api.get.mockResolvedValue({ data: mockData });
    await getBemProduzidosComAdquiridos({}, 1);
    expect(api.get.mock.calls[0][0]).not.toContain("visao_dre");
  });

  test("getTodosPeriodosComPC", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getTodosPeriodosComPC("2024");
    expect(api.get).toHaveBeenCalledWith(
      `/api/periodos/?referencia=2024&somente_com_pcs_entregues=true&associacao_uuid=${associacaoUuid}`,
      authHeader()
    );
    expect(result).toEqual(mockData);
  });

  test("getExportarBensProduzidos", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await getExportarBensProduzidos();
    expect(api.get).toHaveBeenCalledWith(
      `api/bens-produzidos-e-adquiridos/exportar/?associacao_uuid=${associacaoUuid}`,
      authHeader()
    );
    expect(result).toEqual(mockData);
  });
});
