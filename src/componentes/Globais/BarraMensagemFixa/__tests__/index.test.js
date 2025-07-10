import React from "react";
import { render, screen } from "@testing-library/react";
import { BarraMensagemFixa } from "../index";
import { BarraMensagemFixaContext } from "../context/BarraMensagemFixaProvider";
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { useGetStatusCadastroAssociacao } from "../../../escolas/MembrosDaAssociacao/hooks/useGetStatusCadastroAssociacao";
import { barraMensagemCustom } from "../../BarraMensagem/index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock(
  "../../../escolas/MembrosDaAssociacao/hooks/useGetStatusCadastroAssociacao",
  () => ({
    useGetStatusCadastroAssociacao: jest.fn(),
  })
);

jest.mock("../../BarraMensagem", () => ({
  barraMensagemCustom: {
    BarraMensagemSucessLaranja: jest.fn(() => (
      <div data-testid="barra-mensagem">Mensagem Fixa</div>
    )),
  },
}));

describe("Componente BarraMensagemFixa", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue({ push: mockPush });
  });

  const renderComContexto = (contextValue, hookValue) => {
    useGetStatusCadastroAssociacao.mockReturnValue({
      data_status_cadastro_associacao: hookValue,
    });

    return render(
      <MemoryRouter>
        <BarraMensagemFixaContext.Provider value={contextValue}>
          <BarraMensagemFixa />
        </BarraMensagemFixaContext.Provider>
      </MemoryRouter>
    );
  };

  it("exibe a barra de mensagem quando há pendência de novo mandato", () => {
    renderComContexto(
      {
        mensagem: "Mensagem importante",
        txtBotao: "Acessar",
        url: "/cadastro",
      },
      { pendencia_novo_mandato: true }
    );

    expect(barraMensagemCustom.BarraMensagemSucessLaranja).toHaveBeenCalledWith(
      "Mensagem importante",
      "Acessar",
      expect.any(Function),
      true
    );
  });

  it("não exibe a barra de mensagem quando não há pendência", () => {
    renderComContexto(
      {
        mensagem: "Mensagem importante",
        txtBotao: "Acessar",
        url: "/cadastro",
      },
      { pendencia_novo_mandato: false }
    );

    expect(screen.queryByTestId("barra-mensagem")).not.toBeInTheDocument();
  });

  it("não exibe a barra de mensagem se não houver dados", () => {
    renderComContexto(
      {
        mensagem: "Mensagem importante",
        txtBotao: "Acessar",
        url: "/cadastro",
      },
      null
    );

    expect(screen.queryByTestId("barra-mensagem")).not.toBeInTheDocument();
  });
});
