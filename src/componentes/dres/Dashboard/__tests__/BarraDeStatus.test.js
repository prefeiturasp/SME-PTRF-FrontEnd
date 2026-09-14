import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BarraDeStatus } from "../BarraDeStatus";

describe("BarraDeStatus", () => {
    it("exibe o total de associações da diretoria", () => {
        render(
            <BarraDeStatus
                itensDashboard={{ total_associacoes_dre: 12 }}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        expect(screen.getByText(/Total de associações da Diretoria:/)).toBeInTheDocument();
        expect(screen.getByText("12 unidades")).toBeInTheDocument();
    });

    it("não quebra quando itensDashboard não possui total_associacoes_dre", () => {
        render(
            <BarraDeStatus
                itensDashboard={{}}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        expect(screen.getByText(/Total de associações da Diretoria:/)).toBeInTheDocument();
    });

    it("chama handleClickVerPrestacaoes com 'TODOS' ao clicar no botão", () => {
        const handleClickVerPrestacaoes = jest.fn();

        render(
            <BarraDeStatus
                itensDashboard={{ total_associacoes_dre: 12 }}
                handleClickVerPrestacaoes={handleClickVerPrestacaoes}
            />
        );

        fireEvent.click(screen.getByText("Ver todas as prestações"));

        expect(handleClickVerPrestacaoes).toHaveBeenCalledWith("TODOS");
    });
});
