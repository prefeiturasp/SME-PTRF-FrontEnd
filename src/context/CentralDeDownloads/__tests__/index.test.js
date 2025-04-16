import React, { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import {
  CentralDeDownloadContext,
  CentralDeDownloadContextProvider,
} from "../index";
import { getQuantidadeNaoLidas } from "../../../services/CentralDeDownload.service";
import userEvent from "@testing-library/user-event";

// Mock do serviço
jest.mock("../../../services/CentralDeDownload.service", () => ({
  getQuantidadeNaoLidas: jest.fn(),
}));

const TestComponent = () => {
  const { qtdeNotificacoesNaoLidas, getQtdeNotificacoesNaoLidas } = useContext(
    CentralDeDownloadContext
  );

  return (
    <div>
      <p data-testid="qtde-nao-lidas">{qtdeNotificacoesNaoLidas?.toString()}</p>
      <button onClick={getQtdeNotificacoesNaoLidas}>Buscar</button>
    </div>
  );
};

describe("CentralDeDownloadContextProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza corretamente com valores padrão", () => {
    render(
      <CentralDeDownloadContextProvider>
        <TestComponent />
      </CentralDeDownloadContextProvider>
    );

    expect(screen.getByTestId("qtde-nao-lidas")).toHaveTextContent("true");
  });

  it("atualiza a quantidade de notificações não lidas ao chamar getQtdeNotificacoesNaoLidas", async () => {
    getQuantidadeNaoLidas.mockResolvedValue({ quantidade_nao_lidos: 5 });

    render(
      <CentralDeDownloadContextProvider>
        <TestComponent />
      </CentralDeDownloadContextProvider>
    );

    const button = screen.getByText("Buscar");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("qtde-nao-lidas")).toHaveTextContent("5");
    });

    expect(getQuantidadeNaoLidas).toHaveBeenCalledTimes(1);
  });
});
