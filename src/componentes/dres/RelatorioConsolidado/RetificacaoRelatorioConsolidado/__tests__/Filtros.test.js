import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Filtros } from "../Filtros";

describe("Filtros", () => {
  const tabela = {
    tipos_unidade: [
      { id: "EMEF", nome: "EMEF" },
      { id: "CEU", nome: "CEU" },
      { id: "ADM", nome: "ADM" },
      { id: "DRE", nome: "DRE" },
      { id: "IFSP", nome: "IFSP" },
      { id: "CMCT", nome: "CMCT" },
    ],
  };
  const initial = { filtro_por_nome: "", filtro_por_tipo: "" };

  const setup = (tabelaAssociacoes = tabela) => {
    const handleSubmitFiltros = jest.fn();
    const handleLimparFiltros = jest.fn();
    render(
      <Filtros
        tabelaAssociacoes={tabelaAssociacoes}
        handleSubmitFiltros={handleSubmitFiltros}
        handleLimparFiltros={handleLimparFiltros}
        initialValuesFiltros={initial}
      />
    );
    return { handleSubmitFiltros, handleLimparFiltros };
  };

  it("lista apenas os tipos permitidos", () => {
    setup();
    expect(screen.getByRole("option", { name: "EMEF" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "CEU" })).toBeInTheDocument();
    ["ADM", "DRE", "IFSP", "CMCT"].forEach((t) => expect(screen.queryByRole("option", { name: t })).not.toBeInTheDocument());
  });

  it("renderiza sem tipos_unidade", () => {
    setup({});
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("renderiza com lista de tipos vazia", () => {
    setup({ tipos_unidade: [] });
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("submete com os valores digitados", async () => {
    const { handleSubmitFiltros } = setup();
    fireEvent.change(screen.getByPlaceholderText("Nome da unidade"), { target: { name: "filtro_por_nome", value: "ABC" } });
    fireEvent.change(screen.getByLabelText("Pesquisar por tipo unidade"), { target: { name: "filtro_por_tipo", value: "CEU" } });
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));
    await waitFor(() => expect(handleSubmitFiltros).toHaveBeenCalled());
    expect(handleSubmitFiltros.mock.calls[0][0]).toEqual({ filtro_por_nome: "ABC", filtro_por_tipo: "CEU" });
  });

  it("chama handleLimparFiltros com setFieldValue", () => {
    const { handleLimparFiltros } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Limpar" }));
    expect(handleLimparFiltros).toHaveBeenCalledWith(expect.any(Function));
  });
});
