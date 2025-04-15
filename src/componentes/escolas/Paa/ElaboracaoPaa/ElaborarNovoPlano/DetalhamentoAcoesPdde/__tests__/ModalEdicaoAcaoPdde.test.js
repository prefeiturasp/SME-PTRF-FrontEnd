import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalEdicaoAcaoPdde from "../ModalEdicaoAcaoPdde";
import { usePatchAcaoPdde } from '../hooks/usePatchAcaoPdde';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Form } from "antd";

jest.mock("../hooks/usePatchAcaoPdde");

const onClose = jest.fn();
const mutationPatch = jest.fn();

const acaoPdde = {
  id: 1,
  uuid: "acao-pdde-uuid-1234",
  nome: "Recurso PDDE",
  categoria_objeto: { id: 1 },
  aceita_custeio: true,
  aceita_capital: true,
  aceita_livre_aplicacao: true,
  saldo_valor_capital: "100.00",
  saldo_valor_custeio: "200.00",
  saldo_valor_livre_aplicacao: "300.00",
  previsao_valor_capital: "50.00",
  previsao_valor_custeio: "60.00",
  previsao_valor_livre_aplicacao: "70.00",
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

    usePatchAcaoPdde.mockReturnValue({
      mutationPatch: { mutate: mutationPatch, isLoading: false },
    });
  });

  test("renderiza o formulário corretamente", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ModalEdicaoAcaoPdde
          open={true}
          onClose={onClose}
          acaoPdde={acaoPdde}
        />
      </QueryClientProvider>
    );
    
    expect(screen.getByText(`Editar Recurso ${acaoPdde.nome}`)).toBeInTheDocument();
    expect(screen.getByText("Saldo reprogramado")).toBeInTheDocument();
    expect(screen.getByText("Receita prevista")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  test("chama a mutationPatch quando o formulário é submetido", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ModalEdicaoAcaoPdde
          open={true}
          onClose={onClose}
          acaoPdde={acaoPdde}
        />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const submitButton = screen.getByText("Salvar");
      fireEvent.click(submitButton);
      
      expect(mutationPatch).toHaveBeenCalledWith({
        uuid: acaoPdde.uuid,
        payload: expect.objectContaining({
          acao_associacao: acaoPdde.id,
          nome: acaoPdde.nome,
          categoria: acaoPdde.categoria_objeto.id,
        })
      });
    });
  });

  test("desabilita o botão Salvar quando nenhum tipo é aceito", async () => {
    const acaoSemTipos = {
      ...acaoPdde,
      aceita_custeio: false,
      aceita_capital: false,
      aceita_livre_aplicacao: false
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ModalEdicaoAcaoPdde
          open={true}
          onClose={onClose}
          acaoPdde={acaoSemTipos}
        />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const submitButton = screen.getByText("Salvar");
      expect(submitButton.disabled).toBe(true);
    });
  });
});