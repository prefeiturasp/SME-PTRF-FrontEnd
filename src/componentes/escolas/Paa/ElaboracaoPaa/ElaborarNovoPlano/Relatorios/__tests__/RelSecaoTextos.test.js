import { fireEvent, render, screen } from '@testing-library/react';
import { RelSecaoTextos } from '../RelSecaoTextos';
import EditorWysiwygCustom from '../../../../../../Globais/EditorWysiwygCustom';

jest.mock('tinymce/tinymce', () => ({}));
jest.mock('tinymce/themes/silver', () => ({}));
jest.mock('tinymce/icons/default', () => ({}));
jest.mock('tinymce/models/dom', () => ({}));
jest.mock('tinymce/plugins/advlist', () => ({}));
jest.mock('tinymce/plugins/lists', () => ({}));
jest.mock('tinymce/plugins/link', () => ({}));
jest.mock('tinymce/plugins/autolink', () => ({}));
jest.mock('tinymce/plugins/preview', () => ({}));
jest.mock('tinymce/plugins/anchor', () => ({}));
jest.mock('tinymce/plugins/code', () => ({}));
jest.mock('tinymce/plugins/charmap', () => ({}));
jest.mock('tinymce/plugins/fullscreen', () => ({}));
jest.mock('tinymce/plugins/visualblocks', () => ({}));
jest.mock('tinymce/plugins/searchreplace', () => ({}));
jest.mock('tinymce/plugins/insertdatetime', () => ({}));
jest.mock('tinymce/plugins/table', () => ({}));
jest.mock('tinymce/plugins/wordcount', () => ({}));

// jest.mock('../../../../../../Globais/EditorWysiwygCustom', () => ({
//   EditorWysiwygCustom: jest.fn(({ onEditorReady, handleSubmitEditor }) => {
//     onEditorReady?.({ getDoc: () => ({ body: { style: {} } }) });
//     return <div data-testid="editor-wysiwyg">Editor Mock</div>;
//   }),
// }));
// jest.mock('../../../../../../Globais/EditorWysiwygCustom', () => ({
//   __esModule: true,
//   default: jest.fn(
//     ({
//       textoInicialEditor,
//       tituloEditor,
//       handleSubmitEditor,
//       handleLimparEditor,
//       botaoCancelar,
//       disabled,
//       isSaving,
//       onEditorReady,
//     }) => {
//       // Simula inicialização do editor
//       onEditorReady?.({ getDoc: () => ({ body: { style: {} } }) });

//       return (
//         <div data-testid="editor-wysiwyg">
//           <div data-testid="texto-inicial">{textoInicialEditor}</div>
//           <div data-testid="titulo-editor">{tituloEditor}</div>
//           <button
//             data-testid="submit-editor"
//             disabled={disabled || isSaving}
//             onClick={() => handleSubmitEditor('<p>novo texto</p>')}
//           >
//             Salvar
//           </button>
//           <button
//             data-testid="limpar-editor"
//             onClick={() => handleLimparEditor('<p>texto atual</p>')}
//           >
//             Limpar
//           </button>
//           {!botaoCancelar && <span data-testid="sem-botao-cancelar">Sem botão cancelar</span>}
//         </div>
//       );
//     }
//   ),
// }));

describe('RelSecaoTextos', () => {
    const baseProps = {
        textosPaa: {
            introducao_do_paa_1: '<p>Texto fixo</p>',
            introducao_do_paa_2: '<p>Mensagem padrão</p>',
        },
        paaVigente: {
            texto_introducao: '<p>Texto editor Introdução</p>',
            texto_conclusao: '<p>Texto editor conclusão</p>',
        },
        handleSalvarTexto: jest.fn(),
        isSaving: false,
    };

    beforeEach(() => {
        window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        }));
    });

    it('renderiza textos fixos e o editor componente chave introducao', () => {
        const props = {
            ...baseProps,
            secaoKey: 'introducao',
            config: {
                titulo: 'I. Introdução',
                chave: 'introducao',
                textosPaa: ['introducao_do_paa_1', 'introducao_do_paa_2'],
                campoPaa: 'texto_introducao',
            },
            textosPaa: {
                introducao_do_paa_1: '<p>Texto fixo intro</p>',
                introducao_do_paa_2: '<p>Mensagem padrão intro</p>',
            },
        };
        render(<RelSecaoTextos {...props} />);
        
        expect(screen.getByText('Texto fixo intro', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('mensagem padrão intro', { exact: false })).toBeInTheDocument();
    });

    it('renderiza textos fixos e o editor componente chave conclusao', () => {
        const props = {
            ...baseProps,
            secaoKey: 'conclusao',
            config: {
                titulo: 'IV. Conclusão',
                chave: 'conclusao',
                textosPaa: ['conclusao_do_paa_1', 'conclusao_do_paa_2'],
                campoPaa: 'texto_conclusao',
            },
            textosPaa: {
                conclusao_do_paa_1: '<p>Texto fixo conclusão</p>',
                conclusao_do_paa_2: '<p>Mensagem padrão conclusão</p>',
            },
        };
        render(<RelSecaoTextos {...props} />);
        expect(screen.getByText('Texto fixo conclusão', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('mensagem padrão conclusão', { exact: false })).toBeInTheDocument();
    });

    it('renderiza textos fixos e o editor componente chave outros', () => {
        const props = {
            ...baseProps,
            secaoKey: 'outros',
            config: {
                titulo: 'Outros',
                chave: 'outros',
                textosPaa: ['outros_do_paa_1', 'outros_do_paa_2'],
                campoPaa: 'texto_outros',
            },
            textosPaa: {
                outros_do_paa_1: '<p>Texto fixo outros</p>',
                outros_do_paa_2: '<p>Mensagem padrão outros</p>',
            },
        };
        render(<RelSecaoTextos {...props} />);
        expect(screen.getByText('Texto fixo outros', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('mensagem padrão outros', { exact: false })).toBeInTheDocument();
    });

    it('chama ação limpar', () => {
        const props = {
            ...baseProps,
            secaoKey: 'outros',
            config: {
                titulo: 'Outros',
                chave: 'outros',
                textosPaa: ['outros_do_paa_1', 'outros_do_paa_2'],
                campoPaa: 'texto_outros',
            },
            textosPaa: {
                outros_do_paa_1: '<p>Texto fixo outros</p>',
                outros_do_paa_2: '<p>Mensagem padrão outros</p>',
            },
        };
        render(<RelSecaoTextos {...props} />);

        const botaoLimpar = screen.getByRole('button', { name: 'Limpar' }, );
        fireEvent.click(botaoLimpar);
        expect(botaoLimpar).toBeInTheDocument();
    });

    it('chama ação salvar', () => {
        const props = {
            ...baseProps,
            secaoKey: 'outros',
            config: {
                titulo: 'Outros',
                chave: 'outros',
                textosPaa: ['outros_do_paa_1', 'outros_do_paa_2'],
                campoPaa: 'texto_outros',
            },
            textosPaa: {
                outros_do_paa_1: '<p>Texto fixo outros</p>',
                outros_do_paa_2: '<p>Mensagem padrão outros</p>',
            },
        };
        render(<RelSecaoTextos {...props} />);

        const botaoSalvar = screen.getByRole('button', { name: 'Salvar' }, );
        fireEvent.click(botaoSalvar);
        expect(botaoSalvar).toBeInTheDocument();
        expect(props.handleSalvarTexto).toHaveBeenCalled();
    });

});
