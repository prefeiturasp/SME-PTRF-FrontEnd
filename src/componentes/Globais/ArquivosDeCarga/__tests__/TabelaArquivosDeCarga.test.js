import React, {useCallback} from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faCogs, faDownload, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import TabelaArquivosDeCarga from '../TabelaArquivosDeCarga';
import {
    mockTabelaArquivos as tabelaArquivos,
    mockListaArquivos as listaArquivos
 } from "../__fixtures__/mockData";

 
// Mock da função handleEditFormModal
const mockHandleClickProcessarArquivoDeCarga = jest.fn();
const mockHandleClickEditarArquivos = jest.fn();
const mockHandleClickDownloadArquivoDeCarga = jest.fn();
const mockHandleClickDeleteArquivoDeCarga = jest.fn();

jest.mock('../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes = require('../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes').RetornaSeTemPermissaoEdicaoPainelParametrizacoes;
mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes()

const temPermissaoEditarCarga = () => {
    return TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES;
}

// Mock da callback acoesTemplate
const mockAcoesTemplate = (rowData) => {
    return (
        <div className="dropdown">
            <span id="linkDropdownAcoes" role="button" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>
            </span>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <button onClick={()=>mockHandleClickProcessarArquivoDeCarga(rowData)} className="btn btn-link dropdown-item fonte-14" type="button" disabled={!temPermissaoEditarCarga()}>
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                        icon={faCogs}
                    />
                    <strong>Processar</strong>
                </button>
                <button onClick={() => mockHandleClickEditarArquivos(rowData)} className="btn btn-link dropdown-item fonte-14" type="button" disabled={!temPermissaoEditarCarga()}>
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                        icon={faEdit}
                    />
                    <strong>Editar</strong>
                </button>
                <button onClick={()=>mockHandleClickDownloadArquivoDeCarga(rowData)} className="btn btn-link dropdown-item fonte-14" type="button" disabled={!temPermissaoEditarCarga()}>
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                        icon={faDownload}
                    />
                    <strong>Baixar</strong>
                </button>
                <button onClick={()=>mockHandleClickDeleteArquivoDeCarga(rowData.uuid)} className="btn btn-link dropdown-item fonte-14" type="button" disabled={!temPermissaoEditarCarga()}>
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "5px", color: "#B40C02"}}
                        icon={faTrashAlt}
                    />
                    <strong>Excluir</strong>
                </button>
            </div>
        </div>
    )
};

const mockConteudoTemplate = (rowData) => {
    return (
        <div className='quebra-palavra'>
            {rowData.conteudo.split('/').pop()}
        </div>
    )
};

const mockStatusTemplate = (rowData='', status_estatico='') => {
    if (tabelaArquivos && tabelaArquivos.status && tabelaArquivos.status.length > 0) {
        let status_retornar;
        if (rowData){
            status_retornar = tabelaArquivos.status.filter(item => item.id === rowData.status);
        }else if(status_estatico){
            status_retornar = tabelaArquivos.status.filter(item => item.id === status_estatico);
        }else {
            return ''
        }
        return status_retornar[0].nome
    }
};

const MockDataTemplate = (rowData, column) => {
    return (
        <div>
            {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : '-'}
        </div>
    )
};

const MockDataHoraTemplate = (rowData, column) => {
    return rowData[column.field] ? moment(rowData[column.field]).format("DD/MM/YYYY [às] HH[h]mm") : '-'
};

describe("Tabela Component", () => {
    const mockData = listaArquivos.slice(0, 10);
    it('deve renderizar a tabela com os dados fornecidos', () => {
        render(<TabelaArquivosDeCarga
                    arquivos={mockData}
                    rowsPerPage={10}
                    conteudoTemplate={mockConteudoTemplate}
                    dataTemplate={MockDataTemplate}
                    dataHoraTemplate={MockDataHoraTemplate}
                    statusTemplate={mockStatusTemplate}
                    acoesTemplate={mockAcoesTemplate}
                />);

        // Verifica se os nomes dos identificadores dos arquivos estão presentes
        mockData.forEach((row) => {
            expect(screen.getByText(row.identificador)).toBeInTheDocument();
        });

        const table = screen.getByRole("grid");
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll("td");
            expect(cells).toHaveLength(6);
            const actionsCell = cells[3]
            expect(actionsCell).not.toBeEmptyDOMElement();

            const botaoAcoes = screen.getAllByRole('button', { name: /.../i })[index];
            expect(botaoAcoes).toBeInTheDocument();
            // Simula o clique no botão
            fireEvent.click(botaoAcoes);
            waitFor(()=>{
                const botaoProcessar =  screen.getByRole('button', { name: /Processar/i });
                const botaoEditar =  screen.getByRole('button', { name: /Editar/i });
                const botaoBaixar =  screen.getByRole('button', { name: /Baixar/i });
                expect(botaoProcessar).toBeInTheDocument();
                expect(botaoProcessar).toBeEnabled();
                expect(botaoEditar).toBeInTheDocument();
                expect(botaoEditar).toBeEnabled();
                expect(botaoBaixar).toBeInTheDocument();
                expect(botaoBaixar).toBeEnabled();

                fireEvent.click(botaoProcessar);
                fireEvent.click(botaoEditar);
                fireEvent.click(botaoBaixar);

                expect(mockHandleClickProcessarArquivoDeCarga).toHaveBeenCalled()
                expect(mockHandleClickEditarArquivos).toHaveBeenCalled()
                expect(mockHandleClickDownloadArquivoDeCarga).toHaveBeenCalled()

            });
        });
    });
});