import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { ExtracaoDadosPage } from "../index";
import {ExtracaoDados} from "../../../componentes/Globais/ExtracaoDados";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../componentes/Globais/ExtracaoDados", () => ({
  ExtracaoDados: ()=> <></>,
}));

describe('<ExtracaoDadosPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter>
        <ExtracaoDadosPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Extração de dados do sistema')).toBeInTheDocument();
  });
});
