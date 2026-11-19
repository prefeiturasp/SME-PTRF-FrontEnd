import { renderHook, act } from "@testing-library/react";
import { useAcaoElaboracaoPaa } from "../useAcaoElaboracaoPaa";
import { usePostPaa } from "../usePostPaa";
import { getPaa } from "../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { getPaaAtivoUuid, getDadosPaaAtivo } from "../../../../../../utils/paaAtivoStorage";
import { visoesService } from "../../../../../../services/visoes.service";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));
jest.mock("../usePostPaa");
jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: { featureFlagAtiva: jest.fn() },
}));
jest.mock("../../../../../../services/escolas/Paa.service", () => ({ getPaa: jest.fn() }));
jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: { ToastCustomError: jest.fn(), ToastCustomSuccess: jest.fn() },
}));

const mockMutateAsync = jest.fn();

const botaoElaborar = { habilitado: true, acao: "ELABORAR_NOVO", periodoUuid: "p-prox", paaUuid: null };
const botaoContinuar = { habilitado: true, acao: "CONTINUAR", periodoUuid: null, paaUuid: "paa-1" };

const renderiza = () => renderHook(() => useAcaoElaboracaoPaa({ associacaoUuid: "assoc" }));

describe("useAcaoElaboracaoPaa", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    visoesService.featureFlagAtiva.mockReturnValue(true);
    usePostPaa.mockReturnValue({ mutationPost: { mutateAsync: mockMutateAsync, isPending: false } });
  });

  it("cria o PAA no período, torna-o o ativo da aba e navega", async () => {
    mockMutateAsync.mockResolvedValue({ uuid: "novo-paa" });
    const { result } = renderiza();

    await act(async () => { await result.current.executarAcao(botaoElaborar); });

    expect(mockMutateAsync).toHaveBeenCalledWith({ payload: { associacao: "assoc", periodo: "p-prox" } });
    expect(getPaaAtivoUuid()).toBe("novo-paa");
    expect(getDadosPaaAtivo()).toEqual({ uuid: "novo-paa" });
    expect(mockNavigate).toHaveBeenCalledWith("/elaborar-novo-paa/novo-paa");
  });

  it("continua o PAA existente sem criar", async () => {
    getPaa.mockResolvedValue({ uuid: "paa-1", status: "EM_ELABORACAO" });
    const { result } = renderiza();

    await act(async () => { await result.current.executarAcao(botaoContinuar); });

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(getPaa).toHaveBeenCalledWith("paa-1");
    expect(getPaaAtivoUuid()).toBe("paa-1");
    expect(mockNavigate).toHaveBeenCalledWith("/elaborar-novo-paa/paa-1");
  });

  it("não navega nem avisa de novo quando a criação falha (o usePostPaa já notifica)", async () => {
    mockMutateAsync.mockRejectedValue(new Error("400"));
    const { result } = renderiza();

    await act(async () => { await result.current.executarAcao(botaoElaborar); });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    expect(getPaaAtivoUuid()).toBeNull();
  });

  it("avisa e não navega quando a busca do PAA a continuar falha", async () => {
    getPaa.mockRejectedValue(new Error("500"));
    const { result } = renderiza();

    await act(async () => { await result.current.executarAcao(botaoContinuar); });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("falha na busca não apaga o PAA ativo anterior", async () => {
    sessionStorage.setItem("PAA", "paa-anterior");
    getPaa.mockRejectedValue(new Error("500"));
    const { result } = renderiza();

    await act(async () => { await result.current.executarAcao(botaoContinuar); });

    expect(getPaaAtivoUuid()).toBe("paa-anterior");
  });

  it("ignora botão desabilitado ou ausente", async () => {
    const { result } = renderiza();

    await act(async () => {
      await result.current.executarAcao({ ...botaoElaborar, habilitado: false });
      await result.current.executarAcao(null);
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
