import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { EsqueciMinhaSenhaPage } from "../index";

describe('<EsqueciMinhaSenhaPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    render(
        <EsqueciMinhaSenhaPage/>
    )
  });
});
