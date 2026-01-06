import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { UnidadesVinculadas } from "../UnidadesVinculadas";
import { ModalConfirm } from "../../../Globais/Modal/ModalConfirm";
import { useGetUnidadesVinculadas } from "../hooks/useGet";
import { useDesvincularUnidade, useDesvincularUnidadeEmLote } from "../hooks/useVinculoUnidade";

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock("../hooks/useGet", () => ({
  useGetUnidadesVinculadas: jest.fn(),
}));

jest.mock("../hooks/useVinculoUnidade", () => ({
  useDesvincularUnidade: jest.fn(),
  useDesvincularUnidadeEmLote: jest.fn(),
}));

jest.mock("../../../Globais/Modal/ModalConfirm", () => ({
  ModalConfirm: jest.fn(),
}));

jest.mock("../Filtros", () => ({
  Filtros: () => <div data-testid="filtros" />,
}));

jest.mock("../Paginacao", () => ({
  Paginacao: () => <div data-testid="paginacao" />,
}));

jest.mock("primereact/datatable", () => ({
  DataTable: ({ children, onSelectionChange }) => (
    <div data-testid="datatable">
      <button
        onClick={() =>
          onSelectionChange({
            value: [{ uuid: "u1", nome_com_tipo: "UE 1" }],
          })
        }
      >
        selecionar
      </button>
      {children}
    </div>
  ),
}));

jest.mock("primereact/column", () => ({
  Column: () => null,
}));

jest.mock(
  "../../../Globais/Mensagens/MsgImgCentralizada",
  () => ({
    MsgImgCentralizada: ({ texto }) => (
      <div data-testid="msg-vazio">{texto}</div>
    ),
  })
);

const baseProps = {
  instanceUUID: "inst-1",
  instanceLabel: "Recurso X",
  apiServiceGetUnidadesVinculadas: jest.fn(),
  apiServiceDesvincularUnidade: jest.fn(),
  apiServiceDesvincularUnidadeEmLote: jest.fn(),
  onDesvincular: jest.fn(),
};

describe("UnidadesVinculadas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza mensagem quando não há unidades vinculadas", () => {
    useGetUnidadesVinculadas.mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: false,
    });

    render(<UnidadesVinculadas {...baseProps} />);

    expect(
      screen.getByText("Use os filtros para localizar a unidade vinculada.")
    ).toBeInTheDocument();
  });

  test("renderiza tabela quando há unidades", () => {
    useGetUnidadesVinculadas.mockReturnValue({
      data: {
        count: 1,
        results: [{ uuid: "u1", nome_com_tipo: "UE 1" }],
      },
      isLoading: false,
    });

    render(<UnidadesVinculadas {...baseProps} />);

    expect(screen.getByTestId("datatable")).toBeInTheDocument();
    expect(screen.getByText(/Exibindo/)).toBeInTheDocument();
  });

  test("exibe barra de ações ao selecionar unidades", () => {
    useGetUnidadesVinculadas.mockReturnValue({
      data: {
        count: 1,
        results: [{ uuid: "u1", nome_com_tipo: "UE 1" }],
      },
      isLoading: false,
    });

    render(<UnidadesVinculadas {...baseProps} />);

    fireEvent.click(screen.getByText("selecionar"));

    expect(
      screen.getByText("unidade selecionada")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("action-desvincular-unidades")
    ).toBeInTheDocument();
  });

  
});
