import React from "react";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import useTagInformacaoAssociacaoEncerradaTemplate from "../useTagInformacaoAssociacaoEncerradaTemplate";

describe("useTagInformacaoAssociacaoEncerradaTemplate", () => {
  const renderTag = (rowData) => {
    const { result } = renderHook(() => useTagInformacaoAssociacaoEncerradaTemplate());
    return render(<>{result.current(rowData)}</>);
  };

  it("não deve marcar associação em atividade", () => {
    const { container } = renderTag({ uuid: "assoc-1" });

    expect(container).toBeEmptyDOMElement();
  });

  it("deve marcar associação encerrada pela data própria", () => {
    renderTag({
      associacao_uuid: "assoc-2",
      data_de_encerramento_associacao: "2026-01-10",
      tooltip_associacao_encerrada: "Encerrada em 10/01/2026",
    });

    expect(screen.getByText("Associação encerrada")).toBeInTheDocument();
  });

  it("deve marcar associação encerrada pelos dados aninhados", () => {
    renderTag({
      uuid: "assoc-3",
      associacao: {
        data_de_encerramento: "2025-12-01",
        tooltip_data_encerramento: "Encerrada",
      },
    });

    expect(screen.getByText("Associação encerrada")).toBeInTheDocument();
  });

  it("deve marcar associação quando o indicador de encerramento está ativo", () => {
    renderTag({
      uuid: "assoc-4",
      associacao: { encerrada: true },
    });

    expect(screen.getByText("Associação encerrada")).toBeInTheDocument();
  });
});
