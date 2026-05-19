import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { Comissoes } from "../index";

import {
  getUnidade,
} from "../../../../../services/dres/Unidades.service";

import {
  getMembrosComissao,
  getComissoes,
  getMembrosComissaoFiltro,
  postMembroComissao,
  patchMembroComissao,
  deleteMembroComissao
} from "../../../../../services/dres/Comissoes.service";

import { consultarRF } from "../../../../../services/escolas/Associacao.service";
import { TopoComBotoes } from "../TopoComBotoes";

jest.mock("../../../../../services/dres/Unidades.service");
jest.mock("../../../../../services/dres/Comissoes.service");
jest.mock("../../../../../services/escolas/Associacao.service");

jest.mock("../TopoComBotoes", () => ({
  TopoComBotoes: ({handleOnShowModalAdicao}) => (
    <button onClick={handleOnShowModalAdicao}>Adicionar</button>
  )
}));

jest.mock("../FormFiltros", () => ({
  Filtros: ({ handleOnSubmitFiltros, handleOnLimparFiltros }) => (
    <>
      <button onClick={handleOnSubmitFiltros}>Filtrar</button>
      <button onClick={handleOnLimparFiltros}>Limpar</button>
    </>
  )
}));

jest.mock("../ListaComissoes", () => ({
  ListaComissoes: ({ handleOnShowModalEdicao }) => (
    <button onClick={() => handleOnShowModalEdicao({
      uuid: "1",
      rf: "123",
      nome: "Servidor Teste",
      email: "",
      comissoes: [{ id: 10 }]
    })}>
      Editar
    </button>
  )
}));

jest.mock("../Modais", () => ({
  ModalAdicionarMembroComissao: ({ show }) =>
    show ? <div>Modal Adição Aberto</div> : null,

  ModalEditarMembroComissao: ({ show }) =>
    show ? <div>Modal Edição Aberto</div> : null,

  ModalConfirmaExclusaoMembroComissao: ({ show }) =>
    show ? <div>Modal Exclusão</div> : null,
}));

jest.mock("../../../../Globais/MenuInterno", () => ({
  MenuInterno: () => <div>Menu</div>
}));

jest.mock("../../../../../utils/Loading", () => () => (
  <div>Loading...</div>
));

describe("Comissoes Component DRE", () => {
  beforeEach(() => { 
    jest.clearAllMocks();
  });

  const mockDiretoria = { uuid: "dre-1", nome: "DRE Teste" };

  const mockComissoes = [{ id: 1, nome: "Comissão A" }];
  const mockMembros = [{ uuid: "m1", nome: "João" }];

  it("deve mostrar loading inicial", async () => {
    getUnidade.mockResolvedValue(mockDiretoria);
    getComissoes.mockResolvedValue(mockComissoes);
    getMembrosComissao.mockResolvedValue(mockMembros);

    render(<Comissoes />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("deve carregar diretoria e renderizar título", async () => {
    getUnidade.mockResolvedValue(mockDiretoria);
    getComissoes.mockResolvedValue(mockComissoes);
    getMembrosComissao.mockResolvedValue(mockMembros);

    render(<Comissoes />);

    expect(await screen.findByText(/Comissões da Diretoria/i)).toBeInTheDocument();
    expect(screen.getByText(/DRE Teste/i)).toBeInTheDocument();
  });

  it("deve abrir modal de adição", async () => {
    getUnidade.mockResolvedValue(mockDiretoria);
    getComissoes.mockResolvedValue(mockComissoes);
    getMembrosComissao.mockResolvedValue(mockMembros);

    render(<Comissoes />);

    const botao = await screen.findByText("Adicionar");
    fireEvent.click(botao);

    expect(screen.getByText("Modal Adição Aberto")).toBeInTheDocument();
  });


  it("deve abrir modal de edição", async () => {
    getUnidade.mockResolvedValue(mockDiretoria);
    getComissoes.mockResolvedValue(mockComissoes);
    getMembrosComissao.mockResolvedValue(mockMembros);

    render(<Comissoes />);

    const botao = await screen.findByText("Editar");
    fireEvent.click(botao);

    expect(screen.getByText("Modal Edição Aberto")).toBeInTheDocument();
  });

  it("deve aplicar filtros", async () => {
    getUnidade.mockResolvedValue(mockDiretoria);
    getComissoes.mockResolvedValue(mockComissoes);
    getMembrosComissao.mockResolvedValue(mockMembros);
    getMembrosComissaoFiltro.mockResolvedValue([{ uuid: "x" }]);

    render(<Comissoes />);

    const btnFiltrar = await screen.findByText("Filtrar");
    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      expect(getMembrosComissaoFiltro).toHaveBeenCalled();
    });
  });

  it("deve limpar filtros e recarregar membros", async () => {
    getUnidade.mockResolvedValue(mockDiretoria);
    getComissoes.mockResolvedValue(mockComissoes);
    getMembrosComissao.mockResolvedValue(mockMembros);

    render(<Comissoes />);

    const btnLimpar = await screen.findByText("Limpar");
    fireEvent.click(btnLimpar);

    await waitFor(() => {
      expect(getMembrosComissao).toHaveBeenCalled();
    });
  });

  it("deve exibir loading de membros", async () => {
    getUnidade.mockResolvedValue(mockDiretoria);
    getComissoes.mockResolvedValue(mockComissoes);

    getMembrosComissao.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockMembros), 200))
    );

    render(<Comissoes />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

