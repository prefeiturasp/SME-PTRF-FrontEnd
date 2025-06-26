import { fireEvent, render, screen } from "@testing-library/react";
import { VincularDespesas } from "../../VincularDespesas";
import { MemoryRouter } from "react-router-dom";

const mockUseNavigate = jest.fn();
const mockSalvarRascunho = jest.fn();
const mockSetDespesasSelecionadas = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn()
}));

jest.mock("../../hooks/usePostBemProduzido", () => ({
  usePostBemProduzido: () => ({
    mutationPost: { mutate: jest.fn() },
  }),
}));

jest.mock("../../VincularDespesas/hooks/useGetDespesas", () => ({
  useGetDespesas: () => ({
    data: {
      count: 1,
      results: [
        {
          uuid: "1",
          periodo_referencia: "2023-01",
          numero_documento: "ABC123",
          data_documento: "2023-01-01",
          tipo_documento: { nome: "Nota Fiscal" },
          valor_total: 1000,
          rateios: [],
        },
      ],
    },
    refetch: jest.fn(),
    isLoading: false,
    error: null,
    isError: false,
  }),
}));

jest.mock("../../../../../../hooks/Globais/useCarregaTabelaDespesa", () => ({
  useCarregaTabelaDespesa: () => ({
    contas_associacao: [],
  }),
}));

jest.mock("../../../../../../hooks/Globais/useGetPeriodo", () => ({
  useGetPeriodos: () => ({
    data: [],
  }),
}));

jest.mock("../../VincularDespesas/FormFiltrosDespesas", () => ({
  FormFiltrosDespesas: ({ onFiltrar }) => (
    <button onClick={onFiltrar}>Filtrar</button>
  ),
}));

describe("VincularDespesas", () => {
  it("deve renderizar a tabela de despesas", async () => {
    render(
      <MemoryRouter>
        <VincularDespesas
          uuid={null}
          salvarRascunho={mockSalvarRascunho}
          setDespesasSelecionadas={mockSetDespesasSelecionadas}
          despesasSelecionadas={[]}
        />
        ,
      </MemoryRouter>
    );

    expect(
      screen.getByText("Pesquise as despesas relacionadas à produção do bem")
    ).toBeInTheDocument();
    expect(await screen.findByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
    expect(screen.getByText("Salvar rascunho")).toBeDisabled();
  });

  it("Deve voltar para a página de listagem ao clicar no botão cancelar", async () => {
    render(
      <MemoryRouter>
        <VincularDespesas
          uuid={null}
          salvarRascunho={mockSalvarRascunho}
          setDespesasSelecionadas={mockSetDespesasSelecionadas}
          despesasSelecionadas={[]}
        />
      </MemoryRouter>
    );

    const buttonCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(buttonCancelar);

    expect(mockUseNavigate).toHaveBeenCalledWith("/lista-situacao-patrimonial");
  });
});
