import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LinkCustom from "../LinkCustom";
import { visoesService } from "../../../../../services/visoes.service";
import { RetornaSeTemPermissaoEdicaoAjustesLancamentos } from "../../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

// Mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock service
jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn(),
  },
}));

// Mock permissão
jest.mock("../../RetornaSeTemPermissaoEdicaoAjustesLancamentos", () => ({
  RetornaSeTemPermissaoEdicaoAjustesLancamentos: jest.fn(),
}));


describe("LinkCustom", () => {
  const defaultProps = {
    url: "/teste-url",
    analise_documento: {
      despesa: "despesa-1",
      receita: "receita-1",
    },
    prestacaoDeContasUuid: "pc-uuid",
    prestacaoDeContas: {
      associacao: { uuid: "assoc-uuid" },
      periodo_uuid: "periodo-1",
    },
    classeCssBotao: "btn-test",
    operacao: "requer_inclusao_documento_gasto",
    analisePermiteEdicao: true,
    uuid_acerto_documento: "acerto-uuid",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // mock pathname
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/pagina/origem/teste",
      },
      writable: true,
    });

    visoesService.getItemUsuarioLogado.mockReturnValue("visao-teste");
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
  });

  it("deve renderizar o botão com children", () => {
    render(
      <LinkCustom {...defaultProps}>
        Clique aqui
      </LinkCustom>
    );

    expect(screen.getByText("Clique aqui")).toBeInTheDocument();
  });

  it("deve chamar navigate com state correto ao clicar", () => {
    render(
      <LinkCustom {...defaultProps}>
        Clique
      </LinkCustom>
    );

    fireEvent.click(screen.getByText("Clique"));

    expect(mockNavigate).toHaveBeenCalledWith("/teste-url", {
      state: {
        uuid_acerto_documento: "acerto-uuid",
        uuid_pc: "pc-uuid",
        uuid_despesa: "despesa-1",
        uuid_receita: "receita-1",
        uuid_associacao: "assoc-uuid",
        origem: "/pagina/origem",
        origem_visao: "visao-teste",
        tem_permissao_de_edicao: true,
        operacao: "requer_inclusao_documento_gasto",
        periodo_uuid: "periodo-1",
      },
    });
  });

  it("deve ajustar origem corretamente quando path tem apenas um nível", () => {
    window.location.pathname = "/simples";

    render(
      <LinkCustom {...defaultProps}>
        Clique
      </LinkCustom>
    );

    fireEvent.click(screen.getByText("Clique"));

    expect(mockNavigate.mock.calls[0][1].state.origem).toBe("/simples");
  });

  it("deve retornar permissão false para operações de exclusão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    render(
      <LinkCustom
        {...defaultProps}
        operacao="requer_exclusao_documento_gasto"
      >
        Clique
      </LinkCustom>
    );

    fireEvent.click(screen.getByText("Clique"));

    expect(mockNavigate.mock.calls[0][1].state.tem_permissao_de_edicao).toBe(false);
  });

  it("deve respeitar permissão false original", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);

    render(
      <LinkCustom {...defaultProps}>
        Clique
      </LinkCustom>
    );

    fireEvent.click(screen.getByText("Clique"));

    expect(mockNavigate.mock.calls[0][1].state.tem_permissao_de_edicao).toBe(false);
  });

  it("deve lidar com prestacaoDeContas sem associacao", () => {
    const props = {
      ...defaultProps,
      prestacaoDeContas: {},
    };

    render(
      <LinkCustom {...props}>
        Clique
      </LinkCustom>
    );

    fireEvent.click(screen.getByText("Clique"));

    expect(mockNavigate.mock.calls[0][1].state.uuid_associacao).toBeUndefined();
  });
});