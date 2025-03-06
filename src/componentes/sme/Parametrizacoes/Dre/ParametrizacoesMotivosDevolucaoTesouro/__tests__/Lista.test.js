import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { useGetMotivosDevolucaoTesouro } from "../hooks/useGetMotivosDevolucaoTesouro";
import { usePostMotivoDevolucaoTesouro } from "../hooks/usePostMotivoDevolucaoTesouro";
import { usePatchMotivoDevolucaoTesouro } from "../hooks/usePatchMotivoDevolucaoTesouro";
import { useDeleteMotivoDevolucaoTesouro } from "../hooks/useDeleteMotivoDevolucaoTesouro";

// Mock das hooks
jest.mock("../hooks/useGetMotivosDevolucaoTesouro");
jest.mock("../hooks/usePostMotivoDevolucaoTesouro");
jest.mock("../hooks/usePatchMotivoDevolucaoTesouro");
jest.mock("../hooks/useDeleteMotivoDevolucaoTesouro");

const mockSetStateFormModal = jest.fn();
const mockSetShowModalForm = jest.fn();
const mockSetBloquearBtnSalvarForm = jest.fn();

describe("Lista", () => {
  beforeEach(() => {
    useGetMotivosDevolucaoTesouro.mockReturnValue({
      isLoading: false,
      data: { results: [{ id: 1, nome: "Motivo 1", uuid: "123" }] },
    });

    usePostMotivoDevolucaoTesouro.mockReturnValue({
      mutationPost: { mutate: jest.fn() },
    });

    usePatchMotivoDevolucaoTesouro.mockReturnValue({
      mutationPatch: { mutate: jest.fn() },
    });

    useDeleteMotivoDevolucaoTesouro.mockReturnValue({
      mutationDelete: { mutate: jest.fn() },
    });
  });

  it("deve renderizar a tabela com dados", () => {
    render(
      <MotivosDevolucaoTesouroContext.Provider
        value={{
          setShowModalForm: mockSetShowModalForm,
          setStateFormModal: mockSetStateFormModal,
          setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
        }}
      >
        <Lista />
      </MotivosDevolucaoTesouroContext.Provider>
    );

    expect(screen.getByText("Motivos de devolução ao tesouro")).toBeInTheDocument();
    expect(screen.getByText("Motivo 1")).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não houver dados", () => {
    useGetMotivosDevolucaoTesouro.mockReturnValue({
      isLoading: false,
      data: { results: [] },
    });

    render(
      <MotivosDevolucaoTesouroContext.Provider
        value={{
          setShowModalForm: mockSetShowModalForm,
          setStateFormModal: mockSetStateFormModal,
          setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
        }}
      >
        <Lista />
      </MotivosDevolucaoTesouroContext.Provider>
    );

    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", () => {
    render(
      <MotivosDevolucaoTesouroContext.Provider
        value={{
          setShowModalForm: mockSetShowModalForm,
          setStateFormModal: mockSetStateFormModal,
          setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
        }}
      >
        <Lista />
      </MotivosDevolucaoTesouroContext.Provider>
    );

    const editButton = screen.getByRole("button", { name: /editar motivo/i });
    fireEvent.click(editButton);

    expect(mockSetStateFormModal).toHaveBeenCalledWith({
      nome: "Motivo 1",
      uuid: "123",
      id: 1,
    });
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });
});
