import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { ListaDeDespesas } from "../index";
import { ordenacaoDespesas, getDespesasTabelas, getTagInformacao, getListaDespesasPaginacao, ordenacaoDespesasPaginacao } from "../../../../../services/escolas/Despesas.service";
import { getSomaDosTotais } from "../../../../../services/escolas/RateiosDespesas.service";
import { visoesService } from "../../../../../services/visoes.service";
import { redirect } from "../../../../../utils/redirect";

jest.mock("react-router-dom", () => ({
    useNavigate: () => jest.fn(),
}));

jest.mock("../../../../../utils/redirect");

jest.mock("../../../../../services/escolas/Despesas.service");
jest.mock("../../../../../services/escolas/RateiosDespesas.service");
jest.mock("../../../../../services/visoes.service");
jest.mock("../../../../../services/mantemEstadoFiltrosUnidade.service", () => ({
    mantemEstadoFiltrosUnidade: {
        getEstadoDespesasFiltrosUnidades: jest.fn(() => ({})),
        setEstadoFiltrosUnidadesUsuario: jest.fn()
    }
}));

describe("ListaDeDespesas", () => {
    const mockDespesas = {
        results: [
            {
                uuid: "uuid-1",
                numero_documento: "123",
                status: "COMPLETO",
                data_documento: "2024-01-15",
                rateios: [
                    {
                        especificacao_material_servico: { descricao: "Material 1" },
                        valor_rateio: "100.50",
                        aplicacao_recurso: "Capital",
                        acao_associacao: { acao: { nome: "Ação 1" } }
                    }
                ]
            }
        ],
        count: 1
    };

    const mockSomaDosTotais = {
        total_despesas_sem_filtro: 1000,
        total_despesas_com_filtro: 500
    };

    beforeEach(() => {
        ordenacaoDespesas.mockResolvedValue(mockDespesas);
        ordenacaoDespesasPaginacao.mockResolvedValue(mockDespesas);
        getListaDespesasPaginacao.mockResolvedValue(mockDespesas);
        getSomaDosTotais.mockResolvedValue(mockSomaDosTotais);
        getDespesasTabelas.mockResolvedValue({
            tipos_aplicacao_recurso: [],
            acoes_associacao: [],
            contas_associacao: [],
            tags: []
        });
        getTagInformacao.mockResolvedValue([]);
        visoesService.getPermissoes = jest.fn().mockReturnValue(true);
        visoesService.getUsuarioLogin = jest.fn().mockReturnValue("usuario");
        
        Storage.prototype.getItem = jest.fn(() => null);
        Storage.prototype.removeItem = jest.fn();
        Storage.prototype.setItem = jest.fn();
    });

    it("renderiza o componente", () => {
        render(<ListaDeDespesas />);
        expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    it("renderiza botão de cadastrar despesa após carregamento", async () => {
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("Cadastrar despesa")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("renderiza botão Mais Filtros após carregamento", async () => {
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("Mais Filtros")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("renderiza tabela com dados da despesa", async () => {
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("Nº do documento")).toBeInTheDocument();
            expect(screen.getByText("123")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("exibe status COMPLETO", async () => {
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("Status: COMPLETO")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("exibe status RASCUNHO para despesas incompletas", async () => {
        const despesaIncompleta = {
            results: [{
                uuid: "uuid-2",
                numero_documento: "456",
                status: "INCOMPLETO",
                data_documento: "2024-01-20",
                rateios: []
            }],
            count: 1
        };
        ordenacaoDespesas.mockResolvedValue(despesaIncompleta);
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("Status: RASCUNHO")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("formata valor como moeda brasileira", async () => {
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("R$ 100,50")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("exibe mensagem quando não há despesas", async () => {
        ordenacaoDespesas.mockResolvedValue({ results: [], count: 0 });
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText(/A sua escola ainda não possui despesas cadastradas/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("exibe mensagem quando não encontra resultados com filtros", async () => {
        ordenacaoDespesas.mockResolvedValue({ results: [], count: 0 });
        const { container } = render(<ListaDeDespesas />);
        
        await waitFor(async () => {
            const btn = screen.getByText("Mais Filtros");
            btn.click();
        }, { timeout: 3000 });
    });

    it("desabilita botão cadastrar quando não tem permissão", async () => {
        visoesService.getPermissoes = jest.fn().mockReturnValue(false);
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            const btn = screen.getByText("Cadastrar despesa");
            expect(btn).toBeDisabled();
        }, { timeout: 3000 });
    });

    it("renderiza despesa sem rateios", async () => {
        const despesaSemRateios = {
            results: [{
                uuid: "uuid-3",
                numero_documento: "789",
                status: "COMPLETO",
                data_documento: "2024-01-25",
                rateios: []
            }],
            count: 1
        };
        ordenacaoDespesas.mockResolvedValue(despesaSemRateios);
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("789")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("renderiza despesa com imposto vinculado", async () => {
        const despesaComImposto = {
            results: [{
                uuid: "uuid-4",
                numero_documento: "100",
                status: "COMPLETO",
                data_documento: "2024-01-30",
                despesas_impostos: [{ uuid: "imposto-1" }],
                rateios: [{
                    especificacao_material_servico: { descricao: "Serviço 1" },
                    valor_rateio: "200.00",
                    aplicacao_recurso: "Custeio"
                }]
            }],
            count: 1
        };
        ordenacaoDespesas.mockResolvedValue(despesaComImposto);
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("100")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("renderiza despesa geradora de imposto", async () => {
        const despesaGeradoraImposto = {
            results: [{
                uuid: "uuid-5",
                numero_documento: "200",
                status: "COMPLETO",
                data_documento: "2024-02-01",
                despesa_geradora_do_imposto: { uuid: "geradora-1" },
                rateios: []
            }],
            count: 1
        };
        ordenacaoDespesas.mockResolvedValue(despesaGeradoraImposto);
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText("200")).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("renderiza data formatada corretamente", async () => {
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            expect(screen.getByText(/Data:/)).toBeInTheDocument();
            expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it("redireciona ao clicar em uma despesa normal", async () => {
        redirect.mockClear();
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            const row = screen.getByText("123");
            fireEvent.click(row);
        }, { timeout: 3000 });
        
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/edicao-de-despesa/uuid-1');
        }, { timeout: 1000 });
    });

    it("redireciona para despesa geradora quando existe", async () => {
        redirect.mockClear();
        const despesaComGeradora = {
            results: [{
                uuid: "uuid-imposto",
                numero_documento: "999",
                status: "COMPLETO",
                data_documento: "2024-03-10",
                despesa_geradora_do_imposto: { uuid: "uuid-geradora" },
                rateios: []
            }],
            count: 1
        };
        ordenacaoDespesas.mockResolvedValue(despesaComGeradora);
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            const row = screen.getByText("999");
            fireEvent.click(row);
        }, { timeout: 3000 });
        
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/edicao-de-despesa/uuid-geradora');
        }, { timeout: 1000 });
    });

    it("redireciona para recurso próprio quando existe", async () => {
        redirect.mockClear();
        const despesaRecursoProprio = {
            results: [{
                uuid: "uuid-recurso",
                numero_documento: "888",
                status: "COMPLETO",
                data_documento: "2024-03-15",
                receitas_saida_do_recurso: "receita-123",
                rateios: []
            }],
            count: 1
        };
        ordenacaoDespesas.mockResolvedValue(despesaRecursoProprio);
        render(<ListaDeDespesas />);
        
        await waitFor(() => {
            const row = screen.getByText("888");
            fireEvent.click(row);
        }, { timeout: 3000 });
        
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith('/cadastro-de-despesa-recurso-proprio/receita-123/uuid-recurso');
        }, { timeout: 1000 });
    });
});

