import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RenderSecao } from "../RenderSecao";

const mockPatchPaa = jest.fn();

jest.mock("../hooks/usePatchPaa", () => ({
  usePatchPaa: () => ({
    patchPaa: mockPatchPaa,
    patchPaaAsync: mockPatchPaa,
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: null,
    error: null,
    reset: jest.fn(),
  }),
}));

jest.mock("../RelSecaoTextos", () => ({
  RelSecaoTextos: ({ handleSalvarTexto }) => (
    <div>
      <button data-testid="btn-call-save" onClick={() => handleSalvarTexto("texto_introducao", "<p>novo texto</p>")}>
        Salvar mock
      </button>
    </div>
  ),
}));

jest.mock("../RelSecaoObjetivos", () => ({
  RelSecaoObjetivos: ({ onSalvarObjetivos }) => (
    <div>
      <button data-testid="btn-call-save" onClick={() => onSalvarObjetivos([{ nome: "Novo objetivo" }])}>
        Salvar objetivos mock
      </button>
    </div>
  ),
}));

describe("RenderSecao", () => {
  const baseProps = {
    secaoKey: "introducao",
    config: {
      titulo: "Introdução",
      chave: "introducao",
      temEditor: true,
      campoPaa: "texto_introducao",
      textosPaa: ["introducao_do_paa_ue_1", "introducao_do_paa_ue_2"],
    },
    isExpanded: true,
    toggleSection: jest.fn(),
    textosPaa: {},
    isLoading: false,
    isError: false,
    isLoadingPaa: false,
    paaVigente: { uuid: "123" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it("renderiza o título e botão de toggle", () => {
    render(<RenderSecao {...baseProps} />);
    expect(screen.getByText("Introdução")).toBeInTheDocument();
  });

  it("mostra loading quando isLoading = true", () => {
    render(<RenderSecao {...baseProps} isLoading />);
    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it("mostra erro quando isError = true", () => {
    render(<RenderSecao {...baseProps} isError />);
    expect(screen.getByText(/Erro ao carregar textos do PAA/i)).toBeInTheDocument();
  });

  it("chama toggleSection ao clicar no botão", () => {
    const { container } = render(<RenderSecao {...baseProps} />);
    const btn = container.querySelector(".btn-dropdown");
    fireEvent.click(btn);
    expect(baseProps.toggleSection).toHaveBeenCalledWith("introducao");
  });

  it("chama handleSalvarTexto quando clicar em salvar nas seções de texto", async () => {
    mockPatchPaa.mockResolvedValueOnce({});

    const props = {
      ...baseProps,
      paaVigente: { uuid: "uuid-123" },
    };

    render(<RenderSecao {...props} />);

    const btn = screen.getByRole("button", { name: "Salvar mock" });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockPatchPaa).toHaveBeenCalled();
    });
  });

  it("chama handleSalvarObjetivos quando clicar em salvar na seção de objetivos", async () => {
    mockPatchPaa.mockResolvedValueOnce({});

    const props = {
      ...baseProps,
      config: {
        chave: "objetivos",
        temEditor: false,
      },
      secaoKey: "objetivos",
      paaVigente: { uuid: "uuid-123" },
    };

    render(<RenderSecao {...props} />);

    const btn = screen.getByRole("button", { name: "Salvar objetivos mock" });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockPatchPaa).toHaveBeenCalled();
    });
  });

  it("não tenta salvar quando paaVigente não possui uuid", async () => {
    mockPatchPaa.mockResolvedValueOnce({});

    const props = {
      ...baseProps,
      paaVigente: {},
    };

    render(<RenderSecao {...props} />);

    const btn = screen.getByRole("button", { name: "Salvar mock" });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockPatchPaa).not.toHaveBeenCalled();
    });
  });
});
