import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import DetalhamentoRecursosProprios from "../index";
import { combineReducers, createStore } from "redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetRecursosProprios } from "../hooks/useGetRecursosProprios";
import Modal from "../../../../../../../componentes/Globais/Modal/Modal";
import { Modal as modalReducer } from "../../../../../../../store/reducers/componentes/Globais/Modal/reducer";
import { usePostRecursoProprio } from "../hooks/usePostRecursoProprio";
import { usePatchRecursoProprio } from "../hooks/usePatchRecursoProprio";
import { useGetFontesRecursos } from "../hooks/useGetFontesRecursos";

jest.mock("../hooks/useGetRecursosProprios");
jest.mock("../hooks/usePostRecursoProprio");
jest.mock("../hooks/usePatchRecursoProprio");
jest.mock("../hooks/useGetFontesRecursos");
jest.mock("antd/es/date-picker/locale/pt_BR", () => ({}));

let queryClient;

const rootReducer = combineReducers({
  Modal: modalReducer,
});

const mockStore = createStore(rootReducer);

const mockMutatePost = jest.fn();
const mockMutatePatch = jest.fn();

describe("DetalhamentoRecursosProprios Component", () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    usePostRecursoProprio.mockReturnValue({
      mutationPost: { mutate: mockMutatePost },
    });
    usePatchRecursoProprio.mockReturnValue({
      mutationPatch: { mutate: mockMutatePatch },
    });
    useGetFontesRecursos.mockReturnValue({
      data: [
        {
          id: 4,
          uuid: "UUID-fake-fonte-recurso",
          nome: "Doações",
        },
      ],
      isLoading: true,
    });
  });

  it("adicionar nova linha na tabela com inputs ao clicar no botão 'Adicionar fonte de recurso'", async () => {
    useGetRecursosProprios.mockReturnValue({
      data: { results: [] },
      count: 0,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <DetalhamentoRecursosProprios />
        </QueryClientProvider>
      </Provider>
    );

    const botaoAdd = screen.getByRole("button", {
      name: /Adicionar fonte de recurso/,
    });
    fireEvent.click(botaoAdd);

    const textboxes = screen.getAllByRole("textbox");

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", {
        name: /valor/,
      })
    ).toBeInTheDocument();
    expect(textboxes[0]).toHaveAttribute("placeholder", "Data prevista");
    expect(textboxes[1]).toHaveAttribute(
      "placeholder",
      "Descrição de atividade prevista"
    );
  });

  it("remover nova linha na tabela com inputs ao clicar no botão de Excluir", async () => {
    useGetRecursosProprios.mockReturnValue({
      data: { results: [] },
      count: 0,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <DetalhamentoRecursosProprios />
        </QueryClientProvider>
      </Provider>
    );

    const botaoAdd = screen.getByRole("button", {
      name: /Adicionar fonte de recurso/,
    });
    fireEvent.click(botaoAdd);

    const combobox = screen.getByRole("combobox");

    const botaoExcluir = screen.getByRole("button", {
      name: /Excluir/,
    });
    fireEvent.click(botaoExcluir);

    expect(combobox).not.toBeInTheDocument();
  });

  it("substituir linha da tabela por inputs ao clicar em editar", async () => {
    useGetRecursosProprios.mockReturnValue({
      data: {
        results: [
          {
            id: 7,
            uuid: "UUID-fake-recurso-proprio",
            associacao: "UUID-fake-associacao",
            fonte_recurso: {
              id: 2,
              uuid: "UUID-fake-fonte-recurso",
              nome: "Campanhas sem Arrecadação",
            },
            data_prevista: "2025-04-16",
            descricao: "teste",
            valor: 1000,
          },
        ],
      },
      count: 1,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <DetalhamentoRecursosProprios />
        </QueryClientProvider>
      </Provider>
    );

    const botaoEditar = screen.getByRole("button", {
      name: /Editar/,
    });
    fireEvent.click(botaoEditar);

    const textboxes = screen.getAllByRole("textbox");

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", {
        name: /valor/,
      })
    ).toBeInTheDocument();
    expect(textboxes[0]).toHaveAttribute("placeholder", "Data prevista");
    expect(textboxes[1]).toHaveAttribute(
      "placeholder",
      "Descrição de atividade prevista"
    );
  });

  it("abrir modal de confirmação de exclusão para recurso existente", async () => {
    useGetRecursosProprios.mockReturnValue({
      data: {
        results: [
          {
            id: 7,
            uuid: "UUID-fake-recurso-proprio",
            associacao: "UUID-fake-associacao",
            fonte_recurso: {
              id: 2,
              uuid: "UUID-fake-fonte-recurso",
              nome: "Campanhas sem Arrecadação",
            },
            data_prevista: "2025-04-16",
            descricao: "teste",
            valor: 1000,
          },
        ],
      },
      count: 1,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <DetalhamentoRecursosProprios />
          <Modal />
        </QueryClientProvider>
      </Provider>
    );

    const botaoEditar = screen.getByRole("button", {
      name: /Editar/,
    });
    fireEvent.click(botaoEditar);

    const botaoExcluir = screen.getByRole("button", {
      name: /Excluir/,
    });
    fireEvent.click(botaoExcluir);

    await waitFor(() => {
      expect(
        screen.getByText("Tem certeza que deseja excluir esse recurso próprio?")
      ).toBeInTheDocument();
    });
  });

  it("chama hook de atualizar registro ao clicar em salvar", async () => {
    useGetRecursosProprios.mockReturnValue({
      data: {
        results: [
          {
            id: 7,
            uuid: "UUID-fake-recurso-proprio",
            associacao: "UUID-fake-associacao",
            fonte_recurso: {
              id: 2,
              uuid: "UUID-fake-fonte-recurso",
              nome: "Campanhas sem Arrecadação",
            },
            data_prevista: "2025-04-16",
            descricao: "teste",
            valor: 1000,
          },
        ],
      },
      count: 1,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <DetalhamentoRecursosProprios />
        </QueryClientProvider>
      </Provider>
    );

    const botaoEditar = screen.getByRole("button", {
      name: /Editar/,
    });
    fireEvent.click(botaoEditar);

    const botaoSalvar = screen.getByRole("button", {
      name: "Salvar",
    });
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(mockMutatePatch).toHaveBeenCalled();
    });
  });

  it("chama hook de criar registro ao clicar em salvar", async () => {
    useGetRecursosProprios.mockReturnValue({
      data: {
        results: [],
      },
      count: 1,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <DetalhamentoRecursosProprios />
        </QueryClientProvider>
      </Provider>
    );

    const botaoAdd = screen.getByRole("button", {
      name: /Adicionar fonte de recurso/,
    });
    fireEvent.click(botaoAdd);

    const selects = await screen.findAllByRole("combobox");
    const textboxes = screen.getAllByRole("textbox");
    const inputDatepicker = screen.getByPlaceholderText("Data prevista");
    inputDatepicker.style.pointerEvents = "auto";
    const inputNumber = screen.getByRole("spinbutton", {
      name: /valor/,
    });

    selects[0].style.pointerEvents = "auto";
    userEvent.click(selects[0]);
    const option = await screen.findByText("Doações");
    userEvent.click(option);

    // simulação de change no componente DatePickerField
    await userEvent.clear(inputDatepicker);
    await userEvent.click(inputDatepicker);
    await userEvent.type(inputDatepicker, "01/01/2025");
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    fireEvent.change(textboxes[1], {
      target: { value: "Descrição" },
    });

    fireEvent.change(inputNumber, {
      target: { value: 1000 },
    });

    const botaoSalvar = screen.getByRole("button", {
      name: "Salvar",
    });
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(mockMutatePost).toHaveBeenCalled();
    });
  });
});
