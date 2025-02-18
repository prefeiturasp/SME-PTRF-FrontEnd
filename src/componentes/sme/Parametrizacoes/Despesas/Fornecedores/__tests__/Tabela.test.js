import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TabelaFornecedores from "../TabelaFornecedores";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { mockListaFornecedores } from "../__fixtures__/mockData";
// Mock da função handleEditFormModal
const handleEditFormModalFornecedores = jest.fn();

// Mock da callback acoesTemplate
const mockAcoesTemplate = (rowData) => {
    return (
        <div>
            <button onClick={() => handleEditFormModalFornecedores(rowData)}>
                <div data-tip="Editar" data-for={`tooltip-id-${rowData.uuid}`}>
                    <ReactTooltip id={`tooltip-id-${rowData.uuid}`} />
                    <FontAwesomeIcon
                        style={{ fontSize: '20px', marginRight: "0", color: "#00585E" }}
                        icon={faEdit}
                    />
                </div>
            </button>
        </div>
    );
};

const TabelaProps ={
    rowsPerPage: 20,
    listaDeFornecedores: mockListaFornecedores, 
    acoesTemplate: mockAcoesTemplate
}

describe("TabelaFornecedores Componente", () => {
    it('deve renderizar a tabela com os dados fornecidos', () => {
        render(<TabelaFornecedores {...TabelaProps} />);
        // Verifica se os nomes dos membros aparecem
        mockListaFornecedores.forEach((row, index) => {
            if (index < 20) {
                expect(screen.getByText(row.nome)).toBeInTheDocument();
            }else{
                expect(screen.queryByText(row.nome)).not.toBeInTheDocument();
            }
        });
        const tabela = screen.getByRole("grid");
        const rows = tabela.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(20);
        const row = rows[0]
        const cells = row.querySelectorAll("td");
        expect(cells).toHaveLength(3); // todas as colunas da tabela
        const actionsCell = cells[2]
        expect(actionsCell).not.toBeEmptyDOMElement(); // Ações não está vazia
        const botaoEditar = actionsCell.querySelector("button");
        expect(botaoEditar).toBeInTheDocument();
        fireEvent.click(botaoEditar);
        expect(handleEditFormModalFornecedores).toHaveBeenCalled()
    });
});