import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RelacaoDeBens from "../index";
import {
  getRelacaoBensInfo,
  previa,
  documentoFinal,
  documentoPrevia,
} from "../../../../../services/escolas/RelacaoDeBens.service";

jest.mock("../../../../../services/escolas/RelacaoDeBens.service", () => ({
  getRelacaoBensInfo: jest.fn(),
  previa: jest.fn(),
  documentoFinal: jest.fn(),
  documentoPrevia: jest.fn(),
}));

jest.mock("../../ModalGerarPrevia", () => ({
  ModalPrevia: (props) =>
    props.show ? (
      <div data-testid="modal-previa">
        <button
          data-testid="btn-confirmar-previa"
          onClick={props.primeiroBotaoOnclick}
        >
          Confirmar
        </button>

        <button data-testid="btn-fechar-modal-previa" onClick={props.onHide}>
          Fechar
        </button>

        <div>{props.mensagemErro}</div>
      </div>
    ) : null,
}));

jest.mock("../../ModalGerarPreviaSendogerada", () => ({
  ModalPreviaSendoGerada: (props) =>
    props.show ? (
      <div data-testid="modal-previa-gerando">
        <button onClick={props.primeiroBotaoOnClick}>OK</button>
      </div>
    ) : null,
}));

describe("RelacaoDeBens", () => {
  const propsPadrao = {
    periodoPrestacaoDeConta: {
      periodo_uuid: "periodo-uuid",
      data_inicial: "2025-01-01",
      data_final: "2025-12-31",
    },
    contaPrestacaoDeContas: {
      conta_uuid: "conta-uuid",
    },
    podeBaixarDocumentos: true,
    podeGerarPrevias: true,
    statusPrestacaoDeConta: {
      prestacao_contas_status: {
        documentos_gerados: false,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve buscar informações ao montar componente", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento prévio disponível");

    render(<RelacaoDeBens {...propsPadrao} />);

    await waitFor(() => {
      expect(getRelacaoBensInfo).toHaveBeenCalledWith(
        "conta-uuid",
        "periodo-uuid",
      );
    });

    expect(screen.getByText("Documento prévio disponível")).toBeInTheDocument();
  });

  it("deve exibir botão de download de documento prévio quando status for concluído", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento prévio disponível");
    render(<RelacaoDeBens {...propsPadrao} />);
    await waitFor(() => {
      expect(
        screen.getByText("Documento prévio disponível"),
      ).toBeInTheDocument();
    });
    const botao = document.querySelector(
      '[data-qa="btn-baixar-documento-previa-relacao-bens"]',
    );
    expect(botao).toBeInTheDocument();
  });

  it("deve chamar downloadDocumentoPrevia ao clicar no botão de download prévio", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento prévio disponível");
    documentoPrevia.mockResolvedValue();
    render(<RelacaoDeBens {...propsPadrao} />);
    await waitFor(() => {
      expect(
        screen.getByText("Documento prévio disponível"),
      ).toBeInTheDocument();
    });
    const botao = document.querySelector(
      '[data-qa="btn-baixar-documento-previa-relacao-bens"]',
    );
    expect(botao).toBeInTheDocument();
    fireEvent.click(botao);
    await waitFor(() => {
      expect(documentoPrevia).toHaveBeenCalledWith(
        "conta-uuid",
        "periodo-uuid",
        "PDF",
      );
    });
  });

  it("deve exibir botão de download de documento final quando existir documento final", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento final disponível");
    render(<RelacaoDeBens {...propsPadrao} />);
    await waitFor(() => {
      expect(
        screen.getByText("Documento final disponível"),
      ).toBeInTheDocument();
    });
    const botao = document.querySelector(
      '[data-qa="btn-baixar-documento-final-relacao-bens"]',
    );
    expect(botao).toBeInTheDocument();
  });

  it("deve chamar downloadDocumentoFinal ao clicar no botão de download final", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento final disponível");
    documentoFinal.mockResolvedValue();
    render(<RelacaoDeBens {...propsPadrao} />);
    await waitFor(() => {
      expect(
        screen.getByText("Documento final disponível"),
      ).toBeInTheDocument();
    });
    const botao = document.querySelector(
      '[data-qa="btn-baixar-documento-final-relacao-bens"]',
    );
    expect(botao).toBeInTheDocument();
    fireEvent.click(botao);
    await waitFor(() => {
      expect(documentoFinal).toHaveBeenCalledWith(
        "conta-uuid",
        "periodo-uuid",
        "PDF",
      );
    });
  });

  it("deve abrir modal de prévia ao clicar no botão de prévia", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento pendente");

    render(<RelacaoDeBens {...propsPadrao} />);

    const botaoPrevia = screen.getByRole("button", { name: /prévia/i });

    fireEvent.click(botaoPrevia);

    expect(screen.getByTestId("modal-previa")).toBeInTheDocument();
  });

  it("deve fechar modal de prévia ao clicar em fechar", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento pendente");
    render(<RelacaoDeBens {...propsPadrao} />);
    const botaoPrevia = screen.getByRole("button", { name: /prévia/i });
    fireEvent.click(botaoPrevia);
    expect(screen.getByTestId("modal-previa")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("btn-fechar-modal-previa"));
    await waitFor(() => {
      expect(screen.queryByTestId("modal-previa")).not.toBeInTheDocument();
    });
  });

  it("deve exibir loading quando status estiver em processamento", async () => {
    getRelacaoBensInfo.mockResolvedValue("Aguarde processamento");

    render(<RelacaoDeBens {...propsPadrao} />);

    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  it("não deve exibir botão de prévia quando documentos já foram gerados", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento final disponível");

    render(
      <RelacaoDeBens
        {...propsPadrao}
        statusPrestacaoDeConta={{
          prestacao_contas_status: {
            documentos_gerados: true,
          },
        }}
      />,
    );

    expect(
      screen.queryByTestId("btn-abrir-modal-previa-relacao-bens"),
    ).not.toBeInTheDocument();
  });

  it("deve atualizar informações quando props forem alteradas", async () => {
    getRelacaoBensInfo.mockResolvedValue("Documento pendente");

    const { rerender } = render(<RelacaoDeBens {...propsPadrao} />);

    await waitFor(() => {
      expect(getRelacaoBensInfo).toHaveBeenCalledTimes(1);
    });

    rerender(
      <RelacaoDeBens
        {...propsPadrao}
        periodoPrestacaoDeConta={{
          ...propsPadrao.periodoPrestacaoDeConta,
          periodo_uuid: "novo-periodo",
        }}
      />,
    );

    await waitFor(() => {
      expect(getRelacaoBensInfo).toHaveBeenCalledTimes(2);
    });
  });
});
