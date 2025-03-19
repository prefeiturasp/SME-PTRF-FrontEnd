import React from "react";
import { render, screen } from "@testing-library/react";
import { ExibicaoQuantidade } from "../components/ExibicaoQuantidade";
import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";

jest.mock("../hooks/useGetMotivosRejeicao");

describe("ExibicaoQuantidade", () => {
  it("não deve exibir nada quando os dados ainda estão carregando", () => {
    useGetMotivosRejeicao.mockReturnValue({
      isLoading: true,
      totalMotivosRejeicao: null,
    });

    render(
      <MotivosRejeicaoContext.Provider>
        <ExibicaoQuantidade />
      </MotivosRejeicaoContext.Provider>
    );

    expect(screen.queryByText(/Exibindo/i)).not.toBeInTheDocument();
  });

  it("não deve exibir nada quando totalMotivosRejeicao for nulo", () => {
    useGetMotivosRejeicao.mockReturnValue({
      isLoading: false,
      totalMotivosRejeicao: null,
    });

    render(<ExibicaoQuantidade />);

    expect(screen.queryByText(/Exibindo/i)).not.toBeInTheDocument();
  });

  it("deve exibir o número total de motivos quando os dados estão carregados", () => {
    useGetMotivosRejeicao.mockReturnValue({
      isLoading: false,
      totalMotivosRejeicao: 25,
    });

    render(<ExibicaoQuantidade />);

    expect(screen.getByText(/Exibindo/i)).toBeInTheDocument();
    expect(screen.getByText(/25/i)).toBeInTheDocument();

  });
});
