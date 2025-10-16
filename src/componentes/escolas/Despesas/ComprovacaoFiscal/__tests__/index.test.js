import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ComprovacaoFiscal } from "../index";

describe("ComprovacaoFiscal", () => {
    let mockFormikProps;
    let mockLimpaCampos;
    let mockSetFormErrors;

    beforeEach(() => {
        mockFormikProps = {
            handleChange: jest.fn(),
            handleBlur: jest.fn(),
            setFieldValue: jest.fn(),
            values: {
                eh_despesa_sem_comprovacao_fiscal: false,
                eh_despesa_reconhecida_pela_associacao: true
            }
        };
        mockLimpaCampos = jest.fn();
        mockSetFormErrors = jest.fn();
    });

    const renderComponent = (props = {}) => {
        return render(
            <ComprovacaoFiscal
                formikProps={mockFormikProps}
                eh_despesa_com_comprovacao_fiscal={(values) => !values.eh_despesa_sem_comprovacao_fiscal}
                eh_despesa_reconhecida={(values) => values.eh_despesa_reconhecida_pela_associacao}
                disabled={false}
                limpa_campos_sem_comprovacao_fiscal={mockLimpaCampos}
                setFormErrors={mockSetFormErrors}
                {...props}
            />
        );
    };

    it("renderiza o componente com a pergunta inicial", () => {
        renderComponent();
        expect(screen.getByText("Essa despesa tem comprovação fiscal?")).toBeInTheDocument();
    });

    it("seleciona 'Sim' para comprovação fiscal", () => {
        mockFormikProps.values.eh_despesa_sem_comprovacao_fiscal = true;
        renderComponent();
        const radioSim = screen.getAllByLabelText("Sim")[0];
        fireEvent.click(radioSim);
        
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("eh_despesa_sem_comprovacao_fiscal", false);
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("eh_despesa_reconhecida_pela_associacao", true);
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("nome_fornecedor", "");
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("numero_boletim_de_ocorrencia", "");
    });

    it("seleciona 'Não' para comprovação fiscal", () => {
        renderComponent();
        const radioNao = screen.getByLabelText("Não");
        fireEvent.click(radioNao);
        
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("eh_despesa_sem_comprovacao_fiscal", true);
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("nome_fornecedor", "Despesa sem comprovação fiscal");
        expect(mockLimpaCampos).toHaveBeenCalled();
        expect(mockSetFormErrors).toHaveBeenCalledWith({cpf_cnpj_fornecedor: ""});
    });

    it("mostra pergunta sobre reconhecimento pela associação quando não tem comprovação fiscal", () => {
        mockFormikProps.values.eh_despesa_sem_comprovacao_fiscal = true;
        renderComponent();
        
        expect(screen.getByText("Essa despesa é reconhecida pela Associação?")).toBeInTheDocument();
    });

    it("seleciona 'Sim' para reconhecida pela associação", () => {
        mockFormikProps.values.eh_despesa_sem_comprovacao_fiscal = true;
        mockFormikProps.values.eh_despesa_reconhecida_pela_associacao = false;
        renderComponent();
        
        const radioSim = screen.getAllByLabelText("Sim")[1];
        fireEvent.click(radioSim);
        
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("eh_despesa_reconhecida_pela_associacao", true);
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("nome_fornecedor", "Despesa sem comprovação fiscal");
    });

    it("seleciona 'Não' para reconhecida pela associação", () => {
        mockFormikProps.values.eh_despesa_sem_comprovacao_fiscal = true;
        renderComponent();
        
        const radioNao = screen.getAllByLabelText("Não")[1];
        fireEvent.click(radioNao);
        
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("eh_despesa_reconhecida_pela_associacao", false);
        expect(mockFormikProps.setFieldValue).toHaveBeenCalledWith("nome_fornecedor", "Despesa sem comprovação fiscal não reconhecida pela Associação");
    });

    it("respeita a prop disabled nos radio buttons", () => {
        renderComponent({ disabled: true });
        
        const radios = screen.getAllByRole("radio");
        radios.forEach(radio => {
            expect(radio).toBeDisabled();
        });
    });
});
