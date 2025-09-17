import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { ClassificarBem } from "../../ClassificarBem/index";

const mockUseNavigate = jest.fn();
const mockCadastrarBem = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useSearchParams: jest.fn(),
}));

jest.mock("../../../../../../services/escolas/Despesas.service", () => ({
  getEspecificacoesCapital: jest.fn(() =>
    Promise.resolve([
      { uuid: "1", descricao: "Bem 1" },
      { uuid: "2", descricao: "Bem 2" },
    ])
  ),
}));

describe("ClassificarBem", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it("Deve chamar cadastrarBens ao clicar em Salvar", async () => {
    const { container } = render(
      <MemoryRouter>
        <ClassificarBem
          items={[
            {
              num_processo_incorporacao: "1111111111111111",
              especificacao_do_bem: "uuid-fake",
              quantidade: 1,
              valor_individual: 1000,
            },
          ]}
          salvar={mockCadastrarBem}
          salvarRascunhoClassificarBens={jest.fn()}
          setBemProduzidoItems={jest.fn()}
          setHabilitaCadastrarBem={jest.fn()}
          habilitaCadastrarBem={true}
          total={1000}
        />
      </MemoryRouter>
    );

    // Submete o formulário diretamente
    const form = container.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCadastrarBem).toHaveBeenCalled();
    });
  });

  it("Não deve chamar salvar se valores inválidos", async () => {
    const mockSalvar = jest.fn();

    render(
      <MemoryRouter>
        <ClassificarBem
          items={[
            {
              num_processo_incorporacao: "",
              especificacao_do_bem: "",
              quantidade: "",
              valor_individual: "",
            },
          ]}
          salvar={mockSalvar}
          salvarRascunhoClassificarBens={jest.fn()}
          setBemProduzidoItems={jest.fn()}
          setHabilitaCadastrarBem={jest.fn()}
          habilitaCadastrarBem={false}
          total={1000}
        />
      </MemoryRouter>
    );

    const buttonSalvar = screen.getByRole("button", {
      name: /Salvar/i,
    });

    fireEvent.click(buttonSalvar);

    await waitFor(() => {
      expect(mockSalvar).not.toHaveBeenCalled();
    });
  });

  it("Deve adicionar formulário na tela quando clicar em adicionar item", async () => {
    render(
      <MemoryRouter>
        <ClassificarBem
          items={[
            {
              num_processo_incorporacao: "",
              especificacao_do_bem: "",
              quantidade: "",
              valor_individual: "",
            },
          ]}
          cadastrarBens={jest.fn()}
          salvarRascunhoClassificarBens={jest.fn()}
          setBemProduzidoItems={jest.fn()}
          setHabilitaCadastrarBem={jest.fn()}
          habilitaCadastrarBem={false}
          total={1000}
        />
      </MemoryRouter>
    );

    const buttonAdicionarItem = screen.getByRole("button", {
      name: "plus Adicionar item",
    });
    fireEvent.click(buttonAdicionarItem);

    expect(screen.queryByText(/Item 2/i)).toBeInTheDocument();
  });

  it("Deve remover formulário da tela quando clicar em remover item", async () => {
    render(
      <MemoryRouter>
        <ClassificarBem
          items={[
            {
              num_processo_incorporacao: "",
              especificacao_do_bem: "",
              quantidade: "",
              valor_individual: "",
            },
          ]}
          cadastrarBens={jest.fn()}
          salvarRascunhoClassificarBens={jest.fn()}
          setBemProduzidoItems={jest.fn()}
          setHabilitaCadastrarBem={jest.fn()}
          habilitaCadastrarBem={false}
          total={1000}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();

    const buttonRemoverItem = screen.getByRole("button", {
      name: "close-circle Remover item",
    });
    fireEvent.click(buttonRemoverItem);

    expect(screen.queryByText(/Item 1/i)).not.toBeInTheDocument();
  });

  it("Deve mostrar erro de validação quando quantidade e/ou valor utilizado igual a zero", async () => {
    render(
      <MemoryRouter>
        <ClassificarBem
          items={[
            {
              num_processo_incorporacao: "",
              especificacao_do_bem: "",
              quantidade: "",
              valor_individual: "",
            },
          ]}
          cadastrarBens={jest.fn()}
          salvarRascunhoClassificarBens={jest.fn()}
          setBemProduzidoItems={jest.fn()}
          setHabilitaCadastrarBem={jest.fn()}
          habilitaCadastrarBem={false}
          total={1000}
        />
      </MemoryRouter>
    );

    const inputQnt = screen.getByRole("spinbutton", {
      name: /Quantidade/i,
    });
    await userEvent.type(inputQnt, "0");

    await waitFor(() => {
      expect(screen.getByText("O valor deve ser maior que 0")).toBeInTheDocument();
    });

    const inputValor = screen.getByRole("spinbutton", {
      name: /Valor Individual/i,
    });

    await userEvent.type(inputValor, "0");

    await waitFor(() => {
      expect(screen.getByText("O valor deve ser maior que 0")).toBeInTheDocument();
    });
  });

  it("Deve formatar o número de processo de incorporação ao digitar", async () => {
    render(
      <MemoryRouter>
        <ClassificarBem
          items={[
            {
              num_processo_incorporacao: "",
              especificacao_do_bem: "",
              quantidade: "",
              valor_individual: "",
            },
          ]}
          cadastrarBens={jest.fn()}
          salvarRascunhoClassificarBens={jest.fn()}
          setBemProduzidoItems={jest.fn()}
          setHabilitaCadastrarBem={jest.fn()}
          habilitaCadastrarBem={false}
          total={1000}
        />
      </MemoryRouter>
    );

    const input = screen.getByRole("spinbutton", {
      name: /Número do processo de incorporação/i,
    });

    await userEvent.type(input, "1111111111111111");

    await waitFor(() => {
      expect(input).toHaveValue("1111.1111/1111111-1");
    });
  });

  it("Deve mostrar o valor total dos bens produzidos", async () => {
    render(
      <MemoryRouter>
        <ClassificarBem
          items={[]}
          cadastrarBens={jest.fn()}
          salvarRascunhoClassificarBens={jest.fn()}
          setBemProduzidoItems={jest.fn()}
          setHabilitaCadastrarBem={jest.fn()}
          habilitaCadastrarBem={false}
          total={1000}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
  });

  it("Deve voltar para a página de listagem ao clicar no botão cancelar", async () => {
    render(
      <MemoryRouter>
        <ClassificarBem
          items={[]}
          cadastrarBens={jest.fn()}
          salvarRascunhoClassificarBens={jest.fn()}
          setBemProduzidoItems={jest.fn()}
          setHabilitaCadastrarBem={jest.fn()}
          habilitaCadastrarBem={false}
          total={0}
        />
      </MemoryRouter>
    );

    const buttonCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(buttonCancelar);

    expect(mockUseNavigate).toHaveBeenCalledWith("/lista-situacao-patrimonial");
  });
});
