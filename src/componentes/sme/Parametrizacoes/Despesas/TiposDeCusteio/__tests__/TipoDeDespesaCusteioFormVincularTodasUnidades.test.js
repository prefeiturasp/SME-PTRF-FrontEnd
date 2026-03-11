import { screen } from "@testing-library/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { TipoDeDespesaCusteioForm } from "../TipoDeDespesaCusteioForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useGetTipoCusteio } from "../hooks/useGetTipoCusteio";
import { CustomModalConfirm } from "../../../../../Globais/Modal/CustomModalConfirm";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../__fixtures__/mockData";

jest.mock("../../../../../Globais/Modal/CustomModalConfirm", () => ({
  CustomModalConfirm: jest.fn(),
}));
jest.mock("../hooks/useGetTipoCusteio", () => ({
  useGetTipoCusteio: jest.fn(),
}));
jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

describe("TipoDeDespesaCusteioForm Vincular Todas Unidades", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    useParams.mockReturnValue({ uuid: "uuid-fake" });

    useNavigate.mockReturnValue(mockNavigate);

    useGetTipoCusteio.mockReturnValue({
      data: {
        uuid: "uuid-fake",
        id: 1,
        unidades: [{ uuid: "1" }, { uuid: "2" }],
        uso_associacao: "Parcial",
      },
      isLoading: false,
      refetch: () => null,
    });

    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    useLocation.mockReturnValue({
      state: { selecionar_todas: undefined },
    });
  });

  it("deve abrir modal de confirmação ao marcar 'Todas as unidades'", async () => {
    renderWithProviders(<TipoDeDespesaCusteioForm />);

    const user = userEvent.setup();

    const checkbox = await screen.findByRole("checkbox", {
      name: /todas as unidades/i,
    });

    await user.click(checkbox);

    expect(CustomModalConfirm).toHaveBeenCalled();
  });
});
