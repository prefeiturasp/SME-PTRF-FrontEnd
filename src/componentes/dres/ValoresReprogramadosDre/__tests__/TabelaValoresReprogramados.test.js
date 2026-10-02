import React from "react";
import { render, screen } from "@testing-library/react";
import { TabelaValoresReprogramados } from "../TabelaValoresReprogramados";

const linha = {
  associacao: {
    unidade: { codigo_eol: "123456", nome_com_tipo: "EMEF Exemplo" },
    status_valores_reprogramados: "PENDENTE",
  },
  periodo: { referencia: "2026.1" },
  nome_conta_um: "Cheque",
  nome_conta_dois: "Cartão",
  total_conta_um: 1500,
  total_conta_dois: 800,
};

describe("TabelaValoresReprogramados", () => {
  it("deve nomear as colunas de saldo a partir das contas da primeira linha", () => {
    render(
      <TabelaValoresReprogramados
        listaDeValoresReprogramados={[linha]}
        rowsPerPage={10}
        valorTemplateCheque={(row) => `R$ ${row.total_conta_um}`}
        valorTemplateCartao={(row) => `R$ ${row.total_conta_dois}`}
        statusTemplate={(row) => row.associacao.status_valores_reprogramados}
        acoesTemplate={() => <button type="button">Editar</button>}
      />
    );

    expect(screen.getByRole("columnheader", { name: "Saldo Cheque" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Saldo Cartão" })).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("EMEF Exemplo")).toBeInTheDocument();
    expect(screen.getByText("2026.1")).toBeInTheDocument();
    expect(screen.getByText("R$ 1500")).toBeInTheDocument();
    expect(screen.getByText("R$ 800")).toBeInTheDocument();
    expect(screen.getByText("PENDENTE")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar" })).toBeInTheDocument();
  });

  it("deve usar traço nos saldos quando não há valores reprogramados", () => {
    render(
      <TabelaValoresReprogramados
        listaDeValoresReprogramados={[]}
        rowsPerPage={10}
        valorTemplateCheque={() => null}
        valorTemplateCartao={() => null}
        statusTemplate={() => null}
        acoesTemplate={() => null}
      />
    );

    expect(screen.getAllByRole("columnheader", { name: "-" })).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
  });
});
