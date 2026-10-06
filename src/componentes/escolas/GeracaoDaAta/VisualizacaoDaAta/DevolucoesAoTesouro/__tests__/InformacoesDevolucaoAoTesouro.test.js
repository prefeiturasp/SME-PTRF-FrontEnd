import React from "react";
import { render, screen } from "@testing-library/react";
import { InformacoesDevolucaoAoTesouro } from "../InformacoesDevolucaoAoTesouro";
import { visoesService } from "../../../../../../services/visoes.service";

jest.mock("../../../../../Globais/DatePickerField", () => ({
  DatePickerField: ({ value, disabled, placeholderText, name }) => (
    <input
      aria-label="Data de realização da devolução"
      name={name}
      value={value || ""}
      placeholder={placeholderText}
      disabled={disabled}
      readOnly
    />
  ),
}));

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn(),
  },
}));

const despesas = {
  devolucao_0: [
    {
      nome_fornecedor: "Fornecedor Alfa",
      cpf_cnpj_fornecedor: "12345678000199",
      tipo_documento: { nome: "Nota fiscal" },
      numero_documento: "NF-10",
      data_documento: "2026-03-10",
    },
  ],
};

const initialValues = {
  devolucoes_ao_tesouro_da_prestacao: [
    { despesa: "despesa-1", valor: "150,00", data: "2026-03-15" },
  ],
};

describe("InformacoesDevolucaoAoTesouro", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getItemUsuarioLogado.mockReturnValue("UE");
  });

  it("não deve exibir devoluções quando a prestação informa que não há devolução ao tesouro", () => {
    const { container } = render(
      <InformacoesDevolucaoAoTesouro
        informacoesPrestacaoDeContas={{ devolucao_ao_tesouro: "Não" }}
        initialValues={initialValues}
        despesas={despesas}
        validateFormDevolucaoAoTesouro={() => ({})}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("deve exibir os dados da despesa devolvida e permitir informar a data na visão da unidade", () => {
    render(
      <InformacoesDevolucaoAoTesouro
        informacoesPrestacaoDeContas={{ devolucao_ao_tesouro: "Sim" }}
        initialValues={initialValues}
        despesas={despesas}
        validateFormDevolucaoAoTesouro={() => ({})}
      />
    );

    expect(screen.getByText("Devolução 1")).toBeInTheDocument();
    expect(screen.getByText("Fornecedor Alfa")).toBeInTheDocument();
    expect(screen.getByText("12345678000199")).toBeInTheDocument();
    expect(screen.getByText("Nota fiscal")).toBeInTheDocument();
    expect(screen.getByText("NF-10")).toBeInTheDocument();
    expect(screen.getByText("150,00")).toBeInTheDocument();
    expect(screen.getByLabelText("Data de realização da devolução")).toBeEnabled();
    expect(screen.getByLabelText("Data de realização da devolução")).toHaveValue("2026-03-15");
  });

  it("deve bloquear a data da devolução para a visão da DRE", () => {
    visoesService.getItemUsuarioLogado.mockReturnValue("DRE");

    render(
      <InformacoesDevolucaoAoTesouro
        informacoesPrestacaoDeContas={{ devolucao_ao_tesouro: "Sim" }}
        initialValues={initialValues}
        despesas={despesas}
        validateFormDevolucaoAoTesouro={() => ({})}
      />
    );

    expect(screen.getByLabelText("Data de realização da devolução")).toBeDisabled();
  });

  it("deve manter a identificação da devolução sem a tabela quando a despesa não foi encontrada", () => {
    render(
      <InformacoesDevolucaoAoTesouro
        informacoesPrestacaoDeContas={{ devolucao_ao_tesouro: "Sim" }}
        initialValues={{
          devolucoes_ao_tesouro_da_prestacao: [
            { despesa: "", valor: "150,00", data: "" },
          ],
        }}
        despesas={despesas}
        validateFormDevolucaoAoTesouro={() => ({})}
      />
    );

    expect(screen.getByText("Devolução 1")).toBeInTheDocument();
    expect(screen.queryByText("Fornecedor Alfa")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Data de realização da devolução")).not.toBeInTheDocument();
  });
});
