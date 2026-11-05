import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectPeriodo } from "../SelectPeriodo";
import { exibeDataPT_BR } from "../../../../utils/ValidacoesAdicionaisFormularios";

jest.mock("../../../../utils/ValidacoesAdicionaisFormularios", () => ({
  exibeDataPT_BR: jest.fn(),
}));

describe("SelectPeriodo", () => {
  beforeEach(() => {
    exibeDataPT_BR.mockImplementation((d) => `fmt(${d})`);
  });

  it("renderiza períodos com datas formatadas e dispara change", () => {
    const handle = jest.fn();
    const periodos = [
      { uuid: "p1", referencia: "2024.1", data_inicio_realizacao_despesas: "2024-01-01", data_fim_realizacao_despesas: "2024-06-30" },
      { uuid: "p2", referencia: "2024.2", data_inicio_realizacao_despesas: null, data_fim_realizacao_despesas: null },
    ];
    render(<SelectPeriodo periodos={periodos} periodoEscolhido="p1" handleChangePeriodos={handle} />);
    expect(screen.getByText("2024.1 - fmt(2024-01-01) até fmt(2024-06-30)")).toBeInTheDocument();
    expect(screen.getByText("2024.2 - - até -")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "p2" } });
    expect(handle).toHaveBeenCalledWith("p2");
  });

  it("sem períodos", () => {
    render(<SelectPeriodo periodoEscolhido="" handleChangePeriodos={jest.fn()} />);
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
