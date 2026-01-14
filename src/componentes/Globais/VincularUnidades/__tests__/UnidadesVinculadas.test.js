import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Checkbox: ({ children, checked, onChange, disabled }) => {
    const handleClick = (e) => {
      if (!disabled && onChange) {
        const syntheticEvent = {
          target: { checked: !checked },
          currentTarget: { checked: !checked },
          preventDefault: () => {},
          stopPropagation: () => {},
        };
        onChange(syntheticEvent);
      }
    };
    return (
      <label data-testid="checkbox-vincular-todas">
        <input
          type="checkbox"
          checked={checked}
          onClick={handleClick}
          disabled={disabled}
          data-testid="checkbox-input"
        />
        {children}
      </label>
    );
  },
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

  describe("Checkbox Vincular Todas", () => {
    const mockMutate = jest.fn();
    
    beforeEach(() => {
      jest.clearAllMocks();
      ModalConfirm.mockClear();
      useDesvincularUnidadeEmLote.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });
    });

    test("renderiza checkbox quando apiServiceDesvincularUnidadeEmLote está disponível", () => {
      useGetUnidadesVinculadas.mockReturnValue({
        data: { count: 1, results: [{ uuid: "u1" }] },
        isLoading: false,
      });

      render(<UnidadesVinculadas {...baseProps} />);

      expect(screen.getByTestId("checkbox-vincular-todas")).toBeInTheDocument();
      expect(screen.getByText("Todas as unidades")).toBeInTheDocument();
    });

    test("checkbox marcado quando não há unidades vinculadas", () => {
      useGetUnidadesVinculadas.mockReturnValue({
        data: { count: 0, results: [] },
        isLoading: false,
      });

      render(<UnidadesVinculadas {...baseProps} />);

      const checkbox = screen.getByTestId("checkbox-input");
      expect(checkbox).toBeChecked();
    });

    test("checkbox desmarcado quando há unidades vinculadas", () => {
      useGetUnidadesVinculadas.mockReturnValue({
        data: { count: 2, results: [{ uuid: "u1" }, { uuid: "u2" }] },
        isLoading: false,
      });

      render(<UnidadesVinculadas {...baseProps} />);

      const checkbox = screen.getByTestId("checkbox-input");
      expect(checkbox).not.toBeChecked();
    });

    test("abre modal ao marcar checkbox", () => {
      useGetUnidadesVinculadas.mockReturnValue({
        data: { count: 2, results: [{ uuid: "u1" }, { uuid: "u2" }] },
        isLoading: false,
      });

      render(<UnidadesVinculadas {...baseProps} />);

      const checkbox = screen.getByTestId("checkbox-input");
      fireEvent.click(checkbox);

      expect(ModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Confirmação de vinculação",
          dataQa: "modal-confirmar-desvincular-todas",
        })
      );
    });

    test("desvincula todas unidades ao confirmar modal", async () => {
      mockMutate.mockClear();
      
      const mockApiService = jest.fn().mockResolvedValue({
        results: [{ uuid: "u1" }, { uuid: "u2" }],
      });

      useGetUnidadesVinculadas.mockReturnValue({
        data: { count: 2, results: [{ uuid: "u1" }, { uuid: "u2" }] },
        isLoading: false,
      });

      useDesvincularUnidadeEmLote.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      render(
        <UnidadesVinculadas
          {...baseProps}
          apiServiceGetUnidadesVinculadas={mockApiService}
        />
      );

      const checkbox = screen.getByTestId("checkbox-input");
      fireEvent.click(checkbox);

      expect(ModalConfirm).toHaveBeenCalled();
      const modalCall = ModalConfirm.mock.calls[ModalConfirm.mock.calls.length - 1][0];
      
      await modalCall.onConfirm();

      await waitFor(() => {
        expect(mockApiService).toHaveBeenCalledWith("inst-1", {
          pagination: "false",
        });
      });

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          uuid: "inst-1",
          unidade_uuids: ["u1", "u2"],
        });
      });
    });

    test("checkbox desabilitado durante loading", () => {
      useGetUnidadesVinculadas.mockReturnValue({
        data: { count: 1, results: [{ uuid: "u1" }] },
        isLoading: true,
      });

      render(<UnidadesVinculadas {...baseProps} />);

      const checkbox = screen.getByTestId("checkbox-input");
      expect(checkbox).toBeDisabled();
    });

    test("checkbox desabilitado durante mutation pendente", () => {
      useDesvincularUnidadeEmLote.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      });

      useGetUnidadesVinculadas.mockReturnValue({
        data: { count: 1, results: [{ uuid: "u1" }] },
        isLoading: false,
      });

      render(<UnidadesVinculadas {...baseProps} />);

      const checkbox = screen.getByTestId("checkbox-input");
      expect(checkbox).toBeDisabled();
    });
  });
});
