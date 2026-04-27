import { render, screen, fireEvent } from "@testing-library/react";

import { ModalAtribuir, ModalConfirmarRetiradaAtribuicoes, ModalInformativoCopiaPeriodo } from "../index";

jest.mock("react-bootstrap", () => {
    const Modal = ({ children, show }) => (show ? <div role="dialog">{children}</div> : null);
    
    Modal.Header = ({ children }) => <div className="modal-header">{children}</div>;
    Modal.Title = ({ children }) => <div className="modal-title">{children}</div>;
    Modal.Body = ({ children }) => <div className="modal-body">{children}</div>;
    Modal.Footer = ({ children }) => <div className="modal-footer">{children}</div>;
    
    return { Modal };
});

describe("ModalAtribuir", () => {
    const defaultProps = {
        show: true,
        onHide: jest.fn(),
        titulo: "Atribuir técnico",
        quantidadeSelecionada: 2,
        tecnicosList: [
            { uuid: "1", nome: "João" },
            { uuid: "2", nome: "Maria" }
        ],
        selecionarTecnico: jest.fn(),
        primeiroBotaoOnclick: jest.fn(),
        tecnico: ""
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar título e quantidade corretamente no plural", () => {
        render(<ModalAtribuir {...defaultProps} />);

        expect(screen.getByText("Atribuir técnico")).toBeInTheDocument();

        expect(screen.getByText(/unidades/i)).toBeInTheDocument();
        expect(screen.getByText(/selecionadas/i)).toBeInTheDocument();
    });

    it("deve renderizar singular quando quantidadeSelecionada for 1", () => {
        render(<ModalAtribuir {...defaultProps} quantidadeSelecionada={1} />);

        expect(screen.getByText(/unidade/i)).toBeInTheDocument();
        expect(screen.getByText(/selecionada/i)).toBeInTheDocument();
    });

    it("deve renderizar opções de técnicos", () => {
        render(<ModalAtribuir {...defaultProps} />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("João")).toBeInTheDocument();
        expect(screen.getByText("Maria")).toBeInTheDocument();
    });

    it("deve chamar selecionarTecnico ao mudar select", () => {
        render(<ModalAtribuir {...defaultProps} />);
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });
        expect(defaultProps.selecionarTecnico).toHaveBeenCalledWith("1");
    });

    it("deve desabilitar botão Atribuir quando tecnico estiver vazio", () => {
        render(<ModalAtribuir {...defaultProps} tecnico="" />);
        expect(screen.getByText("Atribuir")).toBeDisabled();
    });

    it("deve habilitar botão Atribuir quando tecnico estiver preenchido", () => {
        render(<ModalAtribuir {...defaultProps} tecnico="1" />);
        expect(screen.getByText("Atribuir")).not.toBeDisabled();
    });

    it("deve chamar primeiroBotaoOnclick ao clicar em Atribuir", () => {
        render(<ModalAtribuir {...defaultProps} tecnico="1" />);
        fireEvent.click(screen.getByText("Atribuir"));
        expect(defaultProps.primeiroBotaoOnclick).toHaveBeenCalled();
    });

    it("deve chamar onHide ao clicar em Cancelar", () => {
        render(<ModalAtribuir {...defaultProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(defaultProps.onHide).toHaveBeenCalled();
    });
});

describe("ModalConfirmarRetiradaAtribuicoes", () => {
    const props = {
        show: true,
        onHide: jest.fn(),
        titulo: "Confirmar Retirada",
        primeiroBotaoOnclick: jest.fn(),
        tecnico: "1"
    };

    it("deve renderizar mensagem de confirmação", () => {
        render(<ModalConfirmarRetiradaAtribuicoes {...props} />);
        expect(screen.getByText(/Você deseja retirar as atribuições selecionadas?/i)).toBeInTheDocument();
    });

    it("deve desabilitar botão quando tecnico vazio", () => {
        render(<ModalConfirmarRetiradaAtribuicoes {...props} tecnico="" />);
        expect(screen.getByText("Confirmar")).toBeDisabled();
    });

    it("deve chamar ação ao confirmar", () => {
        render(<ModalConfirmarRetiradaAtribuicoes {...props} />);
        fireEvent.click(screen.getByText("Confirmar"));
        expect(props.primeiroBotaoOnclick).toHaveBeenCalled();
    });
});

describe("ModalInformativoCopiaPeriodo", () => {
    const props = {
        show: true,
        onHide: jest.fn(),
        titulo: "Informativo",
        periodo: { referencia: "2026-01" }
    };

    it("deve exibir período corretamente", () => {
        render(<ModalInformativoCopiaPeriodo {...props} />);
        expect(screen.getByText(/2026-01/i)).toBeInTheDocument();
    });

    it("deve fechar modal ao clicar em OK", () => {
        render(<ModalInformativoCopiaPeriodo {...props} />);
        fireEvent.click(screen.getByText("OK"));
        expect(props.onHide).toHaveBeenCalled();
    });
});