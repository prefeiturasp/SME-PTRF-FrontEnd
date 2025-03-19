import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalConfirmaLogout } from "../ModalConfirmaLogout";

describe("ModalConfirmaLogout", () => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        titulo: "Confirmação de Logout",
        texto: "Deseja realmente sair?",
        onRedirectNotificacoes: jest.fn(),
        onLogoutTrue: jest.fn()
    };

    it("deve renderizar o modal quando show for true", () => {
        render(<ModalConfirmaLogout {...props} />);
        expect(screen.getByText("Confirmação de Logout")).toBeInTheDocument();
        expect(screen.getByText("Deseja realmente sair?")).toBeInTheDocument();
    });

    it("deve chamar onRedirectNotificacoes ao clicar no botão 'Ver notificações'", () => {
        render(<ModalConfirmaLogout {...props} />);
        fireEvent.click(screen.getByText("Ver notificações"));
        expect(props.onRedirectNotificacoes).toHaveBeenCalled();
    });

    it("deve chamar onLogoutTrue ao clicar no botão 'Sair do sistema'", () => {
        render(<ModalConfirmaLogout {...props} />);
        fireEvent.click(screen.getByText("Sair do sistema"));
        expect(props.onLogoutTrue).toHaveBeenCalled();
    });

});
