import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import Cabecalho from "../Cabecalho";
import { visoesService } from "../../../../../services/visoes.service";
import * as DashboardSmeService from "../../../../../services/sme/DashboardSme.service";

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn(),
  },
}));

const prestacaoBase = {
  uuid: "pc-uuid",
  periodo_uuid: "periodo-uuid",
  status: "APROVADA",
  associacao: {
    nome: "EMEF Teste",
    unidade: { codigo_eol: "000123" },
    presidente_associacao: { nome: "Presidente APM" },
    presidente_conselho_fiscal: { nome: "Presidente CF" },
    cnpj: "00.000.000/0001-00",
  },
  publicada: true,
  em_retificacao: false,
  referencia_consolidado_dre: "Publicada no DOC em 01/01/2025",
};

beforeEach(() => {
  jest.clearAllMocks();
  visoesService.getItemUsuarioLogado.mockReturnValue("DRE");
  jest
    .spyOn(DashboardSmeService, "getPeriodos")
    .mockResolvedValue([
      {
        uuid: "periodo-uuid",
        referencia: "2025.1",
        data_inicio_realizacao_despesas: "2025-01-01",
        data_fim_realizacao_despesas: "2025-06-30",
      },
    ]);
});

const renderComponent = (prestacaoDeContas = prestacaoBase) =>
  render(
    <MemoryRouter>
      <Cabecalho prestacaoDeContas={prestacaoDeContas} />
    </MemoryRouter>
  );

describe("Cabecalho Detalhe Prestacao de Contas", () => {
  it("exibe dados básicos da associação e link para listagem", async () => {
    const { container } = renderComponent();

    await waitFor(() =>
      expect(screen.getByText("EMEF Teste")).toBeInTheDocument()
    );

    const codigoEolEl = container.querySelector(
      '[data-qa="cabecalho-codigo-eol"]'
    );
    const cnpjEl = container.querySelector(
      '[data-qa="cabecalho-numero-cnpj"]'
    );

    expect(codigoEolEl).toBeInTheDocument();
    expect(cnpjEl).toBeInTheDocument();

    const linkListagem = screen.getByRole("link", {
      name: /Ir para a listagem/i,
    });
    expect(linkListagem).toHaveAttribute(
      "href",
      `/dre-lista-prestacao-de-contas/${prestacaoBase.periodo_uuid}/${prestacaoBase.status}`
    );
  });

  it("exibe texto de publicação quando publicada e não em retificação", async () => {
    renderComponent();

    await waitFor(() =>
      expect(
        screen.getByText(prestacaoBase.referencia_consolidado_dre)
      ).toBeInTheDocument()
    );

    expect(
      screen.getByText(prestacaoBase.referencia_consolidado_dre)
    ).toBeInTheDocument();
  });

  it("exibe tag 'Em retificação' quando em_retificacao=true, status válido, não publicada e visão DRE", async () => {
    const prestacaoRetificacao = {
      ...prestacaoBase,
      publicada: false,
      em_retificacao: true,
      status: "EM_ANALISE",
    };

    renderComponent(prestacaoRetificacao);

    await waitFor(() =>
      expect(screen.getByText("Em retificação")).toBeInTheDocument()
    );
  });
});

