import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import { DemonstrativoFinanceiro } from "../index";
import { getAcoes, previa, documentoFinal, getDemonstrativoInfo } from "../../../../../services/escolas/DemonstrativoFinanceiro.service";
import { ASSOCIACAO_UUID } from "../../../../../services/auth.service";

jest.mock("../../../../../services/escolas/DemonstrativoFinanceiro.service", () => ({
  getAcoes: jest.fn(),
  previa: jest.fn(),
  documentoFinal: jest.fn(),
  getDemonstrativoInfo: jest.fn(),
}));

jest.mock("../../ModalGerarPrevia", () => ({
  ModalPrevia: (props) => (
    <div
      data-testid="modal-previa"
      data-show={props.show}
      data-acao="gerar-previa"
      onClick={props.primeiroBotaoOnclick}
    />
  ),
}));

const defaultProps = {
  periodoPrestacaoDeConta: {
    periodo_uuid: "periodo-uuid",
    data_inicial: "2025-01-01",
    data_final: "2025-12-31",
  },
  contaPrestacaoDeContas: {
    conta_uuid: "conta-uuid",
  },
  podeGerarPrevias: true,
  podeBaixarDocumentos: true,
  statusPrestacaoDeConta: {
    prestacao_contas_status: {
      documentos_gerados: false,
    },
  },
  setLoading: jest.fn(),
};

const mockAcoesApi = {
  info_acoes: [
    {
      acao_associacao_nome: "Ação 1",
      acao_associacao_uuid: "acao-uuid-1",
      receitas_no_periodo: "100.50",
      despesas_no_periodo: "50.00",
    },
  ],
};

const setup = (props = {}) =>
  render(<DemonstrativoFinanceiro {...defaultProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === ASSOCIACAO_UUID) return "associacao-uuid";
    return null;
  });
  getAcoes.mockResolvedValue(mockAcoesApi);
  getDemonstrativoInfo.mockResolvedValue(
    "Documento gerado em 01/01/2025."
  );
  previa.mockResolvedValue({});
  documentoFinal.mockResolvedValue({});
});

describe("DemonstrativoFinanceiro", () => {
  it("exibe mensagem padrão quando não há ações", async () => {
    getAcoes.mockResolvedValue({ info_acoes: [] });

    setup();

    await waitFor(() =>
      expect(
        screen.getByText("Não existem ações a serem exibidas")
      ).toBeInTheDocument()
    );
  });

  it("carrega e exibe ações com valores formatados e mensagem de documento", async () => {
    setup();

    await waitFor(() =>
      expect(screen.getByText("Demonstrativo Financeiro")).toBeInTheDocument()
    );

    // Nome da ação
    expect(screen.getByText("Ação 1")).toBeInTheDocument();

    // Receita / despesa formatadas
    expect(
      screen.getByText((text) => text.includes("R$") && text.includes("100,50"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((text) => text.includes("R$") && text.includes("50,00"))
    ).toBeInTheDocument();

    // Mensagem vinda de getDemonstrativoInfo
    expect(
      screen.getByText("Documento gerado em 01/01/2025.")
    ).toBeInTheDocument();
  });

  it("habilita botão de prévia quando podeGerarPrevias e documentos_gerados=false", async () => {
    setup();

    await waitFor(() =>
      expect(screen.getByText("Demonstrativo Financeiro")).toBeInTheDocument()
    );

    const botaoPrevia = screen.getByRole("button", { name: /prévia/i });
    expect(botaoPrevia).toBeEnabled();
  });

  it("ao clicar em prévia abre modal e chama previa com datas válidas", async () => {
    setup();

    await waitFor(() =>
      expect(screen.getByText("Demonstrativo Financeiro")).toBeInTheDocument()
    );

    const botaoPrevia = screen.getByRole("button", { name: /prévia/i });

    await act(async () => {
      fireEvent.click(botaoPrevia);
    });

    // Modal renderizado
    const modal = screen.getByTestId("modal-previa");
    expect(modal.getAttribute("data-show")).toBe("true");

    // Chama gerarPrevia via clique no modal (onClick)
    await act(async () => {
      fireEvent.click(modal);
    });

    await waitFor(() =>
      expect(previa).toHaveBeenCalledWith(
        "acao-uuid-1",
        "conta-uuid",
        "periodo-uuid",
        "2025-01-01",
        "2025-12-31"
      )
    );
  });

  it("gera mensagem de erro quando data final é vazia ao gerar prévia", async () => {
    // Força estado com data_fim vazia
    const { container } = setup();

    await waitFor(() =>
      expect(screen.getByText("Demonstrativo Financeiro")).toBeInTheDocument()
    );

    const instance = container.firstChild?._owner?.stateNode;

    if (instance) {
      act(() => {
        instance.setState({
          show: true,
          acaoUuid: "acao-uuid-1",
          data_inicio: "2025-01-01",
          data_fim: "",
        });
      });

      await act(async () => {
        await instance.gerarPrevia();
      });

      expect(instance.state.mensagemErro).toBe(
        "Data final não pode ser vazia!"
      );
      expect(previa).not.toHaveBeenCalled();
    }
  });

  it("desabilita botão documento final quando documentos_gerados=false e habilita quando true", async () => {
    const { rerender } = setup();

    await waitFor(() =>
      expect(screen.getByText("Demonstrativo Financeiro")).toBeInTheDocument()
    );

    let botaoFinal = screen.getByRole("button", { name: /documento final/i });
    expect(botaoFinal).toBeDisabled();

    rerender(
      <DemonstrativoFinanceiro
        {...defaultProps}
        statusPrestacaoDeConta={{
          prestacao_contas_status: { documentos_gerados: true },
        }}
      />
    );

    await waitFor(() => {
      botaoFinal = screen.getByRole("button", { name: /documento final/i });
      expect(botaoFinal).toBeEnabled();
    });
  });

  it("chama documentoFinal e recarrega ações ao gerar documento final", async () => {
    getDemonstrativoInfo.mockResolvedValue(
      "Documento pendente."
    );

    setup({
      statusPrestacaoDeConta: {
        prestacao_contas_status: { documentos_gerados: true },
      },
    });

    await waitFor(() =>
      expect(screen.getByText("Demonstrativo Financeiro")).toBeInTheDocument()
    );

    const botaoFinal = screen.getByRole("button", { name: /documento final/i });

    await act(async () => {
      fireEvent.click(botaoFinal);
    });

    await waitFor(() => {
      expect(documentoFinal).toHaveBeenCalledWith(
        "acao-uuid-1",
        "conta-uuid",
        "periodo-uuid"
      );
      expect(getAcoes).toHaveBeenCalledTimes(2);
    });
  });
});

