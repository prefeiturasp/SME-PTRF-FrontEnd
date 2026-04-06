import React from "react";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import DevolverParaAcertos from "../DevolverParaAcertos";
import { RetornaSeTemPermissaoEdicaoAcompanhamentoDePc } from "../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";

// Mock do DatePickerField
jest.mock("../../../../../Globais/DatePickerField", () => ({
  DatePickerField: (props) => (
    <input
      data-testid="datepicker"
      value={props.value || ""}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  ),
}));

// Mock da permissão
jest.mock("../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc", () => ({
  RetornaSeTemPermissaoEdicaoAcompanhamentoDePc: jest.fn(),
}));


describe("DevolverParaAcertos", () => {
  const defaultProps = {
    dataLimiteDevolucao: "2024-01-01",
    handleChangeDataLimiteDevolucao: jest.fn(),
    editavel: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o label corretamente", () => {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(true);

    render(<DevolverParaAcertos {...defaultProps} />);

    expect(screen.getByText("Prazo para reenvio:")).toBeInTheDocument();
  });

  it("deve passar o valor corretamente para o DatePicker", () => {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(true);

    render(<DevolverParaAcertos {...defaultProps} />);

    const input = screen.getByTestId("datepicker");
    expect(input.value).toBe("2024-01-01");
  });

  it("deve habilitar o campo quando editavel=true e tem permissão", () => {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(true);

    render(<DevolverParaAcertos {...defaultProps} editavel={true} />);

    const input = screen.getByTestId("datepicker");
    expect(input).not.toBeDisabled();
  });

  it("deve desabilitar quando editavel=false", () => {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(true);

    render(<DevolverParaAcertos {...defaultProps} editavel={false} />);

    const input = screen.getByTestId("datepicker");
    expect(input).toBeDisabled();
  });

  it("deve desabilitar quando não tem permissão", () => {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(false);

    render(<DevolverParaAcertos {...defaultProps} editavel={true} />);

    const input = screen.getByTestId("datepicker");
    expect(input).toBeDisabled();
  });

  it("deve desabilitar quando não é editável e não tem permissão", () => {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(false);

    render(<DevolverParaAcertos {...defaultProps} editavel={false} />);

    const input = screen.getByTestId("datepicker");
    expect(input).toBeDisabled();
  });

  it("deve chamar onChange ao alterar o valor", () => {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(true);

    render(<DevolverParaAcertos {...defaultProps} />);

    const input = screen.getByTestId("datepicker");

    fireEvent.change(input, {
        target: { value: "2024-02-01" },
    });

    expect(defaultProps.handleChangeDataLimiteDevolucao).toHaveBeenCalled();
  });
});