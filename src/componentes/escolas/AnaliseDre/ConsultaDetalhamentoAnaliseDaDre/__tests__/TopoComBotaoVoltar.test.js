import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopoComBotaoVoltar } from "../TopoComBotaoVoltar";
import { SidebarContext } from "../../../../../context/Sidebar";
import { getPeriodoPorUuid } from "../../../../../services/sme/Parametrizacoes.service";
import { getStatusPeriodoPorData } from "../../../../../services/escolas/PrestacaoDeContas.service";
import { SidebarLeftService } from "../../../../../services/SideBarLeft.service";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../../../services/sme/Parametrizacoes.service", () => ({
  getPeriodoPorUuid: jest.fn(),
}));

jest.mock("../../../../../services/escolas/PrestacaoDeContas.service", () => ({
  getStatusPeriodoPorData: jest.fn(),
}));

jest.mock("../../../../../services/SideBarLeft.service", () => ({
  SidebarLeftService: {
    setItemActive: jest.fn(),
  },
}));

const periodo = {
  uuid: "periodo-1",
  data_inicio_realizacao_despesas: "2026-01-01",
  data_fim_realizacao_despesas: "2026-04-30",
};

const periodoFormatado = {
  referencia: "2026.1",
  data_inicio_realizacao_despesas: "01/01/2026",
  data_fim_realizacao_despesas: "30/04/2026",
};

describe("TopoComBotaoVoltar", () => {
  const onClickVoltar = jest.fn();
  const podeAbrirModalAcertos = jest.fn();
  const setIrParaUrl = jest.fn();

  const renderTopo = (props = {}) =>
    render(
      <SidebarContext.Provider value={{ setIrParaUrl }}>
        <TopoComBotaoVoltar
          statusPc="DEVOLVIDA"
          prestacaoContaUuid="pc-1"
          onClickVoltar={onClickVoltar}
          periodoFormatado={periodoFormatado}
          periodoUuid="periodo-1"
          podeAbrirModalAcertos={podeAbrirModalAcertos}
          devolucaoAtualSelecionada={{ uuid: "devolucao-1" }}
          {...props}
        />
      </SidebarContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    getPeriodoPorUuid.mockResolvedValue(periodo);
  });

  it("deve exibir o período da devolução e voltar para a tela anterior", async () => {
    const user = userEvent.setup();
    renderTopo();

    expect(screen.getByRole("heading", { name: "Devolução para acertos" })).toBeInTheDocument();
    expect(screen.getByText(/2026\.1 - 01\/01\/2026 até 30\/04\/2026/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Voltar" }));
    expect(onClickVoltar).toHaveBeenCalledTimes(1);
  });

  it("deve ocultar a conclusão do acerto quando a prestação não está devolvida", () => {
    renderTopo({ statusPc: "EM_ANALISE", devolucaoAtualSelecionada: null });

    expect(screen.queryByRole("button", { name: "Ir para concluir acerto" })).not.toBeInTheDocument();
  });

  it("deve abrir o aviso de acertos pendentes antes de concluir", async () => {
    const user = userEvent.setup();
    getStatusPeriodoPorData.mockResolvedValue({
      prestacao_contas_status: { tem_acertos_pendentes: true },
    });

    renderTopo();

    await user.click(await screen.findByRole("button", { name: "Ir para concluir acerto" }));

    await waitFor(() => {
      expect(podeAbrirModalAcertos).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("deve seguir para a geração do documento quando não há acertos pendentes", async () => {
    const user = userEvent.setup();
    getStatusPeriodoPorData.mockResolvedValue({
      prestacao_contas_status: { tem_acertos_pendentes: false },
    });

    renderTopo();
    await user.click(await screen.findByRole("button", { name: "Ir para concluir acerto" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/prestacao-de-contas/");
    });
    expect(podeAbrirModalAcertos).not.toHaveBeenCalled();
    expect(localStorage.getItem("uuidPrestacaoConta")).toBe("pc-1");
    expect(JSON.parse(localStorage.getItem("periodoPrestacaoDeConta"))).toEqual({
      data_final: "2026-04-30",
      data_inicial: "2026-01-01",
      periodo_uuid: "periodo-1",
    });
    expect(SidebarLeftService.setItemActive).toHaveBeenCalledWith("geracao_documento");
    expect(setIrParaUrl).toHaveBeenNthCalledWith(1, false);
    expect(setIrParaUrl).toHaveBeenNthCalledWith(2, true);
  });
});
