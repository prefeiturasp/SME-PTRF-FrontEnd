import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { InformarValores } from "../../InformarValores/index";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Modal as modalReducer } from "../../../../../../store/reducers/componentes/Globais/Modal/reducer";

import React from "react";

const mockUseNavigate = jest.fn();
const mockBemProduzidoDespesas = [
  {
    bem_produzido_despesa_uuid: "234cd9fb-adaf-4c29-83e7-f75b04c06cc2",
    bem_produzido_uuid: "a6bb041d-cc53-4e81-9a59-b43c1e86f956",
    despesa: {
      uuid: "307b5b34-c42e-404f-81ab-e6f1b4025085",
      associacao: "e7837d4a-9227-4f71-ae69-922549d7bb1c",
      numero_documento: "816",
      status: "COMPLETO",
      tipo_documento: {
        id: 6,
        nome: "NFS-e",
      },
      data_documento: "2023-02-24",
      cpf_cnpj_fornecedor: "22.900.952/0001-02",
      nome_fornecedor: "GIUSEPPE NAIMO ME",
      valor_total: "790.00",
      valor_ptrf: 790,
      data_transacao: "2023-02-24",
      tipo_transacao: {
        id: 1,
        nome: "Cheque",
        tem_documento: true,
      },
      documento_transacao: "850561",
      rateios: [
        {
          uuid: "867eb045-15aa-433a-a27b-d0d5803e7f55",
          bem_produzido_rateio_uuid: "e874a8af-b757-4853-8784-d92c1298bb1b",
          valor_disponivel: 90,
          valor_rateio: "790.00",
          valor_utilizado: 700,
          aplicacao_recurso: "CUSTEIO",
          conta_associacao: {
            uuid: "d7cf7c03-bc2f-427f-a35f-62076fab0e1b",
            tipo_conta: {
              uuid: "38c381e1-6a11-44a9-a2dd-39243799fac1",
              id: 1,
              nome: "Cheque",
              banco_nome: "",
              agencia: "",
              numero_conta: "",
              numero_cartao: "",
              apenas_leitura: false,
              permite_inativacao: true,
            },
            associacao: {
              uuid: "e7837d4a-9227-4f71-ae69-922549d7bb1c",
              ccm: "3.758.595-9",
              cnpj: "61.056.321/0001-00",
              email: "emebsneusabasseto@sme.prefeitura.sp.gov.br",
              nome: "ASSOCIACAO DE PAIS E MESTRES DA EMEBS PROFESSORA NEUSA BASSETTO",
              unidade: {
                uuid: "7a6133aa-b3c2-430e-8580-49f3e2fccf3f",
                codigo_eol: "000329",
                tipo_unidade: "EMEBS",
                nome: "NEUSA BASSETTO, PROFA.",
                nome_com_tipo: "EMEBS NEUSA BASSETTO, PROFA.",
                sigla: "",
                dre: {
                  uuid: "d5fb851a-089b-4a1a-abf2-fc270a48a2d7",
                  codigo_eol: "108900",
                  tipo_unidade: "DRE",
                  nome: "DIRETORIA REGIONAL DE EDUCACAO PENHA",
                  sigla: "P",
                },
              },
              id: 1097,
              processo_regularidade: "6016.2023/0021185-9",
            },
            status: "ATIVA",
          },
          acao_associacao: {
            uuid: "3dcf3205-30e2-4a9f-83e7-52cdb1a07465",
            acao: {
              id: 3,
              uuid: "bdcbc8ce-7bab-48b3-959a-f866c6644579",
              nome: "PTRF Básico",
              e_recursos_proprios: false,
              posicao_nas_pesquisas: "AAAAAAAAAA",
              aceita_capital: true,
              aceita_custeio: true,
              aceita_livre: true,
            },
            associacao: {
              uuid: "e7837d4a-9227-4f71-ae69-922549d7bb1c",
              ccm: "3.758.595-9",
              cnpj: "61.056.321/0001-00",
              email: "emebsneusabasseto@sme.prefeitura.sp.gov.br",
              nome: "ASSOCIACAO DE PAIS E MESTRES DA EMEBS PROFESSORA NEUSA BASSETTO",
              unidade: {
                uuid: "7a6133aa-b3c2-430e-8580-49f3e2fccf3f",
                codigo_eol: "000329",
                tipo_unidade: "EMEBS",
                nome: "NEUSA BASSETTO, PROFA.",
                nome_com_tipo: "EMEBS NEUSA BASSETTO, PROFA.",
                sigla: "",
                dre: {
                  uuid: "d5fb851a-089b-4a1a-abf2-fc270a48a2d7",
                  codigo_eol: "108900",
                  tipo_unidade: "DRE",
                  nome: "DIRETORIA REGIONAL DE EDUCACAO PENHA",
                  sigla: "P",
                },
              },
              id: 1097,
              processo_regularidade: "6016.2023/0021185-9",
            },
            status: "ATIVA",
          },
          especificacao_material_servico: {
            id: 6316,
            uuid: "814be876-3c83-473a-b216-7bfa7ea3b088",
            descricao:
              "Conserto, restauração, manutenção e conservação de máquinas, aparelhos, equipamentos, motores, elevadores",
            aplicacao_recurso: "CUSTEIO",
            tipo_custeio: 3,
            tipo_custeio_objeto: {
              nome: "Serviço",
              id: 3,
              uuid: "fc224e09-9ffb-44dc-add8-17a79e969dd9",
              eh_tributos_e_tarifas: false,
            },
            ativa: true,
          },
          tipo_documento_nome: "NFS-e",
        },
      ],
      periodo_referencia: "2023.1",
    },
  },
];

jest.mock("react-router-dom-v5-compat", () => ({
  ...jest.requireActual("react-router-dom-v5-compat"),
  useNavigate: () => mockUseNavigate,
}));

const mockSetDespesasSelecionadas = jest.fn();

jest
  .spyOn(React, "useState")
  .mockReturnValue([mockBemProduzidoDespesas, mockSetDespesasSelecionadas]);

const rootReducer = combineReducers({
  Modal: modalReducer,
});
const mockStore = createStore(rootReducer);

let queryClient;

describe("InformarValores", () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it("Deve solicitar confirmação ao clicar em Excluir despesa", async () => {
    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <InformarValores
              uuid={null}
              podeEditar={true}
              despesas={mockBemProduzidoDespesas}
              salvarRascunhoInformarValores={jest.fn()}
            />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );

    const buttonExcluir = screen.getByRole("button", {
      name: "Excluir despesa",
    });
    fireEvent.click(buttonExcluir);

    expect(
      screen.findByText("Tem certeza que deseja excluir a despesa selecionada?")
    ).toBeInTheDocument();
  });

  it("Deve voltar para a página de listagem ao clicar no botão cancelar", async () => {
    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <QueryClientProvider client={queryClient}>
            <InformarValores
              uuid={null}
              podeEditar={true}
              despesas={mockBemProduzidoDespesas}
              salvarRascunhoInformarValores={jest.fn()}
            />
          </QueryClientProvider>
        </Provider>
      </MemoryRouter>
    );

    const buttonCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(buttonCancelar);

    expect(mockUseNavigate).toHaveBeenCalledWith(-1);
  });
});
