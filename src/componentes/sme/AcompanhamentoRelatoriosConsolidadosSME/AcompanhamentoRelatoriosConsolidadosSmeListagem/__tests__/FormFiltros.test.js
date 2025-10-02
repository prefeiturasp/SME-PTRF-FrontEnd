import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormFiltros } from "../FormFiltros";

jest.mock("antd", () => {
    const Select = ({ children, value, onChange, id, ...props }) => (
        <select
            id={id}
            name={id}
            multiple
            data-testid="multiselect"
            value={value}
            onChange={(e) => {
                const values = Array.from(e.target.options)
                    .filter((opt) => opt.selected)
                    .map((opt) => opt.value);
                onChange(values);
            }}
            {...props}
        >
            {children}
        </select>
    );

    Select.Option = ({ children, value }) => (
        <option value={value}>{children}</option>
    );

    return { Select };
});

describe("FormFiltros", () => {
    const mockHandleChangeFiltros = jest.fn();
    const mockHandleChangeSelectStatusPc = jest.fn();
    const mockHandleLimpaFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();

    const defaultProps = {
        stateFiltros: {
            filtrar_por_dre: "",
            filtrar_por_tipo_de_relatorio: "",
        },
        selectedStatusPc: [],
        listaFiltroDre: [
            { uuid: "1", nome: "DRE Norte" },
            { uuid: "2", nome: "DRE Sul" },
        ],
        listaFiltroTipoRelatorio: [
            { id: "A", nome: "Relatório Anual" },
            { id: "M", nome: "Relatório Mensal" },
        ],
        listaFiltroStatusSme: [
            { id: "P", nome: "Pendente" },
            { id: "C", nome: "Concluído" },
        ],
        handleChangeFiltros: mockHandleChangeFiltros,
        handleChangeSelectStatusPc: mockHandleChangeSelectStatusPc,
        handleLimpaFiltros: mockHandleLimpaFiltros,
        handleSubmitFiltros: mockHandleSubmitFiltros,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar todos os selects e botões", () => {
        render(<FormFiltros {...defaultProps} />);

        expect(screen.getByLabelText("Filtrar por DRE")).toBeInTheDocument();
        expect(screen.getByLabelText("Filtrar por Publicação")).toBeInTheDocument();
        expect(screen.getByTestId("multiselect")).toBeInTheDocument();

        expect(screen.getByText("Limpar filtros")).toBeInTheDocument();
        expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    it("deve listar opções corretas de DRE", () => {
        render(<FormFiltros {...defaultProps} />);
        const dreSelect = screen.getByLabelText("Filtrar por DRE");

        expect(dreSelect).toHaveTextContent("Selecione uma DRE");
        expect(dreSelect).toHaveTextContent("DRE Norte");
        expect(dreSelect).toHaveTextContent("DRE Sul");
    });

    it("deve chamar handleChangeFiltros ao alterar DRE", () => {
        render(<FormFiltros {...defaultProps} />);
        const dreSelect = screen.getByLabelText("Filtrar por DRE");

        fireEvent.change(dreSelect, { target: { name: "filtrar_por_dre", value: "2" } });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith("filtrar_por_dre", "2");
    });

    it("deve chamar handleChangeFiltros ao alterar Tipo de Relatório", () => {
        render(<FormFiltros {...defaultProps} />);
        const tipoSelect = screen.getByLabelText("Filtrar por Publicação");

        fireEvent.change(tipoSelect, {
            target: { name: "filtrar_por_tipo_de_relatorio", value: "M" },
        });

        expect(mockHandleChangeFiltros).toHaveBeenCalledWith("filtrar_por_tipo_de_relatorio", "M");
    });

    it("deve listar e selecionar múltiplos status no Select", async () => {
        render(<FormFiltros {...defaultProps} />);
        const statusSelect = screen.getByTestId("multiselect");

        await userEvent.selectOptions(statusSelect, ["P", "C"]);

        expect(mockHandleChangeSelectStatusPc).toHaveBeenCalledTimes(2);
        expect(mockHandleChangeSelectStatusPc).toHaveBeenNthCalledWith(1, ["P"]);
        expect(mockHandleChangeSelectStatusPc).toHaveBeenNthCalledWith(2, ["C"]);
    });

    it("deve chamar handleLimpaFiltros ao clicar em 'Limpar filtros'", () => {
        render(<FormFiltros {...defaultProps} />);
        fireEvent.click(screen.getByText("Limpar filtros"));

        expect(mockHandleLimpaFiltros).toHaveBeenCalled();
    });

    it("deve chamar handleSubmitFiltros ao clicar em 'Filtrar'", () => {
        render(<FormFiltros {...defaultProps} />);
        fireEvent.click(screen.getByText("Filtrar"));

        expect(mockHandleSubmitFiltros).toHaveBeenCalled();
    });
});