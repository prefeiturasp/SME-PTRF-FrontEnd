import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReceitasPrevistasModalForm from "../ReceitasPrevistasModalForm";
import { usePostReceitasPrevistasPaa } from "../hooks/usePostReceitasPrevistasPaa";
import { usePatchReceitasPrevistasPaa } from "../hooks/usePatchReceitasPrevistasPaa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../hooks/usePostReceitasPrevistasPaa");
jest.mock("../hooks/usePatchReceitasPrevistasPaa");

const onClose = jest.fn();
const mutationPatch = jest.fn();
const mutationPost = jest.fn();

const acaoAssociacao = {
  uuid: "acao-associacao-uuid-1234",
  acao: { nome: "Recurso 1" },
  receitas_previstas_paa: [{
    saldo_congelado_capital: -1,
    saldo_congelado_custeio: 0,
    saldo_congelado_livre: 0,
  }],
  saldos: {
    saldo_atual_capital: 0,
    saldo_atual_custeio: 0,
    saldo_atual_livre: 0,
  },
  fixed: false,
};
describe("ReceitasPrevistasModalForm", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    usePostReceitasPrevistasPaa.mockReturnValue({
      mutationPost: { mutate: mutationPost, isPending: false },
    });
    usePatchReceitasPrevistasPaa.mockReturnValue({
      mutationPatch: { mutate: mutationPatch, isPending: false },
    });
  });
  test("renderiza o formulário corretamente", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ReceitasPrevistasModalForm
          open={true}
          onClose={onClose}
          acaoAssociacao={acaoAssociacao}
        />
      </QueryClientProvider>
    );
    expect(screen.getByText("Recurso Recurso 1")).toBeInTheDocument();
  });

  test("quando não houver receitas previstas, chamar o hook de criar", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ReceitasPrevistasModalForm
          open={true}
          onClose={onClose}
          acaoAssociacao={{...acaoAssociacao, receitas_previstas_paa: []}}
        />
      </QueryClientProvider>
    );

    fireEvent.change(document.getElementById("valor_custeio"), {
      target: { value: 200 },
    });
    fireEvent.change(document.getElementById("valor_capital"), {
      target: { value: 200 },
    });
    fireEvent.change(document.getElementById("valor_livre"), {
      target: { value: 200 },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mutationPost).toHaveBeenCalled();
    });
  });

  test("quando houver receitas previstas, chamar o hook de editar", async () => {
    const acaoAssociacao = {
      uuid: "acao-associacao-uuid-1234",
      acao: { nome: "Recurso 1" },
      receitas_previstas_paa: [
        {
          id: 3,
          uuid: "ef209344-b764-4327-8fcb-2bb3deaaca06",
          acao_associacao: 962,
          previsao_valor_capital: "0.00",
          previsao_valor_custeio: "0.00",
          previsao_valor_livre: "0.00",
          saldo_congelado_capital: 0,
          saldo_congelado_custeio: 0,
          saldo_congelado_livre: 0,
        },
      ],
      saldos: {
        saldo_atual_capital: 0,
        saldo_atual_custeio: 0,
        saldo_atual_livre: 0,
      },
      fixed: false,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ReceitasPrevistasModalForm
          open={true}
          onClose={onClose}
          acaoAssociacao={acaoAssociacao}
        />
      </QueryClientProvider>
    );

    fireEvent.change(document.getElementById("valor_custeio"), {
      target: { value: 200 },
    });
    fireEvent.change(document.getElementById("valor_capital"), {
      target: { value: 200 },
    });
    fireEvent.change(document.getElementById("valor_livre"), {
      target: { value: 200 },
    });

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mutationPatch).toHaveBeenCalled();
    });
  });
});
