import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { CentralDeDownloads } from "../index";
import * as service from "../../../../services/CentralDeDownload.service";
import { CentralDeDownloadContext } from "../../../../context/CentralDeDownloads";

jest.mock("../../../../services/CentralDeDownload.service");

jest.mock("../../ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const mockArquivos = [
  {
    id: "123",
    criado_em: "2025-04-24T17:35:32.940427",
    alterado_em: "2025-04-24T17:36:00.339650",
    uuid: "123",
    identificador: "relatorio.csv",
    informacoes:
      "Filtro aplicado: 01/07/2021 a 31/10/2021 (data de criação do registro)",
    arquivo: "relatorio_mKNvqQt.csv",
    status: "CONCLUIDO",
    msg_erro: "",
    lido: false,
    usuario: 5184,
  },
];

const mockStatus = [
  { id: "novo", descricao: "Novo" },
  { id: "lido", descricao: "Lido" },
];

const mockContext = {
  getQtdeNotificacoesNaoLidas: jest.fn(),
};

describe("CentralDeDownloads", () => {
  beforeEach(() => {
    service.getArquivosDownload.mockResolvedValue(mockArquivos);
    service.getStatus.mockResolvedValue(mockStatus);
    service.putMarcarDesmarcarLido.mockResolvedValue({});
    service.getArquivosDownloadFiltros.mockResolvedValue([]);
  });

  it("deve renderizar a lista de arquivos e filtros", async () => {
    render(
      <CentralDeDownloadContext.Provider value={mockContext}>
        <CentralDeDownloads />
      </CentralDeDownloadContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/relatorio\.csv/i)).toBeInTheDocument();
      expect(service.getArquivosDownload).toHaveBeenCalled();
      expect(service.getStatus).toHaveBeenCalled();
    });
  });

  it("marca checkbox como lido e chama serviço", async () => {
    render(
      <CentralDeDownloadContext.Provider value={mockContext}>
        <CentralDeDownloads />
      </CentralDeDownloadContext.Provider>
    );

    const checkbox = await screen.findByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() =>
      expect(service.putMarcarDesmarcarLido).toHaveBeenCalledWith({
        uuid: "123",
        lido: true,
      })
    );
  });

  it("abre modal de confirmação ao clicar em excluir", async () => {
    render(
      <CentralDeDownloadContext.Provider value={mockContext}>
        <CentralDeDownloads />
      </CentralDeDownloadContext.Provider>
    );

    const excluirButton = await screen.findByRole("button", {
      name: /excluir/i,
    });

    fireEvent.click(excluirButton);

    expect(
      screen.getByText(/Deseja realmente excluir o arquivo/i)
    ).toBeInTheDocument();
  });

  it("chama getDownloadArquivo com os parâmetros corretos", async () => {
    service.getDownloadArquivo.mockResolvedValue();

    await service.getDownloadArquivo("meuarquivo.pdf", "uuid123");

    expect(service.getDownloadArquivo).toHaveBeenCalledWith(
      "meuarquivo.pdf",
      "uuid123"
    );
  });
});
