import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OutrosRecursosModalForm from "../OutrosRecursosModalForm";

const mockOnClose = jest.fn();

var mockMutatePost;
var mockMutatePatch;

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");

  return {
    ...antd,
    InputNumber: ({ value = "", onChange }) => (
      <input
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
    ),
  };
});

jest.mock("../hooks/usePostReceitasPrevistasOutrosRecursosPeriodo", () => {
  mockMutatePost = jest.fn();

  return {
    usePostReceitasPrevistasOutrosRecursos: () => ({
      mutationPost: {
        mutate: mockMutatePost,
        isPending: false,
      },
    }),
  };
});

jest.mock("../hooks/usePatchReceitasPrevistasOutrosRecursosPeriodo", () => {
  mockMutatePatch = jest.fn();

  return {
    usePatchReceitasPrevistasOutrosRecursosPeriodo: () => ({
      mutationPatch: {
        mutate: mockMutatePatch,
        isPending: false,
      },
    }),
  };
});

const baseData = {
  uuid: "recurso-1",
  nome: "Prêmio Educação",
  saldo_capital: 10,
  saldo_custeio: 20,
  saldo_livre: 30,
  previsao_valor_capital: 100,
  previsao_valor_custeio: 200,
  previsao_valor_livre: 300,
  outro_recurso_objeto: {
    aceita_custeio: true,
    aceita_capital: true,
    aceita_livre_aplicacao: true,
  },
  receitas_previstas: [],
};

describe("OutrosRecursosModalForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({ matches: false })),
    });

    localStorage.setItem("PAA", "paa-123");
  });

  it("chama POST ao salvar quando não há receitas_previstas", async () => {
    render(
      <OutrosRecursosModalForm open onClose={mockOnClose} data={baseData} />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /salvar/i }));
    });

    await waitFor(() => {
      expect(mockMutatePost).toHaveBeenCalledTimes(1);
    });
  });

  it("chama PATCH quando já existe receita prevista", async () => {
    render(
      <OutrosRecursosModalForm
        open
        onClose={mockOnClose}
        data={{
          ...baseData,
          receitas_previstas: [{ uuid: "rp-1" }],
        }}
      />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /salvar/i }));
    });

    await waitFor(() => {
      expect(mockMutatePatch).toHaveBeenCalledTimes(1);
    });
  });

  it("calcula corretamente o total de custeio (saldo + previsão)", async () => {
    render(
      <OutrosRecursosModalForm open onClose={mockOnClose} data={baseData} />
    );

    //const totalInput = await screen.findByDisplayValue("220");
    await waitFor(() => {
      expect(screen.getByDisplayValue("220")).toBeInTheDocument();
    });
  });
});
