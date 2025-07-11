import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { LoginSuporte } from "../index";
import { MemoryRouter } from "react-router-dom";

const props = {
  location: {
    redefinicaoDeSenha: true
  }
}

describe('<LoginSuporte>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <MemoryRouter>
          <LoginSuporte {...props}/>
        </MemoryRouter>
    )
    expect(screen.getByText("Acesso exclusivo as unidades de suporte")).toBeInTheDocument();
    
  });

});
