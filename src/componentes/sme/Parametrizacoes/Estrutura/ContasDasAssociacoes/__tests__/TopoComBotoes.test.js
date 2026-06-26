import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopoComBotoes } from "../components/TopoComBotoes";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../hooks/useContasDasAssociacoesContext");
jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext");
jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

describe("TopoComBotoes", () => {
  const handleOpenCreateModal = jest.fn();
  const selectedRecurso = { uuid: "recurso-1", nome: "PTRF" };

  beforeEach(() => {
    jest.clearAllMocks();
    useContasDasAssociacoesContext.mockReturnValue({ handleOpenCreateModal });
    useAbasPorRecursoContext.mockReturnValue({ selectedRecurso });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("exibe recurso selecionado e abre modal de criação", () => {
    render(<TopoComBotoes />);

    expect(screen.getByText("PTRF")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Adicionar conta da associação/i }));

    expect(handleOpenCreateModal).toHaveBeenCalledWith(selectedRecurso);
  });

  it("desabilita botão sem permissão", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(<TopoComBotoes />);

    expect(screen.getByRole("button", { name: /Adicionar conta da associação/i })).toBeDisabled();
  });
});
