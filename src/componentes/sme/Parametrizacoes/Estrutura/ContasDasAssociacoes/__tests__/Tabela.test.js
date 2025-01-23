import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {Tabela} from "../Tabela";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';

// Mock da função handleEditFormModal
const mockHandleEditFormModal = jest.fn();

// Mock da callback acoesTemplate
const mockAcoesTemplate = (rowData) => {
    return (
        <div>
            <button
                className="btn-editar-membro"
                onClick={() => mockHandleEditFormModal(rowData)}
            >
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

const statusTemplate = (rowData) => {
  return rowData.status && rowData.status === 'ATIVA' ? 'Ativa' : 'Inativa'
};
const mockOnPageChange = jest.fn();

describe("Tabela Component", () => {
    const mockData =
      { 
        count: 2,
        page: 1,
        page_size: 10,
        results: [
        {
            uuid: "ba8b96ef-f05c-41f3-af10-73753490c545",
            id: 1,
            associacao_dados: { nome: "Associação 1" },
            tipo_conta_dados: { nome: "Tipo A" },
            status: "ATIVA",
        },
        {
            uuid: "ba8b96ef-f05c-41f3-af10-73753490c544",
            id: 2,
            associacao_dados: { nome: "Associação 2" },
            tipo_conta_dados: { nome: "Tipo B" },
            status: "INATIVA",
        },
      ]};
    it('deve renderizar a tabela com os dados fornecidos', () => {
        render(<Tabela
          rowsPerPage={2}
          firstPage={1}
          todasAsContas={mockData}
          acoesTemplate={mockAcoesTemplate}
          statusTemplate={statusTemplate}
          onPageChange={mockOnPageChange}/>);

        // Verifica se os nomes das associações e tipos de conta aparecem
        mockData.results.forEach((row) => {
            expect(screen.getByText(statusTemplate(row))).toBeInTheDocument();
            expect(screen.getByText(row.associacao_dados.nome)).toBeInTheDocument();
            expect(screen.getByText(row.tipo_conta_dados.nome)).toBeInTheDocument();
        });
        
        const table = screen.getByRole("grid");
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll("td");
            expect(cells).toHaveLength(4); // Nome + Ações
            const actionsCell = cells[3]
            expect(actionsCell).not.toBeEmptyDOMElement(); // Ações não está vazia

            const divTooltipEditar = actionsCell.querySelector("[data-tip='Editar']");
            expect(divTooltipEditar).toBeInTheDocument();
            const svgElement = divTooltipEditar.querySelector("svg");
            expect(svgElement).toBeInTheDocument();

            // Simula o clique no botão
            fireEvent.click(svgElement);
            expect(mockHandleEditFormModal).toHaveBeenCalled()
        });
    });
    
});