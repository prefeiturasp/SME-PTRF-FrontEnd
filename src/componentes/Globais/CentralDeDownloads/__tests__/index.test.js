import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { CentralDeDownloads } from "../index";
import * as service from "../../../../services/CentralDeDownload.service";
import { CentralDeDownloadContext } from "../../../../context/CentralDeDownloads";
import { toastCustom } from "../../ToastCustom";

jest.mock("../../../../services/CentralDeDownload.service");

jest.mock("../../ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

let capturedTabelaProps = {};
let capturedFormProps = {};
let capturedModalProps = {};

jest.mock("../TabelaDownloads", () => ({
  TabelaDownloads: (props) => {
    capturedTabelaProps = props;
    return (
      <div data-testid="tabela-downloads">
        <button
          data-testid="btn-download"
          onClick={() => props.downloadArquivo("relatorio.csv", "123")}
        >
          Download
        </button>
        <button
          data-testid="btn-excluir"
          onClick={() => props.excluirArquivo("123")}
        >
          Excluir
        </button>
        <button
          data-testid="btn-marcar-lido"
          onClick={() =>
            props.marcarDesmarcarLido({ target: { checked: true } }, "123")
          }
        >
          Marcar como lido
        </button>
      </div>
    );
  },
}));

jest.mock("../FormFiltrosDownloads", () => ({
  FormFiltrosDownloads: (props) => {
    capturedFormProps = props;
    return (
      <form data-testid="form-filtros" onSubmit={props.handleSubmitFormFiltros}>
        <button type="submit" data-testid="btn-filtrar">
          Filtrar
        </button>
      </form>
    );
  },
}));

jest.mock("../ModalConfirmarExclusaoArquivo", () => ({
  ModalConfirmarExclusaoArquivo: (props) => {
    capturedModalProps = props;
    return props.open ? (
      <div data-testid="modal-exclusao">
        <span>{props.bodyText}</span>
        <button data-testid="modal-ok" onClick={props.onOk}>
          {props.okText}
        </button>
        <button data-testid="modal-cancel" onClick={props.onCancel}>
          {props.cancelText}
        </button>
      </div>
    ) : null;
  },
}));

const mockContext = {
  getQtdeNotificacoesNaoLidas: jest.fn(),
};

const renderComponent = () =>
  render(
    <CentralDeDownloadContext.Provider value={mockContext}>
      <CentralDeDownloads />
    </CentralDeDownloadContext.Provider>
  );

describe("CentralDeDownloads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedTabelaProps = {};
    capturedFormProps = {};
    capturedModalProps = {};
    service.getArquivosDownload.mockResolvedValue([]);
    service.getStatus.mockResolvedValue([]);
    service.putMarcarDesmarcarLido.mockResolvedValue({});
    service.getArquivosDownloadFiltros.mockResolvedValue([]);
    service.deleteArquivo.mockResolvedValue({});
    service.getDownloadArquivo.mockResolvedValue({});
  });

  it("deve carregar arquivos, status e notificações na montagem", async () => {
    renderComponent();

    await waitFor(() => {
      expect(service.getArquivosDownload).toHaveBeenCalled();
      expect(service.getStatus).toHaveBeenCalled();
      expect(mockContext.getQtdeNotificacoesNaoLidas).toHaveBeenCalled();
    });
  });

  it("chama handleChangeFormFiltros ao alterar campo do formulário", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("form-filtros")).toBeInTheDocument()
    );

    await act(async () => {
      capturedFormProps.handleChangeFormFiltros(
        "filtro_por_identificador",
        "teste"
      );
    });

    expect(capturedFormProps.stateFormFiltros).toBeDefined();
  });

  it("submete formulário de filtros sem data e chama getArquivosDownloadFiltros", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("form-filtros")).toBeInTheDocument()
    );

    await act(async () => {
      capturedFormProps.handleChangeFormFiltros(
        "filtro_por_identificador",
        "relatorio"
      );
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("form-filtros"));
    });

    await waitFor(() =>
      expect(service.getArquivosDownloadFiltros).toHaveBeenCalledWith(
        "relatorio",
        "",
        "",
        ""
      )
    );
  });

  it("submete formulário com data formatada e passa para o serviço", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("form-filtros")).toBeInTheDocument()
    );

    await act(async () => {
      capturedFormProps.handleChangeFormFiltros(
        "filtro_por_atualizacao",
        "2024-09-01"
      );
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId("form-filtros"));
    });

    await waitFor(() =>
      expect(service.getArquivosDownloadFiltros).toHaveBeenCalled()
    );
  });

  it("trata erro ao submeter formulário de filtros", async () => {
    service.getArquivosDownloadFiltros.mockRejectedValueOnce({
      response: "erro",
    });
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("form-filtros")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.submit(screen.getByTestId("form-filtros"));
    });

    await waitFor(() =>
      expect(service.getArquivosDownloadFiltros).toHaveBeenCalled()
    );
  });

  it("chama downloadArquivo ao clicar no botão de download", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("btn-download")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-download"));
    });

    await waitFor(() =>
      expect(service.getDownloadArquivo).toHaveBeenCalledWith(
        "relatorio.csv",
        "123"
      )
    );
  });

  it("trata erro ao fazer download do arquivo", async () => {
    service.getDownloadArquivo.mockRejectedValueOnce({ response: "erro" });
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("btn-download")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-download"));
    });

    await waitFor(() =>
      expect(service.getDownloadArquivo).toHaveBeenCalled()
    );
  });

  it("marca arquivo como lido e chama putMarcarDesmarcarLido", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("btn-marcar-lido")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-marcar-lido"));
    });

    await waitFor(() =>
      expect(service.putMarcarDesmarcarLido).toHaveBeenCalledWith({
        uuid: "123",
        lido: true,
      })
    );
  });

  it("trata erro ao marcar como lido", async () => {
    service.putMarcarDesmarcarLido.mockRejectedValueOnce({ response: "erro" });
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("btn-marcar-lido")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-marcar-lido"));
    });

    await waitFor(() =>
      expect(service.putMarcarDesmarcarLido).toHaveBeenCalled()
    );
  });

  it("abre modal de confirmação ao clicar em excluir", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("btn-excluir")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-excluir"));
    });

    expect(screen.getByTestId("modal-exclusao")).toBeInTheDocument();
  });

  it("confirma exclusão: chama deleteArquivo, exibe toast e fecha modal", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("btn-excluir")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-excluir"));
    });

    expect(screen.getByTestId("modal-exclusao")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("modal-ok"));
    });

    await waitFor(() => {
      expect(service.deleteArquivo).toHaveBeenCalledWith("123");
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        "Exclusão realizada com sucesso"
      );
    });

    expect(screen.queryByTestId("modal-exclusao")).not.toBeInTheDocument();
  });

  it("trata erro ao excluir arquivo e exibe toast de erro", async () => {
    service.deleteArquivo.mockRejectedValueOnce(new Error("erro"));
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("btn-excluir")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-excluir"));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("modal-ok"));
    });

    await waitFor(() =>
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao tentar excluir arquivo"
      )
    );
  });

  it("cancela exclusão ao clicar em cancelar no modal", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("btn-excluir")).toBeInTheDocument()
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-excluir"));
    });

    expect(screen.getByTestId("modal-exclusao")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("modal-cancel"));
    });

    expect(screen.queryByTestId("modal-exclusao")).not.toBeInTheDocument();
  });
});
