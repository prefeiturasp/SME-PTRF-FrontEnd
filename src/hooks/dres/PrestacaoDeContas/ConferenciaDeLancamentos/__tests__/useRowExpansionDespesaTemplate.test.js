import React from "react";
import { render, screen } from "@testing-library/react";
import useRowExpansionDespesaTemplate from "../useRowExpansionDespesaTemplate";
import { useCarregaTabelaDespesa } from "../../../../Globais/useCarregaTabelaDespesa";

jest.mock("../useTagRateioTemplate", () => () => (rateio) => {
  return <span>Tag Atividade</span>;
});

jest.mock(
  "../useConferidoRateioTemplate",
  () => () => (rowData, column, valor) => {
    return <span>Conferido</span>;
  }
);

jest.mock("../useValorTemplate", () => () => (rowData, column, valor) => {
  return "R$ 123,45";
});

jest.mock(
  "../../../../Globais/useDataTemplate",
  () => () => (rowData, column, data_passada) => {
    return "01/01/2024";
  }
);
jest.mock("../../../../Globais/useCarregaTabelaDespesa");

const MockComponent = ({ data }) => {
  const renderFunction = useRowExpansionDespesaTemplate({});
  return renderFunction(data);
};

describe("useRowExpansionDespesaTemplate", () => {
  beforeEach(() => {
    useCarregaTabelaDespesa.mockReturnValue({
      tipos_aplicacao_recurso: [
        { id: 1, nome: "Aplicação A" },
        { id: 2, nome: "Aplicação B" },
      ],
    });
  });

  it("renderiza corretamente os dados da despesa", () => {
    const mockData = {
      documento_mestre: {
        cpf_cnpj_fornecedor: "123.456.789-00",
        tipo_documento: { nome: "Nota Fiscal" },
        tipo_transacao: { nome: "PIX" },
        data_transacao: "2024-01-01",
        documento_transacao: "NF-001",
      },
      rateios: [
        {
          tipo_custeio: { nome: "Custeio Teste" },
          especificacao_material_servico: { descricao: "Serviço de TI" },
          aplicacao_recurso: 1,
          valor_rateio: 123.45,
          acao_associacao: { nome: "Ação Teste" },
        },
      ],
    };

    render(<MockComponent data={mockData} />);

    expect(screen.getByText("CNPJ / CPF")).toBeInTheDocument();
    expect(screen.getByText("123.456.789-00")).toBeInTheDocument();
    expect(screen.getByText("Nota Fiscal")).toBeInTheDocument();
    expect(screen.getByText("PIX")).toBeInTheDocument();
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
    expect(screen.getByText("NF-001")).toBeInTheDocument();
    expect(screen.getByText("Custeio Teste")).toBeInTheDocument();
    expect(screen.getByText("Serviço de TI")).toBeInTheDocument();
    expect(screen.getByText("Aplicação A")).toBeInTheDocument();
    expect(screen.getByText("R$ 123,45")).toBeInTheDocument();
    expect(screen.getByText("Tag Atividade")).toBeInTheDocument();
    expect(screen.getByText("Conferido")).toBeInTheDocument();
  });
});
