import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { NotificacaoContextProvider, NotificacaoContext } from "../index";
import * as notificacoesService from "../../../services/Notificacoes.service";
import * as authService from "../../../services/auth.service";
import * as visoesService from "../../../services/visoes.service";

jest.mock("../../../services/Notificacoes.service");
jest.mock("../../../services/auth.service");
jest.mock("../../../services/visoes.service");

const mockNotificacoes = {
  quantidade_nao_lidos: 5,
};

describe("NotificacaoContextProvider", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it("deve fornecer valores de contexto padrão", async () => {
    notificacoesService.getQuantidadeNaoLidas.mockResolvedValue(
      mockNotificacoes
    );
    authService.authService.isLoggedIn = jest.fn().mockReturnValue(false);

    const TestComponent = () => {
      const context = React.useContext(NotificacaoContext);
      return (
        <>
          <div data-testid="qtde">
            {context.qtdeNotificacoesNaoLidas.toString()}
          </div>
        </>
      );
    };

    render(
      <NotificacaoContextProvider>
        <TestComponent />
      </NotificacaoContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("qtde")).toBeInTheDocument();
    });
  });

  it("deve chamar getQtdeNotificacoesNaoLidas e atualizar o estado", async () => {
    notificacoesService.getQuantidadeNaoLidas.mockResolvedValue(
      mockNotificacoes
    );

    const TestComponent = () => {
      const context = React.useContext(NotificacaoContext);

      React.useEffect(() => {
        context.getQtdeNotificacoesNaoLidas();
      }, []);

      return <div data-testid="qtde">{context.qtdeNotificacoesNaoLidas}</div>;
    };

    render(
      <NotificacaoContextProvider>
        <TestComponent />
      </NotificacaoContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("qtde").textContent).toBe("5");
    });
  });

  it("deve definir exibirModalTemDevolucao true se localStorage tiver NOTIFICAR_DEVOLUCAO_REFERENCIA", () => {
    localStorage.setItem("NOTIFICAR_DEVOLUCAO_REFERENCIA", "true");

    const TestComponent = () => {
      const context = React.useContext(NotificacaoContext);
      return (
        <div data-testid="modal">
          {context.exibeModalTemDevolucao ? "yes" : "no"}
        </div>
      );
    };

    render(
      <NotificacaoContextProvider>
        <TestComponent />
      </NotificacaoContextProvider>
    );

    expect(screen.getByTestId("modal").textContent).toBe("yes");
  });

  it("deve renderizar condicionalmente modal", async () => {
    authService.authService.isLoggedIn = jest.fn().mockReturnValue(true);
    visoesService.visoesService.getItemUsuarioLogado = jest.fn((key) => {
      if (key === "visao_selecionada.nome") return "UE";
      if (key === "associacao_selecionada.uuid") return "uuid-test";
    });

    notificacoesService.getRegistrosFalhaGeracaoPc.mockResolvedValue([
      {
        periodo_uuid: "uuid-periodo",
        periodo_referencia: "Jan 2024",
        periodo_data_inicio: "2024-01-01",
        periodo_data_final: "2024-01-31",
        excede_tentativas: false,
      },
    ]);

    render(
      <NotificacaoContextProvider>
        <div>Mock children</div>
      </NotificacaoContextProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Houve um erro na geração da Prestação de Contas/)
      ).toBeInTheDocument();
    });
  });
});
