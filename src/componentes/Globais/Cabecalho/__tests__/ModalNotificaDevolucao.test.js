import React from "react";
import { render, screen } from "@testing-library/react";
import { ModalNotificaDevolucao } from "../ModalNotificaDevolucao";
import userEvent from "@testing-library/user-event";

describe("ModalNotificaDevolucao", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("deve renderizar o modal quando 'show' for true", () => {
    render(
      <ModalNotificaDevolucao show={true} handleClose={jest.fn()} titulo="Acesso perdido" />
    );
    expect(screen.getByRole("dialog", {selector: ".fade.modal-backdrop.show"})).toBeInTheDocument();
  });

  
});
