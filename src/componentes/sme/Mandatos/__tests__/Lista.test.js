import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Lista } from "../components/Lista";
import { ModalForm } from "../components/ModalForm";
import { MandatosContext } from "../context/Mandatos";
import { useGetMandatos } from "../hooks/useGetMandatos";
import { usePostMandato } from "../hooks/usePostMandato";
import { usePatchMandato } from "../hooks/usePatchMandato";
import { useDeleteMandato } from "../hooks/useDeleteMandato";
// import { mockData } from "../__fixtures__/mockData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn(() => ({})), // Mock do estado do Redux
}));

// Mock das hooks
jest.mock("../hooks/useGetMandatos");
jest.mock("../hooks/usePostMandato");
jest.mock("../hooks/usePatchMandato");
jest.mock("../hooks/useDeleteMandato");

const mockSetStateFormModal = jest.fn();
const mockSetShowModalForm = jest.fn();
const mockSetBloquearBtnSalvarForm = jest.fn();
const mockforceLoading = false;

const stateFormCreate = {
    referencia: "Referencia 123",
    data_inicial: "2025-04-01",
    data_final: "2025-04-11",
    editavel: true,
    data_inicial_proximo_mandato: "2025-04-15",
    uuid: "uuid",
    id: 1,
    limite_min_data_inicial: ""
}

const context = {
    setShowModalForm: mockSetShowModalForm,
    stateFormModal: stateFormCreate,
    setStateFormModal: mockSetStateFormModal,
    setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
    forceLoading: mockforceLoading,
}

describe("Lista", () => {

    const mockMutationPost = { mutate: jest.fn() };
    const mockMutationPatch = { mutate: jest.fn() };
    const mockMutationDelete = { mutate: jest.fn() };
    beforeEach(() => {
      useGetMandatos.mockReturnValue({
            isLoading: false,
      refetch: jest.fn(),
      data: {results: [
        {
          referencia_mandato: "Referencia 1",
          data_inicial: "2025-04-01",
          data_final: "2025-04-11",
          editavel: true,
          data_inicial_proximo_mandato: "2025-04-15", 
          uuid: "uuid1", id: 1, 
          limite_min_data_inicial: ""}
      ]}
    });

    usePostMandato.mockReturnValue({ mutationPost: mockMutationPost});
    usePatchMandato.mockReturnValue({ mutationPatch: mockMutationPatch });
    useDeleteMandato.mockReturnValue({ mutationDelete: mockMutationDelete });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MandatosContext.Provider value={context}>
          <Lista />
        </MandatosContext.Provider>
      </QueryClientProvider>
    );
  };

  it("deve renderizar a tabela com dados", () => {
    renderComponent();

    // Verifica se os dois primeiros registros da lista aparecem
    expect(screen.getByText("Referencia 1")).toBeInTheDocument();
    expect(useGetMandatos).toHaveBeenCalled();

  });

  it("Valida quando nenhum registro foi carregado", () => {
    useGetMandatos.mockReturnValue({
      isLoading: false,
      refetch: jest.fn(),
      data: {results: []}
    });
    renderComponent();
    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve abrir o modal de edição quando clicar no botão editar", async () => {
    renderComponent();

    const botaoEditar = screen.getByRole("button", { selector: ".btn-editar-membro" });
    fireEvent.click(botaoEditar);

    expect(mockSetStateFormModal).toHaveBeenCalledTimes(1);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });

});
