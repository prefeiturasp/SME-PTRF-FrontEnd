import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Tabela from "../Tabela";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';


jest.mock("primereact/datatable", () => {
    return {
      DataTable: ({ value, children, paginator }) => (
        <table data-testid="datatable">
          <thead>
            {children.map((child, index) => (
              <tr key={index}>
                <th>{child.props.header}</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {value.map((item, rowIndex) => (
              <tr key={rowIndex} data-testid="datatable-row">
                {children.map((child, colIndex) => (
                  <td key={colIndex}>
                    {child.props.body ? child.props.body(item) : item[child.props.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {paginator && <tfoot data-testid="datatable-paginator">Paginator</tfoot>}
        </table>
      ),
    };
  });

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
                <div data-tooltip-content="Editar" data-tooltip-id={`tooltip-id-${rowData.uuid}`}>
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

describe("Componente Tabela", () => {
    const mockData = [
        {
            uuid: "ba8b96ef-f05c-41f3-af10-73753490c542",
            id: 1,
            motivo: "Motivo A",
        },
        {
            uuid: "ba8b96ef-f05c-41f3-af10-73753490c541",
            id: 2,
            motivo: "Motivo B",
        },
    ];
    it('deve renderizar a tabela com os dados fornecidos', () => {
        render(<Tabela rowsPerPage={2} lista={mockData} acoesTemplate={mockAcoesTemplate} />);

        // Verifica se os nomes dos membros aparecem
        mockData.forEach((row) => {
            expect(screen.getByText(row.motivo)).toBeInTheDocument();
        });
        
       
        const rows = screen.getAllByTestId("datatable-row");
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll("td");
            expect(cells).toHaveLength(2); // Motivo + Ações
            const actionsCell = cells[1]
            expect(actionsCell).not.toBeEmptyDOMElement(); // Ações não está vazia

            const divTooltipEditar = actionsCell.querySelector("[data-tooltip-content='Editar']");
            expect(divTooltipEditar).toBeInTheDocument();
            const svgElement = divTooltipEditar.querySelector("svg");
            expect(svgElement).toBeInTheDocument();

            // Simula o clique no botão
            fireEvent.click(svgElement);
            expect(mockHandleEditFormModal).toHaveBeenCalled()
        });
    });
    
});
