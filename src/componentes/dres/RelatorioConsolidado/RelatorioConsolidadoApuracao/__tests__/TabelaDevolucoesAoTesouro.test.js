import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TabelaDevolucoesAoTesouro } from "../TabelaDevolucoesAoTesouro";

describe("TabelaDevolucoesAoTesouro Component", () => {
  const mockDevolucoes = [
    {
      tipo_uuid: "tipo-1",
      tipo_nome: "Devolução de saldo remanescente",
      ocorrencias: 3,
      valor: 320,
      observacao: "",
    },
    {
      tipo_uuid: "tipo-2",
      tipo_nome: "Devolução de despesa glosada",
      ocorrencias: 1,
      valor: 0,
      observacao: "Observação existente",
    },
  ];

  const renderComponente = (devolucoesAoTesouro = mockDevolucoes) => {
    const valorTemplate = jest.fn((valor) => `R$ ${valor}`);
    const onClickObservacao = jest.fn();

    render(
      <TabelaDevolucoesAoTesouro
        devolucoesAoTesouro={devolucoesAoTesouro}
        valorTemplate={valorTemplate}
        onClickObservacao={onClickObservacao}
      />
    );

    return { valorTemplate, onClickObservacao };
  };

  it("deve renderizar o título da seção", () => {
    renderComponente();

    expect(screen.getByText("Devoluções ao tesouro")).toBeInTheDocument();
  });

  it.each([
    ["uma lista vazia", []],
    ["false", false],
  ])("deve exibir a mensagem de lista vazia quando receber %s", (_, devolucoes) => {
    renderComponente(devolucoes);

    expect(
      screen.getByText("Não existem devoluções a serem exibidas")
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("deve renderizar os cabeçalhos da tabela de devoluções ao tesouro", () => {
    renderComponente();

    expect(
      screen.getByRole("columnheader", { name: "Tipo de devolução ao tesouro" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Observações da DRE" })
    ).toBeInTheDocument();
  });

  it("deve renderizar uma linha por devolução e exibir '-' quando o valor for zero", () => {
    const { valorTemplate } = renderComponente();

    const [, primeiraLinha, segundaLinha] = screen.getAllByRole("row");

    expect(
      within(primeiraLinha).getByText("Devolução de saldo remanescente")
    ).toBeInTheDocument();
    expect(within(primeiraLinha).getByText("3")).toBeInTheDocument();
    expect(within(primeiraLinha).getByText("R$ 320")).toBeInTheDocument();

    expect(
      within(segundaLinha).getByText("Devolução de despesa glosada")
    ).toBeInTheDocument();
    expect(within(segundaLinha).getByText("-")).toBeInTheDocument();

    expect(valorTemplate).toHaveBeenCalledTimes(1);
  });

  it("deve exibir 'adicionar' sem observação e 'editar' com observação", () => {
    renderComponente();

    const [, primeiraLinha, segundaLinha] = screen.getAllByRole("row");

    expect(within(primeiraLinha).getByRole("button", { name: "adicionar" })).toBeInTheDocument();
    expect(within(segundaLinha).getByRole("button", { name: "editar" })).toBeInTheDocument();
  });

  it("deve chamar onClickObservacao com a devolução e o tipo devolucao_tesouro", () => {
    const { onClickObservacao } = renderComponente();

    fireEvent.click(screen.getByRole("button", { name: "adicionar" }));

    expect(onClickObservacao).toHaveBeenCalledWith({
      ...mockDevolucoes[0],
      tipo_devolucao: "devolucao_tesouro",
    });
  });
});
