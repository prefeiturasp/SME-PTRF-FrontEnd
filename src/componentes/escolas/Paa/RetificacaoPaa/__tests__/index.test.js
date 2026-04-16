import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { RetificacaoPaa } from "../index";
import { useGetPaaRetificacao } from "../../componentes/hooks/useGetPaaRetificacao";
import { PaaContext } from "../../componentes/PaaContext";

// --- Mocks ---

const mockUseParams = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => mockUseParams(),
}));

jest.mock("../../componentes/hooks/useGetPaaRetificacao");

let capturedPaaBaseProps = null;
let capturedContextValue = null;

jest.mock("../../componentes/PaaBase", () => ({
    __esModule: true,
    default: (props) => {
        const { useContext } = require("react");
        const { PaaContext } = require("../../componentes/PaaContext");
        capturedPaaBaseProps = props;
        capturedContextValue = useContext(PaaContext);
        return <div data-testid="paa-base">PaaBase</div>;
    },
}));

let capturedSpinProps = null;
jest.mock("antd", () => ({
    Spin: (props) => {
        capturedSpinProps = props;
        return <div data-testid="spin">{props.children}</div>;
    },
}));

// --- Helpers ---

const mockRefetch = jest.fn();
const mockPaa = { uuid: "paa-uuid-123", status: "EM_RETIFICACAO" };

const setupHook = ({ paa = mockPaa, isFetching = false, refetch = mockRefetch } = {}) => {
    useGetPaaRetificacao.mockReturnValue({ data: paa, isFetching, refetch });
};

// --- Testes ---

describe("RetificacaoPaa", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedPaaBaseProps = null;
        capturedContextValue = null;
        capturedSpinProps = null;
    });

    describe("quando uuid_paa não está nos params", () => {
        beforeEach(() => {
            mockUseParams.mockReturnValue({ uuid_paa: undefined });
            setupHook({ paa: undefined });
        });

        it("não deve renderizar o PaaBase", () => {
            render(<RetificacaoPaa />);
            expect(screen.queryByTestId("paa-base")).not.toBeInTheDocument();
        });

        it("deve chamar useGetPaaRetificacao com undefined", () => {
            render(<RetificacaoPaa />);
            expect(useGetPaaRetificacao).toHaveBeenCalledWith(undefined);
        });
    });

    describe("quando uuid_paa está nos params", () => {
        beforeEach(() => {
            mockUseParams.mockReturnValue({ uuid_paa: "paa-uuid-123" });
            setupHook();
        });

        it("deve chamar useGetPaaRetificacao com o uuid correto", () => {
            render(<RetificacaoPaa />);
            expect(useGetPaaRetificacao).toHaveBeenCalledWith("paa-uuid-123");
        });

        it("deve renderizar o PaaBase dentro do Spin", () => {
            render(<RetificacaoPaa />);
            expect(screen.getByTestId("paa-base")).toBeInTheDocument();
        });

        it("deve passar os itemsBreadCrumb corretos ao PaaBase", () => {
            render(<RetificacaoPaa />);
            expect(capturedPaaBaseProps.itemsBreadCrumb).toEqual([
                { label: "Plano Anual de Atividades", url: "/retificacao-paa" },
                { label: "Elaboração e histórico", active: false },
                { label: "PAA Vigente e Anteriores", active: true },
            ]);
        });

        it("deve prover o paa no PaaContext", () => {
            render(<RetificacaoPaa />);
            expect(capturedContextValue.paa).toBe(mockPaa);
        });

        it("deve prover refetch no PaaContext", () => {
            render(<RetificacaoPaa />);
            expect(capturedContextValue.refetch).toBe(mockRefetch);
        });

        it("deve atualizar o contexto quando paa muda", () => {
            const novoPaa = { uuid: "outro-uuid", status: "PUBLICADO" };
            setupHook({ paa: novoPaa });
            render(<RetificacaoPaa />);
            expect(capturedContextValue.paa).toBe(novoPaa);
        });

    });
});
