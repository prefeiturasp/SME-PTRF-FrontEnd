import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "../Loading"

describe("Loading Component", () => {
    it("deve renderizar o componente corretamente", () => {
        render(<Loading corGrafico="blue" corFonte="dark" marginTop={3} marginBottom={3} />);
        
        expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });
});
