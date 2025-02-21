import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TabelaArquivosDeCarga from './TabelaArquivosDeCarga';
import '@testing-library/jest-dom';

const conteudoTemplateMock = (rowData) => <div>{rowData.conteudo}</div>;
const dataTemplateMock = (rowData) => <div>{rowData.criado_em}</div>;
const dataHoraTemplateMock = (rowData) => <div>{rowData.ultima_execucao}</div>;
const statusTemplateMock = (rowData) => <div>{rowData.status}</div>;
const acoesTemplateMock = (rowData) => <div>{rowData.acoes}</div>;

describe('TabelaArquivosDeCarga', () => {
  const arquivosMock = [
    {
      identificador: '1',
      conteudo: 'Conteúdo 1',
      criado_em: '2022-01-01',
      status: 'Ativo',
      ultima_execucao: '2022-01-02',
      acoes: 'Ação 1'
    },
    {
      identificador: '2',
      conteudo: 'Conteúdo 2',
      criado_em: '2022-02-01',
      status: 'Inativo',
      ultima_execucao: '2022-02-02',
      acoes: 'Ação 2'
    },
  ];

  it('deve renderizar corretamente os dados da tabela', () => {
    render(
      <TabelaArquivosDeCarga
        arquivos={arquivosMock}
        rowsPerPage={5}
        conteudoTemplate={conteudoTemplateMock}
        dataTemplate={dataTemplateMock}
        dataHoraTemplate={dataHoraTemplateMock}
        statusTemplate={statusTemplateMock}
        acoesTemplate={acoesTemplateMock}
      />
    );

    expect(screen.getByText('Conteúdo 1')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo 2')).toBeInTheDocument();
    expect(screen.getByText('2022-01-01')).toBeInTheDocument();
    expect(screen.getByText('2022-02-01')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    expect(screen.getByText('Inativo')).toBeInTheDocument();
    expect(screen.getByText('Ação 1')).toBeInTheDocument();
    expect(screen.getByText('Ação 2')).toBeInTheDocument();
  });

  it('deve resetar a página quando os arquivos mudarem', () => {
    const { rerender } = render(
      <TabelaArquivosDeCarga
        arquivos={arquivosMock}
        rowsPerPage={5}
        conteudoTemplate={conteudoTemplateMock}
        dataTemplate={dataTemplateMock}
        dataHoraTemplate={dataHoraTemplateMock}
        statusTemplate={statusTemplateMock}
        acoesTemplate={acoesTemplateMock}
      />
    );

    expect(screen.getByText('Conteúdo 1')).toBeInTheDocument();

    const novosArquivosMock = [
      {
        identificador: '3',
        conteudo: 'Conteúdo 3',
        criado_em: '2022-03-01',
        status: 'Ativo',
        ultima_execucao: '2022-03-02',
        acoes: 'Ação 3'
      },
    ];

    rerender(
      <TabelaArquivosDeCarga
        arquivos={novosArquivosMock}
        rowsPerPage={5}
        conteudoTemplate={conteudoTemplateMock}
        dataTemplate={dataTemplateMock}
        dataHoraTemplate={dataHoraTemplateMock}
        statusTemplate={statusTemplateMock}
        acoesTemplate={acoesTemplateMock}
      />
    );

    expect(screen.getByText('Conteúdo 3')).toBeInTheDocument();
  });

  it('deve mudar a página corretamente ao interagir com a paginação', () => {
    render(
      <TabelaArquivosDeCarga
        arquivos={arquivosMock}
        rowsPerPage={1}
        conteudoTemplate={conteudoTemplateMock}
        dataTemplate={dataTemplateMock}
        dataHoraTemplate={dataHoraTemplateMock}
        statusTemplate={statusTemplateMock}
        acoesTemplate={acoesTemplateMock}
      />
    );

    expect(screen.getByText('Conteúdo 1')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button'); 

    const nextButton = buttons.find(button =>
      button.querySelector('.p-paginator-icon.pi-caret-right')
    );

    fireEvent.click(nextButton);
    
    expect(screen.getByText('Conteúdo 2')).toBeInTheDocument();
  });
});
