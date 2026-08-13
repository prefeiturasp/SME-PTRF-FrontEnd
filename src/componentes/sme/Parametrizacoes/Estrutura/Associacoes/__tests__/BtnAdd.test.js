import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BtnAddAssociacoes } from "../components/BtnAddAssociacoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useNavigate } from "react-router-dom";

jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../../../Globais/UI/Button", () => ({
  IconButton: ({ label, onClick, disabled }) => (
    <button type="button" onClick={onClick} disabled={disabled}>{label}</button>
  ),
}));

describe("BtnAddAssociacoes", () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  it("permite acessar o formulario para usuarios com permissao", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<BtnAddAssociacoes />);

    const button = screen.getByRole("button", { name: "Adicionar Associação" });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(navigate).toHaveBeenCalledWith("/formulario-associacao");
  });

  it("fica desabilitado para usuarios sem permissao", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<BtnAddAssociacoes />);

    expect(screen.getByRole("button", { name: "Adicionar Associação" })).toBeDisabled();
  });
});
