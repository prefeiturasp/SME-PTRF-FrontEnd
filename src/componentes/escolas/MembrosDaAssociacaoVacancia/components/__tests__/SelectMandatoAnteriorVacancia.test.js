import { render, screen, fireEvent } from "@testing-library/react";
import { SelectMandatoAnteriorVacancia } from "../SelectMandatoAnteriorVacancia";

jest.mock("../../../../../hooks/Globais/useDataTemplate", () => ({
    __esModule: true,
    default: () => (_, __, value) => value,
}));

describe("SelectMandatoAnteriorVacancia", () => {
    const mandatos = [
        { id: 2, uuid: "mandato-2", data_inicial: "2025-01-01", data_final: "2025-12-31" },
        { id: 1, uuid: "mandato-1", data_inicial: "2024-01-01", data_final: "2024-12-31" },
    ];

    const onChangeMandato = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar uma opção pra cada mandato recebido", () => {
        render(
            <SelectMandatoAnteriorVacancia
                mandatos={mandatos}
                mandatoUuid="mandato-2"
                onChangeMandato={onChangeMandato}
            />
        );

        expect(screen.getByText("2025-01-01 até 2025-12-31")).toBeInTheDocument();
        expect(screen.getByText("2024-01-01 até 2024-12-31")).toBeInTheDocument();
    });

    it("deve selecionar o mandatoUuid recebido por prop", () => {
        render(
            <SelectMandatoAnteriorVacancia
                mandatos={mandatos}
                mandatoUuid="mandato-1"
                onChangeMandato={onChangeMandato}
            />
        );

        expect(screen.getByLabelText("Selecionar período")).toHaveValue("mandato-1");
    });

    it("deve chamar onChangeMandato com o uuid selecionado", () => {
        render(
            <SelectMandatoAnteriorVacancia
                mandatos={mandatos}
                mandatoUuid="mandato-2"
                onChangeMandato={onChangeMandato}
            />
        );

        fireEvent.change(screen.getByLabelText("Selecionar período"), {
            target: { value: "mandato-1" },
        });

        expect(onChangeMandato).toHaveBeenCalledWith("mandato-1");
    });
});
