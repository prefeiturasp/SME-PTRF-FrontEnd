import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabelaAssociacaoAcao } from '../TabelaAssociacaoAcao';

describe('TabelaAssociacaoAcao', () => {
  const mockUnidades =
  {
    "count": 2,
    "next": "http://localhost:8000/api/acoes-associacoes/?acao__uuid=ee8a43b7-0156-4025-b142-b1c5ba2a3790&filtro_informacoes=&nome=&page=2",
    "previous": null,
    "results": [
      {
        "uuid": "2b1c42d9-946a-40a2-bc25-bc4f62e3123e",
        "id": 7021,
        "associacao": {
          "uuid": "b74dff1e-5c53-4028-b99e-d04176a74116",
          "nome": "A P M DA EMEF MARIA DA CONCEICAO ALMEIDA",
          "cnpj": "58.712.318/0001-40",
          "status_valores_reprogramados": "VALORES_CORRETOS",
          "data_de_encerramento": null,
          "tooltip_data_encerramento": null,
          "tooltip_encerramento_conta": null,
          "unidade": {
            "uuid": "f5e5d8ac-7105-472f-b2de-c28c2cf9a3b6",
            "codigo_eol": "097533",
            "nome_com_tipo": "EMEF MARIA DA CONCEICAO ALMEIDA",
            "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO SÃO MATEUS"
          },
          "encerrada": false,
          "informacoes": []
        },
        "data_de_encerramento_associacao": null,
        "tooltip_associacao_encerrada": null,
        "acao": {
          "id": 13,
          "uuid": "dfg76u9f-0156-4dba-c81b-abc123c7985b",
          "nome": "Educom - Imprensa Jovem",
          "e_recursos_proprios": false,
          "posicao_nas_pesquisas": "AAAAAAAAA",
          "aceita_capital": true,
          "aceita_custeio": true,
          "aceita_livre": false
        },
        "status": "ATIVA",
        "criado_em": "2021-07-15T14:22:01.123456"
      },
      {
        "uuid": "431d63e2-9437-48c5-93d5-b4238f20781c",
        "id": 7022,
        "associacao": {
          "uuid": "d38cb5db-7639-44da-b173-8c2e7f8f998b",
          "nome": "A P M DA EMEF PROF. HENRIQUE PINHEIRO",
          "cnpj": "47.711.535/0001-90",
          "status_valores_reprogramados": "VALORES_CORRETOS",
          "data_de_encerramento": null,
          "tooltip_data_encerramento": null,
          "tooltip_encerramento_conta": null,
          "unidade": {
            "uuid": "8a420a94-cf1a-4b52-8b8d-f23e28e073b9",
            "codigo_eol": "094743",
            "nome_com_tipo": "EMEF PROFESSOR HENRIQUE PINHEIRO",
            "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO CAMPO LIMPO"
          },
          "encerrada": false,
          "informacoes": []
        },
        "data_de_encerramento_associacao": null,
        "tooltip_associacao_encerrada": null,
        "acao": {
          "id": 13,
          "uuid": "dfg76u9f-0156-4dba-c81b-abc123c7985b",
          "nome": "Educom - Imprensa Jovem",
          "e_recursos_proprios": false,
          "posicao_nas_pesquisas": "AAAAAAAAA",
          "aceita_capital": true,
          "aceita_custeio": true,
          "aceita_livre": false
        },
        "status": "ATIVA",
        "criado_em": "2021-07-15T14:45:30.345678"
      }
    ]
  };

  const mockSelecionarHeader = jest.fn(() => 'Selecionar Header');
  const mockSelecionarTemplate = jest.fn(() => 'Selecionar Template');
  const mockAcoesTemplate = jest.fn(() => 'Ações Template');
  const mockOnPageChange = jest.fn();

  it('deve renderizar o componente corretamente', () => {
    render(
      <TabelaAssociacaoAcao
        unidades={mockUnidades}
        rowsPerPage={10}
        selecionarHeader={mockSelecionarHeader}
        selecionarTemplate={mockSelecionarTemplate}
        acoesTemplate={mockAcoesTemplate}
        onPageChange={mockOnPageChange}
        firstPage={1}
      />
    );

    expect(screen.getByText('Código Eol')).toBeInTheDocument();
    expect(screen.getByText('Nome UE')).toBeInTheDocument();
    expect(screen.getByText('Informações')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve chamar a função onPageChange ao clicar no Paginator', () => {
    render(
      <TabelaAssociacaoAcao
        unidades={mockUnidades}
        rowsPerPage={10}
        selecionarHeader={mockSelecionarHeader}
        selecionarTemplate={mockSelecionarTemplate}
        acoesTemplate={mockAcoesTemplate}
        onPageChange={mockOnPageChange}
        firstPage={1}
      />
    );

    const paginatorButton = screen.getByText('1');
    fireEvent.click(paginatorButton);

    expect(mockOnPageChange).toHaveBeenCalled();
  });
});
