import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { barraMensagemCustom } from "../index";

describe("BarraMensagem", () => {
    it("BarraMensagemSucessAzul renderiza mensagem", () => {
        const result = barraMensagemCustom.BarraMensagemSucessAzul("Mensagem de sucesso");
        const { container } = render(<>{result}</>);
        
        expect(screen.getByText("Mensagem de sucesso")).toBeInTheDocument();
    });

    it("BarraMensagemSucessAzul não renderiza botão quando mostraBotao é false", () => {
        const result = barraMensagemCustom.BarraMensagemSucessAzul("Mensagem", null, null, false);
        render(<>{result}</>);
        
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("BarraMensagemSucessAzul renderiza botão quando mostraBotao é true", () => {
        const handleClick = jest.fn();
        const result = barraMensagemCustom.BarraMensagemSucessAzul("Mensagem", "Clique Aqui", handleClick, true);
        render(<>{result}</>);
        
        expect(screen.getByText("Clique Aqui")).toBeInTheDocument();
    });

    it("BarraMensagemSucessAzul executa callback ao clicar no botão", () => {
        const handleClick = jest.fn();
        const result = barraMensagemCustom.BarraMensagemSucessAzul("Mensagem", "Botão", handleClick, true);
        render(<>{result}</>);
        
        const botao = screen.getByText("Botão");
        fireEvent.click(botao);
        
        expect(handleClick).toHaveBeenCalled();
    });

    it("BarraMensagemSucessLaranja renderiza mensagem", () => {
        const result = barraMensagemCustom.BarraMensagemSucessLaranja("Mensagem laranja", "Ação", jest.fn(), true);
        render(<>{result}</>);
        
        expect(screen.getByText("Mensagem laranja")).toBeInTheDocument();
    });

    it("BarraMensagemAcertoExterno renderiza mensagem de acerto", () => {
        const result = barraMensagemCustom.BarraMensagemAcertoExterno("Mensagem de acerto");
        render(<>{result}</>);
        
        expect(screen.getByText("Mensagem de acerto")).toBeInTheDocument();
    });

    it("BarraMensagemInativa renderiza mensagem em negrito", () => {
        const result = barraMensagemCustom.BarraMensagemInativa("Mensagem inativa", null, null, false);
        render(<>{result}</>);
        
        expect(screen.getByText("Mensagem inativa")).toBeInTheDocument();
    });

    it("BarraMensagemAcertoExterno renderiza com botão", () => {
        const handleClick = jest.fn();
        const result = barraMensagemCustom.BarraMensagemAcertoExterno("Acerto", "Ação", handleClick, true);
        render(<>{result}</>);
        
        expect(screen.getByText("Ação")).toBeInTheDocument();
    });

    it("BarraMensagemSucessLaranja executa callback", () => {
        const handleClick = jest.fn();
        const result = barraMensagemCustom.BarraMensagemSucessLaranja("Laranja", "Executar", handleClick, true);
        render(<>{result}</>);
        
        const botao = screen.getByText("Executar");
        fireEvent.click(botao);
        
        expect(handleClick).toHaveBeenCalled();
    });

    it("BarraMensagemInativa renderiza com botão", () => {
        const handleClick = jest.fn();
        const result = barraMensagemCustom.BarraMensagemInativa("Inativa", "Botão", handleClick, true);
        render(<>{result}</>);
        
        const botao = screen.getByText("Botão");
        fireEvent.click(botao);
        
        expect(handleClick).toHaveBeenCalled();
    });
});

