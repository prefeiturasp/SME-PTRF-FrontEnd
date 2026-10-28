import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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

const mockColumns = [];
jest.mock("primereact/column", () => ({
  Column: (props) => {
    mockColumns.push(props);
    return null;
  },
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

jest.mock("../../../Globais/Modal/CustomModalConfirm", () => ({
  CustomModalConfirm: jest.fn(),
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
import { CustomModalConfirm } from "../../../Globais/Modal/CustomModalConfirm";

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

  describe("ações, modais e vinculação", () => {
    const unidade = { uuid: "uuid-1", codigo_eol: "123", nome_com_tipo: "Unidade Escolar 1" };

    const setup = ({ mutateAsync, mutateAsyncLote, onVincular } = {}) => {
      useVincularUnidade.mockReturnValue({ mutateAsync: mutateAsync || jest.fn().mockResolvedValue({}) });
      useVincularUnidadeEmLote.mockReturnValue({ mutateAsync: mutateAsyncLote || jest.fn().mockResolvedValue({}) });
      mockColumns.length = 0;
      return render(
        <VincularUnidades
          instanceUUID="uuid-inst"
          instanceLabel="Recurso X"
          header={<div>Cabeçalho</div>}
          apiServiceGetUnidadesNaoVinculadas={jest.fn()}
          onVincular={onVincular}
        />
      );
    };

    const colBody = (field) => mockColumns.filter((c) => c.field === field).pop().body;
    const lastModal = () => ModalConfirm.mock.calls[ModalConfirm.mock.calls.length - 1][0];
    const lastCustom = () => CustomModalConfirm.mock.calls[CustomModalConfirm.mock.calls.length - 1][0];

    it("renderiza o header e o texto de contagem", () => {
      setup();
      expect(screen.getByText("Cabeçalho")).toBeInTheDocument();
      expect(screen.getByText(/unidades não vinculadas/)).toBeInTheDocument();
    });

    it("template da unidade exibe nome ou vazio", () => {
      setup();
      const body = colBody("nome_com_tipo");
      const { container } = render(<>{body(unidade)}</>);
      expect(container).toHaveTextContent("Unidade Escolar 1");
      const { container: vazio } = render(<>{body({})}</>);
      expect(vazio).toHaveTextContent("");
    });

    it("botão de ação da linha abre modal e confirma vinculação com sucesso", async () => {
      const mutateAsync = jest.fn().mockResolvedValue({});
      setup({ mutateAsync });
      render(<>{colBody("uuid")(unidade)}</>);
      const botao = screen.getAllByRole("button").find((b) => !b.textContent);
      fireEvent.click(botao);

      const modal = lastModal();
      expect(modal.title).toBe("Confirmação de vinculação");
      render(<>{modal.children}</>);
      expect(screen.getByText("Unidade Escolar 1")).toBeInTheDocument();

      await modal.onConfirm();
      expect(mutateAsync).toHaveBeenCalledWith({
        uuid: "uuid-inst",
        unidade_uuid: "uuid-1",
        payload: { confirmado: false },
      });
    });

    it("vinculação individual com erro que exige confirmação reabre modal e reenvia confirmado", async () => {
      const mutateAsync = jest
        .fn()
        .mockRejectedValueOnce({ response: { data: { confirmar: "Linha1\nLinha2" } } })
        .mockResolvedValueOnce({});
      setup({ mutateAsync });
      render(<>{colBody("uuid")(unidade)}</>);
      fireEvent.click(screen.getAllByRole("button").find((b) => !b.textContent));

      await lastModal().onConfirm();
      const modal = lastModal();
      expect(modal.title).toBe("Confirmação de Vinculação");
      expect(modal.message).toBe("Linha1<br>Linha2");

      await modal.onConfirm();
      expect(mutateAsync).toHaveBeenLastCalledWith({
        uuid: "uuid-inst",
        unidade_uuid: "uuid-1",
        payload: { confirmado: true },
      });
    });

    it.each([
      [{ response: { data: { mensagem: "msg" } } }, "msg"],
      [{ response: { data: { detail: "det" } } }, "det"],
      [{ response: { data: { non_field_errors: "nfe" } } }, "nfe"],
      [{ response: { data: "texto" } }, "texto"],
      [{}, "Falha ao tentar vincular unidade"],
    ])("vinculação individual com erro %j exibe mensagem", async (erro, esperado) => {
      setup({ mutateAsync: jest.fn().mockRejectedValue(erro) });
      render(<>{colBody("uuid")(unidade)}</>);
      fireEvent.click(screen.getAllByRole("button").find((b) => !b.textContent));

      await lastModal().onConfirm();
      expect(lastCustom().title).toBe("Erro ao vincular unidade");
      expect(lastCustom().message).toBe(esperado);
    });

    it("botão de ação fica desabilitado com unidades selecionadas", () => {
      setup();
      fireEvent.click(screen.getByText("Selecionar unidade"));
      render(<>{colBody("uuid")(unidade)}</>);
      const botoes = screen.getAllByRole("button").filter((b) => !b.textContent);
      expect(botoes.pop()).toBeDisabled();
    });

    it("cancelar limpa a seleção", () => {
      setup();
      fireEvent.click(screen.getByText("Selecionar unidade"));
      fireEvent.click(screen.getByText("Cancelar"));
      expect(screen.queryByText("Vincular unidades")).not.toBeInTheDocument();
    });

    it("vinculação em lote com sucesso limpa a seleção", async () => {
      const mutateAsyncLote = jest.fn().mockResolvedValue({});
      setup({ mutateAsyncLote });
      fireEvent.click(screen.getByText("Selecionar unidade"));
      fireEvent.click(screen.getByText("Vincular unidades"));

      const modal = lastModal();
      render(<>{modal.children}</>);
      expect(screen.getByText("1 unidade selecionada")).toBeInTheDocument();

      await act(async () => {
        await modal.onConfirm();
      });
      expect(mutateAsyncLote).toHaveBeenCalledWith({
        uuid: "uuid-inst",
        unidade_uuids: ["uuid-1"],
        payload: { confirmado: false },
      });
      await waitFor(() => expect(screen.queryByText("Cancelar")).not.toBeInTheDocument());
    });

    it("vinculação em lote com erro que exige confirmação reenvia confirmado", async () => {
      const mutateAsyncLote = jest
        .fn()
        .mockRejectedValueOnce({ response: { data: { confirmar: "A\nB" } } })
        .mockResolvedValueOnce({});
      setup({ mutateAsyncLote });
      fireEvent.click(screen.getByText("Selecionar unidade"));
      fireEvent.click(screen.getByText("Vincular unidades"));

      await act(async () => {
        await lastModal().onConfirm();
      });
      const modal = lastModal();
      expect(modal.message).toBe("A<br>B");

      await act(async () => {
        await modal.onConfirm();
      });
      expect(mutateAsyncLote).toHaveBeenLastCalledWith({
        uuid: "uuid-inst",
        unidade_uuids: ["uuid-1"],
        payload: { confirmado: true },
      });
    });

    it.each([
      [{ response: { data: { mensagem: "msg" } } }, "msg"],
      [{ response: { data: { detail: "det" } } }, "det"],
      [{ response: { data: { non_field_errors: "nfe" } } }, "nfe"],
      [{ response: { data: "texto" } }, "texto"],
      [{}, "Falha ao tentar vincular unidades em lote"],
    ])("vinculação em lote com erro %j exibe mensagem", async (erro, esperado) => {
      setup({ mutateAsyncLote: jest.fn().mockRejectedValue(erro) });
      fireEvent.click(screen.getByText("Selecionar unidade"));
      fireEvent.click(screen.getByText("Vincular unidades"));

      await act(async () => {
        await lastModal().onConfirm();
      });
      expect(lastCustom().title).toBe("Erro ao vincular unidades");
      const { container } = render(<>{lastCustom().message}</>);
      expect(container).toHaveTextContent(esperado);
    });

    it("aplicar filtro atualiza os parâmetros da consulta", () => {
      setup();
      fireEvent.click(screen.getByText("Aplicar filtro"));
      expect(useGetUnidadesNaoVinculadas).toHaveBeenLastCalledWith(
        expect.anything(),
        "uuid-inst",
        expect.objectContaining({ nome_ou_codigo: "teste", page: 1 })
      );
    });

    it("erro 404 volta para a primeira página", () => {
      useGetUnidadesNaoVinculadas.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { response: { status: 404 } },
      });
      setup();
      expect(useGetUnidadesNaoVinculadas).toHaveBeenCalled();
    });
  });
});
