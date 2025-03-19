import { useEffect, React } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";
import { getMotivosRejeicaoEncerramentoConta } from "../../../../../../services/MotivosRejeicaoEncerramentoConta.service";

jest.mock("../../../../../../services/MotivosRejeicaoEncerramentoConta.service");

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
  const { isLoading, isError, data, totalMotivosRejeicao, refetch } = useGetMotivosRejeicao();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data</p>}
      {data && <p data-testid="data-count">{totalMotivosRejeicao}</p>}
      <button onClick={refetch}>Refetch</button>
    </div>
  );
};

describe("Hook useGetMotivosRejeicao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  test("Mostra carregamento inicial", async () => {
    getMotivosRejeicaoEncerramentoConta.mockReturnValue(new Promise(() => {})); 

    render(
      <QueryClientProvider client={queryClient}>
        <MotivosRejeicaoContext.Provider value={{ filter: {}, currentPage: 1 }}>
          <TestComponent />
        </MotivosRejeicaoContext.Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("Resgata dados com sucesso", async () => {
    const mockData = { count: 2, results: [{ nome: "Motivo 1" }, { nome: "Motivo 2" }] };
    getMotivosRejeicaoEncerramentoConta.mockResolvedValueOnce(Promise.resolve(mockData));

    render(
      <QueryClientProvider client={queryClient}>
        <MotivosRejeicaoContext.Provider value={{ filter: {}, currentPage: 1 }}>
          <TestComponent />
        </MotivosRejeicaoContext.Provider>
      </QueryClientProvider>
    );
  
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("data-count")).toHaveTextContent("2");
    });
  });

  
});
