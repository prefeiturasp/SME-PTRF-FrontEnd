import { useEffect, React } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useGet } from "../hooks/useGet";
import { getEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";

jest.mock("../../../../../../services/sme/Parametrizacoes.service");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    },
  },
});

const TestComponent = () => {
  const { isLoading, isError, data, total, refetch } = useGet();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data</p>}
      {data && <p data-testid="data-count">{total}</p>}
      <button onClick={refetch}>Refetch</button>
    </div>
  );
};

describe("Hook useGet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  test("Mostra carregamento inicial", async () => {
    getEspecificacoesMateriaisServicos.mockReturnValue(new Promise(() => {})); 

    render(
      <QueryClientProvider client={queryClient}>
        <MateriaisServicosContext.Provider value={{ filter: {}, currentPage: 1 }}>
          <TestComponent />
        </MateriaisServicosContext.Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("Resgata dados com sucesso", async () => {
    const mockData = { count: 2, results: [{ nome: "Motivo 1" }, { nome: "Motivo 2" }] };
    getEspecificacoesMateriaisServicos.mockResolvedValueOnce(Promise.resolve(mockData));

    render(
      <QueryClientProvider client={queryClient}>
        <MateriaisServicosContext.Provider value={{ filter: {}, currentPage: 1 }}>
          <TestComponent />
        </MateriaisServicosContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("data-count")).toHaveTextContent("2");
    });
  });

  test("Chama a funcao de busca novamente", async () => {
    const mockData = { count: 1, results: [{ nome: "Motivo Teste" }] };
    getEspecificacoesMateriaisServicos.mockResolvedValue(mockData);

    render(
      <QueryClientProvider client={queryClient}>
        <MateriaisServicosContext.Provider value={{ filter: {}, currentPage: 1 }}>
          <TestComponent />
        </MateriaisServicosContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data-count")).toHaveTextContent("1");
    });

    getEspecificacoesMateriaisServicos.mockResolvedValue(
        { count: 3, results: [{ descricao: "Especificação Teste" }] });

    screen.getByText("Refetch").click();

    await waitFor(() => {
      expect(screen.getByTestId("data-count")).toHaveTextContent("1");
    });
  });
});
