import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { 
  URLS, 
  UrlsMenuInterno, 
  retornaMenuAtualizadoPorStatusCadastro 
} from "../UrlsMenuInterno";
import { IconeDadosDaAssociacaoPendentes } from "../IconeDadosDaAssociacaoPendentes";

jest.mock("../IconeDadosDaAssociacaoPendentes", () => ({
  IconeDadosDaAssociacaoPendentes: () => (
    <div data-testid="icone-pendente">Ícone Pendente</div>
  )
}));

describe("Constantes e funções do menu interno", () => {
  afterEach(() => {
    cleanup();
  });

  describe("URLS", () => {
    test("deve conter as URLs corretas", () => {
      expect(URLS).toEqual({
        DADOS_ASSOCIACAO: 'dados-da-associacao',
        MEMBROS_ASSOCIACAO: 'membros-da-associacao',
        CONTAS_ASSOCIACAO: 'dados-das-contas-da-associacao'
      });
    });
  });

  describe("UrlsMenuInterno", () => {
    test("deve conter os itens de menu corretos", () => {
      expect(UrlsMenuInterno).toEqual([
        {label: "Dados da Associação", url: URLS.DADOS_ASSOCIACAO},
        {label: "Membros", url: URLS.MEMBROS_ASSOCIACAO},
        {label: "Dados das contas", url: URLS.CONTAS_ASSOCIACAO},
      ]);
    });
  });

  describe("retornaMenuAtualizadoPorStatusCadastro", () => {
    test("retorna menu original quando não há pendências", () => {
      const statusCadastro = {
        pendencia_cadastro: false,
        pendencia_membros: false,
        pendencia_contas: false
      };
      
      const resultado = retornaMenuAtualizadoPorStatusCadastro(statusCadastro);
      
      expect(resultado).toEqual(UrlsMenuInterno);
      resultado.forEach(item => {
        expect(item).not.toHaveProperty('iconRight');
      });
    });

    test("adiciona ícone de pendência apenas para Dados da Associação quando há pendência", () => {
      const statusCadastro = {
        pendencia_cadastro: true,
        pendencia_membros: false,
        pendencia_contas: false
      };
      
      const resultado = retornaMenuAtualizadoPorStatusCadastro(statusCadastro);
      
      const itemComPendencia = resultado.find(item => item.url === URLS.DADOS_ASSOCIACAO);
      expect(itemComPendencia).toHaveProperty('iconRight');
      
      render(itemComPendencia.iconRight);
      expect(screen.getByTestId("icone-pendente")).toBeInTheDocument();
      
      const outrosItens = resultado.filter(item => item.url !== URLS.DADOS_ASSOCIACAO);
      outrosItens.forEach(item => {
        expect(item).not.toHaveProperty('iconRight');
      });
    });

    test("adiciona ícone de pendência apenas para Membros quando há pendência", () => {
      const statusCadastro = {
        pendencia_cadastro: false,
        pendencia_membros: true,
        pendencia_contas: false
      };
      
      const resultado = retornaMenuAtualizadoPorStatusCadastro(statusCadastro);
      
      const itemComPendencia = resultado.find(item => item.url === URLS.MEMBROS_ASSOCIACAO);
      expect(itemComPendencia).toHaveProperty('iconRight');
      
      render(itemComPendencia.iconRight);
      expect(screen.getByTestId("icone-pendente")).toBeInTheDocument();
      
      const outrosItens = resultado.filter(item => item.url !== URLS.MEMBROS_ASSOCIACAO);
      outrosItens.forEach(item => {
        expect(item).not.toHaveProperty('iconRight');
      });
    });

    test("adiciona ícone de pendência apenas para Contas quando há pendência", () => {
      const statusCadastro = {
        pendencia_cadastro: false,
        pendencia_membros: false,
        pendencia_contas: true
      };
      
      const resultado = retornaMenuAtualizadoPorStatusCadastro(statusCadastro);
      
      const itemComPendencia = resultado.find(item => item.url === URLS.CONTAS_ASSOCIACAO);
      expect(itemComPendencia).toHaveProperty('iconRight');
      
      render(itemComPendencia.iconRight);
      expect(screen.getByTestId("icone-pendente")).toBeInTheDocument();
      
      const outrosItens = resultado.filter(item => item.url !== URLS.CONTAS_ASSOCIACAO);
      outrosItens.forEach(item => {
        expect(item).not.toHaveProperty('iconRight');
      });
    });

    test("adiciona ícone de pendência para todos os itens quando há pendências em todos", () => {
      const statusCadastro = {
        pendencia_cadastro: true,
        pendencia_membros: true,
        pendencia_contas: true
      };
      
      const resultado = retornaMenuAtualizadoPorStatusCadastro(statusCadastro);
      
      resultado.forEach(item => {
        expect(item).toHaveProperty('iconRight');
        
        cleanup();
        render(item.iconRight);
        expect(screen.getByTestId("icone-pendente")).toBeInTheDocument();
      });
    });

    test("retorna menu original quando statusCadastro é undefined", () => {
      const resultado = retornaMenuAtualizadoPorStatusCadastro(undefined);
      expect(resultado).toEqual(UrlsMenuInterno);
    });

    test("retorna menu original quando statusCadastro é null", () => {
      const resultado = retornaMenuAtualizadoPorStatusCadastro(null);
      expect(resultado).toEqual(UrlsMenuInterno);
    });
  });
});