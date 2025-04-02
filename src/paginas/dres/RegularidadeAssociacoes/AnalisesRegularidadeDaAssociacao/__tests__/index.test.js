import React  from "react";
import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { AnalisesRegularidadeAssociacaoPage } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn()
}));

describe('<AnalisesRegularidadeAssociacaoPage>', () => {
  test('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ associacao_uuid: '1234' });
    render(
      <AnalisesRegularidadeAssociacaoPage/>
    )
    expect(useParams).toHaveBeenCalled()
    expect(screen.getByText('Regularidade da associação')).toBeInTheDocument()
  });

});
