import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CancelarRetificacao from "../index";
import { visoesService } from "../../../../../../services/visoes.service";
import { usePostCancelarRetificacaoPaa } from "../hooks/usePostCancelarRetificacao";

const mockNavigate = jest.fn();
const mockMutateAsync = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../../../../services/visoes.service", () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(),
  },
}));

jest.mock("../hooks/usePostCancelarRetificacao", () => ({
  usePostCancelarRetificacaoPaa: jest.fn(),
}));

const defaultProps = {
  paa: {
    uuid: "123-uuid",
    status: "EM_RETIFICACAO",
  },
};

const renderComponent = (props = defaultProps) =>
  render(
    <MemoryRouter>
      <CancelarRetificacao {...props} />
    </MemoryRouter>,
  );

describe("CancelarRetificacao", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    visoesService.featureFlagAtiva.mockReturnValue(true);

    usePostCancelarRetificacaoPaa.mockReturnValue({
      mutationPost: {
        mutateAsync: mockMutateAsync,
        isPending: false,
      },
    });
  });

  it("deve renderizar botão de cancelar retificação", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: /cancelar retificação/i,
      }),
    ).toBeInTheDocument();
  });

  it("não deve renderizar componente quando feature flag estiver desativada", () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);

    renderComponent();

    expect(
      screen.queryByRole("button", {
        name: /cancelar retificação/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("não deve renderizar componente quando status for diferente de EM_RETIFICACAO", () => {
    renderComponent({
      paa: {
        uuid: "123",
        status: "RASCUNHO",
      },
    });

    expect(
      screen.queryByRole("button", {
        name: /cancelar retificação/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("deve abrir modal ao clicar em cancelar retificação", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /cancelar retificação/i,
      }),
    );

    expect(screen.getByText(/ao cancelar, as alterações/i)).toBeInTheDocument();
  });

  it("deve fechar modal ao clicar em voltar", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /cancelar retificação/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /voltar/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/ao cancelar, as alterações/i),
      ).not.toBeInTheDocument();
    });
  });

  it("deve chamar mutation ao confirmar cancelamento", async () => {
    mockMutateAsync.mockResolvedValue({});

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /cancelar retificação/i,
      }),
    );

    const modal = screen.getByRole("dialog");

    fireEvent.click(
      within(modal).getByRole("button", {
        name: /^cancelar retificação$/i,
      }),
    );

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        paaUuid: "123-uuid",
      });
    });
  });

  it("deve navegar após sucesso da mutation", async () => {
    mockMutateAsync.mockResolvedValue({});

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /cancelar retificação/i,
      }),
    );

    const modal = screen.getByRole("dialog");

    fireEvent.click(
      within(modal).getByRole("button", {
        name: /^cancelar retificação$/i,
      }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/paa-vigente-e-anteriores");
    });
  });

  it("deve desabilitar botões quando mutation estiver pending", () => {
    usePostCancelarRetificacaoPaa.mockReturnValue({
      mutationPost: {
        mutateAsync: mockMutateAsync,
        isPending: true,
      },
    });

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /cancelar retificação/i,
      }),
    );

    const modal = screen.getByRole("dialog");

    expect(
      within(modal).getByRole("button", {
        name: /voltar/i,
      }),
    ).toBeDisabled();

    expect(
      within(modal).getByRole("button", {
        name: /cancelando/i,
      }),
    ).toBeDisabled();
  });

  it("não deve fechar modal ao clicar em voltar durante loading", () => {
    usePostCancelarRetificacaoPaa.mockReturnValue({
      mutationPost: {
        mutateAsync: mockMutateAsync,
        isPending: true,
      },
    });

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /cancelar retificação/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /voltar/i,
      }),
    );

    expect(screen.getByText(/ao cancelar, as alterações/i)).toBeInTheDocument();
  });

  it("deve tratar erro da mutation sem quebrar componente", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockMutateAsync.mockRejectedValue(new Error("erro"));

    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: /cancelar retificação/i,
      }),
    );

    const modal = screen.getByRole("dialog");

    fireEvent.click(
      within(modal).getByRole("button", {
        name: /^cancelar retificação$/i,
      }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
