import { render, screen, fireEvent } from "@testing-library/react";
import BotaoAcertosLancamentosDesconciliacaoGasto from "../BotaoAcertosLancamentosDesconciliacaoGasto";
import { RetornaSeTemPermissaoEdicaoAjustesLancamentos } from "../../RetornaSeTemPermissaoEdicaoAjustesLancamentos";
import { botoesAcertosLancamentosService as BtnService } from "../botoesAcertosLancamentosService.service";

// Mocks
jest.mock("../../RetornaSeTemPermissaoEdicaoAjustesLancamentos", () => ({
  RetornaSeTemPermissaoEdicaoAjustesLancamentos: jest.fn(),
}));

jest.mock("../botoesAcertosLancamentosService.service", () => ({
  botoesAcertosLancamentosService: {
    marcarGastoComoDesconciliado: jest.fn(),
    marcarGastoComoConciliado: jest.fn(),
  },
}));


describe("BotaoAcertosLancamentosDesconciliacaoGasto", () => {
  const defaultProps = {
    carregaAcertosLancamentos: jest.fn(),
    conta: { id: 1 },
    prestacaoDeContas: { id: 10 },
    analisePermiteEdicao: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar botão de desconciliação quando não estiver conciliado e houver permissão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    const analise_lancamento = {
      conciliacao_atualizada: false,
    };

    render(
      <BotaoAcertosLancamentosDesconciliacaoGasto
        {...defaultProps}
        analise_lancamento={analise_lancamento}
      />
    );

    const botao = screen.getByText("Clique para desconciliar");
    expect(botao).toBeInTheDocument();

    fireEvent.click(botao);

    expect(BtnService.marcarGastoComoDesconciliado).toHaveBeenCalledWith(
      analise_lancamento,
      defaultProps.carregaAcertosLancamentos,
      defaultProps.conta
    );
  });

  it("não deve mostrar texto se não tiver permissão (caso desconciliar)", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);

    const analise_lancamento = {
      conciliacao_atualizada: false,
    };

    render(
      <BotaoAcertosLancamentosDesconciliacaoGasto
        {...defaultProps}
        analise_lancamento={analise_lancamento}
      />
    );

    expect(screen.queryByText("Clique para desconciliar")).not.toBeInTheDocument();
  });

  it("deve renderizar botão de conciliação quando já estiver conciliado e houver permissão", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);

    const analise_lancamento = {
      conciliacao_atualizada: true,
    };

    render(
      <BotaoAcertosLancamentosDesconciliacaoGasto
        {...defaultProps}
        analise_lancamento={analise_lancamento}
      />
    );

    const botao = screen.getByText(/Clique para conciliar/i);
    expect(botao).toBeInTheDocument();

    fireEvent.click(botao);

    expect(BtnService.marcarGastoComoConciliado).toHaveBeenCalledWith(
      analise_lancamento,
      defaultProps.prestacaoDeContas,
      defaultProps.carregaAcertosLancamentos,
      defaultProps.conta
    );
  });

  it("deve renderizar apenas texto quando não houver permissão e estiver conciliado", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);

    const analise_lancamento = {
      conciliacao_atualizada: true,
    };

    render(
      <BotaoAcertosLancamentosDesconciliacaoGasto
        {...defaultProps}
        analise_lancamento={analise_lancamento}
      />
    );

    expect(screen.getByText("Gasto atualizado.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("não deve quebrar quando analise_lancamento for null", () => {
    RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);

    render(
      <BotaoAcertosLancamentosDesconciliacaoGasto
        {...defaultProps}
        analise_lancamento={null}
      />
    );

    expect(screen.getByText("Gasto atualizado.")).toBeInTheDocument();
  });
});