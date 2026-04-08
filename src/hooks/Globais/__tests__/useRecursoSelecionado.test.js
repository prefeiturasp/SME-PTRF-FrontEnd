import { renderHook, act, waitFor } from "@testing-library/react";
import useRecursoSelecionado from "../useRecursoSelecionado";
import {
  getRecursos,
  getRecursosPorUnidade,
} from "../../../services/AlterarRecurso.service";
import { authService } from "../../../services/auth.service";

jest.mock("../../../services/AlterarRecurso.service", () => ({
  getRecursos: jest.fn(),
  getRecursosPorUnidade: jest.fn(),
}));

jest.mock("../../../services/auth.service", () => ({
  authService: {
    limparStorageAoTrocarRecurso: jest.fn(),
  },
}));

const STORAGE_KEY = "RECURSO_SELECIONADO";
const RECURSO_EXIBIDO_NA_SESSAO = "RECURSO_EXIBIDO_NA_SESSAO";

const recursoA = { uuid: "rec-a", nome: "Recurso A" };
const recursoB = { uuid: "rec-b", nome: "Recurso B" };

const makeVisoesService = (visaoNome = "DRE", unidadeUuid = "uuid-unidade-123") => ({
  getDadosDoUsuarioLogado: jest.fn().mockReturnValue({
    visao_selecionada: { nome: visaoNome },
    unidade_selecionada: { uuid: unidadeUuid },
  }),
});

beforeAll(() => {
  delete window.location;
  window.location = { href: "" };
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  window.location.href = "";
});

describe("useRecursoSelecionado - inicialização", () => {
  it("inicializa recursoSelecionado com o valor do localStorage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recursoA));
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    expect(result.current.recursoSelecionado).toEqual(recursoA);
  });

  it("inicializa recursoSelecionado como null quando localStorage está vazio", () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    expect(result.current.recursoSelecionado).toBeNull();
  });

  it("inicializa recursoSelecionado como null quando localStorage contém JSON inválido", () => {
    localStorage.setItem(STORAGE_KEY, "json-invalido{{{");
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    expect(result.current.recursoSelecionado).toBeNull();
  });

  it("inicializa recursos como lista vazia", () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    expect(result.current.recursos).toEqual([]);
  });
});

describe("useRecursoSelecionado - fetch de recursos", () => {
  it("chama getRecursos quando visão é SME", async () => {
    getRecursos.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService("SME") })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getRecursos).toHaveBeenCalledTimes(1);
    expect(getRecursosPorUnidade).not.toHaveBeenCalled();
    expect(result.current.recursos).toEqual([recursoA, recursoB]);
  });

  it("chama getRecursosPorUnidade com o UUID da unidade quando visão não é SME", async () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService("DRE", "uuid-123") })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getRecursosPorUnidade).toHaveBeenCalledTimes(1);
    expect(getRecursosPorUnidade).toHaveBeenCalledWith("uuid-123");
    expect(getRecursos).not.toHaveBeenCalled();
  });

  it("não realiza fetch quando dadosUsuarioLogado é null", () => {
    const visoesService = {
      getDadosDoUsuarioLogado: jest.fn().mockReturnValue(null),
    };

    renderHook(() => useRecursoSelecionado({ visoesService }));

    expect(getRecursos).not.toHaveBeenCalled();
    expect(getRecursosPorUnidade).not.toHaveBeenCalled();
  });

  it("isLoading é true durante o fetch e false após conclusão", async () => {
    let resolvePromise;
    const promise = new Promise((res) => {
      resolvePromise = res;
    });
    getRecursosPorUnidade.mockReturnValue(promise);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise([recursoA, recursoB]);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("seta error e mantém recursos vazio quando getRecursos falha", async () => {
    const err = new Error("Falha na API");
    getRecursos.mockRejectedValue(err);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService("SME") })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe(err);
    expect(result.current.recursos).toEqual([]);
  });

  it("seta error quando getRecursosPorUnidade falha", async () => {
    const err = new Error("Falha na API");
    getRecursosPorUnidade.mockRejectedValue(err);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService("DRE") })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe(err);
  });
});

describe("useRecursoSelecionado - auto-seleção com 1 recurso", () => {
  it("auto-seleciona o recurso quando há exatamente 1 disponível", async () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => {
      expect(result.current.recursoSelecionado).toEqual(recursoA);
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(recursoA));
    expect(authService.limparStorageAoTrocarRecurso).toHaveBeenCalledTimes(1);
  });

  it("seleciona o primeiro recurso quando o recurso salvo não está mais na lista", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ uuid: "rec-removido", nome: "Removido" }));
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => {
      expect(result.current.recursoSelecionado).toEqual(recursoA);
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(recursoA));
    expect(authService.limparStorageAoTrocarRecurso).toHaveBeenCalledTimes(1);
  });

  it("não auto-seleciona e não chama limparStorage quando há mais de 1 recurso", async () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.recursoSelecionado).toBeNull();
    expect(authService.limparStorageAoTrocarRecurso).not.toHaveBeenCalled();
  });

  it("não chama limparStorage mais de uma vez (sem loop) ao auto-selecionar", async () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => {
      expect(result.current.recursoSelecionado).toEqual(recursoA);
    });

    expect(authService.limparStorageAoTrocarRecurso).toHaveBeenCalledTimes(1);
  });
});

describe("useRecursoSelecionado - handleChangeRecurso", () => {
  it("salva recurso no localStorage, limpa storage e redireciona para /", () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    act(() => {
      result.current.handleChangeRecurso(recursoB);
    });

    expect(result.current.recursoSelecionado).toEqual(recursoB);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(recursoB));
    expect(authService.limparStorageAoTrocarRecurso).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("/");
  });

  it("remove recurso do localStorage e redireciona quando chamado com null", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recursoA));
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    act(() => {
      result.current.handleChangeRecurso(null);
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(authService.limparStorageAoTrocarRecurso).not.toHaveBeenCalled();
    expect(window.location.href).toBe("/");
  });
});

describe("useRecursoSelecionado - clearRecurso", () => {
  it("limpa recursoSelecionado e remove do localStorage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recursoA));
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    act(() => {
      result.current.clearRecurso();
    });

    expect(result.current.recursoSelecionado).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("não redireciona ao limpar recurso", () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    act(() => {
      result.current.clearRecurso();
    });

    expect(window.location.href).toBe("");
  });
});

describe("useRecursoSelecionado - mostrarSelecionarRecursos", () => {
  it("é true quando há mais de 1 recurso", async () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.mostrarSelecionarRecursos).toBe(true);
  });

  it("é false quando há exatamente 1 recurso", async () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.mostrarSelecionarRecursos).toBe(false);
  });

  it("é false quando não há recursos", async () => {
    getRecursosPorUnidade.mockResolvedValue([]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.mostrarSelecionarRecursos).toBe(false);
  });
});

describe("useRecursoSelecionado - mostrarOverlaySelecionarRecursos", () => {
  it("é true quando recursoSelecionado é null e há mais de 1 recurso", async () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.mostrarOverlaySelecionarRecursos).toBe(true);
  });

  it("é false quando recursoSelecionado está definido", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recursoA));
    localStorage.setItem(RECURSO_EXIBIDO_NA_SESSAO, JSON.stringify(true));
    getRecursosPorUnidade.mockResolvedValue([recursoA, recursoB]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.mostrarOverlaySelecionarRecursos).toBe(false);
  });

  it("é false quando há apenas 1 recurso (mesmo sem recurso selecionado)", async () => {
    getRecursosPorUnidade.mockResolvedValue([recursoA]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => {
      expect(result.current.recursoSelecionado).toEqual(recursoA);
    });

    expect(result.current.mostrarOverlaySelecionarRecursos).toBe(false);
  });

  it("é false quando não há recursos", async () => {
    getRecursosPorUnidade.mockResolvedValue([]);

    const { result } = renderHook(() =>
      useRecursoSelecionado({ visoesService: makeVisoesService() })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.mostrarOverlaySelecionarRecursos).toBe(false);
  });
});
