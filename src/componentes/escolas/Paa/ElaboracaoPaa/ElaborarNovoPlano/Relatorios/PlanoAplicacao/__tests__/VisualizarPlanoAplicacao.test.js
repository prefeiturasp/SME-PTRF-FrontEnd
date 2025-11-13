import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useGetPrioridadesRelatorio } from "../hooks/useGetPrioridadesRelatorio";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/useGetPrioridadesRelatorio", () => ({
  useGetPrioridadesRelatorio: jest.fn(),
}));

jest.mock("../../components/RelatorioTabelaGrupo", () => ({
  __esModule: true,
  RelatorioTabelaGrupo: ({ headerExtra }) => (
    <div data-testid="relatorio-tabela-grupo">{headerExtra}</div>
  ),
}));

jest.mock(
  "../../components/RelatorioVisualizacao",
  () => ({
    __esModule: true,
    RelatorioVisualizacao({
      children,
      headerActions,
      onBack = () => {},
    }) {
      return (
        <div>
          <div>{headerActions}</div>
          <button type="button" onClick={onBack}>
            Voltar
          </button>
          <div>{children}</div>
        </div>
      );
    },
  })
);

let VisualizarPlanoAplicacao;

describe("VisualizarPlanoAplicacao", () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigateMock);

    useGetPrioridadesRelatorio.mockReturnValue({
      prioridades: [
        {
          uuid: "prioridade-1",
          prioridade: true,
          recurso: "PTRF",
          valor_total: 100,
        },
        {
          uuid: "prioridade-2",
          prioridade: false,
          recurso: "PTRF",
          valor_total: 50,
        },
      ],
      isFetching: false,
      isError: false,
    });
  });

  it("redireciona corretamente ao clicar nos botões da tela", async () => {
    ({ VisualizarPlanoAplicacao } = await import("../VisualizarPlanoAplicacao"));
    render(<VisualizarPlanoAplicacao />);

    const botaoEditarInformacoes = screen.getByRole("button", {
      name: /editar informações/i,
    });

    fireEvent.click(botaoEditarInformacoes);
    expect(navigateMock).toHaveBeenNthCalledWith(1, "/elaborar-novo-paa", {
      state: {
        activeTab: "prioridades-list",
        fromPlanoAplicacao: true,
      },
    });

    const botaoVoltar = screen.getByRole("button", {
      name: /voltar/i,
    });

    fireEvent.click(botaoVoltar);
    expect(navigateMock).toHaveBeenNthCalledWith(2, "/elaborar-novo-paa", {
      state: {
        activeTab: "relatorios",
        expandedSections: {
          planoAnual: true,
          componentes: true,
        },
      },
    });
  });
});

