import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filtros } from "../FormFiltros";

describe("Filtros Comissoes DRE", () => {
  const defaultProps = {
    listaComissoes: [
      { id: 1, uuid: "abc", nome: "Comissão A" },
      { id: 2, uuid: "def", nome: "Comissão B" },
    ],
    estadoFiltros: {
      filtrar_por_rf_ou_nome: "",
      filtar_por_comissao: "",
    },
    handleOnChangeFiltros: jest.fn(),
    handleOnSubmitFiltros: jest.fn((e) => e.preventDefault()),
    handleOnLimparFiltros: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<Filtros {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização inicial", () => {
    it("deve renderizar todos os campos e botões", () => {
      renderComponent();

      expect(
        screen.getByLabelText(/filtrar por nome ou rf/i)
      ).toBeInTheDocument();

      expect(
        screen.getByLabelText(/filtrar por comissão/i)
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /limpar/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /filtrar/i })
      ).toBeInTheDocument();
    });

    it("deve renderizar opções do select quando listaComissoes é fornecida", () => {
      renderComponent();

      expect(
        screen.getByRole("option", { name: /selecione a comissão/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", { name: /comissão a/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", { name: /comissão b/i })
      ).toBeInTheDocument();
    });

    it("deve renderizar apenas a opção padrão quando listaComissoes está vazia", () => {
      renderComponent({ listaComissoes: [] });

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1);
    });

    it("deve refletir os valores iniciais do estado", () => {
      renderComponent({
        estadoFiltros: {
          filtrar_por_rf_ou_nome: "João",
          filtar_por_comissao: "abc",
        },
      });

      expect(
        screen.getByLabelText(/filtrar por nome ou rf/i)
      ).toHaveValue("João");

      expect(
        screen.getByLabelText(/filtrar por comissão/i)
      ).toHaveValue("abc");
    });
  });

  describe("Interações do usuário", () => {
    it("deve chamar handleOnChangeFiltros ao digitar no input", async () => {
      const user = userEvent.setup();
      renderComponent();

      const input = screen.getByLabelText(/filtrar por nome ou rf/i);

      await user.type(input, "M");

      expect(defaultProps.handleOnChangeFiltros).toHaveBeenCalled();
      expect(defaultProps.handleOnChangeFiltros).toHaveBeenLastCalledWith(
        "filtrar_por_rf_ou_nome",
        "M"
      );
    });

    it("deve chamar handleOnChangeFiltros ao selecionar uma comissão", async () => {
      const user = userEvent.setup();
      renderComponent();

      const select = screen.getByLabelText(/filtrar por comissão/i);

      await user.selectOptions(select, "abc");

      expect(defaultProps.handleOnChangeFiltros).toHaveBeenCalledWith(
        "filtar_por_comissao",
        "abc"
      );
    });

    it("deve chamar handleOnLimparFiltros ao clicar em limpar", async () => {
      const user = userEvent.setup();
      renderComponent();

      const botaoLimpar = screen.getByRole("button", { name: /limpar/i });

      await user.click(botaoLimpar);

      expect(defaultProps.handleOnLimparFiltros).toHaveBeenCalledTimes(1);
    });

    it("deve submeter o formulário ao clicar em filtrar", async () => {
      const user = userEvent.setup();
      renderComponent();

      const botaoFiltrar = screen.getByRole("button", {
        name: /filtrar/i,
      });

      await user.click(botaoFiltrar);

      expect(defaultProps.handleOnSubmitFiltros).toHaveBeenCalledTimes(1);
    });

    it("deve submeter o formulário ao pressionar Enter", async () => {
      const user = userEvent.setup();
      renderComponent();

      const input = screen.getByLabelText(/filtrar por nome ou rf/i);

      await user.type(input, "{enter}");

      expect(defaultProps.handleOnSubmitFiltros).toHaveBeenCalled();
    });
  });

  describe("Cenários condicionais", () => {
    it("não deve quebrar quando listaComissoes é undefined", () => {
      renderComponent({ listaComissoes: undefined });

      expect(
        screen.getByRole("option", { name: /selecione a comissão/i })
      ).toBeInTheDocument();
    });

    it("deve manter o select vazio quando nenhum valor é selecionado", () => {
      renderComponent({
        estadoFiltros: {
          filtrar_por_rf_ou_nome: "",
          filtar_por_comissao: "",
        },
      });

      const select = screen.getByLabelText(/filtrar por comissão/i);
      expect(select).toHaveValue("");
    });
  });
});