import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DemonstrativoFinanceiroPorConta from "../index";
import {
  getDemonstrativoInfo,
  previa,
} from "../../../../../services/escolas/DemonstrativoFinanceiro.service";

jest.mock("../../../../../services/escolas/DemonstrativoFinanceiro.service", () => ({
  getDemonstrativoInfo: jest.fn(),
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

describe("DemonstrativoFinanceiroPorConta", () => {
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
      gerar_previas: true,
      prestacao_contas_status: {
        documentos_gerados: false,
      },
    },
  };

  it("deve exibir o botão com o texto Prévia", async () => {
    getDemonstrativoInfo.mockResolvedValue("Documento pendente");

    render(<DemonstrativoFinanceiroPorConta {...propsPadrao} />);

    expect(
      await screen.findByRole("button", { name: "Prévia" }),
    ).toBeInTheDocument();
  });

  it("deve abrir o modal de prévia ao clicar no botão Prévia", async () => {
    getDemonstrativoInfo.mockResolvedValue("Documento pendente");

    render(<DemonstrativoFinanceiroPorConta {...propsPadrao} />);

    fireEvent.click(await screen.findByRole("button", { name: "Prévia" }));

    expect(screen.getByTestId("modal-previa")).toBeInTheDocument();
  });

  it("deve fechar o modal de prévia ao clicar em fechar", async () => {
    getDemonstrativoInfo.mockResolvedValue("Documento pendente");

    render(<DemonstrativoFinanceiroPorConta {...propsPadrao} />);

    fireEvent.click(await screen.findByRole("button", { name: "Prévia" }));
    fireEvent.click(screen.getByTestId("btn-fechar-modal-previa"));

    await waitFor(() => {
      expect(screen.queryByTestId("modal-previa")).not.toBeInTheDocument();
    });
  });

  it("deve gerar a prévia com as datas do período ao confirmar o modal", async () => {
    jest.useFakeTimers();
    try {
      getDemonstrativoInfo.mockResolvedValue("Documento pendente");
      previa.mockResolvedValue();

      render(<DemonstrativoFinanceiroPorConta {...propsPadrao} />);

      fireEvent.click(await screen.findByRole("button", { name: "Prévia" }));
      fireEvent.click(screen.getByTestId("btn-confirmar-previa"));

      await waitFor(() => {
        expect(previa).toHaveBeenCalledWith(
          "conta-uuid",
          "periodo-uuid",
          "2025-01-01",
          "2025-12-31",
        );
      });
      expect(screen.queryByTestId("modal-previa")).not.toBeInTheDocument();
      expect(screen.getByTestId("modal-previa-gerando")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "OK" }));

      expect(
        screen.queryByTestId("modal-previa-gerando"),
      ).not.toBeInTheDocument();
    } finally {
      jest.clearAllTimers();
      jest.useRealTimers();
    }
  });

  it("não deve gerar a prévia quando a data final do período estiver vazia", async () => {
    jest.useFakeTimers();
    try {
      getDemonstrativoInfo.mockResolvedValue("Documento pendente");

      render(
        <DemonstrativoFinanceiroPorConta
          {...propsPadrao}
          periodoPrestacaoDeConta={{
            ...propsPadrao.periodoPrestacaoDeConta,
            data_final: null,
          }}
        />,
      );

      fireEvent.click(await screen.findByRole("button", { name: "Prévia" }));
      fireEvent.click(screen.getByTestId("btn-confirmar-previa"));

      await waitFor(() => {
        expect(screen.queryByTestId("modal-previa")).not.toBeInTheDocument();
      });
      expect(previa).not.toHaveBeenCalled();
      expect(
        screen.queryByTestId("modal-previa-gerando"),
      ).not.toBeInTheDocument();
    } finally {
      jest.clearAllTimers();
      jest.useRealTimers();
    }
  });

  it("não deve exibir o botão Prévia quando o usuário não puder gerar prévias", async () => {
    getDemonstrativoInfo.mockResolvedValue("Documento pendente");

    render(
      <DemonstrativoFinanceiroPorConta
        {...propsPadrao}
        podeGerarPrevias={false}
      />,
    );

    expect(await screen.findByText("Documento pendente")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Prévia" }),
    ).not.toBeInTheDocument();
  });

  it("não deve exibir o botão Prévia quando a geração de prévias não estiver liberada", async () => {
    getDemonstrativoInfo.mockResolvedValue("Documento pendente");

    render(
      <DemonstrativoFinanceiroPorConta
        {...propsPadrao}
        statusPrestacaoDeConta={{
          ...propsPadrao.statusPrestacaoDeConta,
          gerar_previas: false,
        }}
      />,
    );

    expect(await screen.findByText("Documento pendente")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Prévia" }),
    ).not.toBeInTheDocument();
  });

  it("não deve exibir o botão Prévia quando os documentos já foram gerados", async () => {
    getDemonstrativoInfo.mockResolvedValue("Documento final disponível");

    render(
      <DemonstrativoFinanceiroPorConta
        {...propsPadrao}
        statusPrestacaoDeConta={{
          gerar_previas: true,
          prestacao_contas_status: {
            documentos_gerados: true,
          },
        }}
      />,
    );

    expect(
      await screen.findByText("Documento final disponível"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Prévia" }),
    ).not.toBeInTheDocument();
  });

  it("não deve exibir o botão Prévia quando não houver movimentação", async () => {
    getDemonstrativoInfo.mockResolvedValue("Não houve movimentação na conta");

    render(<DemonstrativoFinanceiroPorConta {...propsPadrao} />);

    expect(
      await screen.findByText("Não houve movimentação na conta"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Prévia" }),
    ).not.toBeInTheDocument();
  });
});
