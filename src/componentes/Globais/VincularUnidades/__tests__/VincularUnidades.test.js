import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { VincularUnidades } from "../VincularUnidades";


jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock("../hooks/useGet", () => ({
  useGetUnidadesNaoVinculadas: jest.fn(),
}));

jest.mock("../hooks/useVinculoUnidade", () => ({
  useVincularUnidade: jest.fn(),
  useVincularUnidadeEmLote: jest.fn(),
}));

jest.mock("../Filtros", () => ({
  Filtros: ({ onFilterChange }) => (
    <button onClick={() => onFilterChange({ nome_ou_codigo: "teste" })}>
      Aplicar filtro
    </button>
  ),
}));

jest.mock("../Paginacao", () => ({
  Paginacao: ({ onPageChange }) => (
    <button onClick={() => onPageChange(2, 10)}>Mudar página</button>
  ),
}));

jest.mock("primereact/datatable", () => ({
  DataTable: ({ children, onSelectionChange }) => (
    <div>
      <button
        onClick={() =>
          onSelectionChange({
            value: [{ uuid: "uuid-1", nome_com_tipo: "Unidade 1" }],
          })
        }
      >
        Selecionar unidade
      </button>
      {children}
    </div>
  ),
}));

jest.mock("primereact/column", () => ({
  Column: () => null,
}));

jest.mock("antd", () => ({
  Spin: ({ spinning, children }) =>
    spinning ? <div>Carregando...</div> : children,
  Button: ({ onClick, disabled, children }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Tooltip: ({ children }) => <>{children}</>,
}));

jest.mock("../../../Globais/Modal/ModalConfirm", () => ({
  ModalConfirm: jest.fn(),
}));

jest.mock("../../../Globais/Mensagens/MsgImgCentralizada", () => ({
  MsgImgCentralizada: ({ texto }) => <div>{texto}</div>,
}));

/* -------------------------------------------------------------------------- */
/*                                   Fixtures                                  */
/* -------------------------------------------------------------------------- */

import { useGetUnidadesNaoVinculadas } from "../hooks/useGet";
import {
  useVincularUnidade,
  useVincularUnidadeEmLote,
} from "../hooks/useVinculoUnidade";
import { ModalConfirm } from "../../../Globais/Modal/ModalConfirm";

const mockUnidades = {
  count: 1,
  results: [
    {
      uuid: "uuid-1",
      codigo_eol: "123",
      nome_com_tipo: "Unidade Escolar 1",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                                    Tests                                   */
/* -------------------------------------------------------------------------- */

describe("VincularUnidades", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useGetUnidadesNaoVinculadas.mockReturnValue({
      data: mockUnidades,
      isLoading: false,
      isError: false,
      error: null,
    });

    useVincularUnidade.mockReturnValue({
      mutate: jest.fn(),
    });

    useVincularUnidadeEmLote.mockReturnValue({
      mutate: jest.fn(),
    });
  });

  it("renderiza corretamente com dados", () => {
    render(
      <VincularUnidades
        instanceUUID="uuid-instancia"
        instanceLabel="Recurso X"
        apiServiceGetUnidadesNaoVinculadas={jest.fn()}
        apiServiceVincularUnidade={jest.fn()}
        apiServiceVincularUnidadeEmLote={jest.fn()}
      />
    );

    expect(screen.getByText("Selecionar unidade")).toBeInTheDocument();
  });

  it("exibe loader enquanto carrega", () => {
    useGetUnidadesNaoVinculadas.mockReturnValueOnce({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(
      <VincularUnidades
        instanceUUID="uuid"
        apiServiceGetUnidadesNaoVinculadas={jest.fn()}
      />
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("exibe mensagem quando não há resultados", () => {
    useGetUnidadesNaoVinculadas.mockReturnValueOnce({
      data: { count: 0, results: [] },
      isLoading: false,
      isError: false,
    });

    render(
      <VincularUnidades
        instanceUUID="uuid"
        apiServiceGetUnidadesNaoVinculadas={jest.fn()}
      />
    );

    expect(
      screen.getByText(
        "Use os filtros para localizar a unidade que será vinculada."
      )
    ).toBeInTheDocument();
  });

  it("chama paginação ao mudar página", () => {
    render(
      <VincularUnidades
        instanceUUID="uuid"
        apiServiceGetUnidadesNaoVinculadas={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Mudar página"));

    expect(useGetUnidadesNaoVinculadas).toHaveBeenCalled();
  });

  it("abre modal ao clicar em vincular unidade", async () => {
    render(
      <VincularUnidades
        instanceUUID="uuid"
        instanceLabel="Recurso X"
        apiServiceGetUnidadesNaoVinculadas={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Selecionar unidade"));
    fireEvent.click(screen.getByText("Vincular unidades"));

    await waitFor(() => {
      expect(ModalConfirm).toHaveBeenCalled();
    });
  });

  it("permite seleção e vinculação em lote", async () => {
    render(
      <VincularUnidades
        instanceUUID="uuid"
        instanceLabel="Recurso X"
        apiServiceGetUnidadesNaoVinculadas={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Selecionar unidade"));
    const label = screen.getAllByText((_, element) =>
        element.textContent.replace(/\s+/g, " ").trim() ===
        "1 unidade selecionada"
    )
    expect(label).toHaveLength(2);

    fireEvent.click(screen.getByText("Vincular unidades"));

    await waitFor(() => {
      expect(ModalConfirm).toHaveBeenCalled();
    });
  });

  it("reseta página ao receber erro 404", async () => {
    useGetUnidadesNaoVinculadas.mockReturnValueOnce({
      data: null,
      isLoading: false,
      isError: true,
      error: { response: { status: 404 } },
    });

    render(
      <VincularUnidades
        instanceUUID="uuid"
        apiServiceGetUnidadesNaoVinculadas={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(useGetUnidadesNaoVinculadas).toHaveBeenCalled();
    });
  });
});