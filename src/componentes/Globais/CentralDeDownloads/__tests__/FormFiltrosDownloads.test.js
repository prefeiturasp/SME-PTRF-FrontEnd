import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormFiltrosDownloads } from "../FormFiltrosDownloads";

jest.mock("../../DatePickerField", () => ({
  DatePickerField: ({ onChange, name }) => (
    <input
      data-testid="filtro_por_atualizacao"
      onChange={(e) => onChange(name, e.target.value)}
    />
  ),
}));

describe("FormFiltrosDownloads", () => {
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn((e) => e.preventDefault());

  const defaultProps = {
    handleChangeFormFiltros: mockHandleChange,
    handleSubmitFormFiltros: mockHandleSubmit,
    stateFormFiltros: {
      filtro_por_identificador: "",
      filtro_por_status: "",
      filtro_por_atualizacao: "",
      filtro_por_visto: "",
    },
    listaStatus: [
      { id: "1", nome: "Processado" },
      { id: "2", nome: "Pendente" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("chama handleChangeFormFiltros ao alterar campos", () => {
    render(<FormFiltrosDownloads {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/identificador/i), {
      target: { value: "teste" },
    });
    expect(mockHandleChange).toHaveBeenCalledWith(
      "filtro_por_identificador",
      "teste"
    );

    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "1" },
    });
    expect(mockHandleChange).toHaveBeenCalledWith("filtro_por_status", "1");

    fireEvent.change(screen.getByTestId("filtro_por_atualizacao"), {
      target: { value: "2024-09-01" },
    });
    expect(mockHandleChange).toHaveBeenCalledWith(
      "filtro_por_atualizacao",
      "2024-09-01"
    );

    fireEvent.change(screen.getByLabelText(/visto/i), {
      target: { value: "true" },
    });
    expect(mockHandleChange).toHaveBeenCalledWith("filtro_por_visto", "true");
  });

  test("chama handleSubmitFormFiltros ao submeter o formulário", () => {
    render(<FormFiltrosDownloads {...defaultProps} />);

    fireEvent.submit(
      screen.getByRole("form") ||
        screen.getByRole("button", { name: /filtrar/i }).closest("form")
    );
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
