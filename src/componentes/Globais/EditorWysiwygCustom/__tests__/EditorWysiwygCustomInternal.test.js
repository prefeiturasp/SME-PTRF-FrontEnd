import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorWysiwygCustomInternal from '../EditorWysiwygCustomInternal';

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
    handleLimparEditor: jest.fn(() => ''),
    isSaving: false,
    onEditorReady: jest.fn(),
};

describe('EditorWysiwygCustomInternal', () => {
    beforeEach(() => {
        capturedEditorProps = {};
        mockSetContent.mockClear();
        jest.clearAllMocks();
    });

    describe('Renderização básica', () => {
        it('renderiza o Editor TinyMCE', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            expect(screen.getByTestId('tinymce-editor')).toBeInTheDocument();
        });

        it('renderiza os botões Limpar e Salvar', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            expect(screen.getByText('Limpar')).toBeInTheDocument();
            expect(screen.getByText('Salvar')).toBeInTheDocument();
        });

        it('não renderiza botão Cancelar por padrão (botaoCancelar=false)', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
        });

        it('aplica justify-content-end quando botaoCancelar=false', () => {
            const { container } = render(<EditorWysiwygCustomInternal {...defaultProps} />);
            const botoesDiv = container.querySelector('.d-flex.pb-3');
            expect(botoesDiv).toHaveClass('justify-content-end');
            expect(botoesDiv).not.toHaveClass('justify-content-between');
        });
    });

    describe('Prop tituloEditor', () => {
        it('exibe o título quando tituloEditor é fornecido', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} tituloEditor="Meu Editor" />);
            expect(screen.getByText('Meu Editor')).toBeInTheDocument();
        });

        it('o título tem a classe correta', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} tituloEditor="Título" />);
            const titulo = screen.getByText('Título');
            expect(titulo.tagName).toBe('P');
            expect(titulo).toHaveClass('titulo-editor-fique-de-olho');
        });

        it('não renderiza o parágrafo de título quando tituloEditor é vazio', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} tituloEditor="" />);
            expect(document.querySelector('.titulo-editor-fique-de-olho')).not.toBeInTheDocument();
        });

        it('não renderiza o parágrafo de título quando tituloEditor é undefined', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} tituloEditor={undefined} />);
            expect(document.querySelector('.titulo-editor-fique-de-olho')).not.toBeInTheDocument();
        });
    });

    describe('Prop botaoCancelar', () => {
        it('exibe o botão Cancelar quando botaoCancelar=true', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} botaoCancelar={true} />);
            expect(screen.getByText('Cancelar')).toBeInTheDocument();
        });

        it('aplica justify-content-between quando botaoCancelar=true', () => {
            const { container } = render(<EditorWysiwygCustomInternal {...defaultProps} botaoCancelar={true} />);
            const botoesDiv = container.querySelector('.d-flex.pb-3');
            expect(botoesDiv).toHaveClass('justify-content-between');
        });

        it('clique em Cancelar chama setExibeEditor(false)', () => {
            const setExibeEditor = jest.fn();
            render(<EditorWysiwygCustomInternal {...defaultProps} botaoCancelar={true} setExibeEditor={setExibeEditor} />);
            fireEvent.click(screen.getByText('Cancelar'));
            expect(setExibeEditor).toHaveBeenCalledWith(false);
        });
    });

    describe('Prop disabled', () => {
        it('botão Limpar está desabilitado quando disabled=true', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} disabled={true} />);
            expect(screen.getByText('Limpar')).toBeDisabled();
        });

        it('botão Salvar está desabilitado quando disabled=true', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} disabled={true} />);
            expect(screen.getByText('Salvar')).toBeDisabled();
        });

        it('repassa disabled=true ao Editor', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} disabled={true} />);
            expect(capturedEditorProps.disabled).toBe(true);
        });

        it('botões habilitados por padrão (disabled=false)', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            expect(screen.getByText('Limpar')).not.toBeDisabled();
            expect(screen.getByText('Salvar')).not.toBeDisabled();
        });
    });

    describe('Prop isSaving', () => {
        it('exibe "Salvando..." e spinner quando isSaving=true', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} isSaving={true} />);
            expect(screen.getByText('Salvando...')).toBeInTheDocument();
            expect(screen.getByTestId('spinner-icon')).toBeInTheDocument();
        });

        it('exibe "Salvar" quando isSaving=false', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} isSaving={false} />);
            expect(screen.getByText('Salvar')).toBeInTheDocument();
            expect(screen.queryByTestId('spinner-icon')).not.toBeInTheDocument();
        });

        it('botão Salvar está desabilitado quando isSaving=true', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} isSaving={true} />);
            expect(screen.getByRole('button', { name: /salvando/i })).toBeDisabled();
        });

        it('botão Limpar está desabilitado quando isSaving=true', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} isSaving={true} />);
            expect(screen.getByText('Limpar')).toBeDisabled();
        });
    });

    describe('Editor TinyMCE — props repassadas', () => {
        it('repassa textoInicialEditor como value ao Editor', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} textoInicialEditor="<p>Olá</p>" />);
            expect(capturedEditorProps.value).toBe('<p>Olá</p>');
        });

        it('repassa onEditorChange ao Editor (é função)', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            expect(typeof capturedEditorProps.onEditorChange).toBe('function');
        });

        it('onInit define editorRef.current', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            const fakeEditor = { setContent: mockSetContent, on: jest.fn() };
            act(() => {
                capturedEditorProps.onInit({}, fakeEditor);
            });
            fireEvent.click(screen.getByText('Limpar'));
            expect(mockSetContent).toHaveBeenCalled();
        });

        it('repassa disabled=false ao Editor por padrão', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            expect(capturedEditorProps.disabled).toBe(false);
        });
    });

    describe('Botão Salvar', () => {
        it('clique em Salvar chama handleSubmitEditor com o texto atual', () => {
            const handleSubmitEditor = jest.fn();
            render(
                <EditorWysiwygCustomInternal
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
            render(<EditorWysiwygCustomInternal {...defaultProps} handleSubmitEditor={handleSubmitEditor} />);
            act(() => {
                capturedEditorProps.onEditorChange('<p>Novo texto</p>');
            });
            fireEvent.click(screen.getByText('Salvar'));
            expect(handleSubmitEditor).toHaveBeenCalledWith('<p>Novo texto</p>');
        });
    });

    describe('Botão Limpar — handleLimparEditor personalizado', () => {
        it('chama handleLimparEditor com o texto atual ao clicar em Limpar', () => {
            const handleLimparEditor = jest.fn(() => '<p>Limpo</p>');
            render(
                <EditorWysiwygCustomInternal
                    {...defaultProps}
                    textoInicialEditor="<p>Texto</p>"
                    handleLimparEditor={handleLimparEditor}
                />
            );
            fireEvent.click(screen.getByText('Limpar'));
            expect(handleLimparEditor).toHaveBeenCalledWith('<p>Texto</p>');
        });

        it('atualiza textoEditor com o retorno de handleLimparEditor', () => {
            const handleLimparEditor = jest.fn(() => '<p>Limpo</p>');
            const handleSubmitEditor = jest.fn();
            render(
                <EditorWysiwygCustomInternal
                    {...defaultProps}
                    handleLimparEditor={handleLimparEditor}
                    handleSubmitEditor={handleSubmitEditor}
                />
            );
            fireEvent.click(screen.getByText('Limpar'));
            fireEvent.click(screen.getByText('Salvar'));
            expect(handleSubmitEditor).toHaveBeenCalledWith('<p>Limpo</p>');
        });

        it('chama setContent do editor com o retorno de handleLimparEditor quando editorRef está definido', () => {
            const handleLimparEditor = jest.fn(() => '<p>Limpo</p>');
            render(<EditorWysiwygCustomInternal {...defaultProps} handleLimparEditor={handleLimparEditor} />);
            const fakeEditor = { setContent: mockSetContent, on: jest.fn() };
            act(() => {
                capturedEditorProps.onInit({}, fakeEditor);
            });
            fireEvent.click(screen.getByText('Limpar'));
            expect(mockSetContent).toHaveBeenCalledWith('<p>Limpo</p>');
        });

        it('não chama setContent quando editorRef não está definido (onInit nunca chamado)', () => {
            const handleLimparEditor = jest.fn(() => '<p>Limpo</p>');
            render(<EditorWysiwygCustomInternal {...defaultProps} handleLimparEditor={handleLimparEditor} />);
            expect(() => fireEvent.click(screen.getByText('Limpar'))).not.toThrow();
            expect(mockSetContent).not.toHaveBeenCalled();
        });
    });

    describe('Botão Limpar — comportamento padrão (handleLimparEditor falsy)', () => {
        it('limpa o texto para string vazia quando handleLimparEditor é null', () => {
            const handleSubmitEditor = jest.fn();
            render(
                <EditorWysiwygCustomInternal
                    {...defaultProps}
                    textoInicialEditor="<p>Texto</p>"
                    handleLimparEditor={null}
                    handleSubmitEditor={handleSubmitEditor}
                />
            );
            fireEvent.click(screen.getByText('Limpar'));
            fireEvent.click(screen.getByText('Salvar'));
            expect(handleSubmitEditor).toHaveBeenCalledWith('');
        });

        it('chama setContent com string vazia quando editorRef está definido e handleLimparEditor é null', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} handleLimparEditor={null} />);
            const fakeEditor = { setContent: mockSetContent, on: jest.fn() };
            act(() => {
                capturedEditorProps.onInit({}, fakeEditor);
            });
            fireEvent.click(screen.getByText('Limpar'));
            expect(mockSetContent).toHaveBeenCalledWith('');
        });
    });

    describe('Prop onEditorReady', () => {
        it('chama onEditorReady com o editor ao disparar onInit', () => {
            const onEditorReady = jest.fn();
            render(<EditorWysiwygCustomInternal {...defaultProps} onEditorReady={onEditorReady} />);
            const fakeEditor = { setContent: mockSetContent, on: jest.fn() };
            act(() => {
                capturedEditorProps.onInit({}, fakeEditor);
            });
            expect(onEditorReady).toHaveBeenCalledWith(fakeEditor);
        });

        it('registra handler no evento "remove" do editor', () => {
            const onEditorReady = jest.fn();
            const mockOn = jest.fn();
            render(<EditorWysiwygCustomInternal {...defaultProps} onEditorReady={onEditorReady} />);
            const fakeEditor = { setContent: mockSetContent, on: mockOn };
            act(() => {
                capturedEditorProps.onInit({}, fakeEditor);
            });
            expect(mockOn).toHaveBeenCalledWith('remove', expect.any(Function));
        });

        it('chama onEditorReady(null) quando o evento "remove" é disparado', () => {
            const onEditorReady = jest.fn();
            const mockOn = jest.fn();
            render(<EditorWysiwygCustomInternal {...defaultProps} onEditorReady={onEditorReady} />);
            const fakeEditor = { setContent: mockSetContent, on: mockOn };
            act(() => {
                capturedEditorProps.onInit({}, fakeEditor);
            });
            // Captura e dispara o handler do evento 'remove'
            const removeHandler = mockOn.mock.calls[0][1];
            act(() => {
                removeHandler();
            });
            expect(onEditorReady).toHaveBeenCalledWith(null);
        });

        it('não chama onEditorReady quando não é fornecido', () => {
            const { onEditorReady: _omit, ...propsWithoutReady } = defaultProps;
            render(<EditorWysiwygCustomInternal {...propsWithoutReady} />);
            const fakeEditor = { setContent: mockSetContent, on: jest.fn() };
            expect(() => {
                act(() => {
                    capturedEditorProps.onInit({}, fakeEditor);
                });
            }).not.toThrow();
        });
    });

    describe('Prop topExtraContent', () => {
        it('renderiza topExtraContent quando fornecido', () => {
            render(
                <EditorWysiwygCustomInternal
                    {...defaultProps}
                    topExtraContent={<div data-testid="top-extra">Conteúdo superior</div>}
                />
            );
            expect(screen.getByTestId('top-extra')).toBeInTheDocument();
        });

        it('não renderiza nada acima do editor quando topExtraContent é undefined', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} topExtraContent={undefined} />);
            expect(screen.queryByTestId('top-extra')).not.toBeInTheDocument();
        });
    });

    describe('Prop bottomExtraContent', () => {
        it('renderiza bottomExtraContent quando fornecido', () => {
            render(
                <EditorWysiwygCustomInternal
                    {...defaultProps}
                    bottomExtraContent={<div data-testid="bottom-extra">Conteúdo inferior</div>}
                />
            );
            expect(screen.getByTestId('bottom-extra')).toBeInTheDocument();
        });

        it('não renderiza nada abaixo do editor quando bottomExtraContent é undefined', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} bottomExtraContent={undefined} />);
            expect(screen.queryByTestId('bottom-extra')).not.toBeInTheDocument();
        });
    });

    describe('Prop mensagemErroForm', () => {
        it('renderiza mensagemErroForm quando fornecido', () => {
            render(
                <EditorWysiwygCustomInternal
                    {...defaultProps}
                    mensagemErroForm={<span data-testid="erro-form">Campo obrigatório</span>}
                />
            );
            expect(screen.getByTestId('erro-form')).toBeInTheDocument();
        });

        it('não renderiza mensagem de erro quando mensagemErroForm é null', () => {
            render(<EditorWysiwygCustomInternal {...defaultProps} mensagemErroForm={null} />);
            expect(screen.queryByTestId('erro-form')).not.toBeInTheDocument();
        });
    });

    describe('useEffect — sincronização com textoInicialEditor', () => {
        it('atualiza value do Editor quando textoInicialEditor muda', () => {
            const { rerender } = render(
                <EditorWysiwygCustomInternal {...defaultProps} textoInicialEditor="<p>Inicial</p>" />
            );
            expect(capturedEditorProps.value).toBe('<p>Inicial</p>');

            rerender(<EditorWysiwygCustomInternal {...defaultProps} textoInicialEditor="<p>Atualizado</p>" />);
            expect(capturedEditorProps.value).toBe('<p>Atualizado</p>');
        });
    });

    describe('Props opcionais com valores padrão', () => {
        it('não lança erro ao clicar Cancelar sem passar setExibeEditor', () => {
            const { setExibeEditor: _omit, ...propsWithoutSetExibe } = defaultProps;
            render(<EditorWysiwygCustomInternal {...propsWithoutSetExibe} botaoCancelar={true} />);
            expect(() => fireEvent.click(screen.getByText('Cancelar'))).not.toThrow();
        });
    });

    describe('apiKey do Editor', () => {
        it('usa EDITOR_KEY_REPLACE_ME quando não está em ambiente local', () => {
            const originalEnv = process.env.REACT_APP_NODE_ENV;
            delete process.env.REACT_APP_NODE_ENV;
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            expect(capturedEditorProps.apiKey).toBe('EDITOR_KEY_REPLACE_ME');
            process.env.REACT_APP_NODE_ENV = originalEnv;
        });

        it('usa REACT_APP_EDITOR_KEY quando ambiente é local', () => {
            process.env.REACT_APP_NODE_ENV = 'local';
            process.env.REACT_APP_EDITOR_KEY = 'minha-chave-local';
            render(<EditorWysiwygCustomInternal {...defaultProps} />);
            expect(capturedEditorProps.apiKey).toBe('minha-chave-local');
            delete process.env.REACT_APP_NODE_ENV;
            delete process.env.REACT_APP_EDITOR_KEY;
        });
    });
});
