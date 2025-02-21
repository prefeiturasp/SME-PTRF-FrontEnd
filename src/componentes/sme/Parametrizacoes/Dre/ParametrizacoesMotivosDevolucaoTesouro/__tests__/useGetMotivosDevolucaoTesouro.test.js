import { useEffect, React } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { useGetMotivosDevolucaoTesouro } from "../hooks/useGetMotivosDevolucaoTesouro";
import { getMotivosDevolucaoTesouro } from "../../../../../../services/sme/Parametrizacoes.service";

jest.mock("../../../../../../services/sme/Parametrizacoes.service");

// Criar um QueryClient para os testes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Desativar tentativas automáticas para evitar re-fetchs
    },
  },
});

// Criar um componente de teste que usa o hook
const TestComponent = () => {
  const { isLoading, isError, data, totalMotivosDevolucaoTesouro, refetch } = useGetMotivosDevolucaoTesouro();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data</p>}
      {data && <p data-testid="data-count">{totalMotivosDevolucaoTesouro}</p>}
      <button onClick={refetch}>Refetch</button>
    </div>
  );
};

describe("Hook useGetMotivosDevolucaoTesouro", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  test("Mostra carregamento inicial", async () => {
    getMotivosDevolucaoTesouro.mockReturnValue(new Promise(() => {})); 

    render(
      <QueryClientProvider client={queryClient}>
        <MotivosDevolucaoTesouroContext.Provider value={{ filter: {}, currentPage: 1 }}>
          <TestComponent />
        </MotivosDevolucaoTesouroContext.Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("Resgata dados com sucesso", async () => {
    const mockData = { count: 2, results: [{ nome: "Motivo 1" }, { nome: "Motivo 2" }] };
    getMotivosDevolucaoTesouro.mockResolvedValueOnce(Promise.resolve(mockData));

    render(
      <QueryClientProvider client={queryClient}>
        <MotivosDevolucaoTesouroContext.Provider value={{ filter: {}, currentPage: 1 }}>
          <TestComponent />
        </MotivosDevolucaoTesouroContext.Provider>
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
    getMotivosDevolucaoTesouro.mockResolvedValue(mockData);

    render(
      <QueryClientProvider client={queryClient}>
        <MotivosDevolucaoTesouroContext.Provider value={{ filter: {}, currentPage: 1 }}>
          <TestComponent />
        </MotivosDevolucaoTesouroContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("data-count")).toHaveTextContent("1");
    });

    getMotivosDevolucaoTesouro.mockResolvedValue({ count: 3, results: [{ nome: "Novo Motivo" }] });

    screen.getByText("Refetch").click();

    await waitFor(() => {
      expect(screen.getByTestId("data-count")).toHaveTextContent("3");
    });
  });
});
