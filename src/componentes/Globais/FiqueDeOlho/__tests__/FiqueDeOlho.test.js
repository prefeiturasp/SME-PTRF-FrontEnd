import { render, screen } from "@testing-library/react";
import FiqueDeOlho from "../FiqueDeOlho";

describe("FiqueDeOlho", () => {
    it("não deve renderizar nada quando o texto não for informado", () => {
        const { container } = render(<FiqueDeOlho />);

        expect(container).toBeEmptyDOMElement();
    });

    it("não deve renderizar nada quando o texto for uma string vazia", () => {
        const { container } = render(<FiqueDeOlho texto="" />);

        expect(container).toBeEmptyDOMElement();
    });

    it("deve renderizar o texto informado como html", () => {
        const { container } = render(
            <FiqueDeOlho texto="<p>Atenção aos prazos.</p>" />
        );

        expect(screen.getByText("Atenção aos prazos.")).toBeInTheDocument();
        expect(container.querySelector("p")).toBeInTheDocument();
    });

    it("deve aplicar a classe do container de texto introdutório", () => {
        const { container } = render(
            <FiqueDeOlho texto="<p>Atenção aos prazos.</p>" />
        );

        expect(
            container.querySelector(".container-texto-introdutorio")
        ).toBeInTheDocument();
    });
});
