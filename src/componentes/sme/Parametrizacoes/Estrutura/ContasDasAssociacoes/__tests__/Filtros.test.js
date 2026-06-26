import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../components/Filtros";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useGetTiposContas } from "../../TiposConta/hooks/useGetTiposdeConta";

jest.mock("../hooks/useContasDasAssociacoesContext");
jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext");
jest.mock("../../TiposConta/hooks/useGetTiposdeConta");

describe("Filtros", () => {
  const setFilter = jest.fn();
  const setCurrentPage = jest.fn();
  const setFirstPage = jest.fn();

  const initialFilter = {
    recurso_uuid: "",
    is_required_recurso_uuid: true,
    page: 1,
    page_size: 10,
    associacao_nome: "",
    tipo_conta_uuid: "",
    status: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: "recurso-1" },
    });
    useContasDasAssociacoesContext.mockReturnValue({
      initialFilter,
      setFilter,
      setCurrentPage,
      setFirstPage,
    });
    useGetTiposContas.mockReturnValue({
      data: [{ uuid: "tipo-1", nome: "Conta Corrente" }],
    });
  });

  it("renderiza campos e opções do filtro", () => {
    render(<Filtros />);

    expect(screen.getByPlaceholderText("Filtrar por nome da unidade ou EOL")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar por tipo de conta")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar por status")).toBeInTheDocument();
    expect(screen.getByText("Conta Corrente")).toBeInTheDocument();
  });

  it("aplica filtros resetando paginação", () => {
    render(<Filtros />);

    fireEvent.change(screen.getByPlaceholderText("Filtrar por nome da unidade ou EOL"), {
      target: { name: "associacao_nome", value: "EMEF" },
    });
    fireEvent.change(screen.getByLabelText("Filtrar por tipo de conta"), {
      target: { name: "tipo_conta_uuid", value: "tipo-1" },
    });
    fireEvent.change(screen.getByLabelText("Filtrar por status"), {
      target: { name: "status", value: "ATIVA" },
    });
    fireEvent.click(screen.getByText("Filtrar"));

    expect(setCurrentPage).toHaveBeenCalledWith(1);
    expect(setFirstPage).toHaveBeenCalledWith(0);

    const updater = setFilter.mock.calls[0][0];
    expect(updater({ recurso_uuid: "recurso-1" })).toEqual({
      ...initialFilter,
      associacao_nome: "EMEF",
      tipo_conta_uuid: "tipo-1",
      status: "ATIVA",
      page: 1,
      recurso_uuid: "recurso-1",
    });
  });

  it("limpa filtros preservando recurso", () => {
    render(<Filtros />);

    fireEvent.click(screen.getByText("Limpar"));

    const updater = setFilter.mock.calls[0][0];
    expect(updater({ recurso_uuid: "recurso-1" })).toEqual({
      ...initialFilter,
      recurso_uuid: "recurso-1",
    });
  });
});
