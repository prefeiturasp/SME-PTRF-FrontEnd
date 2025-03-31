import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { ExtracaoDadosPage } from "../index";
import {ExtracaoDados} from "../../../componentes/Globais/ExtracaoDados";

jest.mock("../../../componentes/Globais/ExtracaoDados", () => ({
  ExtracaoDados: ()=> <></>,
}));

describe('<ExtracaoDadosPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
      <ExtracaoDadosPage />
    )
    expect(screen.getByText('Extração de dados do sistema')).toBeInTheDocument();
  });
});
