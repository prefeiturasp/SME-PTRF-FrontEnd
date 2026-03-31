import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorWysiwygInternal from '../EditorWysiwygInternal';

let capturedEditorProps = {};
const mockSetContent = jest.fn();

jest.mock('@tinymce/tinymce-react', () => ({
    Editor: (props) => {
        capturedEditorProps = props;
        return <div data-testid="tinymce-editor" />;
    },
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ spin }) => (
        <span data-testid="spinner-icon" data-spin={String(spin)} />
    ),
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faSpinner: 'faSpinner',
}));

const defaultProps = {
    textoInicialEditor: '<p>Texto inicial</p>',
    tituloEditor: '',
    handleSubmitEditor: jest.fn(),
    disabled: false,
    botaoCancelar: false,
    setExibeEditor: jest.fn(),
    handleLimparEditor: jest.fn(),
    isSaving: false,
};

describe('EditorWysiwygInternal', () => {
    beforeEach(() => {
        capturedEditorProps = {};
        mockSetContent.mockClear();
        jest.clearAllMocks();
    });

    describe('Renderização básica', () => {
        it('renderiza o Editor TinyMCE', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            expect(screen.getByTestId('tinymce-editor')).toBeInTheDocument();
        });

        it('renderiza os botões Limpar e Salvar', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            expect(screen.getByText('Limpar')).toBeInTheDocument();
            expect(screen.getByText('Salvar')).toBeInTheDocument();
        });

        it('não renderiza botão Cancelar por padrão (botaoCancelar=false)', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
        });

        it('aplica justify-content-end quando botaoCancelar=false', () => {
            const { container } = render(<EditorWysiwygInternal {...defaultProps} />);
            const botoesDiv = container.querySelector('.d-flex.pb-3');
            expect(botoesDiv).toHaveClass('justify-content-end');
            expect(botoesDiv).not.toHaveClass('justify-content-between');
        });
    });

    describe('Prop tituloEditor', () => {
        it('exibe o título quando tituloEditor é fornecido', () => {
            render(<EditorWysiwygInternal {...defaultProps} tituloEditor="Meu Editor" />);
            expect(screen.getByText('Meu Editor')).toBeInTheDocument();
        });

        it('o título tem a classe correta', () => {
            render(<EditorWysiwygInternal {...defaultProps} tituloEditor="Título" />);
            const titulo = screen.getByText('Título');
            expect(titulo.tagName).toBe('P');
            expect(titulo).toHaveClass('titulo-editor-fique-de-olho');
        });

        it('não renderiza o parágrafo de título quando tituloEditor é vazio', () => {
            render(<EditorWysiwygInternal {...defaultProps} tituloEditor="" />);
            expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
        });

        it('não renderiza o parágrafo de título quando tituloEditor é undefined', () => {
            render(<EditorWysiwygInternal {...defaultProps} tituloEditor={undefined} />);
            expect(document.querySelector('.titulo-editor-fique-de-olho')).not.toBeInTheDocument();
        });
    });

    describe('Prop botaoCancelar', () => {
        it('exibe o botão Cancelar quando botaoCancelar=true', () => {
            render(<EditorWysiwygInternal {...defaultProps} botaoCancelar={true} />);
            expect(screen.getByText('Cancelar')).toBeInTheDocument();
        });

        it('aplica justify-content-between quando botaoCancelar=true', () => {
            const { container } = render(<EditorWysiwygInternal {...defaultProps} botaoCancelar={true} />);
            const botoesDiv = container.querySelector('.d-flex.pb-3');
            expect(botoesDiv).toHaveClass('justify-content-between');
        });

        it('clique em Cancelar chama setExibeEditor(false)', () => {
            const setExibeEditor = jest.fn();
            render(<EditorWysiwygInternal {...defaultProps} botaoCancelar={true} setExibeEditor={setExibeEditor} />);
            fireEvent.click(screen.getByText('Cancelar'));
            expect(setExibeEditor).toHaveBeenCalledWith(false);
        });
    });

    describe('Prop disabled', () => {
        it('botão Limpar está desabilitado quando disabled=true', () => {
            render(<EditorWysiwygInternal {...defaultProps} disabled={true} />);
            expect(screen.getByText('Limpar')).toBeDisabled();
        });

        it('botão Salvar está desabilitado quando disabled=true', () => {
            render(<EditorWysiwygInternal {...defaultProps} disabled={true} />);
            expect(screen.getByText('Salvar')).toBeDisabled();
        });

        it('repassa disabled=true ao Editor', () => {
            render(<EditorWysiwygInternal {...defaultProps} disabled={true} />);
            expect(capturedEditorProps.disabled).toBe(true);
        });

        it('botões habilitados por padrão (disabled=false)', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            expect(screen.getByText('Limpar')).not.toBeDisabled();
            expect(screen.getByText('Salvar')).not.toBeDisabled();
        });
    });

    describe('Prop isSaving', () => {
        it('exibe "Salvando..." e spinner quando isSaving=true', () => {
            render(<EditorWysiwygInternal {...defaultProps} isSaving={true} />);
            expect(screen.getByText('Salvando...')).toBeInTheDocument();
            expect(screen.getByTestId('spinner-icon')).toBeInTheDocument();
        });

        it('exibe "Salvar" quando isSaving=false', () => {
            render(<EditorWysiwygInternal {...defaultProps} isSaving={false} />);
            expect(screen.getByText('Salvar')).toBeInTheDocument();
            expect(screen.queryByTestId('spinner-icon')).not.toBeInTheDocument();
        });

        it('botão Salvar está desabilitado quando isSaving=true', () => {
            render(<EditorWysiwygInternal {...defaultProps} isSaving={true} />);
            expect(screen.getByRole('button', { name: /salvando/i })).toBeDisabled();
        });

        it('botão Limpar está desabilitado quando isSaving=true', () => {
            render(<EditorWysiwygInternal {...defaultProps} isSaving={true} />);
            expect(screen.getByText('Limpar')).toBeDisabled();
        });
    });

    describe('Editor TinyMCE — props repassadas', () => {
        it('repassa textoInicialEditor como value ao Editor', () => {
            render(<EditorWysiwygInternal {...defaultProps} textoInicialEditor="<p>Olá</p>" />);
            expect(capturedEditorProps.value).toBe('<p>Olá</p>');
        });

        it('repassa onEditorChange ao Editor (é setTextoEditor)', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            expect(typeof capturedEditorProps.onEditorChange).toBe('function');
        });

        it('onInit define editorRef.current', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            const fakeEditor = { setContent: mockSetContent };
            act(() => {
                capturedEditorProps.onInit({}, fakeEditor);
            });
            // Verifica que editorRef foi configurado clicando em Limpar depois
            fireEvent.click(screen.getByText('Limpar'));
            expect(mockSetContent).toHaveBeenCalledWith('');
        });

        it('repassa disabled=false ao Editor por padrão', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            expect(capturedEditorProps.disabled).toBe(false);
        });
    });

    describe('Botão Salvar', () => {
        it('clique em Salvar chama handleSubmitEditor com o texto atual', () => {
            const handleSubmitEditor = jest.fn();
            render(
                <EditorWysiwygInternal
                    {...defaultProps}
                    textoInicialEditor="<p>Conteúdo</p>"
                    handleSubmitEditor={handleSubmitEditor}
                />
            );
            fireEvent.click(screen.getByText('Salvar'));
            expect(handleSubmitEditor).toHaveBeenCalledWith('<p>Conteúdo</p>');
        });

        it('clique em Salvar usa texto atualizado via onEditorChange', () => {
            const handleSubmitEditor = jest.fn();
            render(<EditorWysiwygInternal {...defaultProps} handleSubmitEditor={handleSubmitEditor} />);
            // Simula mudança no editor
            act(() => {
                capturedEditorProps.onEditorChange('<p>Novo texto</p>');
            });
            fireEvent.click(screen.getByText('Salvar'));
            expect(handleSubmitEditor).toHaveBeenCalledWith('<p>Novo texto</p>');
        });
    });

    describe('Botão Limpar', () => {
        it('clique em Limpar limpa o texto do editor (onEditorChange recebe string vazia)', () => {
            const handleSubmitEditor = jest.fn();
            render(
                <EditorWysiwygInternal
                    {...defaultProps}
                    textoInicialEditor="<p>Texto</p>"
                    handleSubmitEditor={handleSubmitEditor}
                />
            );
            fireEvent.click(screen.getByText('Limpar'));
            // Após limpar, Salvar deve enviar string vazia
            fireEvent.click(screen.getByText('Salvar'));
            expect(handleSubmitEditor).toHaveBeenCalledWith('');
        });

        it('clique em Limpar chama setContent do editor quando editorRef está definido', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            const fakeEditor = { setContent: mockSetContent };
            act(() => {
                capturedEditorProps.onInit({}, fakeEditor);
            });
            fireEvent.click(screen.getByText('Limpar'));
            expect(mockSetContent).toHaveBeenCalledWith('');
        });

        it('clique em Limpar não lança erro quando editorRef não está definido', () => {
            render(<EditorWysiwygInternal {...defaultProps} />);
            // editorRef.current é null (onInit nunca chamado)
            expect(() => fireEvent.click(screen.getByText('Limpar'))).not.toThrow();
        });

        it('não chama handleLimparEditor ao clicar em Limpar', () => {
            const handleLimparEditor = jest.fn();
            render(<EditorWysiwygInternal {...defaultProps} handleLimparEditor={handleLimparEditor} />);
            fireEvent.click(screen.getByText('Limpar'));
            expect(handleLimparEditor).not.toHaveBeenCalled();
        });
    });

    describe('useEffect — sincronização com textoInicialEditor', () => {
        it('atualiza value do Editor quando textoInicialEditor muda', () => {
            const { rerender } = render(
                <EditorWysiwygInternal {...defaultProps} textoInicialEditor="<p>Inicial</p>" />
            );
            expect(capturedEditorProps.value).toBe('<p>Inicial</p>');

            rerender(<EditorWysiwygInternal {...defaultProps} textoInicialEditor="<p>Atualizado</p>" />);
            expect(capturedEditorProps.value).toBe('<p>Atualizado</p>');
        });
    });

    describe('Props opcionais com valores padrão', () => {
        it('não lança erro ao clicar Cancelar sem passar setExibeEditor', () => {
            const { handleSubmitEditor, setExibeEditor: _omit, ...propsWithoutSetExibe } = defaultProps;
            render(
                <EditorWysiwygInternal
                    {...propsWithoutSetExibe}
                    handleSubmitEditor={handleSubmitEditor}
                    botaoCancelar={true}
                />
            );
            expect(() => fireEvent.click(screen.getByText('Cancelar'))).not.toThrow();
        });
    });

    describe('apiKey do Editor', () => {
        it('usa EDITOR_KEY_REPLACE_ME quando não está em ambiente local', () => {
            const originalEnv = process.env.REACT_APP_NODE_ENV;
            delete process.env.REACT_APP_NODE_ENV;
            render(<EditorWysiwygInternal {...defaultProps} />);
            expect(capturedEditorProps.apiKey).toBe('EDITOR_KEY_REPLACE_ME');
            process.env.REACT_APP_NODE_ENV = originalEnv;
        });

        it('usa REACT_APP_EDITOR_KEY quando ambiente é local', () => {
            process.env.REACT_APP_NODE_ENV = 'local';
            process.env.REACT_APP_EDITOR_KEY = 'minha-chave-local';
            render(<EditorWysiwygInternal {...defaultProps} />);
            expect(capturedEditorProps.apiKey).toBe('minha-chave-local');
            delete process.env.REACT_APP_NODE_ENV;
            delete process.env.REACT_APP_EDITOR_KEY;
        });
    });
});
