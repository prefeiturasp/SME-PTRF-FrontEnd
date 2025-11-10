import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RelSecaoObjetivos } from "../RelSecaoObjetivos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetObjetivosPaa } from "../hooks/useGetObjetivosPaa";

jest.mock("../hooks/useGetObjetivosPaa");

export function renderWithProviders(ui, options) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>, options);
}

describe("RelSecaoObjetivos", () => {
  beforeEach(() => {
    useGetObjetivosPaa.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        { uuid: "1", nome: "Objetivo Existente 1", checked: false },
        { uuid: "2", nome: "Objetivo Existente 2", checked: false },
        { uuid: "3", nome: "Objetivo criado previamente", checked: false, paa: "uuid-paa" },
        { key: "mocked-uuid", nome: "Objetivo novo", checked: true },
      ],
      error: null,
      refetch: jest.fn(),
    });

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  test("renderiza itens da API", async () => {
    renderWithProviders(<RelSecaoObjetivos paaVigente={{ objetivos: [] }} onSalvarObjetivos={jest.fn()} />);

    expect(screen.getByText("Objetivo Existente 1")).toBeInTheDocument();
    expect(screen.getByText("Objetivo Existente 2")).toBeInTheDocument();
  });

  test("marca um objetivo quando checkbox é clicado", () => {
    renderWithProviders(<RelSecaoObjetivos paaVigente={{ objetivos: [] }} onSalvarObjetivos={jest.fn()} />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test("altera, salva e remove objetivo existente", () => {
    renderWithProviders(
      <RelSecaoObjetivos paaVigente={{ objetivos: [{ uuid: "3", paa: "uuid-paa" }] }} onSalvarObjetivos={jest.fn()} />
    );

    const editButton = screen.getAllByLabelText("Editar")[0];
    fireEvent.click(editButton);

    const input = screen.getByPlaceholderText("Digite o objetivo");

    fireEvent.change(input, { target: { value: "Novo nome" } });

    fireEvent.click(screen.getByLabelText("Salvar"));

    expect(screen.getByText("Novo nome")).toBeInTheDocument();

    const removeButton = screen.getAllByLabelText("Excluir")[0];

    fireEvent.click(removeButton);

    expect(screen.queryByText("Novo nome")).toBeNull();
  });

  test("adiciona, altera, salva e remove novo objetivo", () => {
    global.crypto = { randomUUID: () => "mocked-uuid" };

    renderWithProviders(<RelSecaoObjetivos paaVigente={{ objetivos: [] }} onSalvarObjetivos={jest.fn()} />);

    fireEvent.click(screen.getByText("Adicionar mais objetivos"));

    const input = screen.getByPlaceholderText("Digite o objetivo");
    fireEvent.change(input, { target: { value: "Objetivo Teste" } });

    fireEvent.click(screen.getByLabelText("Salvar"));

    const objetivoItem = screen.getAllByText("Objetivo Teste")[1];
    expect(objetivoItem).toBeInTheDocument();

    const editButton = screen.getAllByLabelText("Editar")[1];
    fireEvent.click(editButton);

    const removeButton = screen.getAllByLabelText("Excluir")[1];
    fireEvent.click(removeButton);

    expect(screen.queryByText("Objetivo Teste")).toBeNull();
  });

  test("ao salvar, chama onSalvarObjetivos com payload correto", async () => {
    const mockSave = jest.fn();

    renderWithProviders(<RelSecaoObjetivos paaVigente={{ objetivos: [] }} onSalvarObjetivos={mockSave} />);

    const checkboxObjetivoExistente = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkboxObjetivoExistente);

    const checkboxNovoObjetivo = screen.getAllByRole("checkbox")[3];
    fireEvent.click(checkboxNovoObjetivo);

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith([
        { objetivo: "1", nome: "Objetivo Existente 1", _destroy: false },
        { nome: "Objetivo novo" },
      ]);
    });
  });
});
