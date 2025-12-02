import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalEdicaoReceitaPrevistaPDDE from "../ModalEdicaoReceitaPrevistaPdde";
import { usePatchReceitaPrevistaPdde } from '../hooks/usePatchReceitaPrevistaPdde';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Form } from "antd";

jest.mock("../hooks/usePatchReceitaPrevistaPdde");

localStorage.setItem("PAA", "fake-uuid-paa")
const onClose = jest.fn();
const mutationPatch = jest.fn();

const receitaPrevisaPdde = {
  id: 1,
  uuid: "acao-pdde-uuid-1234",
  nome: "Recurso PDDE",
  programa: 1,
  programa_objeto: { id: 1, uuid: "1de0c2ac-8468-48a6-89e8-14ffa0d78133", },
  aceita_custeio: true,
  aceita_capital: true,
  aceita_livre_aplicacao: true,
  receitas_previstas_pdde_valores:{
    uuid: "1de0c2ac-8468-48a6-89e8-14ffa0d78131",
    saldo_capital: "100.00",
    saldo_custeio: "200.00",
    saldo_livre: "300.00",
    previsao_valor_capital: "50.00",
    previsao_valor_custeio: "60.00",
    previsao_valor_livre: "70.00",
  }
};

describe("ModalEdicaoAcaoPdde", () => {
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

    usePatchReceitaPrevistaPdde.mockReturnValue({
      mutationPatch: { mutate: mutationPatch, isPending: false },
    });
  });

  it("renderiza o formulário corretamente", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ModalEdicaoReceitaPrevistaPDDE
          open={true}
          onClose={onClose}
          receitaPrevistaPDDE={receitaPrevisaPdde}
        />
      </QueryClientProvider>
    );
    
    const input_saldo_custeio = screen.getAllByLabelText("Custeio")[0];
    fireEvent.change(input_saldo_custeio, { target: { value: "250.00" } });

    expect(screen.getByText(`Editar Recurso ${receitaPrevisaPdde.nome}`)).toBeInTheDocument();
    expect(screen.getByText("Saldo reprogramado")).toBeInTheDocument();
    expect(screen.getByText("Receita prevista")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("chama a mutationPatch quando o formulário é submetido", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ModalEdicaoReceitaPrevistaPDDE
          open={true}
          onClose={onClose}
          receitaPrevistaPDDE={receitaPrevisaPdde}
        />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const submitButton = screen.getByText("Salvar");
      fireEvent.click(submitButton);
      
      expect(mutationPatch).toHaveBeenCalledWith({
        uuid: receitaPrevisaPdde.receitas_previstas_pdde_valores.uuid,
        payload: {
          saldo_custeio: parseFloat(receitaPrevisaPdde.receitas_previstas_pdde_valores.saldo_custeio),
          saldo_capital: parseFloat(receitaPrevisaPdde.receitas_previstas_pdde_valores.saldo_capital),
          saldo_livre: parseFloat(receitaPrevisaPdde.receitas_previstas_pdde_valores.saldo_livre),
          previsao_valor_custeio: parseFloat(receitaPrevisaPdde.receitas_previstas_pdde_valores.previsao_valor_custeio),
          previsao_valor_capital: parseFloat(receitaPrevisaPdde.receitas_previstas_pdde_valores.previsao_valor_capital),
          previsao_valor_livre: parseFloat(receitaPrevisaPdde.receitas_previstas_pdde_valores.previsao_valor_livre)
        }
      });
    });
  });

  it("desabilita o botão Salvar quando nenhum tipo é aceito", async () => {
    const receitaPrevisaPddeData = {
      ...receitaPrevisaPdde,
      aceita_custeio: false,
      aceita_capital: false,
      aceita_livre_aplicacao: false
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ModalEdicaoReceitaPrevistaPDDE
          open={true}
          onClose={onClose}
          receitaPrevistaPDDE={receitaPrevisaPddeData}
        />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const submitButton = screen.getByText("Salvar");
      expect(submitButton.disabled).toBe(true);
    });
  });
});