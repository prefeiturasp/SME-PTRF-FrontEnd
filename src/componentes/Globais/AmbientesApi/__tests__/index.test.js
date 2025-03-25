import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import { AmbientesApi } from "../index";

beforeEach(() => {
  jest.resetModules();
});

describe("AmbientesApi", () => {
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("deve exibir o nome correto da API com base na URL e ambiente", async () => {
    process.env.REACT_APP_API_URL = "http://local.api.exemplo.com"; // Mocka a variável de ambiente

    Object.defineProperty(window, "location", {
      value: { href: "http://test.exemplo.com" },
      writable: true,
    });

    render(<AmbientesApi />);

    await act(async () => {
      expect(screen.getByText("API: local")).toBeInTheDocument();
    });
  });
});
