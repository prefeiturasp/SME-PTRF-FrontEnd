import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DetalheDasPrestacoes from "../DataSaldoBancario/index";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service");

jest.mock('../../../../../componentes/Globais/ReactNumberFormatInput/indexv2', () => ({
  __esModule: true,
  ReactNumberFormatInputV2: ({ onChangeEvent, ...rest }) => (
    <input
      data-testid="react-number-format-mock"
      {...rest}
      onChange={(e) => {
        // Emule o valor que seu componente espera. Se ele espera número, envie número; se string, string.
        const raw = e.target.value;
        const num = Number(raw);
        onChangeEvent && onChangeEvent(Number.isNaN(num) ? raw : num);
      }}
    />
  ),
}));

jest.mock('../../../../../componentes/Globais/ReactNumberFormatInput', () => ({
  __esModule: true,
  ReactNumberFormatInput: (props) => <input data-testid="react-format-input-mock" {...props} />,
}));

const propsBase = {
  dataSaldoBancario: {
    observacao_uuid: "03b8bb62-688c-4ce3-9c39-c57de91c2b85",
    observacao: null,
    saldo_extrato: 317057.99,
    comprovante_extrato: "plano-de-fundo-teams.jpg",
    data_atualizacao_comprovante_extrato: "2025-07-31T17:32:00",
    data_encerramento: null,
    saldo_encerramewnto: null,
    possui_solicitacao_encerramento: false,
    permite_editar_campos_extrato: true,
    data_extrato: "2024-04-30",
  },
  dataSaldoBancarioSolicitacaoEncerramento: {
    data_encerramento: "2025-04-30",
    saldo_encerramewnto: 0,
    possui_solicitacao_encerramento: false,
  },
  checkSalvarExtratoBancario: true,
  valoresPendentes: {
    saldo_anterior: 317057.99,
    saldo_anterior_conciliado: 317057.99,
    saldo_anterior_nao_conciliado: 0,
    receitas_total: 0,
    receitas_conciliadas: 0,
    receitas_nao_conciliadas: 0,
    despesas_total: 0,
    despesas_conciliadas: 0,
    despesas_nao_conciliadas: 0,
    despesas_outros_periodos: 0,
    despesas_outros_periodos_conciliadas: 0,
    despesas_outros_periodos_nao_conciliadas: 0,
    saldo_posterior_total: 317057.99,
    saldo_posterior_conciliado: 317057.99,
    saldo_posterior_nao_conciliado: 0,
  },
  pendenciaSaldoBancario: false,
  salvarExtratoBancario: jest.fn(),
  setShowModalSalvarDataSaldoExtrato: jest.fn(),
  handleChangaDataSaldo: jest.fn(),
};
describe("DetalheDasPrestacoes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockResolvedValueOnce(["change_conciliacao_bancaria"]);
  });

  it("deve abrir o modal quando os valores diferem", () => {
    const props = {
      ...propsBase,
      dataSaldoBancarioSolicitacaoEncerramento: {
        possui_solicitacao_encerramento: true,
      },
    };

    render(<DetalheDasPrestacoes {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /salvar saldo/i }));

    expect(props.setShowModalSalvarDataSaldoExtrato).toHaveBeenCalled();
  });

  it("deve chamar salvarExtratoBancario quando não existe validação de encerramento de conta", () => {
    const props = {
      ...propsBase,
    };

    render(<DetalheDasPrestacoes {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /salvar saldo/i }));

    expect(props.salvarExtratoBancario).toHaveBeenCalled();
  });

  it("deve renderizar ícone de pendências cadastrais quando pendenciaSaldoBancario true", () => {
    const props = {
      ...propsBase,
      pendenciaSaldoBancario: true,
    };

    render(<DetalheDasPrestacoes {...props} />);

    const iconePendencia = screen.getByTestId("icone-data-saldo-bancario-pendentes");

    expect(iconePendencia).toBeInTheDocument();
  });

  it("não deve renderizar ícone de pendências cadastrais quando pendenciaSaldoBancario false", () => {
    const props = {
      ...propsBase,
      pendenciaSaldoBancario: false,
    };

    render(<DetalheDasPrestacoes {...props} />);

    const iconePendencia = screen.queryByTestId("icone-data-saldo-bancario-pendentes");
    expect(iconePendencia).not.toBeInTheDocument();
  });

  it("deve chamar handleChangaDataSaldo ao alterar saldo", async () => {
    const props = {
      ...propsBase,
      permiteEditarCamposExtrato: true,
    };

    render(<DetalheDasPrestacoes {...props} />);

    const input = screen.getByTestId("react-number-format-mock");
    fireEvent.change(input, { target: { value: "1001" } });

    await waitFor(() => {
      expect(props.handleChangaDataSaldo).toHaveBeenCalledWith("saldo_extrato", 1001);
    });
  });

  it("deve exibir todos os inputs com '*'", () => {
    const props = {
      ...propsBase,
    };

    render(<DetalheDasPrestacoes {...props} />);

    expect(screen.getByText("Data *")).toBeInTheDocument();
    expect(screen.getByText("Saldo *")).toBeInTheDocument();
    expect(screen.getByText("Comprovante do saldo da conta *")).toBeInTheDocument();
  });

  it("deve exibir o campo de data extrato sempre desabilitado", () => {
    const props = {
      ...propsBase,
    };

    render(<DetalheDasPrestacoes {...props} />);

    const inputDataExtrato = screen.getByLabelText("Data *");
    expect(inputDataExtrato).toBeDisabled();
  });
});
