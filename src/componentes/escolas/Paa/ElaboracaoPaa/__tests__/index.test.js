import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTextosPaaUe, getVigenciaElaboracaoPaa, getPaa } from "../../../../../services/escolas/Paa.service";
import { ASSOCIACAO_UUID } from "../../../../../services/auth.service";
import { usePostPaa } from "../hooks/usePostPaa";
import { ElaboracaoPaaNovo as ElaboracaoPaa } from "../index_novo";
import { visoesService } from "../../../../../services/visoes.service";
import { getPaaAtivoUuid, getDadosPaaAtivo } from "../../../../../utils/paaAtivoStorage";

jest.mock("../hooks/usePostPaa");

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: { getPermissoes: jest.fn(), featureFlagAtiva: jest.fn() },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../../../../services/escolas/Paa.service", () => ({
  getTextosPaaUe: jest.fn(),
  getVigenciaElaboracaoPaa: jest.fn(),
  getPaa: jest.fn(),
}));

jest.mock("../../../../../paginas/PaginasContainer", () => ({
  PaginasContainer: ({ children }) => <div>{children}</div>,
}));

jest.mock("../EstruturaCompletaModeloPaa", () => ({
  EstruturaCompletaModeloPaa: () => <div data-testid="estrutura-modelo-paa" />,
}));

const mockNavigate = jest.fn();
const mockMutateAsync = jest.fn();
let queryClient;

const periodo = (vigencia, paa = null) => ({
  uuid: vigencia === "VIGENTE" ? "p-vig" : "p-prox",
  referencia: vigencia === "VIGENTE" ? "2026" : "2027",
  data_inicial: vigencia === "VIGENTE" ? "2026-05-01" : "2027-05-01",
  data_final: vigencia === "VIGENTE" ? "2027-04-30" : "2028-04-30",
  vigencia,
  paa,
});

const paaEm = (status_andamento, uuid = "paa-1") => ({ uuid, status: "EM_ELABORACAO", status_andamento });

const vigenciaElaboracao = (sobrescrever = {}) => ({
  hoje: "2026-10-28",
  mes_elaboracao_paa: 10,
  proxima_vigencia_habilitada: true,
  periodos_sobrepostos: false,
  status_vigente_exigidos_para_proxima_vigencia: null,
  periodos: { count: 1, page: 1, page_size: 20, total_pages: 1, results: [periodo("VIGENTE")] },
  ...sobrescrever,
});

const comPeriodos = (...periodos) => vigenciaElaboracao({
  periodos: { count: periodos.length, page: 1, page_size: 20, total_pages: 1, results: periodos },
});

const renderiza = () => render(
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <ElaboracaoPaa />
    </QueryClientProvider>
  </MemoryRouter>,
);

describe("ElaboracaoPaa", () => {
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(ASSOCIACAO_UUID, "assoc-1");

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false, addListener: jest.fn(), removeListener: jest.fn(),
    }));

    usePostPaa.mockReturnValue({ mutationPost: { mutateAsync: mockMutateAsync, isPending: false } });
    mockMutateAsync.mockResolvedValue({ uuid: "novo-paa" });
    visoesService.getPermissoes.mockReturnValue(true);
    visoesService.featureFlagAtiva.mockReturnValue(true);
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    getTextosPaaUe.mockResolvedValue({ texto_pagina_paa_ue: "Texto ABC" });
  });

  const botaoDo = async (vigencia) => within(await screen.findByTestId(`secaoPeriodo-${vigencia}`))
    .getByTestId("elaborar-paa-button");

  it("não mostra cartões enquanto o estado carrega", async () => {
    getVigenciaElaboracaoPaa.mockReturnValue(new Promise(() => {}));

    renderiza();

    expect(screen.queryByTestId("elaborar-paa-button")).not.toBeInTheDocument();
  });

  it("vigente sem PAA: Elaborar novo PAA cria no período vigente e torna o PAA o ativo da aba", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValue(vigenciaElaboracao());

    renderiza();

    const botao = await botaoDo("VIGENTE");
    expect(screen.getByText("Texto ABC")).toBeInTheDocument();
    expect(botao).toBeEnabled();
    expect(botao).toHaveTextContent("Elaborar novo PAA 2026/2027");
    expect(screen.getByTestId("vigencia-elaboracao")).toHaveTextContent("PAA Vigente");

    fireEvent.click(botao);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ payload: { associacao: "assoc-1", periodo: "p-vig" } });
      expect(mockNavigate).toHaveBeenCalledWith("/elaborar-novo-paa/novo-paa");
    });
    expect(getPaaAtivoUuid()).toBe("novo-paa");
    expect(localStorage.getItem("PAA")).toBeNull();
  });

  it("lista o vigente e a Próxima Vigência, cada um com o próprio botão", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValue(comPeriodos(periodo("VIGENTE"), periodo("PROXIMA_VIGENCIA")));

    renderiza();

    expect(await botaoDo("VIGENTE")).toHaveTextContent("Elaborar novo PAA");
    expect(await botaoDo("PROXIMA_VIGENCIA")).toHaveTextContent("Elaborar novo PAA");
    expect(screen.getAllByTestId("elaborar-paa-button")).toHaveLength(2);
  });

  it("cria o PAA da Próxima Vigência mesmo com o vigente em elaboração", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValue(comPeriodos(
      periodo("VIGENTE", paaEm("EM_ELABORACAO", "paa-vig")), periodo("PROXIMA_VIGENCIA")));
    mockMutateAsync.mockResolvedValue({ uuid: "paa-prox" });

    renderiza();

    expect(await botaoDo("VIGENTE")).toHaveTextContent("Continuar elaboração 2026/2027");
    fireEvent.click(await botaoDo("PROXIMA_VIGENCIA"));

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledWith(
      { payload: { associacao: "assoc-1", periodo: "p-prox" } }));
    expect(getPaaAtivoUuid()).toBe("paa-prox");
  });

  it("alternar entre os PAAs troca por completo o PAA ativo (uuid e dados)", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValue(comPeriodos(
      periodo("VIGENTE", paaEm("EM_ELABORACAO", "paa-vig")),
      periodo("PROXIMA_VIGENCIA", paaEm("EM_ELABORACAO", "paa-prox"))));
    getPaa.mockImplementation(async (uuid) => ({ uuid, status: "EM_ELABORACAO", texto_introducao: `texto de ${uuid}` }));

    renderiza();

    fireEvent.click(await botaoDo("VIGENTE"));
    await waitFor(() => expect(getPaaAtivoUuid()).toBe("paa-vig"));
    expect(getDadosPaaAtivo().texto_introducao).toBe("texto de paa-vig");

    fireEvent.click(await botaoDo("PROXIMA_VIGENCIA"));
    await waitFor(() => expect(getPaaAtivoUuid()).toBe("paa-prox"));
    expect(getDadosPaaAtivo().texto_introducao).toBe("texto de paa-prox");
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("sem custom_change_paa continua a elaboração sem criar novo PAA", async () => {
    visoesService.getPermissoes.mockReturnValue(false);
    getVigenciaElaboracaoPaa.mockResolvedValue(comPeriodos(periodo("VIGENTE", paaEm("EM_ELABORACAO", "paa-existente"))));
    getPaa.mockResolvedValue({ uuid: "paa-existente", status: "EM_ELABORACAO" });

    renderiza();

    const botao = await botaoDo("VIGENTE");
    expect(botao).toBeEnabled();
    fireEvent.click(botao);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/elaborar-novo-paa/paa-existente"));
    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(getPaa).toHaveBeenCalledWith("paa-existente");
    expect(getPaaAtivoUuid()).toBe("paa-existente");
  });

  it("PAA com Plano gerado: botão bloqueado com o motivo no title", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValue(comPeriodos(
      periodo("VIGENTE", paaEm("GERADO_PARCIALMENTE")), periodo("PROXIMA_VIGENCIA")));

    renderiza();

    const secaoVigente = within(await screen.findByTestId("secaoPeriodo-VIGENTE"));
    expect(secaoVigente.getByTestId("elaborar-paa-button")).toBeDisabled();
    expect(secaoVigente.getByTestId("elaborar-paa-button"))
      .toHaveAttribute("title", expect.stringContaining("aguarda a ata"));
    expect(await botaoDo("PROXIMA_VIGENCIA")).toBeEnabled();
  });

  it("fora do mês parametrizado: vigente bloqueado com o motivo e Próxima Vigência sem seção", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValue(
      comPeriodos(periodo("VIGENTE"), periodo("PROXIMA_VIGENCIA")));
    getVigenciaElaboracaoPaa.mockResolvedValue({
      ...comPeriodos(periodo("VIGENTE"), periodo("PROXIMA_VIGENCIA")), mes_elaboracao_paa: 3,
    });

    renderiza();

    expect(await botaoDo("VIGENTE")).toBeDisabled();
    expect(screen.queryByTestId("secaoPeriodo-PROXIMA_VIGENCIA")).not.toBeInTheDocument();
    expect(await botaoDo("VIGENTE")).toHaveAttribute("title", expect.stringContaining("março"));
  });

  it("com períodos sobrepostos bloqueia os botões", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValue(vigenciaElaboracao({ periodos_sobrepostos: true }));

    renderiza();

    expect(await botaoDo("VIGENTE")).toBeDisabled();
    expect(await botaoDo("VIGENTE")).toHaveAttribute("title", expect.stringContaining("períodos de PAA sobrepostos"));
  });

  it("sem período a exibir, informa que não há período cadastrado", async () => {
    getVigenciaElaboracaoPaa.mockResolvedValue(comPeriodos());

    renderiza();

    expect(await screen.findByTestId("sem-periodo-elaboracao")).toHaveTextContent("Não há período de PAA cadastrado");
  });

  it("não mostra botões quando o panorama falha ao carregar", async () => {
    getVigenciaElaboracaoPaa.mockRejectedValue(new Error("500"));

    renderiza();

    await waitFor(() => expect(screen.getByText("Texto ABC")).toBeInTheDocument());
    expect(screen.queryByTestId("elaborar-paa-button")).not.toBeInTheDocument();
  });
});
