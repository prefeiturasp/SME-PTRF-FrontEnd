import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { RelatorioVisualizacao } from "../RelatorioVisualizacao";

jest.mock("../TextoParametroPaa", () => ({
  TextoParametroPaa: ({ campo }) => <p>Parâmetro {campo}</p>,
}));

jest.mock("../../../../../../../Globais/WatermarkPrevia/WatermarkPrevia", () => ({
  __esModule: true,
  default: ({ icon }) => <div>Marca d'água {icon}</div>,
}));

describe("RelatorioVisualizacao", () => {
  const originalClientHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientHeight"
  );

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get: () => 480,
    });
  });

  afterAll(() => {
    if (originalClientHeight) {
      Object.defineProperty(HTMLElement.prototype, "clientHeight", originalClientHeight);
    }
  });

  const renderRelatorio = (props = {}, initialEntries = ["/relatorios"]) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <RelatorioVisualizacao title="Plano de aplicação" {...props}>
          <p>Conteúdo do relatório</p>
        </RelatorioVisualizacao>
      </MemoryRouter>
    );

  it("deve exibir o título, o conteúdo e a marca d'água de rascunho", () => {
    renderRelatorio();

    expect(screen.getByRole("heading", { name: "Plano de aplicação" })).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do relatório")).toBeInTheDocument();
    expect(screen.getByText("Marca d'água rascunho")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Voltar" })).not.toBeInTheDocument();
  });

  it("deve voltar quando o usuário aciona o botão de retorno", async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();

    renderRelatorio({ onBack, backButtonLabel: "Retornar à lista" });

    await user.click(screen.getByRole("button", { name: "Retornar à lista" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("deve exibir o conteúdo de erro e ocultar o relatório e a marca d'água", () => {
    renderRelatorio({
      error: true,
      errorContent: <p>Não foi possível carregar o relatório.</p>,
    });

    expect(screen.getByText("Não foi possível carregar o relatório.")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo do relatório")).not.toBeInTheDocument();
    expect(screen.queryByText(/Marca d'água/)).not.toBeInTheDocument();
  });

  it("deve exibir o estado vazio quando não há dados", () => {
    renderRelatorio({
      isEmpty: true,
      emptyContent: <p>Nenhum dado para exibir.</p>,
    });

    expect(screen.getByText("Nenhum dado para exibir.")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo do relatório")).not.toBeInTheDocument();
  });

  it("deve indicar carregamento do relatório", () => {
    renderRelatorio({ isLoading: true });

    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
  });

  it("deve exibir o texto parametrizado na visualização de atividades previstas", () => {
    renderRelatorio(
      {},
      ["/relatorios-componentes/atividades-previstas"]
    );

    expect(screen.getByText("Parâmetro texto_atividades_previstas")).toBeInTheDocument();
  });
});
