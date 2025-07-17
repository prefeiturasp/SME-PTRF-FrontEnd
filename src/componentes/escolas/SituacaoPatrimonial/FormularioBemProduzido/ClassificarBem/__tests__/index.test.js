import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ClassificarBem } from "../index";

describe("ClassificarBem - Transformação de especificação", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it("deve transformar especificação do bem de objeto para UUID corretamente", async () => {
    const mockSetBemProduzidoItems = jest.fn();
    const mockSetHabilitaCadastrarBem = jest.fn();
    
    render(
      <MemoryRouter>
        <ClassificarBem
          items={[
            {
              uuid: "test-uuid-1",
              num_processo_incorporacao: "1234567890123456",
              especificacao_do_bem: {
                id: 6372,
                uuid: "2de99664-4453-4c3b-9847-5bfc0567344b",
                descricao: "Analisador de voltagem",
                aplicacao_recurso: "CAPITAL",
                tipo_custeio: null,
                tipo_custeio_objeto: null,
                ativa: false
              },
              quantidade: 2,
              valor_individual: 7200,
            },
          ]}
          salvar={jest.fn()}
          salvarRacuscunho={jest.fn()}
          setBemProduzidoItems={mockSetBemProduzidoItems}
          setHabilitaCadastrarBem={mockSetHabilitaCadastrarBem}
          habilitaCadastrarBem={true}
          total={14400}
        />
      </MemoryRouter>
    );

    // Aguardar o componente carregar
    await waitFor(() => {
      expect(mockSetBemProduzidoItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            especificacao_do_bem: "2de99664-4453-4c3b-9847-5bfc0567344b"
          })
        ])
      );
    });
  });

  it("deve manter UUID quando especificação já é string", async () => {
    const mockSetBemProduzidoItems = jest.fn();
    const mockSetHabilitaCadastrarBem = jest.fn();
    
    render(
      <MemoryRouter>
        <ClassificarBem
          items={[
            {
              uuid: "test-uuid-1",
              num_processo_incorporacao: "1234567890123456",
              especificacao_do_bem: "2de99664-4453-4c3b-9847-5bfc0567344b",
              quantidade: 2,
              valor_individual: 7200,
            },
          ]}
          salvar={jest.fn()}
          salvarRacuscunho={jest.fn()}
          setBemProduzidoItems={mockSetBemProduzidoItems}
          setHabilitaCadastrarBem={mockSetHabilitaCadastrarBem}
          habilitaCadastrarBem={true}
          total={14400}
        />
      </MemoryRouter>
    );

    // Aguardar o componente carregar
    await waitFor(() => {
      expect(mockSetBemProduzidoItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            especificacao_do_bem: "2de99664-4453-4c3b-9847-5bfc0567344b"
          })
        ])
      );
    });
  });
}); 