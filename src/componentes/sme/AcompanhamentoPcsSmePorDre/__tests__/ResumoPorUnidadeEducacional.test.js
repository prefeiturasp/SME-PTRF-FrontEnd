import React from "react";
import { render, screen } from "@testing-library/react";
import { ResumoPorUnidadeEducacional } from "../ResumoPorUnidadeEducacional";
import { visoesService } from "../../../../services/visoes.service";
import { mantemEstadoAcompanhamentoDePcUnidade } from "../../../../services/mantemEstadoAcompanhamentoDePcUnidadeEducacional.service";

jest.mock("../../../../hooks/Globais/useDataTemplate", () => ({
  __esModule: true,
  default: () => (_coluna, _linha, valor) => (valor ? `formatada ${valor}` : "-"),
}));

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: { getUsuarioLogin: jest.fn(() => "usuario.sme") },
}));

jest.mock("../../../../services/mantemEstadoAcompanhamentoDePcUnidadeEducacional.service", () => ({
  mantemEstadoAcompanhamentoDePcUnidade: {
    setAcompanhamentoPcUnidadePorUsuario: jest.fn(),
  },
}));

const unidade = (status, extras = {}) => ({
  unidade_eol: "123456",
  unidade_tipo_unidade: "EMEF",
  unidade_nome: "Exemplo",
  processo_sei: "SEI-1",
  data_recebimento: "2026-02-01",
  data_ultima_analise: "2026-03-01",
  tecnico_responsavel: "Ana",
  devolucao_ao_tesouro: "Não",
  status,
  ...extras,
});

describe("ResumoPorUnidadeEducacional", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir o carregamento enquanto as prestações estão sendo buscadas", () => {
    render(
      <ResumoPorUnidadeEducacional
        unidadesEducacionais={[]}
        loadingDataTable
        dreUuid="dre-1"
        setPaginaAtual={jest.fn()}
        paginaAtual={0}
      />
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.queryByText("Código EOL")).not.toBeInTheDocument();
  });

  it("deve informar quando nenhuma prestação é retornada", () => {
    render(
      <ResumoPorUnidadeEducacional
        unidadesEducacionais={[]}
        loadingDataTable={false}
        dreUuid="dre-1"
        setPaginaAtual={jest.fn()}
        paginaAtual={0}
      />
    );

    expect(
      screen.getByText("Nenhuma prestação retornada. Tente novamente com outros filtros")
    ).toBeInTheDocument();
  });

  it("deve traduzir o status e preencher os dados da unidade", () => {
    render(
      <ResumoPorUnidadeEducacional
        unidadesEducacionais={[
          unidade("NAO_RECEBIDA"),
          unidade("APROVADA_RESSALVA", { unidade_eol: "654321", unidade_nome: "Outra" }),
          unidade("DEVOLVIDA", { unidade_eol: null, unidade_nome: "", processo_sei: "" }),
          unidade("REPROVADA", { unidade_eol: "999" }),
          unidade("SITUACAO_NOVA", { unidade_eol: "111" }),
          unidade("DEVOLVIDA_RETORNADA", { unidade_eol: "222" }),
        ]}
        loadingDataTable={false}
        dreUuid="dre-1"
        setPaginaAtual={jest.fn()}
        paginaAtual={0}
      />
    );

    expect(screen.getByText("Não recebida")).toBeInTheDocument();
    expect(screen.getByText("Aprovada com ressalva")).toBeInTheDocument();
    expect(screen.getByText("Devolvida para acerto")).toBeInTheDocument();
    expect(screen.getByText("Rejeitada")).toBeInTheDocument();
    expect(screen.getByText("Apresentada após acertos")).toBeInTheDocument();
    expect(screen.getAllByText("EMEF Exemplo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("formatada 2026-02-01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
    expect(visoesService.getUsuarioLogin).not.toHaveBeenCalled();
    expect(mantemEstadoAcompanhamentoDePcUnidade.setAcompanhamentoPcUnidadePorUsuario).not.toHaveBeenCalled();
  });
});
