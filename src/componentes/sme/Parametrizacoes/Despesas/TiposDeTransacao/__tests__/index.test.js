import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TiposDeTransacao } from '..';
import { getTiposDeTransacao, getFiltrosTiposDeTransacao, postTipoDeTransacao, patchTipoDeTransacao, deleteTipoDeTransacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { mockData } from '../__fixtures__/mockData';

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getTiposDeTransacao: jest.fn(),
    getFiltrosTiposDeTransacao: jest.fn(),
    postTipoDeTransacao: jest.fn(),
    patchTipoDeTransacao: jest.fn(),
    deleteTipoDeTransacao: jest.fn(),
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

describe("Carrega página de tipo de transação", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getTiposDeTransacao.mockResolvedValue(mockData);
    });

    it('Renderiza a mensagem "Carregando..." ao abrir a página', () => {
      render(<TiposDeTransacao />);
      expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("Testa a chamada de getFiltrosTiposDeTransacao", async () => {
        getTiposDeTransacao.mockResolvedValueOnce(mockData);
        render(<TiposDeTransacao />);

        await waitFor(() => {
            const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
            expect(filtro_nome).toBeInTheDocument();

            fireEvent.change(filtro_nome, { target: { value: 'Cartão' } });
            expect(filtro_nome.value).toBe('Cartão');

        });
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getFiltrosTiposDeTransacao).toHaveBeenCalledWith('Cartão');
        });
    });

    it("Testa a chamada de limpar Filtros", async () => {
      getTiposDeTransacao.mockResolvedValue(mockData);
      render(<TiposDeTransacao />);
  
      expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
      await expect(screen.findByText(/Cartão/i)).resolves.toBeInTheDocument();

      const filtro_nome = screen.getByLabelText(/filtrar por nome/i);
      expect(filtro_nome).toBeInTheDocument();
  
      fireEvent.change(filtro_nome, { target: { value: 'Cartão' } });
      expect(filtro_nome.value).toBe('Cartão');
  
      const botao_limpar = screen.getByRole('button', { name: /Limpar/i });
      expect(botao_limpar).toBeInTheDocument();
      fireEvent.click(botao_limpar);
  
      expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  
      await waitFor(() => expect(screen.getByText(/Cartão/i)).toBeInTheDocument());
  
      await waitFor(() => {
          const filtro_nome = screen.getByLabelText(/filtrar por nome/i);
          expect(filtro_nome.value).toBe('');
      });
    });

    it("Carrega no modo Listagem com itens", async () => {
      getTiposDeTransacao.mockResolvedValueOnce(mockData);
        render(
            <TiposDeTransacao />
        );

        expect(screen.getByText(/Tipos de transação/i)).toBeInTheDocument();

        await waitFor(()=> {
            expect(getTiposDeTransacao).toHaveBeenCalledTimes(1);
            const item_tabela = screen.getByText("Cartão")
            expect(item_tabela).toBeInTheDocument()
        });
    });

    it("Carrega no modo Listagem vazia", async () => {
        const mockData = [];
        getTiposDeTransacao.mockResolvedValue(mockData)
        render(
            <TiposDeTransacao />
        );

        await waitFor(()=> expect(getTiposDeTransacao).toHaveBeenCalled());
        await waitFor(()=> {
            expect(screen.getByText(/Nenhum resultado encontrado./i)).toBeInTheDocument()
        });
    });

});

describe("Testes Operacao CREATE", () => {

  const renderizarTelaEInteragirComBotaoAdicionar = async () => {
    render(<TiposDeTransacao />);
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /adicionar tipo de transação/i });
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
    getTiposDeTransacao.mockResolvedValue(mockData);

    const screen = await renderizarTelaEInteragirComBotaoAdicionar();

    // Testa se as mensagens de erro obrigatórias aparecem
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

    // Preenche o formulário e clica em "Salvar"
    await preencherFormularioEConfirmar("Tipo transação Teste");

    // Verifica se o postTipoDeTransacao foi chamado
    await waitFor(() => {
      expect(postTipoDeTransacao).toHaveBeenCalled();
    });
  });

  it("Renderiza Operacao create falha non_field_errors", async () => {
    postTipoDeTransacao.mockRejectedValueOnce({
      response: { data: { non_field_errors: "Já existe um tipo de transação com esse nome" } },
    });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    const screen = await renderizarTelaEInteragirComBotaoAdicionar();

    // Preenche o formulário e clica em "Salvar"
    await preencherFormularioEConfirmar("Tipo transação Teste");

    // Verifica se o erro específico aparece
    await waitFor(() => {
      const toastCustomError = screen.getByText(/Já existe um tipo de transação com esse nome/i);
      expect(toastCustomError).toBeInTheDocument();
    });
  });

  it("Renderiza Operacao create falha erro response", async () => {
    postTipoDeTransacao.mockRejectedValueOnce({
      response: { data: { nome: "Campo obrigatório" } },
    });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    const screen = await renderizarTelaEInteragirComBotaoAdicionar();

    // Preenche o formulário e clica em "Salvar"
    await preencherFormularioEConfirmar("Tipo transação Teste");

    // Verifica se a mensagem de erro genérica aparece
    await waitFor(() => {
      const toastCustomError = screen.getByText(/Erro ao criar tipo de transação. Tente novamente./i);
      expect(toastCustomError).toBeInTheDocument();
    });
  });

});

describe("Testes Operacao EDIT", () => {
  const setupAndClickAlterar = async () => {
      render(<TiposDeTransacao />);

      await waitFor(() => {
          const tabela = screen.getByRole('grid');
          const linhas = tabela.querySelectorAll('tbody tr');
          const linha = linhas[0];
          const coluna = linha.querySelectorAll('td');
          const btnAlterar = coluna[2].querySelector('button');
          expect(btnAlterar).toBeInTheDocument();
          fireEvent.click(btnAlterar);
      });
  };

  beforeEach(() => {
      jest.clearAllMocks();
      getTiposDeTransacao.mockResolvedValue(mockData);
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("Renderiza Operacao edit sucesso", async () => {
      render(<TiposDeTransacao />);

      await setupAndClickAlterar();

      const input = screen.getByLabelText("Nome *");
      expect(input).toBeInTheDocument();
      expect(input.value).toBe("Cartão");

      const btnSalvar = screen.getByRole("button", { name: "Salvar" });
      expect(btnSalvar).toBeInTheDocument();
      expect(btnSalvar).toBeEnabled();

      fireEvent.change(input, { target: { value: "Cartão Atualizado" } });
      expect(input.value).toBe("Cartão Atualizado");
      
      fireEvent.click(btnSalvar);

      await waitFor(() => {
          expect(patchTipoDeTransacao).toHaveBeenCalled();
      });
  });

  it("Renderiza Operacao edit erro non_field_errors", async () => {
      patchTipoDeTransacao.mockRejectedValueOnce({
          response: { data: { non_field_errors: "Ja existe um tipo de transação com esse nome" } },
      });

      render(<TiposDeTransacao />);

      await setupAndClickAlterar();

      const input = screen.getByLabelText("Nome *");
      expect(input).toBeInTheDocument();
      expect(input.value).toBe("Cartão");

      const btnSalvar = screen.getByRole("button", { name: "Salvar" });
      expect(btnSalvar).toBeInTheDocument();
      expect(btnSalvar).toBeEnabled();

      fireEvent.change(input, { target: { value: "Cartão Atualizado" } });
      expect(input.value).toBe("Cartão Atualizado");

      fireEvent.click(btnSalvar);

      await waitFor(() => {
          expect(patchTipoDeTransacao).toHaveBeenCalled();
          const toastError = screen.getByText(/Ja existe um tipo de transação com esse nome/i);
          expect(toastError).toBeInTheDocument();
      });
  });

  it("Renderiza Operacao edit erro response", async () => {
      patchTipoDeTransacao.mockRejectedValueOnce({
          response: { data: { nome: "Testando erro response" } },
      });

      render(<TiposDeTransacao />);

      await setupAndClickAlterar();

      const input = screen.getByLabelText("Nome *");
      expect(input).toBeInTheDocument();
      expect(input.value).toBe("Cartão");

      const btnSalvar = screen.getByRole("button", { name: "Salvar" });
      expect(btnSalvar).toBeInTheDocument();
      expect(btnSalvar).toBeEnabled();

      fireEvent.change(input, { target: { value: "Cartão" } });
      expect(input.value).toBe("Cartão");

      fireEvent.click(btnSalvar);

      await waitFor(() => {
          expect(patchTipoDeTransacao).toHaveBeenCalled();
          const toastError = screen.getByText(/Erro ao atualizar tipo de transação. Tente novamente./i);
          expect(toastError).toBeInTheDocument();
      });
  });
});


describe("Testes Operacao DELETE", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        getTiposDeTransacao.mockResolvedValue(mockData);
    });

    it("Renderiza Operacao delete sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        render(<TiposDeTransacao/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Apagar" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => 
          btn.classList.contains("btn") && btn.classList.contains("btn-danger"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeTransacao).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteTipoDeTransacao.mockRejectedValueOnce({
            response: { data: { mensagem: "mensagem de erro" } },
        });
        render(<TiposDeTransacao/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Apagar" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => 
          btn.classList.contains("btn") && btn.classList.contains("btn-danger"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeTransacao).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteTipoDeTransacao.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(<TiposDeTransacao/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Apagar" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => 
          btn.classList.contains("btn") && btn.classList.contains("btn-danger"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeTransacao).toHaveBeenCalled();
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    let setErroExclusaoNaoPermitidaMock;
    let setShowModalInfoUpdateNaoPermitidoMock;

    beforeEach(() => {
        setErroExclusaoNaoPermitidaMock = jest.fn();
        setShowModalInfoUpdateNaoPermitidoMock = jest.fn();
    });

    it('Deve lidar com erro ao criar tipo de documento', async () => {
        postTipoDeTransacao.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                try {
                    await postTipoDeTransacao(payload);
                } catch (e) {
                    setErroExclusaoNaoPermitidaMock('Este tipo de transação já existe.');
                    setShowModalInfoUpdateNaoPermitidoMock(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Cartão' };

        await handleSubmitModalForm(values);

        expect(postTipoDeTransacao).toHaveBeenCalledWith({
            operacao: 'create',
            nome: 'Cartão',
        });
        expect(setErroExclusaoNaoPermitidaMock).toHaveBeenCalledWith('Este tipo de transação já existe.');
        expect(setShowModalInfoUpdateNaoPermitidoMock).toHaveBeenCalledWith(true);
    });

    it('Deve atualizar tipo de documento com sucesso', async () => {
        patchTipoDeTransacao.mockResolvedValueOnce({});

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'update') {
                await patchTipoDeTransacao(values.uuid, payload);
            }
        });

        const values = { operacao: 'update', uuid: '1234', nome: 'Tipo de transação atualizado' };

        await handleSubmitModalForm(values);

        expect(patchTipoDeTransacao).toHaveBeenCalledWith(
            '1234',
            { operacao: 'update', uuid: '1234', nome: 'Tipo de transação atualizado' }
        );
    });

    it('Deve criar um tipo de documento com sucesso quando operacao é "create"', async () => {
        const mockCarregaTodos = jest.fn();
        const setShowModalForm = jest.fn();

        postTipoDeTransacao.mockResolvedValueOnce({});
        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                await postTipoDeTransacao(payload);
                toastCustom.ToastCustomSuccess('Inclusão de tipo de transação realizado com sucesso.', 'O tipo de transação foi adicionado ao sistema com sucesso.');
                setShowModalForm(false);
                await mockCarregaTodos();
            }
        });

        const values = { operacao: 'create', nome: 'Tipo de transaçao teste' };

        await handleSubmitModalForm(values);

        expect(postTipoDeTransacao).toHaveBeenCalledWith({ operacao: 'create', nome: 'Tipo de transaçao teste' });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão de tipo de transação realizado com sucesso.',
            'O tipo de transação foi adicionado ao sistema com sucesso.'
        );
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(mockCarregaTodos).toHaveBeenCalled();
        expect(values.operacao).toEqual('create');
    });

});
