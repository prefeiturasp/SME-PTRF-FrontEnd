import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabelaAcoesDasAssociacoes as Tabela } from "../TabelaAcoesDasAssociacoes";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
 import { mockAcoes } from "../__fixtures__/mockData";
// Mock useAcoesDasAssociacoesContext to provide table data and spies
jest.mock('../hooks/useAcoesDasAssociacoesContext', () => ({
  useAcoesDasAssociacoesContext: jest.fn(),
}));

// Mock tag template hook
jest.mock('../../../../../../hooks/Globais/TagsInformacoesAssociacoes/useTagInformacaoAssociacaoEncerradaTemplate', () => ({
  __esModule: true,
  default: () => (rowData) => rowData.informacao || '',
}));

// Mock EditIconButton to render a button we can click
jest.mock('../../../../../Globais/UI/Button', () => ({
  EditIconButton: ({ onClick }) => <button onClick={onClick}>Edit</button>,
}));

const mockUseAcoes = require('../hooks/useAcoesDasAssociacoesContext').useAcoesDasAssociacoesContext;

describe("Tabela Componente", () => {

    it('deve renderizar a tabela com os dados fornecidos e reagir ao clique de editar', () => {
        const mockSetStateFormModal = jest.fn();
        const mockSetIsOpenModalForm = jest.fn();
        const mockSetFormReadOnly = jest.fn();

        mockUseAcoes.mockReturnValue({
            filters: { page: 1 },
            setFilters: jest.fn(),
            acoesAssociacoes: mockAcoes.results,
            isLoadingAcoesAssociacoes: false,
            countAcoesAssociacoes: mockAcoes.results.length,
            setFormReadOnly: mockSetFormReadOnly,
            setStateFormModal: mockSetStateFormModal,
            setIsOpenModalForm: mockSetIsOpenModalForm,
            isOpenModalConfirmDelete: false,
            handleCloseModalConfirmDelete: jest.fn(),
            handleDeleteAcaoAssociacao: jest.fn(),
        });

        render(<Tabela />);

        // Expect an Edit button for each row
        const editButtons = screen.getAllByText('Edit');
        expect(editButtons.length).toBe(mockAcoes.results.length);

        // Click first edit and expect context setters called
        fireEvent.click(editButtons[0]);
        expect(mockSetStateFormModal).toHaveBeenCalledTimes(1);
        expect(mockSetIsOpenModalForm).toHaveBeenCalledTimes(1);
    });

});
