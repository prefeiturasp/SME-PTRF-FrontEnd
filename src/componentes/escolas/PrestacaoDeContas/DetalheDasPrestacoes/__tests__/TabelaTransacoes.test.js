import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TabelaTransacoes from "../TabelaTransacoes/index";
import { visoesService } from "../../../../../services/visoes.service";
import {
  mockTabelaDespesas,
  mockTransasoes,
  mockTransasoesCredito,
  mockTransasoesDebito,
} from "../__fixtures__/mockData";

const mockUseNavigate = jest.fn();

jest.mock("../../../../../services/visoes.service");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
}));

describe("TabelaTransacoes", () => {
  const mockAssign = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: {
        assign: mockAssign,
      },
      writable: true,
    });

    mockAssign.mockClear();

    visoesService.getPermissoes.mockResolvedValueOnce(["change_conciliacao_bancaria"]);
  });

  it("deve renderizar <Loading/> se loading for true", () => {
    render(
      <MemoryRouter>
        <TabelaTransacoes />
      </MemoryRouter>
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve renderizar vazio se loading for false e não houver transações", () => {
    render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={[]} />
      </MemoryRouter>
    );
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    expect(screen.queryByText("Conciliada")).not.toBeInTheDocument();
  });

  it("deve renderizar tabela se loading for false e houver transações", () => {
    render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoes} />
      </MemoryRouter>
    );

    expect(screen.getByText("Conciliada")).toBeInTheDocument();
  });

  it("deve renderizar linha expandida quando clicar na seta de expansão", () => {
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoes} tabelasDespesa={mockTabelaDespesas} />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    expect(screen.getByText("Despesa 1")).toBeInTheDocument();
  });

  it("deve renderizar linha expandida quando clicar na seta de expansão", () => {
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoes} tabelasDespesa={mockTabelaDespesas} />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    expect(screen.getByText("Despesa 1")).toBeInTheDocument();
  });

  it("deve renderizar 'Número do cheque' na linha expandida quando tipo de transação for cheque", () => {
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoes} tabelasDespesa={mockTabelaDespesas} />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    expect(screen.getByText("Número do cheque")).toBeInTheDocument();
  });

  it("deve renderizar 'Número do documento' na linha expandida quando tipo de transação não for cheque", () => {
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoesDebito} tabelasDespesa={mockTabelaDespesas} />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    expect(screen.getByText("Número do documento")).toBeInTheDocument();
  });

  it("deve abrir modal de confirmação de redirecionamento para detalhe da despesa ao clicar em Editar Lançamento", async () => {
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoesDebito} tabelasDespesa={mockTabelaDespesas} />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    const buttonEditar = await screen.findByRole("button", { name: /Editar Lançamento/i });
    fireEvent.click(buttonEditar);

    expect(
      screen.getByText("Você será direcionado para a página de edição desse lançamento, deseja continuar?")
    ).toBeInTheDocument();
  });

  it("deve fechar modal de confirmação de redirecionamento para detalhe da despesa ao clicar em 'Não'", async () => {
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoesDebito} tabelasDespesa={mockTabelaDespesas} />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    const buttonEditar = await screen.findByRole("button", { name: /Editar Lançamento/i });
    fireEvent.click(buttonEditar);

    const buttonNao = await screen.findByRole("button", { name: /Não/i });
    fireEvent.click(buttonNao);

    expect(
      screen.queryAllByAltText("Você será direcionado para a página de edição desse lançamento, deseja continuar?")
    ).toStrictEqual([]);
  });

  it("deve abrir modal de confirmação de redirecionamento para detalhe do crédito ao clicar em Editar Lançamento", async () => {
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoesCredito} tabelasDespesa={mockTabelaDespesas} />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    const buttonEditar = await screen.findByRole("button", { name: /Editar Lançamento/i });
    fireEvent.click(buttonEditar);

    expect(
      screen.getByText("Você será direcionado para a página de edição desse lançamento, deseja continuar?")
    ).toBeInTheDocument();
  });

  it("deve redirecionar para página de detalhe do crédito ao confirmar redirecionamento no modal", async () => {
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes loading={false} transacoes={mockTransasoesCredito} tabelasDespesa={mockTabelaDespesas} />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    const buttonEditar = await screen.findByRole("button", { name: /Editar Lançamento/i });
    fireEvent.click(buttonEditar);

    const buttonConfirmar = await screen.findByRole("button", { name: /Sim, leve-me à página de edição/i });
    fireEvent.click(buttonConfirmar);

    expect(mockUseNavigate).toHaveBeenCalled();
  });

  it("deve chamar handleChangeCheckboxTransacoes ao clicar no checkbox de conferido", async () => {
    const mockHandleChangeCheckboxTransacoes = jest.fn();
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes
          loading={false}
          transacoes={mockTransasoesDebito}
          tabelasDespesa={mockTabelaDespesas}
          handleChangeCheckboxTransacoes={mockHandleChangeCheckboxTransacoes}
        />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    const buttonConferido = await screen.getByTestId("checkConferido");
    fireEvent.click(buttonConferido);

    expect(mockHandleChangeCheckboxTransacoes).toHaveBeenCalled();
  });

  it("deve chamar handleChangeCheckboxTransacoes ao clicar no checkbox de conferido do rateio", async () => {
    const mockHandleChangeCheckboxTransacoes = jest.fn();
    const { container } = render(
      <MemoryRouter>
        <TabelaTransacoes
          loading={false}
          transacoes={mockTransasoesDebito}
          tabelasDespesa={mockTabelaDespesas}
          handleChangeCheckboxTransacoes={mockHandleChangeCheckboxTransacoes}
        />
      </MemoryRouter>
    );
    const buttonCollapse = container.querySelector(".p-row-toggler");
    fireEvent.click(buttonCollapse);

    const buttonConferido = await screen.getByTestId("checkConferidoRateio");
    fireEvent.click(buttonConferido);

    expect(mockHandleChangeCheckboxTransacoes).toHaveBeenCalled();
  });
});
