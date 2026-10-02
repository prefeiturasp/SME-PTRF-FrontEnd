import React from "react";
import { render, screen } from "@testing-library/react";
import ComentariosDeAnaliseNotificados from "../ComentariosDeAnaliseNotificados";

describe("ComentariosDeAnaliseNotificados", () => {
    it("deve exibir mensagem informando que não existem comentários notificados quando a lista estiver vazia", () => {
        const { container } = render(<ComentariosDeAnaliseNotificados comentariosNotificados={[]} />);
        expect(screen.getByText("Comentários já notificados")).toBeInTheDocument();
        expect(container.querySelector('[data-qa="info-nao-existem-comentarios-notificados"]')).toBeInTheDocument();
    });

    it("deve exibir mensagem informando que não existem comentários notificados quando a prop não for informada", () => {
        const { container } = render(<ComentariosDeAnaliseNotificados />);
        expect(container.querySelector('[data-qa="info-nao-existem-comentarios-notificados"]')).toBeInTheDocument();
    });

    it("deve renderizar os comentários notificados com a data de notificação", () => {
        const { container } = render(
            <ComentariosDeAnaliseNotificados
                comentariosNotificados={[
                    { uuid: "c1", comentario: "Primeiro comentário", notificado_em: "2024-01-15" },
                    { uuid: "c2", comentario: "Segundo comentário", notificado_em: "2024-02-20" },
                ]}
            />
        );
        expect(screen.getByText("Primeiro comentário")).toBeInTheDocument();
        expect(screen.getByText("Segundo comentário")).toBeInTheDocument();
        expect(screen.getByText("Notificado 15/01/2024")).toBeInTheDocument();
        expect(screen.getByText("Notificado 20/02/2024")).toBeInTheDocument();
        expect(container.querySelector('[data-qa="info-nao-existem-comentarios-notificados"]')).not.toBeInTheDocument();
    });
});
