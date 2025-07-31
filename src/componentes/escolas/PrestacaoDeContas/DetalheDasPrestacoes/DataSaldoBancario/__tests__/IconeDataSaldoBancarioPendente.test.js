import { render } from "@testing-library/react";
import { IconeDataSaldoBancarioPendentes } from "../IconeDataSaldoBancarioPendentes";

describe("IconeDataSaldoBancarioPendentes", () => {
  test("renderiza o ícone com o tooltip correto", () => {
    render(<IconeDataSaldoBancarioPendentes />);

    expect(document.querySelector(`img[alt="icone-exclamacao-vermelho"]`)).toBeInTheDocument();

  });
});
