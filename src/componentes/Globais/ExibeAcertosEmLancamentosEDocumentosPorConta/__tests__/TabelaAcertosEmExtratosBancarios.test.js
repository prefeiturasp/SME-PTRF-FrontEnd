import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import TabelaAcertosEmExtratosBancarios from "../TabelaAcertosEmExtratosBancarios";

import { visoesService } from "../../../../services/visoes.service";
import { getPeriodos } from "../../../../services/dres/Dashboard.service";
import { SidebarLeftService } from "../../../../services/SideBarLeft.service";
import { SidebarContext } from "../../../../context/Sidebar";
import { conciliacaoStorageService } from "../../../../services/storages/Conciliacao.storage.service";
import { useCarregaPrestacaoDeContasPorUuid } from "../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn(),
  },
}));

jest.mock("../../../../services/dres/Dashboard.service", () => ({
  getPeriodos: jest.fn(),
}));

jest.mock("../../../../services/SideBarLeft.service", () => ({
  SidebarLeftService: {
    setItemActive: jest.fn(),
  },
}));

jest.mock(
  "../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid",
  () => ({
    useCarregaPrestacaoDeContasPorUuid: jest.fn(),
  })
);

jest.mock(
  "../../../../services/storages/Conciliacao.storage.service",
  () => ({
    conciliacaoStorageService: {
      setPeriodoConta: jest.fn(),
    },
  })
);

const mockSidebarContextValue = {
  setIrParaUrl: jest.fn().mockResolvedValue(undefined),
  irParaUrl: true,
  setSideBarStatus: jest.fn(),
};

const extratosMock = {
  data_extrato: "2025-01-10",
  saldo_extrato: 1234.56,
};

const renderComponent = (props = {}, locationState) =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/acertos-extratos",
          state: locationState,
        },
      ]}
    >
      <SidebarContext.Provider value={mockSidebarContextValue}>
        <TabelaAcertosEmExtratosBancarios
          extratosBancariosAjustes={extratosMock}
          contaUuidAjustesExtratosBancarios="conta-uuid"
          prestacaoDeContasUuid="pc-uuid"
          {...props}
        />
      </SidebarContext.Provider>
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  visoesService.getItemUsuarioLogado.mockReturnValue("UE");
  getPeriodos.mockResolvedValue([
    { uuid: "periodo-uuid", referencia: "2025.1" },
  ]);
  useCarregaPrestacaoDeContasPorUuid.mockReturnValue({
    periodo_uuid: "periodo-uuid",
  });

  Storage.prototype.setItem = jest.fn();
});

describe("TabelaAcertosEmExtratosBancarios", () => {
  it("exibe mensagem de ausência de acertos quando extratosBancariosAjustes é null", () => {
    render(
      <MemoryRouter>
        <SidebarContext.Provider value={mockSidebarContextValue}>
          <TabelaAcertosEmExtratosBancarios
            extratosBancariosAjustes={null}
            contaUuidAjustesExtratosBancarios="conta-uuid"
            prestacaoDeContasUuid="pc-uuid"
          />
        </SidebarContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Não existem acertos para serem exibidos")
    ).toBeInTheDocument();
  });

  it("renderiza data e saldo formatados quando dados existem", () => {
    renderComponent(undefined, {
      periodoFormatado: { referencia: "2025.1" },
    });

    expect(
      screen.getByText("Ajuste da data do extrato")
    ).toBeInTheDocument();
    expect(screen.getByText("10/01/2025")).toBeInTheDocument();

    expect(
      screen.getByText("Ajuste no saldo do extrato")
    ).toBeInTheDocument();
    // 1.234,56 em pt-BR (tolerando variações de espaço)
    expect(
      screen.getByText(
        (text) => text.includes("R$") && text.includes("1.234,56")
      )
    ).toBeInTheDocument();
  });

  it("define periodo a partir do estado da rota e persiste no storage/conciliacaoStorageService", async () => {
    renderComponent(undefined, {
      periodoFormatado: { referencia: "2025.1" },
    });

    await waitFor(() => {
      expect(getPeriodos).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        "periodoContaAcertosEmExtratosBancarios",
        JSON.stringify({ periodo: "periodo-uuid", conta: "conta-uuid" })
      );
      expect(conciliacaoStorageService.setPeriodoConta).toHaveBeenCalledWith({
        periodo: "periodo-uuid",
        conta: "conta-uuid",
      });
    });
  });

  it("usa periodo da prestação de contas quando não há periodoFormatado na rota", async () => {
    useCarregaPrestacaoDeContasPorUuid.mockReturnValue({
      periodo_uuid: "periodo-uuid-prestacao",
    });

    renderComponent(undefined, undefined);

    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        "periodoContaAcertosEmExtratosBancarios",
        JSON.stringify({
          periodo: "periodo-uuid-prestacao",
          conta: "conta-uuid",
        })
      );
    });
  });

  it("ao clicar em Ir para conciliação bancária dispara navegação e configura Sidebar", async () => {
    renderComponent(undefined, {
      periodoFormatado: { referencia: "2025.1" },
    });

    const botao = screen.getByRole("button", {
      name: /Ir para conciliação bancária/i,
    });

    fireEvent.click(botao);

    await waitFor(() => {
      expect(mockSidebarContextValue.setIrParaUrl).toHaveBeenCalledWith(false);
      expect(SidebarLeftService.setItemActive).toHaveBeenCalledWith(
        "detalhe_das_prestacoes"
      );
      expect(mockSidebarContextValue.setIrParaUrl).toHaveBeenCalledWith(true);
    });
  });
});

