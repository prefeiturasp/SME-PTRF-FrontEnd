import { render, screen } from "@testing-library/react";
import { MandatoInfo } from "../MandatoInfo";

import { useGetMandatoVigente } from "../../hooks/useGetMandatoVigente";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";

jest.mock("../../hooks/useGetMandatoVigente");

describe("MandatoInfo", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useDataTemplate();
    });

    it("não deve renderizar informações enquanto estiver carregando", () => {
        useGetMandatoVigente.mockReturnValue({
            isLoading: true,
            data: null,
        });

        const { container } = render(<MandatoInfo />);

        expect(screen.queryByText(/mandato atual/i)).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it("não deve renderizar quando não houver dados", () => {
        useGetMandatoVigente.mockReturnValue({
            isLoading: false,
            data: null,
        });

        const { container } = render(<MandatoInfo />);

        expect(screen.queryByText(/mandato atual/i)).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it("não deve renderizar quando os dados não possuírem uuid", () => {
        useGetMandatoVigente.mockReturnValue({
            isLoading: false,
            data: {
                data_inicial: "2024-01-01",
                data_final: "2024-12-31",
            },
        });

        const { container } = render(<MandatoInfo />);

        expect(screen.queryByText(/mandato atual/i)).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it("deve renderizar as informações do mandato vigente formatadas", () => {
        useGetMandatoVigente.mockReturnValue({
            isLoading: false,
            data: {
                uuid: "123",
                data_inicial: "2024-01-01",
                data_final: "2024-12-31",
            },
        });

        render(<MandatoInfo />);

        expect(screen.getByText(/mandato atual:/i)).toBeInTheDocument();

        expect(
            screen.getByText(
                "01/01/2024 até 31/12/2024",
                { exact: false }
            )
        ).toBeInTheDocument();
    });
});