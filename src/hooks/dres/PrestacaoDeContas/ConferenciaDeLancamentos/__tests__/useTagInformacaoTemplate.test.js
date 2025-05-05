import React from "react";
import { render, screen } from "@testing-library/react";
import useTagInformacaoTemplate from "../useTagInformacaoTemplate";

jest.mock(
  "../../ConferenciaDeLancamentos/scss/tagInformacaoTemplate.scss",
  () => ({})
);

describe("useTagInformacaoTemplate", () => {
  it("renderiza corretamente tags com tooltip", () => {
    const renderizaTagInformacao = useTagInformacaoTemplate();

    const rowData = {
      informacoes: [
        {
          tag_id: 1,
          tag_nome: "Nome da Tag 1",
          tag_hint: "Texto do Hint 1",
        },
        {
          tag_id: 2,
          tag_nome: "Nome da Tag 2",
          tag_hint: ["Linha 1", "Linha 2"],
        },
      ],
    };

    const Component = renderizaTagInformacao(rowData);
    render(Component);

    expect(screen.getByText("Nome da Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Nome da Tag 2")).toBeInTheDocument();

    const tags = document.querySelectorAll("[data-tip]");
    expect(tags[0].getAttribute("data-tip")).toContain("Texto do Hint 1");
    expect(tags[1].getAttribute("data-tip")).toContain("Linha 1<br/>Linha 2");

    expect(tags[0].className).toContain("tag-purple");
    expect(tags[1].className).toContain("tag-darkblue");
  });

  it("retorna '-' se não houver informacoes", () => {
    const renderizaTagInformacao = useTagInformacaoTemplate();
    const Component = renderizaTagInformacao({});
    render(Component);

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
