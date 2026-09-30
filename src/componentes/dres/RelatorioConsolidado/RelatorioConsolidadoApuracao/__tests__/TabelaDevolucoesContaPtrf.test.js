import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TabelaDevolucoesContaPtrf } from "../TabelaDevolucoesContaPtrf";

describe("TabelaDevolucoesContaPtrf Component", () => {
  const mockDevolucoes = [
    {
      tipo_uuid: "tipo-1",
      tipo_nome: "Devolução de saldo",
      ocorrencias: 2,
      valor: 150.5,
      observacao: "",
    },
    {
      tipo_uuid: "tipo-2",
      tipo_nome: "Devolução de juros",
      ocorrencias: 1,
      valor: null,
      observacao: "Observação existente",
    },
  ];

  const renderComponente = (devolucoesContaPtrf = mockDevolucoes) => {
    const valorTemplate = jest.fn((valor) => `R$ ${valor}`);
    const onClickObservacao = jest.fn();

    render(
      <TabelaDevolucoesContaPtrf
        devolucoesContaPtrf={devolucoesContaPtrf}
        valorTemplate={valorTemplate}
        onClickObservacao={onClickObservacao}
      />
    );

    return { valorTemplate, onClickObservacao };
  };

  it("deve renderizar o título da seção", () => {
    renderComponente();

    expect(screen.getByText("Devoluções a conta PTRF")).toBeInTheDocument();
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

  it("deve renderizar uma linha por devolução com tipo, ocorrências e valor", () => {
    const { valorTemplate } = renderComponente();

    const [, primeiraLinha, segundaLinha] = screen.getAllByRole("row");

    expect(within(primeiraLinha).getByText("Devolução de saldo")).toBeInTheDocument();
    expect(within(primeiraLinha).getByText("2")).toBeInTheDocument();
    expect(within(primeiraLinha).getByText("R$ 150.5")).toBeInTheDocument();

    expect(within(segundaLinha).getByText("Devolução de juros")).toBeInTheDocument();
    expect(within(segundaLinha).getByText("-")).toBeInTheDocument();

    expect(valorTemplate).toHaveBeenCalledTimes(1);
  });

  it("deve exibir 'adicionar' sem observação e 'editar' com observação", () => {
    renderComponente();

    const [, primeiraLinha, segundaLinha] = screen.getAllByRole("row");

    expect(within(primeiraLinha).getByRole("button", { name: "adicionar" })).toBeInTheDocument();
    expect(within(segundaLinha).getByRole("button", { name: "editar" })).toBeInTheDocument();
  });

  it("deve chamar onClickObservacao com a devolução e o tipo devolucao_conta", () => {
    const { onClickObservacao } = renderComponente();

    fireEvent.click(screen.getByRole("button", { name: "editar" }));

    expect(onClickObservacao).toHaveBeenCalledWith({
      ...mockDevolucoes[1],
      tipo_devolucao: "devolucao_conta",
    });
  });
});
