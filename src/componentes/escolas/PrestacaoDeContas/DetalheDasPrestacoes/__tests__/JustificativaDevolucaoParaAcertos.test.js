import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DetalheDasPrestacoes } from "../index";
import { BrowserRouter } from "react-router-dom";
import * as associacaoService from "../../../../../services/escolas/Associacao.service";
import * as receitaService from "../../../../../services/escolas/Receitas.service";
import * as prestacaoService from "../../../../../services/escolas/PrestacaoDeContas.service";
import * as tabelaValoresPendentesService from "../../../../../services/escolas/TabelaValoresPendentesPorAcao.service";
import { SidebarContext } from "../../../../../context/Sidebar";
import { useParams, useLocation } from "react-router-dom";
import { conciliacaoStorageService } from "../../../../../services/storages/Conciliacao.storage.service";
import { visoesService } from "../../../../../services/visoes.service";
import { mockTransasoes } from "../__fixtures__/mockData";

jest.mock("../../../../../services/escolas/TabelaValoresPendentesPorAcao.service");
jest.mock("../../../../../services/escolas/PrestacaoDeContas.service");
jest.mock("../../../../../services/escolas/Receitas.service");
jest.mock("../../../../../services/escolas/Associacao.service");
jest.mock("../../../../../services/escolas/Despesas.service");
jest.mock("../../../../../services/storages/Conciliacao.storage.service");
jest.mock("../../../../../services/visoes.service");

jest.mock("../../../../../services/auth.service", () => ({
  ASSOCIACAO_UUID: "ASSOCIACAO_UUID",
}));

jest.mock("../../../../../services/SideBarLeft.service", () => ({
  SidebarLeftService: { setItemActive: jest.fn() },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  exibeDataPT_BR: (data) => data,
  trataNumericos: (v) => v,
}));

jest.mock("../../../../../utils/FormataData", () => ({
  formataData: (data) => data,
  formatDateOrDash: (data) => data || "-",
}));

jest.mock("../../../../../componentes/Globais/ReactNumberFormatInput/indexv2", () => ({
  __esModule: true,
  ReactNumberFormatInputV2: (props) => <input data-testid="number-format-v2" {...props} />,
}));

jest.mock("../../../../../componentes/Globais/ReactNumberFormatInput", () => ({
  __esModule: true,
  ReactNumberFormatInput: (props) => <input data-testid="number-format" {...props} />,
}));

jest.mock("../../../../../componentes/Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

const mockPeriodos = [
  {
    uuid: "periodo-1",
    referencia: "2024.1",
    data_inicio_realizacao_despesas: "2024-01-01",
    data_fim_realizacao_despesas: "2024-06-30",
  },
];

const mockContas = [
  { uuid: "conta-1", nome: "Conta Custeio", tipo_conta: { nome: "Custeio" }, solicitacao_encerramento: null },
];

const gastosNaoConciliados = [
  {
    ...mockTransasoes[0],
    conferido: false,
  },
];

const mockSidebarContext = { setIrParaUrl: jest.fn() };

const renderComponent = () =>
  render(
    <SidebarContext.Provider value={mockSidebarContext}>
      <BrowserRouter>
        <DetalheDasPrestacoes />
      </BrowserRouter>
    </SidebarContext.Provider>
  );

describe("Conciliação Bancária - justificativa na devolução para acertos", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    visoesService.getPermissoes.mockReturnValue(true);
    useParams.mockReturnValue({ periodo_uuid: null, conta_uuid: null });
    useLocation.mockReturnValue({ state: null });

    localStorage.setItem("ASSOCIACAO_UUID", "associacao-uuid");
    conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-1", conta: "conta-1" });
    conciliacaoStorageService.setPeriodoConta.mockImplementation(() => {});

    receitaService.getTabelasReceita.mockResolvedValue({ data: { acoes_associacao: [] } });
    associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue(mockPeriodos);
    associacaoService.getContas.mockResolvedValue(mockContas);
    tabelaValoresPendentesService.tabelaValoresPendentes.mockResolvedValue({
      saldo_posterior_total: 200,
    });
    prestacaoService.getStatusPeriodoPorData.mockResolvedValue({
      prestacao_contas_status: { periodo_bloqueado: true },
    });
    prestacaoService.getObservacoes.mockResolvedValue({
      possui_solicitacao_encerramento: false,
      observacao_uuid: "obs-1",
      observacao: "Justificativa anterior",
      data_extrato: "2024-06-30",
      saldo_extrato: 100,
      permite_editar_campos_extrato: false,
    });
    prestacaoService.getTransacoes.mockImplementation((_periodo, _conta, conferido) => {
      if (conferido === "False") {
        return Promise.resolve(gastosNaoConciliados);
      }
      return Promise.resolve([]);
    });
    prestacaoService.pathSalvarJustificativaPrestacaoDeConta.mockResolvedValue({});
  });

  it("habilita justificativa e botão de salvar mesmo quando o extrato não pode ser editado", async () => {
    renderComponent();

    const textarea = await screen.findByPlaceholderText("Escreva o comentário");
    expect(textarea).toBeEnabled();
    await waitFor(() => expect(textarea).toHaveValue("Justificativa anterior"));
    expect(screen.getByRole("button", { name: /Salvar Justificativas/i })).toBeInTheDocument();

    expect(await screen.findByTestId("number-format-v2")).toBeDisabled();
  });

  it("mantém justificativa opcional e checkbox de conciliação bloqueado quando há gastos não conciliados em período fechado", async () => {
    renderComponent();

    expect(
      await screen.findByText("Adicione justificativas e informações adicionais se necessário (opcional)")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Escreva o comentário")).not.toBeRequired();

    const checkbox = await screen.findByTestId("checkConferido");
    expect(checkbox).toBeDisabled();
  });

  it("mantém justificativa obrigatória quando não há gastos não conciliados e existe diferença de saldo", async () => {
    prestacaoService.getTransacoes.mockResolvedValue([]);

    renderComponent();

    expect(
      await screen.findByText("Adicione justificativas e informações adicionais se necessário *")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Escreva o comentário")).toBeRequired();
    expect(screen.getByPlaceholderText("Escreva o comentário")).toBeEnabled();
  });

  it("permite editar e salvar a justificativa na devolução para acertos", async () => {
    renderComponent();

    const textarea = await screen.findByPlaceholderText("Escreva o comentário");
    fireEvent.change(textarea, { target: { value: "Nova justificativa" } });

    const botaoSalvar = screen.getByRole("button", { name: /Salvar Justificativas/i });
    expect(botaoSalvar).toBeEnabled();
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(prestacaoService.pathSalvarJustificativaPrestacaoDeConta).toHaveBeenCalledWith(
        expect.objectContaining({
          periodo_uuid: "periodo-1",
          conta_associacao_uuid: "conta-1",
          observacao: "Nova justificativa",
        })
      );
    });
  });
});
