import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { Login } from "../index";

const mockProps = {
  location: {
    redefinicaoDeSenha: true
  }
}

describe('<Login>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
      <Login {...mockProps} />
    )
  });
});
