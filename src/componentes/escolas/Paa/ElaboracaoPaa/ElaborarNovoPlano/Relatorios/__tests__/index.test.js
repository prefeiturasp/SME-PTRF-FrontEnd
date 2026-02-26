import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Relatorios from "../index";
import "@testing-library/jest-dom";

let mockStatusDocumento = {
  status: "CONCLUIDO",
  versao: "PREVIA",
  mensagem: "Documento disponível",
};

// 🔹 Mocks
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Hooks
const mockMutatePrevia = jest.fn();
const mockMutateFinal = jest.fn();
const mockRefetch = jest.fn();

jest.mock("../hooks/useGetTextosPaa", () => ({
  useGetTextosPaa: () => ({
    textosPaa: {},
    isLoading: false,
    isError: false,
  }),
}));

jest.mock("../hooks/useGetPaaVigente", () => ({
  useGetPaaVigente: () => ({
    paaVigente: { uuid: "paa-uuid-1" },
    isLoading: false,
  }),
}));

jest.mock("../hooks/useGetAtaPaaVigente", () => ({
  useGetAtaPaaVigente: () => ({
    ataPaa: { uuid: "ata-uuid-1" },
    isLoading: false,
  }),
}));

jest.mock("../hooks/useGetStatusGeracaoDocumentoPaa", () => ({
  useGetStatusGeracaoDocumentoPaa: () => ({
    data: mockStatusDocumento,
    isFetching: false,
    refetch: mockRefetch,
  }),
}));

jest.mock("../hooks/usePostPaaGeracaoDocumento", () => ({
  usePostPaaGeracaoDocumentoPrevia: (config) => {
    onSuccessPrevia = config.onSuccessGerarDocumento;

    return {
      mutate: mockMutatePrevia,
    };
  },
  usePostPaaGeracaoDocumentoFinal: (config) => {
    onSuccessFinal = config.onSuccessGerarDocumento;
    onErrorFinal = config.onErrorGerarDocumento;

    return {
      mutate: mockMutateFinal,
    };
  },
}));

// Serviços
const mockDownloadPrevia = jest.fn();
const mockDownloadFinal = jest.fn();

jest.mock(".../../../../../../services/escolas/Paa.service", () => ({
  getDownloadArquivoPrevia: (...args) => mockDownloadPrevia(...args),
  getDownloadArquivoFinal: (...args) => mockDownloadFinal(...args),
}));

// Toast
const mockToastError = jest.fn();

jest.mock(".../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: (...args) => mockToastError(...args),
  },
}));

// Componentes filhos
jest.mock("../RenderSecao", () => ({
  RenderSecao: ({ secaoKey }) => (
    <div data-testid={`secao-${secaoKey}`}>Secao {secaoKey}</div>
  ),
}));

jest.mock("../ModalInfoGeracaoDocumento", () => ({
  ModalInfoGeracaoDocumentoPrevia: ({ open, onClose }) =>
    open ? (
      <div>
        <span>Modal Prévia</span>
        <button onClick={onClose}>Fechar Prévia</button>
      </div>
    ) : null,

  ModalInfoGeracaoDocumentoFinal: ({ open, onClose }) =>
    open ? (
      <div>
        <span>Modal Final</span>
        <button onClick={onClose}>Fechar Final</button>
      </div>
    ) : null,

  ModalConfirmaGeracaoFinal: ({ open, onClose, onConfirm }) =>
    open ? (
      <div>
        <span>Modal Confirmar</span>
        <button onClick={onClose}>Fechar Confirmar</button>
        <button onClick={onConfirm}>Confirmar Final</button>
      </div>
    ) : null,

  ModalInfoPendenciasGeracaoFinal: ({ open, onClose, pendencias }) =>
    open ? (
      <div>
        <span>{pendencias}</span>
        <button onClick={onClose}>Fechar Pendencias</button>
      </div>
    ) : null,
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem("ASSOCIACAO_UUID", "assoc-1");
});

describe("Relatorios", () => {
  test("renderiza título Documentos", () => {
    render(<Relatorios />);
    expect(screen.getByText("Documentos")).toBeInTheDocument();
  });

  test("chama mutate ao clicar em Prévia", () => {
    render(<Relatorios />);
    fireEvent.click(screen.getByText("Prévia"));
    expect(mockMutatePrevia).toHaveBeenCalledWith("paa-uuid-1");
  });

  test("chama mutate ao clicar em Gerar (final)", () => {
    render(<Relatorios />);
    fireEvent.click(screen.getByText("Gerar"));
    expect(mockMutateFinal).toHaveBeenCalledWith({
      uuid: "paa-uuid-1",
      payload: { confirmar: 0 },
    });
  });

  test("realiza download da versão prévia", async () => {
    render(<Relatorios />);
    const downloadBtn = screen.getByTitle("Download");
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(mockDownloadPrevia).toHaveBeenCalledWith("paa-uuid-1");
    });
  });

  test("exibe toast se versão não identificada", () => {
    mockStatusDocumento = {
      status: "CONCLUIDO",
      versao: "INVALIDO",
      mensagem: "Documento final gerado",
    };

    render(<Relatorios />);
    fireEvent.click(screen.getByTitle("Download"));
    expect(mockToastError).toHaveBeenCalled();
  });

  test("expande seção Plano Anual ao clicar no dropdown", () => {
    render(<Relatorios />);
    const dropdownBtn = document.querySelector(
      'button.btn-dropdown'
    )
    fireEvent.click(dropdownBtn);

    expect(screen.getByTestId("secao-introducao")).toBeInTheDocument();
  });

  test("navega ao visualizar ata", () => {
    render(<Relatorios />);
    fireEvent.click(screen.getByText("Visualizar prévia da ata"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/relatorios-paa/visualizacao-da-ata-paa/paa-uuid-1"
    );
  });

  test("redireciona quando status FINAL concluído", async () => {
    mockStatusDocumento = {
      status: "CONCLUIDO",
      versao: "FINAL",
      mensagem: "Documento final gerado",
    };

    render(<Relatorios />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/paa-vigente-e-anteriores"
      );
    });
  });

  test("abre modal de prévia ao sucesso da geração", async () => {
    render(<Relatorios />);

    await onSuccessPrevia();

    expect(mockRefetch).toHaveBeenCalled();
  });

  test("executa verificação de status ao sucesso da geração final", async () => {
    render(<Relatorios />);

    await onSuccessFinal();

    expect(mockRefetch).toHaveBeenCalled();
  });

  test("abre modal de confirmação quando erro contém confirmar=true", async () => {
    render(<Relatorios />);

    await onErrorFinal({ confirmar: true });
  });

  test("fecha modal de prévia ao clicar em fechar", async () => {
    render(<Relatorios />);

    await onSuccessPrevia();

    await waitFor(() => {
      expect(screen.getByText("Modal Prévia")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Fechar Prévia"));
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Modal Prévia")
      ).not.toBeInTheDocument();
    });
  });

  test("fecha modal de confirmação ao clicar em fechar", async () => {
    render(<Relatorios />);

    onErrorFinal({ confirmar: true });

    await waitFor(() => {
      expect(screen.getByText("Modal Confirmar")).toBeInTheDocument();
    
      fireEvent.click(screen.getByText("Fechar Confirmar"));
    })

    await waitFor(() => {
      expect(
        screen.queryByText("Modal Confirmar")
      ).not.toBeInTheDocument();
    });

  });

  test("fecha modal de pendências ao clicar em fechar", async () => {
    render(<Relatorios />);

    onErrorFinal({
      confirmar: false,
      mensagem: "Pendências encontradas",
    });

    await waitFor(() => {

      expect(
        screen.getByText("Pendências encontradas")
      ).toBeInTheDocument();

      fireEvent.click(screen.getByText("Fechar Pendencias"));
    })

    await waitFor(() => {
      expect(
        screen.queryByText("Pendências encontradas")
      ).not.toBeInTheDocument();
    })
  });
});
