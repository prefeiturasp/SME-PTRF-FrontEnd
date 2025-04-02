import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { CentralDeDownloadsPage } from "../index";

describe('<CentralDeDownloadsPage>', () => {
 
  test('Deve renderizar o componente', async () => {
    render(
        <CentralDeDownloadsPage/>
    )
    expect(screen.getByText('Central de downloads')).toBeInTheDocument();
  });

});
