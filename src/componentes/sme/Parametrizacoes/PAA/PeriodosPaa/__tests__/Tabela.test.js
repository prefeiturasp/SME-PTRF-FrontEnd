import { render, screen, fireEvent } from "@testing-library/react";
import { Tabela } from "../Tabela";
import { PeriodosPaaContext } from "../context/index";
import { useGet } from "../hooks/useGet";
import { MemoryRouter, useNavigate } from "react-router-dom";

jest.mock("../hooks/useGet");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

const mockEdit = {
  id: 1,
  referencia: "Referencia 1",
  uuid: "123",
  data_inicial: '2020-01-01',
  data_final: '2020-12-31',
  editavel: true,
  operacao: "edit",
  qtd_outros_recursos_habilitados: 1
}

const contexto = {
  handleEditFormModal: jest.fn(),
  handleExcluir: jest.fn(),
}
const renderComponent = () => {
  return render(
    <MemoryRouter>
      <PeriodosPaaContext.Provider value={contexto}>
        <Tabela />
      </PeriodosPaaContext.Provider>
    </MemoryRouter>
  );
}
describe("Tabela", () => {
  beforeEach(() => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  it("deve renderizar o loading", () => {
    
    useGet.mockReturnValue({
      isLoading: true,
      data: { results: [mockEdit] },
    })
    renderComponent();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve renderizar a tabela com dados", () => {
    
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [mockEdit] },
      total: 1,
    })
    renderComponent();
    expect(screen.getByText(mockEdit.referencia)).toBeInTheDocument();
  });

  it("deve renderizar uso de associacao 1 habilitado na tabela", () => {
    const result = mockEdit
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [result] },
      total: 1,
    })
    renderComponent();
    expect(screen.getByText(`${result.qtd_outros_recursos_habilitados} habilitado`)).toBeInTheDocument();
  });

  it("deve renderizar uso de associacao 0 habilitados na tabela", () => {
    const result = {...mockEdit, qtd_outros_recursos_habilitados: 0}
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [result] },
      total: 0,
    })
    renderComponent();
    expect(screen.getByText(`${result.qtd_outros_recursos_habilitados} habilitados`)).toBeInTheDocument();
  });

  it("deve renderizar uso de associacao com mais de 1 habilitados na tabela", () => {
    const result = {...mockEdit, qtd_outros_recursos_habilitados: 10}
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [result] },
      total: 0,
    })
    renderComponent();
    expect(screen.getByText(`${result.qtd_outros_recursos_habilitados} habilitados`)).toBeInTheDocument();
  });

  it("deve exibir mensagem quando não houver dados", () => {
    useGet.mockReturnValue({
      isLoading: false,
      data: { results: [] },
    });

    renderComponent();

    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("deve navegar para edição quando clicar no botão editar", async () => {
    
    renderComponent();

    const editButton = document.querySelector('.btn-Editar-periodo');
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/edicao-periodo-paa/:uuid'.replace(':uuid', mockEdit.uuid)
    );

  });

});
