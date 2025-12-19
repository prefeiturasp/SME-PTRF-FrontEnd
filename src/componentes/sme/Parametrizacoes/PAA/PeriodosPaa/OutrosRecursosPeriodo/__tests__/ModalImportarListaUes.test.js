import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalImportarListaUes from "../ModalImportarListaUes";
import { OutrosRecursosPeriodosPaaContext } from "../context";
import { Form } from "antd";

import { usePostOutroRecursoPeriodoImportarUnidades } from "../hooks/usePost";
import { useGetTodos } from "../../hooks/useGet";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

jest.mock("../../hooks/useGet", () => ({
  useGetTodos: jest.fn(),
}));

jest.mock(".././hooks/usePost", () => ({
  usePostOutroRecursoPeriodoImportarUnidades: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("../../../../../../Globais/ModalBootstrap", () => ({
  ModalFormBodyText: ({ bodyText, titulo, show }) =>
    show ? (
      <div>
        <h1>{titulo}</h1>
        {bodyText}
      </div>
    ) : null,
}));

const renderComponent = ({
  periodosMock,
  mutationMock,
  contextProps,
  outroRecursoPeriodo,
  onSuccess = jest.fn(),
}) => {
  useGetTodos.mockReturnValue({
    data: { results: periodosMock },
    isLoading: false,
    refetch: jest.fn(),
  });

  usePostOutroRecursoPeriodoImportarUnidades.mockReturnValue(mutationMock);

  return render(
    <OutrosRecursosPeriodosPaaContext.Provider value={contextProps}>
      <ModalImportarListaUes
        outroRecursoPeriodo={outroRecursoPeriodo}
        onSuccess={onSuccess}
      />
    </OutrosRecursosPeriodosPaaContext.Provider>
  );
};

const outroRecursoPeriodo = {
  uuid: "destino-uuid",
  outro_recurso: "X",
  outro_recurso_nome: "Recurso Destino",
};

const periodosMock = [
  {
    uuid: "periodo-1",
    referencia: "2024",
    outros_recursos: [
      {
        uuid: "recurso-1",
        outro_recurso: "Y",
        outro_recurso_nome: "Recurso Origem",
        unidades: [{ id: 1 }, { id: 2 }],
      },
    ],
  },
];

describe("ModalImportarListaUes", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({ matches: false })),
    })
  });

  test("carrega períodos e permite selecionar período", async () => {
    renderComponent({
      periodosMock,
      mutationMock: { mutateAsync: jest.fn(), isPending: false },
      contextProps: {
        showModalImportarUEs: true,
        setShowModalImportarUEs: jest.fn(),
      },
      outroRecursoPeriodo,
    });

    fireEvent.mouseDown(
        screen.getByLabelText(
            "Selecione o período de onde deseja importar a lista de UEs"
        )
    );
    fireEvent.click(screen.getByText("2024"));

    expect(
      await screen.getByLabelText(/Selecione o recurso/i)
    ).toBeInTheDocument();
  });

  test("bloqueia quando recurso não possui unidades", async () => {
    const periodosSemUnidade = [
      {
        ...periodosMock[0],
        outros_recursos: [
          {
            ...periodosMock[0].outros_recursos[0],
            unidades: [],
          },
        ],
      },
    ];

    renderComponent({
      periodosMock: periodosSemUnidade,
      mutationMock: { mutateAsync: jest.fn(), isPending: false },
      contextProps: {
        showModalImportarUEs: true,
        setShowModalImportarUEs: jest.fn(),
      },
      outroRecursoPeriodo,
    });

    fireEvent.mouseDown(screen.getByLabelText(/Selecione o período/i));
    fireEvent.click(screen.getByText("2024"));

    fireEvent.mouseDown(screen.getByLabelText(/Selecione o recurso/i));
    fireEvent.click(screen.getByText(/Recurso Origem/i));

    fireEvent.click(screen.getByText("Importar"));

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalled();
    });
  });

  test("entra no modo confirmação ao clicar importar", async () => {
    renderComponent({
      periodosMock,
      mutationMock: { mutateAsync: jest.fn(), isPending: false },
      contextProps: {
        showModalImportarUEs: true,
        setShowModalImportarUEs: jest.fn(),
      },
      outroRecursoPeriodo,
    });

    fireEvent.mouseDown(screen.getByLabelText(/Selecione o período/i));
    fireEvent.click(screen.getByText("2024"));

    fireEvent.mouseDown(screen.getByLabelText(/Selecione o recurso/i));
    fireEvent.click(screen.getByText("Recurso Origem"));  

    fireEvent.click(screen.getByText("Importar"));

    expect(
      await screen.findByText("Confirmação de vinculação")
    ).toBeInTheDocument();
  });

  test("confirma vinculação e chama mutation + onSuccess", async () => {
    const mutateAsync = jest.fn().mockResolvedValue({});
    const onSuccess = jest.fn();

    renderComponent({
      periodosMock,
      mutationMock: { mutateAsync, isPending: false },
      contextProps: {
        showModalImportarUEs: true,
        setShowModalImportarUEs: jest.fn(),
      },
      outroRecursoPeriodo,
      onSuccess,
    });

    fireEvent.mouseDown(screen.getByLabelText(/Selecione o período/i));
    fireEvent.click(screen.getByText("2024"));

    fireEvent.mouseDown(screen.getByLabelText(/Selecione o recurso/i));
    fireEvent.click(screen.getByText("Recurso Origem"));    

    fireEvent.click(screen.getByText("Importar"));
    fireEvent.click(await screen.findByText("Confirmar vinculação"));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        payload: { origem_uuid: "recurso-1" },
        uuid: "destino-uuid",
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
