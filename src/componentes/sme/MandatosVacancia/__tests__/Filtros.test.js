import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtros } from "../Filtros";

describe("Filtros (MandatosVacancia)", () => {
    const handleChangeFiltros = jest.fn();
    const handleSubmitFiltros = jest.fn();
    const limpaFiltros = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o campo de filtro por referência com o valor recebido", () => {
        render(
            <Filtros
                stateFiltros={{ filtrar_por_referencia: "2023" }}
                handleChangeFiltros={handleChangeFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
            />
        );

        expect(screen.getByLabelText(/filtrar por referência/i)).toHaveValue("2023");
    });

    it("deve chamar handleChangeFiltros ao digitar no campo", () => {
        render(
            <Filtros
                stateFiltros={{ filtrar_por_referencia: "" }}
                handleChangeFiltros={handleChangeFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
            />
        );

        fireEvent.change(screen.getByLabelText(/filtrar por referência/i), {
            target: { name: "filtrar_por_referencia", value: "2024" },
        });

        expect(handleChangeFiltros).toHaveBeenCalledWith("filtrar_por_referencia", "2024");
    });

    it("deve chamar handleSubmitFiltros ao clicar em Filtrar", () => {
        render(
            <Filtros
                stateFiltros={{ filtrar_por_referencia: "" }}
                handleChangeFiltros={handleChangeFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));

        expect(handleSubmitFiltros).toHaveBeenCalled();
    });

    it("deve chamar limpaFiltros ao clicar em Limpar", () => {
        render(
            <Filtros
                stateFiltros={{ filtrar_por_referencia: "" }}
                handleChangeFiltros={handleChangeFiltros}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /limpar/i }));

        expect(limpaFiltros).toHaveBeenCalled();
    });
});
