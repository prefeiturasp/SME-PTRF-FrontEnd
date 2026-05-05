import { render, screen, fireEvent } from "@testing-library/react";
import { ListaComissoes } from "../ListaComissoes";

jest.mock("primereact/datatable", () => {
  const React = require("react");

  return {
    DataTable: ({ value, children }) => {
      const columns = React.Children.toArray(children);

      return (
        <table>
          <tbody>
            {value.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.props.body
                      ? col.props.body(row)
                      : row[col.props.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
  };
});

jest.mock("primereact/column", () => ({
  Column: (props) => props,
}));

jest.mock("../../../../../utils/Loading", () => () => (
  <div role="status">Carregando...</div>
));

jest.mock("../../../../Globais/Mensagens/MsgImgLadoDireito", () => ({
  MsgImgLadoDireito: ({ texto }) => <div>{texto}</div>,
}));

jest.mock("../../../../Globais/UI/Button", () => ({
  EditIconButton: ({ disabled, onClick }) => (
    <button onClick={onClick} disabled={disabled}>
      Editar
    </button>
  ),
}));

const mockGetPermissoes = jest.fn();

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: (...args) => mockGetPermissoes(...args),
  },
}));

describe("ListaComissoes Comissões DRE", () => {
  const defaultProps = {
    membrosComissao: [],
    loadingMembrosComissao: false,
    handleOnShowModalEdicao: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve mostrar loading quando está carregando e não há dados", () => {
    render(
      <ListaComissoes
        {...defaultProps}
        loadingMembrosComissao={true}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent("Carregando...");
  });

  it("deve mostrar mensagem de vazio quando não há membros e não está carregando", () => {
    render(<ListaComissoes {...defaultProps} />);

    expect(
      screen.getByText("Não encontramos nenhum membro com comissões")
    ).toBeInTheDocument();
  });

  it("deve renderizar tabela com dados quando há membros", () => {
    mockGetPermissoes.mockReturnValue(true);

    const membros = [
      {
        rf: "123",
        nome: "João Silva",
        email: "joao@email.com",
        comissoes: [{ id: 1, nome: "Comissão A" }],
      },
    ];

    render(
      <ListaComissoes
        {...defaultProps}
        membrosComissao={membros}
      />
    );

    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Comissão A")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /editar/i })).toBeInTheDocument();
  });

  it("deve renderizar múltiplas comissões", () => {
    mockGetPermissoes.mockReturnValue(true);

    const membros = [
      {
        rf: "123",
        nome: "João Silva",
        email: "joao@email.com",
        comissoes: [
          { id: 1, nome: "Comissão A" },
          { id: 2, nome: "Comissão B" },
        ],
      },
    ];

    render(
      <ListaComissoes
        {...defaultProps}
        membrosComissao={membros}
      />
    );

    expect(screen.getByText("Comissão A")).toBeInTheDocument();
    expect(screen.getByText("Comissão B")).toBeInTheDocument();
  });

  it("não deve quebrar quando não há comissões", () => {
    mockGetPermissoes.mockReturnValue(true);

    const membros = [
      {
        rf: "123",
        nome: "João Silva",
        email: "joao@email.com",
        comissoes: null,
      },
    ];

    render(
      <ListaComissoes
        {...defaultProps}
        membrosComissao={membros}
      />
    );

    expect(screen.getByText("João Silva")).toBeInTheDocument();
  });

  it("deve desabilitar botão de edição quando não tem permissão", () => {
    mockGetPermissoes.mockReturnValue(false);

    const membros = [
      {
        rf: "123",
        nome: "João Silva",
        email: "joao@email.com",
        comissoes: [],
      },
    ];

    render(
      <ListaComissoes
        {...defaultProps}
        membrosComissao={membros}
      />
    );

    const button = screen.getByRole("button", { name: /editar/i });

    expect(button).toBeDisabled();
  });

  it("deve habilitar botão de edição quando tem permissão", () => {
    mockGetPermissoes.mockReturnValue(true);

    const membros = [
      {
        rf: "123",
        nome: "João Silva",
        email: "joao@email.com",
        comissoes: [],
      },
    ];

    render(
      <ListaComissoes
        {...defaultProps}
        membrosComissao={membros}
      />
    );

    const button = screen.getByRole("button", { name: /editar/i });

    expect(button).toBeEnabled();
  });

  it("deve chamar handleOnShowModalEdicao ao clicar no botão", () => {
    mockGetPermissoes.mockReturnValue(true);

    const handleClick = jest.fn();

    const membros = [
      {
        rf: "123",
        nome: "João Silva",
        email: "joao@email.com",
        comissoes: [],
      },
    ];

    render(
      <ListaComissoes
        {...defaultProps}
        membrosComissao={membros}
        handleOnShowModalEdicao={handleClick}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /editar/i }));

    expect(handleClick).toHaveBeenCalledWith(membros[0]);
  });

  it("deve lidar corretamente com múltiplas linhas", () => {
    mockGetPermissoes.mockReturnValue(true);

    const membros = [
      {
        rf: "1",
        nome: "João",
        email: "joao@email.com",
        comissoes: [],
      },
      {
        rf: "2",
        nome: "Maria",
        email: "maria@email.com",
        comissoes: [],
      },
    ];

    render(
      <ListaComissoes
        {...defaultProps}
        membrosComissao={membros}
      />
    );

    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });
});