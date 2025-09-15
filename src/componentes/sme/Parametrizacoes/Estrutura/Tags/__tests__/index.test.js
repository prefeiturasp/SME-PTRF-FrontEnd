import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
        render(<MemoryRouter><Tags /></MemoryRouter>);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("Testa a chamada de getFiltrosTags", async () => {
        getTodasTags.mockResolvedValue(mockData);
        render(<MemoryRouter><Tags /></MemoryRouter>);
        
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
        render(<MemoryRouter><Tags /></MemoryRouter>);
        
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
        render(<MemoryRouter><Tags /></MemoryRouter>);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
        await expect(screen.findByText(/COVID-19/i)).resolves.toBeInTheDocument();

        const filtro_nome = screen.getByLabelText(/filtrar por etiqueta\/tag/i);
        expect(filtro_nome).toBeInTheDocument();

        fireEvent.change(filtro_nome, { target: { value: 'COVID-19' } });
        expect(filtro_nome.value).toBe('COVID-19');

        const filtro_status = screen.getByLabelText(/filtrar por status/i);
        expect(filtro_status).toBeInTheDocument();

        fireEvent.change(filtro_status, { target: { value: 'ATIVO' } });
        expect(filtro_status.value).toBe('ATIVO');
    
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
        render(<MemoryRouter><Tags /></MemoryRouter>);

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
    render(<MemoryRouter><Tags /></MemoryRouter>);
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /adicionar etiqueta\/tag/i });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
    });
    return screen;
  };

  const preencherFormularioEConfirmar = async (nome, status) => {
    const input = screen.getByLabelText("Nome *");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: nome } });
    expect(input.value).toBe(nome);

    const status_input = screen.getByLabelText("Status *");
    expect(status_input).toBeInTheDocument();
    fireEvent.change(status_input, { target: { value: status } });
    expect(status_input.value).toBe(status);
    
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

    await preencherFormularioEConfirmar("Tag teste 5", "INATIVO");

    await waitFor(() => {
      expect(postCreateTag).toHaveBeenCalled();
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
        'Inclusão de etiqueta/tag realizada com sucesso.', 'A etiqueta/tag foi adicionada ao sistema com sucesso.'
      );
    });
  });

  it("Renderiza Operacao create falha non_field_errors", async () => {
    postCreateTag.mockRejectedValueOnce({
      response: { data: { non_field_errors: "Já existe um tipo de tag/etiqueta com esse nome" } },
    });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    getTodasTags.mockResolvedValue(mockData);

    const screen = await renderizarTelaEInteragirComBotaoAdicionar();

    await preencherFormularioEConfirmar("Tipo tag/etiqueta Teste", "ATIVO");

    // Verifica se o erro específico aparece
    await waitFor(() => {
      const toastCustomError = screen.getByText(/Ja existe uma tag com esse nome/i);
      expect(toastCustomError).toBeInTheDocument();
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        'Erro ao criar etiqueta/tag', 'Não foi possível criar a etiqueta/tag'
      );
    });
  });


  it("Renderiza Operacao create falha erro response", async () => {
    postCreateTag.mockRejectedValueOnce({
      response: { data: { nome: "Nome é obrigatório" } },
    });
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    const screen = await renderizarTelaEInteragirComBotaoAdicionar();

    await preencherFormularioEConfirmar("Tipo tag/etiqueta Teste", "ATIVO");

    await waitFor(() => {
      const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
      expect(toastCustomError).toBeInTheDocument();
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        'Erro ao criar etiqueta/tag', 'Não foi possível criar a etiqueta/tag'
      );
    });
  });
});

describe("Testes Operacao EDIT", () => {
  const setupAndClickAlterar = async () => {
      render(<MemoryRouter><Tags /></MemoryRouter>);

      await waitFor(() => {
          const tabela = screen.getByRole('table');
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
      getTodasTags.mockResolvedValue(mockData);
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("Renderiza Operacao edit sucesso", async () => {
      render(<MemoryRouter><Tags /></MemoryRouter>);

      await setupAndClickAlterar();

      const input = screen.getByLabelText("Nome *");
      expect(input).toBeInTheDocument();
      expect(input.value).toBe("COVID-19");

      const btnSalvar = screen.getByRole("button", { name: "Salvar" });
      expect(btnSalvar).toBeInTheDocument();
      expect(btnSalvar).toBeEnabled();

      fireEvent.change(input, { target: { value: "COVID-19 Atualizado" } });
      expect(input.value).toBe("COVID-19 Atualizado");
      
      fireEvent.click(btnSalvar);

      await waitFor(() => {
          expect(patchAlterarTag).toHaveBeenCalled();
          expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Edição da etiqueta/tag realizado com sucesso.', 'A etiqueta/tag foi editada no sistema com sucesso.'
          );
      });
  });

  it("Renderiza Operacao edit erro non_field_errors", async () => {
    patchAlterarTag.mockRejectedValueOnce({
        response: { data: { non_field_errors: "Ja existe uma tag com esse nome" } },
    });

    render(<MemoryRouter><Tags /></MemoryRouter>);

    await setupAndClickAlterar();

    const input = screen.getByLabelText("Nome *");
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("COVID-19");

    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    expect(btnSalvar).toBeInTheDocument();
    expect(btnSalvar).toBeEnabled();

    fireEvent.change(input, { target: { value: "COVID-19 Atualizado" } });
    expect(input.value).toBe("COVID-19 Atualizado");

    fireEvent.click(btnSalvar);

    await waitFor(() => {
        expect(patchAlterarTag).toHaveBeenCalled();
        const toastError = screen.getByText(/Ja existe uma tag com esse nome/i);
        expect(toastError).toBeInTheDocument();
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao atualizar etiqueta/tag', 'Não foi possível atualizar a etiqueta/tag'
        );
    });
  });

  it("Renderiza Operacao edit erro response", async () => {
    patchAlterarTag.mockRejectedValueOnce({
        response: { data: { nome: "Testando erro response" } },
    });

    render(<MemoryRouter><Tags /></MemoryRouter>);

    await setupAndClickAlterar();

    const input = screen.getByLabelText("Nome *");
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("COVID-19");

    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    expect(btnSalvar).toBeInTheDocument();
    expect(btnSalvar).toBeEnabled();

    fireEvent.change(input, { target: { value: "COVID-19" } });
    expect(input.value).toBe("COVID-19");

    fireEvent.click(btnSalvar);

    await waitFor(() => {
        expect(patchAlterarTag).toHaveBeenCalled();
        const toastError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
        expect(toastError).toBeInTheDocument();
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao atualizar etiqueta/tag', 'Não foi possível atualizar a etiqueta/tag'
        );
    });
  });
});

describe("Testes Operacao DELETE", ()=>{
  beforeEach(() => {
      jest.clearAllMocks();
      getTodasTags.mockResolvedValue(mockData);
  });

  it("Renderiza Operacao delete sucesso", async () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
      render(<MemoryRouter><Tags /></MemoryRouter>);

      await waitFor(()=> {
          const tabela = screen.getByRole('table');
          const linhas = tabela.querySelectorAll('tbody tr');
          const linha = linhas[0];
          const coluna = linha.querySelectorAll('td');
          const btnAlterar = coluna[2].querySelector('button');
          expect(btnAlterar).toBeInTheDocument();
          fireEvent.click(btnAlterar);
      });

      const botaoFormExcluir = screen.getByRole("button", { name: "Excluir" });
      expect(botaoFormExcluir).toBeInTheDocument();
      expect(botaoFormExcluir).toBeEnabled();
      fireEvent.click(botaoFormExcluir);

      const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

      const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-base-vermelho"));
      expect(botaoConfirmarExcluir).toBeInTheDocument();
      expect(botaoConfirmarExcluir).toBeEnabled();
      fireEvent.click(botaoConfirmarExcluir);

      await waitFor(() => {
          expect(deleteTag).toHaveBeenCalled();
          expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Remoção da etiqueta/tag efetuada com sucesso.', 'A etiqueta/tag foi removida do sistema com sucesso.'
          );
      });
  });

  it("Renderiza Operacao delete erro non_field_errors", async () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
      deleteTag.mockRejectedValueOnce({
          response: { data: { mensagem: "mensagem de erro" } },
      });
      render(<MemoryRouter><Tags /></MemoryRouter>);

      await waitFor(()=> {
          const tabela = screen.getByRole('table');
          const linhas = tabela.querySelectorAll('tbody tr');
          const linha = linhas[0];
          const coluna = linha.querySelectorAll('td');
          const btnAlterar = coluna[2].querySelector('button');
          expect(btnAlterar).toBeInTheDocument();
          fireEvent.click(btnAlterar);
      });

      const botaoFormExcluir = screen.getByRole("button", { name: "Excluir" });
      expect(botaoFormExcluir).toBeInTheDocument();
      expect(botaoFormExcluir).toBeEnabled();
      fireEvent.click(botaoFormExcluir);

      const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

      const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-base-vermelho"));
      expect(botaoConfirmarExcluir).toBeInTheDocument();
      expect(botaoConfirmarExcluir).toBeEnabled();
      fireEvent.click(botaoConfirmarExcluir);
      await waitFor(() => {
          expect(deleteTag).toHaveBeenCalled();
          expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao remover etiqueta/tag', 'Não foi possível remover a etiqueta/tag'
          );
      });
  });

  it("Renderiza Operacao delete erro response", async () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    deleteTag.mockRejectedValueOnce({
        response: { data: { nome: "Testando erro response" } },
    });
    render(<MemoryRouter><Tags /></MemoryRouter>);

    await waitFor(()=> {
        const tabela = screen.getByRole('table');
        const linhas = tabela.querySelectorAll('tbody tr');
        const linha = linhas[0];
        const coluna = linha.querySelectorAll('td');
        const btnAlterar = coluna[2].querySelector('button');
        expect(btnAlterar).toBeInTheDocument();
        fireEvent.click(btnAlterar);
    });

    const botaoFormExcluir = screen.getByRole("button", { name: "Excluir" });
    expect(botaoFormExcluir).toBeInTheDocument();
    expect(botaoFormExcluir).toBeEnabled();
    fireEvent.click(botaoFormExcluir);

    const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

    const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-base-vermelho"));
    expect(botaoConfirmarExcluir).toBeInTheDocument();
    expect(botaoConfirmarExcluir).toBeEnabled();
    fireEvent.click(botaoConfirmarExcluir);
    await waitFor(() => {
        expect(deleteTag).toHaveBeenCalled();
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro ao remover etiqueta/tag', 'Não foi possível remover a etiqueta/tag'
        );
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

  it('Deve lidar com erro ao criar tag', async () => {
      postCreateTag.mockRejectedValueOnce({
          response: { data: { non_field_errors: true } },
      });

      const handleSubmitModalForm = jest.fn(async (values) => {
          let payload = { ...values };
          if (values.operacao === 'create') {
              try {
                  await postCreateTag(payload);
              } catch (e) {
                  setErroExclusaoNaoPermitidaMock('Ja existe uma tag com esse nome.');
                  setShowModalInfoUpdateNaoPermitidoMock(true);
              }
          }
      });

      const values = { operacao: 'create', nome: 'Tag nova' };

      await handleSubmitModalForm(values);

      expect(postCreateTag).toHaveBeenCalledWith({
          operacao: 'create',
          nome: 'Tag nova',
      });
      expect(setErroExclusaoNaoPermitidaMock).toHaveBeenCalledWith('Ja existe uma tag com esse nome.');
      expect(setShowModalInfoUpdateNaoPermitidoMock).toHaveBeenCalledWith(true);
  });

  it('Deve atualizar tipo de documento com sucesso', async () => {
      patchAlterarTag.mockResolvedValueOnce({});

      const handleSubmitModalForm = jest.fn(async (values) => {
          let payload = { ...values };
          if (values.operacao === 'update') {
              await patchAlterarTag(values.uuid, payload);
          }
      });

      const values = { operacao: 'update', uuid: '1234', nome: 'Tag atualizada' };

      await handleSubmitModalForm(values);

      expect(patchAlterarTag).toHaveBeenCalledWith(
          '1234',
          { operacao: 'update', uuid: '1234', nome: 'Tag atualizada' }
      );
  });

  it('Deve criar um tipo de documento com sucesso quando operacao é "create"', async () => {
      const mockCarregaTodos = jest.fn();
      const setShowModalForm = jest.fn();

      postCreateTag.mockResolvedValueOnce({});
      const handleSubmitModalForm = jest.fn(async (values) => {
          let payload = { ...values };
          if (values.operacao === 'create') {
              await postCreateTag(payload);
              toastCustom.ToastCustomSuccess('Inclusão de etiqueta/tag realizada com sucesso.', 'A etiqueta/tag foi adicionada ao sistema com sucesso.');
              setShowModalForm(false);
              await mockCarregaTodos();
          }
      });

      const values = { operacao: 'create', nome: 'Tag de teste' };

      await handleSubmitModalForm(values);

      expect(postCreateTag).toHaveBeenCalledWith({ operacao: 'create', nome: 'Tag de teste' });
      expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
          'Inclusão de etiqueta/tag realizada com sucesso.', 'A etiqueta/tag foi adicionada ao sistema com sucesso.'
      );
      expect(setShowModalForm).toHaveBeenCalledWith(false);
      expect(mockCarregaTodos).toHaveBeenCalled();
      expect(values.operacao).toEqual('create');
  });

});