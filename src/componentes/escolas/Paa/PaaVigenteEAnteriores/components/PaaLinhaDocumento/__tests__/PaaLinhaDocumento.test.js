import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaaLinhaDocumento } from "../PaaLinhaDocumento";

const blocoComArquivo = {
  existe_arquivo: true,
  url: "https://exemplo/documento.pdf",
  status: {
    mensagem: "Documento gerado em 01/01/2026",
    cor_mensagem: "green",
    status_geracao: "CONCLUIDO",
  },
};

describe("PaaLinhaDocumento", () => {
  const onVisualizar = jest.fn();
  const onDownload = jest.fn();

  const renderLinha = (props = {}) =>
    render(
      <PaaLinhaDocumento
        titulo="Plano de aplicação"
        bloco={blocoComArquivo}
        onVisualizar={onVisualizar}
        onDownload={onDownload}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir o título e a mensagem de status na cor informada", () => {
    renderLinha();

    expect(screen.getByRole("heading", { name: "Plano de aplicação" })).toBeInTheDocument();
    const mensagem = screen.getByTestId("paa-doc-mensagem");
    expect(mensagem).toHaveTextContent("Documento gerado em 01/01/2026");
    expect(mensagem).toHaveStyle({ color: "#0F7A6C" });
  });

  it("deve usar a cor cinza quando a cor da mensagem não é conhecida", () => {
    renderLinha({
      bloco: {
        ...blocoComArquivo,
        status: { ...blocoComArquivo.status, cor_mensagem: "azul" },
      },
    });

    expect(screen.getByTestId("paa-doc-mensagem")).toHaveStyle({ color: "#60686A" });
  });

  it("deve exibir aviso de processamento e ocultar visualizar e baixar enquanto o arquivo não existe", () => {
    renderLinha({
      bloco: {
        existe_arquivo: false,
        url: null,
        status: {
          mensagem: "Falhou",
          cor_mensagem: "orange",
          status_geracao: "EM_PROCESSAMENTO",
        },
      },
    });

    expect(screen.getByText("Documento sendo gerado. Aguarde...")).toBeInTheDocument();
    expect(screen.queryByText("Falhou")).not.toBeInTheDocument();
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("deve permitir visualizar e baixar o documento quando o arquivo existe", async () => {
    const user = userEvent.setup();
    renderLinha();

    const botoes = screen.getAllByRole("button");
    expect(botoes).toHaveLength(2);

    await user.click(botoes[0]);
    await user.click(botoes[1]);

    expect(onVisualizar).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("deve desabilitar visualizar e baixar enquanto a visualização está carregando", () => {
    renderLinha({ carregandoVisualizar: true });

    screen.getAllByRole("button").forEach((botao) => {
      expect(botao).toBeDisabled();
    });
  });
});
