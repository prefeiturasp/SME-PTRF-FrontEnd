import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopoComBotoes } from "../TopoComBotoes";

jest.mock("../../../AssociacaoEPeriodoDoCabecalho", () => {
    return function MockedAssociacaoEPeriodoDoCabecalho({ prestacaoDeContas }) {
        return (
            <div data-testid="mock-cabecalho">
                Cabecalho Mockado - Id: {prestacaoDeContas?.id || "Nenhum"}
            </div>
        );
    };
});

jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: () => <span data-testid="font-awesome-icon" />,
}));

describe("<TopoComBotoes />", () => {
    const defaultProps = {
        validaContaAoSalvar: jest.fn(),
        onClickBtnVoltar: jest.fn(),
        prestacaoDeContas: { id: 123, nome: "Prestação de Teste" },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar os elementos iniciais corretamente, incluindo o título e o componente de cabeçalho", () => {
        render(<TopoComBotoes {...defaultProps} />);

        const titulo = screen.getByRole("heading", { name: /ajustes no documento/i });
        expect(titulo).toBeInTheDocument();

        const btnVoltar = screen.getByRole("button", { name: /voltar/i });
        const btnSalvar = screen.getByRole("button", { name: /salvar/i });

        expect(btnVoltar).toBeInTheDocument();
        expect(btnSalvar).toBeInTheDocument();

        const cabecalhoMock = screen.getByTestId("mock-cabecalho");
        expect(cabecalhoMock).toBeInTheDocument();
        expect(cabecalhoMock).toHaveTextContent("Cabecalho Mockado - Id: 123");
    });

    it("deve chamar a função onClickBtnVoltar quando o botão 'Voltar' for clicado", async () => {
        const user = userEvent.setup();
        render(<TopoComBotoes {...defaultProps} />);

        const btnVoltar = screen.getByRole("button", { name: /voltar/i });
        await user.click(btnVoltar);

        expect(defaultProps.onClickBtnVoltar).toHaveBeenCalledTimes(1);
    });

    it("deve chamar a função validaContaAoSalvar quando o botão 'Salvar' for clicado", async () => {
        const user = userEvent.setup();
        render(<TopoComBotoes {...defaultProps} />);

        const btnSalvar = screen.getByRole("button", { name: /salvar/i });
        await user.click(btnSalvar);

        expect(defaultProps.validaContaAoSalvar).toHaveBeenCalledTimes(1);
    });

    it("deve lidar corretamente se o objeto prestacaoDeContas for vazio ou indefinido", () => {
        const propsSemPrestacao = {
            ...defaultProps,
            prestacaoDeContas: undefined,
        };

        render(<TopoComBotoes {...propsSemPrestacao} />);

        const cabecalhoMock = screen.getByTestId("mock-cabecalho");
        expect(cabecalhoMock).toHaveTextContent("Cabecalho Mockado - Id: Nenhum");
    });
});