import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { LoginSuporte } from "../index";

const props = {
  location: {
    redefinicaoDeSenha: true
  }
}

describe('<LoginSuporte>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <LoginSuporte {...props}/>
    )
    expect(screen.getByText("Acesso exclusivo as unidades de suporte")).toBeInTheDocument();
    
  });

});
