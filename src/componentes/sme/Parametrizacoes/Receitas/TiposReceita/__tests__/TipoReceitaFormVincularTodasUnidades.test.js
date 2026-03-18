import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TipoReceitaForm } from "../TipoReceitaForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useGetTipoReceita } from "../hooks/useGetTipoReceita";
import { CustomModalConfirm } from "../../../../../Globais/Modal/CustomModalConfirm";
import userEvent from "@testing-library/user-event";

jest.mock("../../../../../Globais/Modal/CustomModalConfirm", () => ({
  CustomModalConfirm: jest.fn(),
}));
jest.mock("../hooks/useGetTipoReceita", () => ({
  useGetTipoReceita: jest.fn(),
}));
jest.mock("../components/UnidadesAssociadas/Lista", () => ({
  UnidadesVinculadas: () => null,
}));
jest.mock("../components/VincularUnidades", () => ({
  VincularUnidades: () => null,
}));
jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

let queryClient;

const mockStore = createStore(() => ({}));

describe("TipoReceitaForm", () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    useParams.mockReturnValue({ uuid: "uuid-fake" });

    useNavigate.mockReturnValue(mockNavigate);

    useGetTipoReceita.mockReturnValue({
      data: {
        uuid: "uuid-fake",
        id: 1,
        unidades: [{ uuid: "1" }, { uuid: "2" }],
        uso_associacao: "Parcial",
        tipos_conta: [],
        detalhes: [],
      },
      isLoading: false,
    });

    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    useLocation.mockReturnValue({
      state: { selecionar_todas: undefined },
    });
  });

  it("deve abrir modal de confirmação ao marcar 'Todas as unidades'", async () => {
    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <TipoReceitaForm />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>,
    );

    const user = userEvent.setup();

    const checkbox = await screen.findByRole("checkbox", {
      name: /todas as unidades/i,
    });

    await user.click(checkbox);

    expect(CustomModalConfirm).toHaveBeenCalled();
  });
});
