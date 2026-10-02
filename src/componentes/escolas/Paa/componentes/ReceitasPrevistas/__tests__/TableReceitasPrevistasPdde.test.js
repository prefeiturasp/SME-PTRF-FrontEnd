import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableReceitasPrevistasPdde from "../TableReceitasPrevistasPdde";
import { useGetProgramasPddeTotais } from "../hooks/useGetProgramasPddeTotais";
import { usePaaContext } from "../../PaaContext";

jest.mock("../hooks/useGetProgramasPddeTotais", () => ({
  useGetProgramasPddeTotais: jest.fn(),
}));

jest.mock("../../PaaContext", () => ({
  usePaaContext: jest.fn(),
}));

const programas = [
  {
    nome: "Qualidade",
    total_valor_custeio: 100,
    total_valor_capital: 200,
    total_valor_livre_aplicacao: 50,
    total: 350,
  },
];

const total = {
  total_valor_custeio: 100,
  total_valor_capital: 200,
  total_valor_livre_aplicacao: 50,
  total: 350,
};

describe("TableReceitasPrevistasPdde", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePaaContext.mockReturnValue({ paa: { uuid: "paa-1" } });
    useGetProgramasPddeTotais.mockReturnValue({
      programas,
      total,
      isLoading: false,
    });
  });

  it("deve exibir os programas e a linha de total do PDDE", () => {
    render(<TableReceitasPrevistasPdde />);

    expect(useGetProgramasPddeTotais).toHaveBeenCalledWith("paa-1");
    expect(screen.getByText("Qualidade")).toBeInTheDocument();
    expect(screen.getByText("Total do PDDE")).toBeInTheDocument();
    expect(screen.getAllByText("100,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("350,00")).toHaveLength(2);
  });

  it("deve abrir o detalhamento das ações ao editar um programa", async () => {
    const user = userEvent.setup();
    const setActiveTab = jest.fn();

    render(<TableReceitasPrevistasPdde setActiveTab={setActiveTab} />);

    const editar = screen.getAllByRole("button", { name: "Editar" });
    expect(editar).toHaveLength(1);

    await user.click(editar[0]);

    expect(setActiveTab).toHaveBeenCalledWith("detalhamento-das-acoes-pdde");
  });

  it("deve indicar carregamento enquanto os totais estão sendo buscados", () => {
    useGetProgramasPddeTotais.mockReturnValue({
      programas: [],
      total: {},
      isLoading: true,
    });

    render(<TableReceitasPrevistasPdde />);

    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
    expect(screen.getByText("Total do PDDE")).toBeInTheDocument();
    expect(screen.getAllByText("0,00").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Editar" })).not.toBeInTheDocument();
  });
});
