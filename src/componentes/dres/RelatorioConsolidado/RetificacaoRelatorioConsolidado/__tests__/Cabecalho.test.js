import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Cabecalho } from "../Cabecalho";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

jest.mock("../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

describe("Cabecalho", () => {
  const setup = (lauda) => {
    useRecursoSelecionadoContext.mockReturnValue({ recursoSelecionado: lauda === undefined ? undefined : { habilita_exibicao_de_lauda: lauda } });
    const onClickVoltar = jest.fn();
    const formataPeriodo = jest.fn(() => "2024.1 - 01/01 à 30/06");
    render(<Cabecalho referenciaPublicacao="Ref 1" onClickVoltar={onClickVoltar} formataPeriodo={formataPeriodo} />);
    return { onClickVoltar, formataPeriodo };
  };

  it("exibe referência, período e texto 'do relatório' sem lauda", () => {
    setup(false);
    expect(screen.getByText("Referência do relatório:")).toBeInTheDocument();
    expect(screen.getByText("Ref 1")).toBeInTheDocument();
    expect(screen.getByText("2024.1 - 01/01 à 30/06")).toBeInTheDocument();
  });

  it("exibe 'da publicação' com lauda", () => {
    setup(true);
    expect(screen.getByText("Referência da publicação:")).toBeInTheDocument();
  });

  it("funciona sem recurso selecionado", () => {
    setup(undefined);
    expect(screen.getByText("Referência do relatório:")).toBeInTheDocument();
  });

  it("chama onClickVoltar ao clicar em Voltar", () => {
    const { onClickVoltar } = setup(false);
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(onClickVoltar).toHaveBeenCalledTimes(1);
  });
});
