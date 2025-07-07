import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";
import { RedefinirSenhaPage } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe('<RedefinirSenhaPage>', () => {
  test('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ uuid: "uuid-teste" });
    render(
      <MemoryRouter initialEntries={["/redefinir-senha/uuid-teste"]}>
        <Routes>
          <Route path="/redefinir-senha/:uuid" element={<RedefinirSenhaPage />} />
        </Routes>
      </MemoryRouter>
    );
    // The component should render without errors
  });
});
