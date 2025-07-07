import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { CentralDeDownloadsPage } from "../index";
import { MemoryRouter } from "react-router-dom";

describe('<CentralDeDownloadsPage>', () => {
 
  test('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter>
        <CentralDeDownloadsPage/>
      </MemoryRouter>
    )
    expect(screen.getByText('Central de downloads')).toBeInTheDocument();
  });

});
