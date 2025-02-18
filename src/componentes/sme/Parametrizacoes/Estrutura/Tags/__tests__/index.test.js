import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tags } from '../index';
import {
    getTodasTags,
    getFiltrosTags,
    postCreateTag,
    patchAlterarTag,
    deleteTag
} from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { mockData } from '../__fixtures__/mockData';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getTodasTags: jest.fn(),
    getFiltrosTags: jest.fn(),
    postCreateTag: jest.fn(),
    patchAlterarTag: jest.fn(),
    deleteTag: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("Teste da página Tags", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getTodasTags.mockResolvedValue([]);
    });

    it('Renderiza a mensagem "Carregando..." ao abrir a página', () => {
        render(<Tags />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("Testa a chamada de getFiltrosTags", async () => {
        getTodasTags.mockResolvedValueOnce(mockData);
        render(<Tags />);
        
        await waitFor(() => {
          const filtroNome = screen.getByLabelText(/Filtrar por etiqueta\/tag/i);
          fireEvent.change(filtroNome, { target: { value: 'COVID-19' } });
          expect(filtroNome.value).toBe('COVID-19');
        });
        
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getFiltrosTags).toHaveBeenCalledWith('COVID-19', "");
        });
    });

    it("Testa a chamada de getFiltrosTags com filtro de status", async () => {
        getTodasTags.mockResolvedValueOnce(mockData);
        render(<Tags />);
        
        await waitFor(() => {
          const filtroNome = screen.getByLabelText(/Filtrar por etiqueta\/tag/i);
          fireEvent.change(filtroNome, { target: { value: 'COVID-19' } });
          expect(filtroNome.value).toBe('COVID-19');
        });
        
        const filtroStatus = screen.getByLabelText(/Filtrar por status/i);
        fireEvent.change(filtroStatus, { target: { value: 'ATIVO' } });
        expect(filtroStatus.value).toBe('ATIVO');
        
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getFiltrosTags).toHaveBeenCalledWith('COVID-19', 'ATIVO');
        });
    });

    it("Testa a chamada de limpar Filtros", async () => {
        getTodasTags.mockResolvedValueOnce(mockData);
        render(<Tags />);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
        await expect(screen.findByText(/COVID/i)).resolves.toBeInTheDocument();

        const filtro_nome = screen.getByLabelText(/filtrar por etiqueta\/tag/i);
        expect(filtro_nome).toBeInTheDocument();

        fireEvent.change(filtro_nome, { target: { value: 'COVID' } });
        expect(filtro_nome.value).toBe('COVID');
    
        const botao_limpar = screen.getByRole('button', { name: /Limpar/i });
        expect(botao_limpar).toBeInTheDocument();
        fireEvent.click(botao_limpar);
    
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    
        await waitFor(() => {
            const filtro_nome = screen.getByLabelText(/filtrar por etiqueta\/tag/i);
            expect(filtro_nome.value).toBe('');
        });
    });

    it("Carrega no modo Listagem com itens", async () => {
      getTodasTags.mockResolvedValueOnce(mockData);
        render(
            <Tags />
        );

        expect(screen.getByText(/Etiquetas\/Tags/i)).toBeInTheDocument();

        await waitFor(()=> {
            expect(getTodasTags).toHaveBeenCalledTimes(1);
            const item_tabela = screen.getByText("COVID-19")
            expect(item_tabela).toBeInTheDocument()
        });
    });
});

describe("Testes Operacao CREATE", () => {

  const renderizarTelaEInteragirComBotaoAdicionar = async () => {
    render(<Tags />);
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
    });
    return screen;
  };

  const preencherFormularioEConfirmar = async (nome) => {
    const input = screen.getByLabelText("Nome *");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: nome } });
    expect(input.value).toBe(nome);
    
    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    expect(btnSalvar).toBeInTheDocument();
    expect(btnSalvar).toBeEnabled();
    fireEvent.click(btnSalvar);
  };

  it("Renderiza Operacao create sucesso", async () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    getTodasTags.mockResolvedValue(mockData);

    const screen = await renderizarTelaEInteragirComBotaoAdicionar();

    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

    await preencherFormularioEConfirmar("Tag teste 5");

    await waitFor(() => {
      expect(postCreateTag).toHaveBeenCalled();
    });
  });

});
