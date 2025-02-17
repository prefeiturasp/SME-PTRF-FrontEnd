import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {TabelaAssociacoes} from "../TabelaAssociacoes";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {mockListaAssociacoes} from "../__fixtures__/mockData";

// Mock da função handleEditFormModal
const mockHandleEditFormModal = jest.fn();
const mockHandleEditFormModalAssociacoes = jest.fn();
const mockSetShowModalLegendaInformacao = jest.fn();
const mockOnPageChange = jest.fn();

// Mock da callback acoesTemplate
const mockAcoesTemplate = (rowData) => {
    return (
        <div>
            <button className="btn-editar-membro" onClick={()=>mockHandleEditFormModalAssociacoes(rowData)}>
                <FontAwesomeIcon
                    style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                    icon={faEdit}
                />
            </button>
        </div>
    )
};

const statusTemplate = (rowData) => {
  return rowData.status && rowData.status === 'ATIVA' ? 'Ativa' : 'Inativa'
};
describe("Tabela Component", () => {
    it('deve renderizar a tabela com os dados fornecidos', () => {
        render(<TabelaAssociacoes
            rowsPerPage={20}
            listaDeAssociacoes={mockListaAssociacoes}
            acoesTemplate={mockAcoesTemplate}
            showModalLegendaInformacao={false}
            setShowModalLegendaInformacao={mockSetShowModalLegendaInformacao}
            onPageChange={mockOnPageChange}
            firstPage={1}/>);

        // Verifica se os nomes das associações e tipos de conta aparecem
        mockListaAssociacoes.results.forEach((row) => {
            expect(screen.getByText(row.nome)).toBeInTheDocument();
            expect(screen.getByText(row.unidade.nome_com_tipo)).toBeInTheDocument();
            expect(screen.getAllByText(row.unidade.nome_dre)[0]).toBeInTheDocument();
        });
        
        const table = screen.getByRole("grid");
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll("td");
            expect(cells).toHaveLength(5); // Nome + Ações
            const actionsCell = cells[4]
            expect(actionsCell).not.toBeEmptyDOMElement(); // Ações não está vazia

            const divTooltipEditar = actionsCell.querySelector(".btn-editar-membro");
            expect(divTooltipEditar).toBeInTheDocument();

            // Simula o clique no botão
            fireEvent.click(divTooltipEditar);
            expect(mockHandleEditFormModalAssociacoes).toHaveBeenCalled()
        });
    });
    
});