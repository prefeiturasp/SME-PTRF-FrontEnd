import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormFiltrosAvancados } from "../index";
import { getDespesasTabelas, getTagInformacao } from "../../../../../services/escolas/Despesas.service";

jest.mock("../../../../../services/escolas/Despesas.service");
jest.mock("../../../../../services/mantemEstadoFiltrosUnidade.service");
jest.mock("../../../../../services/visoes.service");

describe("FormFiltrosAvancados", () => {
    let mockProps;

    const mockDespesasTabelas = {
        tipos_aplicacao_recurso: [{ id: "1", nome: "Capital" }],
        acoes_associacao: [{ uuid: "uuid1", nome: "Ação 1" }],
        contas_associacao: [{ uuid: "conta1", nome: "Conta 1" }],
        tags: [{ id: 1, nome: "Tag 1" }]
    };

    const mockTagInformacao = [{ id: 1, nome: "Informação 1" }];

    beforeEach(() => {
        mockProps = {
            btnMaisFiltros: true,
            onClickBtnMaisFiltros: jest.fn(),
            iniciaLista: jest.fn(),
            reusltadoSomaDosTotais: jest.fn(),
            filtrosAvancados: {
                filtrar_por_termo: "",
                aplicacao_recurso: "",
                acao_associacao: "",
                despesa_status: "",
                fornecedor: "",
                data_inicio: "",
                data_fim: "",
                conta_associacao: "",
            },
            setFiltrosAvancados: jest.fn(),
            buscaDespesasOrdenacao: jest.fn(),
            setBuscaUtilizandoOrdenacao: jest.fn(),
            forcarPrimeiraPagina: jest.fn(),
            setLoading: jest.fn(),
            filtro_informacoes: [],
            set_filtro_informacoes: jest.fn(),
            filtro_vinculo_atividades: [],
            set_filtro_vinculo_atividades: jest.fn(),
            handleChangeFiltroInformacoes: jest.fn(),
            handleChangeFiltroVinculoAtividades: jest.fn(),
            limparOrdenacao: jest.fn(),
        };

        getDespesasTabelas.mockResolvedValue(mockDespesasTabelas);
        getTagInformacao.mockResolvedValue(mockTagInformacao);
    });

    it("renderiza o formulário com campos principais", () => {
        render(<FormFiltrosAvancados {...mockProps} />);
        
        expect(screen.getByPlaceholderText("Escreva o termo que deseja filtrar")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Escreva a razão social")).toBeInTheDocument();
        expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    it("atualiza campo de texto ao digitar", () => {
        render(<FormFiltrosAvancados {...mockProps} />);
        
        const input = screen.getByPlaceholderText("Escreva o termo que deseja filtrar");
        fireEvent.change(input, { target: { name: "filtrar_por_termo", value: "teste" } });
        
        expect(mockProps.setFiltrosAvancados).toHaveBeenCalledWith({
            ...mockProps.filtrosAvancados,
            filtrar_por_termo: "teste"
        });
    });

    it("atualiza campo select ao selecionar", () => {
        render(<FormFiltrosAvancados {...mockProps} />);
        
        const select = screen.getByLabelText("Status");
        fireEvent.change(select, { target: { name: "despesa_status", value: "COMPLETO" } });
        
        expect(mockProps.setFiltrosAvancados).toHaveBeenCalled();
    });

    it("submete o formulário com os filtros", () => {
        mockProps.filtrosAvancados.filtrar_por_termo = "material";
        render(<FormFiltrosAvancados {...mockProps} />);
        
        const btnFiltrar = screen.getByText("Filtrar");
        const form = btnFiltrar.closest("form");
        fireEvent.submit(form);
        
        expect(mockProps.setLoading).toHaveBeenCalledWith(true);
        expect(mockProps.reusltadoSomaDosTotais).toHaveBeenCalled();
        expect(mockProps.buscaDespesasOrdenacao).toHaveBeenCalled();
        expect(mockProps.setBuscaUtilizandoOrdenacao).toHaveBeenCalledWith(true);
        expect(mockProps.limparOrdenacao).toHaveBeenCalled();
    });

    it("limpa formulário ao clicar em Limpar Filtros", () => {
        render(<FormFiltrosAvancados {...mockProps} />);
        
        const btnLimpar = screen.getByText("Limpar Filtros");
        fireEvent.click(btnLimpar);
        
        expect(mockProps.iniciaLista).toHaveBeenCalled();
        expect(mockProps.reusltadoSomaDosTotais).toHaveBeenCalled();
        expect(mockProps.forcarPrimeiraPagina).toHaveBeenCalled();
        expect(mockProps.set_filtro_informacoes).toHaveBeenCalledWith([]);
        expect(mockProps.set_filtro_vinculo_atividades).toHaveBeenCalledWith([]);
    });

    it("cancela e fecha filtros ao clicar em Cancelar", () => {
        render(<FormFiltrosAvancados {...mockProps} />);
        
        const btnCancelar = screen.getByText("Cancelar");
        fireEvent.click(btnCancelar);
        
        expect(mockProps.onClickBtnMaisFiltros).toHaveBeenCalled();
        expect(mockProps.iniciaLista).toHaveBeenCalled();
        expect(mockProps.reusltadoSomaDosTotais).toHaveBeenCalled();
    });

    it("não renderiza quando btnMaisFiltros é false", () => {
        mockProps.btnMaisFiltros = false;
        const { container } = render(<FormFiltrosAvancados {...mockProps} />);
        
        const div = container.querySelector(".lista-de-despesas-invisible");
        expect(div).toBeInTheDocument();
    });
});
