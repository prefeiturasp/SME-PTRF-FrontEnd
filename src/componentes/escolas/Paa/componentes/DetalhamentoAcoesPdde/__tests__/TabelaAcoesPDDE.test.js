import { render, screen, fireEvent } from "@testing-library/react";
import TabelaAcoesPDDE from "../TabelaAcoesPDDE";
import { useGetResumoAcoesPddePorPrograma } from "../hooks/useGetResumoAcoesPddePorPrograma";

jest.mock("../hooks/useGetResumoAcoesPddePorPrograma");

jest.mock("../ModalEdicaoReceitaPrevistaPdde", () => {
  return ({ open, onClose, receitaPrevistaPDDE }) => (
    <div data-testid="modal-edicao">
      {open ? `Modal aberto para ${receitaPrevistaPDDE?.nome}` : "Modal fechado"}
      <button onClick={onClose}>Fechar Modal</button>
    </div>
  );
});

describe("TabelaAcoesPDDE", () => {
  const acaoTeste = {
    key: "acao-1",
    level: 1,
    nome: "Ação Teste",
    custeio: 100,
    capital: 200,
    livre_aplicacao: 0,
    aceita_custeio: true,
    aceita_capital: true,
    aceita_livre_aplicacao: false,
    acao: { uuid: "acao-1-uuid", nome: "Ação Teste" },
  };

  const programaX = {
    key: "programa-1",
    level: 0,
    nome: "Programa X",
    custeio: 300,
    capital: 400,
    livre_aplicacao: 0,
    children: [acaoTeste],
  };

  const totalPdde = {
    key: "total-pdde",
    level: 0,
    nome: "Total do PDDE",
    custeio: 300,
    capital: 400,
    livre_aplicacao: 0,
  };

  const baseDados = [programaX, totalPdde];

  const mockUseGetResumo = (overrides = {}) => {
    useGetResumoAcoesPddePorPrograma.mockReturnValue({
      isLoading: false,
      dados: baseDados,
      error: null,
      refetch: jest.fn(),
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetResumo();

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it("renderiza os cabeçalhos da tabela", () => {
    render(<TabelaAcoesPDDE />);
    expect(screen.getByText("Tipos de Programa")).toBeInTheDocument();
    expect(screen.getByText("Custeio (R$)")).toBeInTheDocument();
    expect(screen.getByText("Capital (R$)")).toBeInTheDocument();
    expect(screen.getByText("Livre Aplicação (R$)")).toBeInTheDocument();
  });

  it("renderiza as linhas de nível 0 com valores formatados", () => {
    render(<TabelaAcoesPDDE />);
    expect(screen.getByText("Programa X")).toBeInTheDocument();
    expect(screen.getByText("Total do PDDE")).toBeInTheDocument();
    // custeio = 300,00 aparece em ambas as linhas de nível 0
    expect(screen.getAllByText("300,00")).toHaveLength(2);
    expect(screen.getAllByText("400,00")).toHaveLength(2);
  });

  it("exibe o ícone de expandir para linha com filhos e permite expandir/recolher", () => {
    render(<TabelaAcoesPDDE />);

    expect(screen.queryByText("Ação Teste")).not.toBeInTheDocument();

    const chevronExpandir = screen.getByRole("img", { name: "down" });
    fireEvent.click(chevronExpandir);

    expect(screen.getByText("Ação Teste")).toBeInTheDocument();

    const chevronRecolher = screen.getByRole("img", { name: "up" });
    fireEvent.click(chevronRecolher);

    expect(screen.queryByText("Ação Teste")).not.toBeInTheDocument();
  });

  it("não exibe nenhum ícone para linha de nível 0 sem filhos", () => {
    render(<TabelaAcoesPDDE />);
    const linhaTotal = screen.getByText("Total do PDDE").closest("tr");
    expect(linhaTotal).not.toBeNull();
    expect(linhaTotal.querySelector('[role="img"]')).not.toBeInTheDocument();
    expect(linhaTotal.querySelector("button")).not.toBeInTheDocument();
  });

  it("exibe o botão de editar para linha de nível 1 sem filhos e abre o modal com a ação correta", () => {
    render(<TabelaAcoesPDDE />);

    fireEvent.click(screen.getByRole("img", { name: "down" }));

    const botaoEditar = screen.getByRole("button", { name: /editar/i });
    fireEvent.click(botaoEditar);

    expect(screen.getByTestId("modal-edicao")).toHaveTextContent("Modal aberto para Ação Teste");

    fireEvent.click(screen.getByText("Fechar Modal"));
    expect(screen.getByTestId("modal-edicao")).toHaveTextContent("Modal fechado");
  });

  it("renderiza '-' para campo não aceito em linha de nível 1", () => {
    render(<TabelaAcoesPDDE />);
    fireEvent.click(screen.getByRole("img", { name: "down" }));

    const celulaDesativada = document.querySelector(".cell-desativada-pdde");
    expect(celulaDesativada).toBeInTheDocument();
    expect(celulaDesativada).toHaveTextContent("—");
  });

  it("renderiza valor formatado para campo aceito em linha de nível 1", () => {
    render(<TabelaAcoesPDDE />);
    fireEvent.click(screen.getByRole("img", { name: "down" }));

    expect(screen.getByText("100,00")).toBeInTheDocument();
    expect(screen.getByText("200,00")).toBeInTheDocument();
  });

  it("assume 0,00 quando o valor não é informado em campo aceito", () => {
    useGetResumoAcoesPddePorPrograma.mockReturnValue({
      isLoading: false,
      dados: [
        {
          key: "programa-2",
          level: 0,
          nome: "Programa Y",
          custeio: 0,
          capital: 0,
          livre_aplicacao: 0,
          children: [
            {
              key: "acao-2",
              level: 1,
              nome: "Ação Sem Valor",
              custeio: undefined,
              capital: undefined,
              livre_aplicacao: undefined,
              aceita_custeio: true,
              aceita_capital: true,
              aceita_livre_aplicacao: true,
              acao: { uuid: "acao-2-uuid", nome: "Ação Sem Valor" },
            },
          ],
        },
      ],
      error: null,
      refetch: jest.fn(),
    });

    render(<TabelaAcoesPDDE />);
    fireEvent.click(screen.getByRole("img", { name: "down" }));

    expect(screen.getAllByText("0,00").length).toBeGreaterThan(0);
  });

  it("exibe o indicador de carregamento quando isLoading é verdadeiro", () => {
    mockUseGetResumo({ isLoading: true, dados: [] });
    render(<TabelaAcoesPDDE />);
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
  });

  it("não exibe o indicador de carregamento quando isLoading é falso", () => {
    render(<TabelaAcoesPDDE />);
    expect(document.querySelector(".ant-spin-spinning")).not.toBeInTheDocument();
  });

  it("renderiza o modal fechado por padrão", () => {
    render(<TabelaAcoesPDDE />);
    expect(screen.getByTestId("modal-edicao")).toHaveTextContent("Modal fechado");
  });
});
