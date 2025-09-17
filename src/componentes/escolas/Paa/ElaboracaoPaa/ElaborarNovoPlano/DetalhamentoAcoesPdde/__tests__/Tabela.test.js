import { render, screen, fireEvent } from "@testing-library/react";
import Tabela from "../Tabela";

jest.mock("../Paginacao", () => ({
  Paginacao: ({ acoes, setCurrentPage, firstPage, setFirstPage, isLoading, count }) => (
    <div data-testid="paginacao">
      paginação simulada - {acoes.length} ações
    </div>
  ),
}));

jest.mock("../ModalEdicaoReceitaPrevistaPdde", () => {
  return ({ open, onClose, receitaPrevistaPDDE }) => (
    <div data-testid="modal-edicao">
      {open ? `Modal aberto para ${receitaPrevistaPDDE?.nome}` : "Modal fechado"}
      <button onClick={onClose}>Fechar Modal</button>
    </div>
  );
});

describe("Tabela", () => {
  const baseData = {
    results: [
      {
        uuid: "123",
        nome: "Ação Teste",
        programa_objeto: { nome: "Programa X" },
        aceita_custeio: true,
        aceita_capital: true,
        aceita_livre_aplicacao: false,
        receitas_previstas_pdde_valores: {
          previsao_valor_custeio: 100,
          saldo_custeio: 50,
          previsao_valor_capital: 200,
          saldo_capital: 100,
          previsao_valor_livre: 0,
          saldo_livre: 0,
        },
      },
    ],
  };

  const defaultProps = {
    rowsPerPage: 10,
    data: baseData,
    isLoading: false,
    setCurrentPage: jest.fn(),
    firstPage: 0,
    setFirstPage: jest.fn(),
    count: 1,
  };

  it("renderiza título e tabela", () => {
    render(<Tabela {...defaultProps} />);
    expect(screen.getByText("Ações PDDE")).toBeInTheDocument();
    expect(screen.getAllByText("Ação PDDE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Programa").length).toBeGreaterThan(0);
  });

  it("renderiza valores monetários formatados corretamente", () => {
    render(<Tabela {...defaultProps} />);
    // custo = 100 + 50 = 150
    expect(screen.getByText("150,00")).toBeInTheDocument();
    // capital = 200 + 100 = 300
    expect(screen.getByText("300,00")).toBeInTheDocument();
    // livre aplicação não aceito → bloco cinza
    expect(screen.getAllByText("Ações")[0]).toBeInTheDocument();
  });

  it("renderiza fallback 0,00 quando valor é NaN", () => {
    const dataComNaN = {
      results: [
        {
          uuid: "456",
          nome: "Ação Inválida",
          programa_objeto: { nome: "Programa Y" },
          aceita_custeio: true,
          receitas_previstas_pdde_valores: {
            previsao_valor_custeio: NaN,
            saldo_custeio: NaN,
          },
        },
      ],
    };

    render(<Tabela {...defaultProps} data={dataComNaN} />);
    expect(screen.getByText("0,00")).toBeInTheDocument();
  });

  it("abre e fecha modal ao clicar no botão de editar", () => {
    render(<Tabela {...defaultProps} />);
    const botaoEditar = screen.getByTestId("botao-editar");
    fireEvent.click(botaoEditar);

    expect(screen.getByTestId("modal-edicao")).toHaveTextContent("Modal aberto para Ação Teste");

    fireEvent.click(screen.getByText("Fechar Modal"));
    expect(screen.getByTestId("modal-edicao")).toHaveTextContent("Modal fechado");
  });

  it("renderiza componente de paginação com número de ações", () => {
    render(<Tabela {...defaultProps} />);
    expect(screen.getByTestId("paginacao")).toHaveTextContent("1 ações");
  });
});
