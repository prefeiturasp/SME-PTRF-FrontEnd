import { render, act } from '@testing-library/react';
import GestaoDePerfisFormAutocomplete from '../GestaoDePerfisFormAutocomplete';

// ── Captura de props do AutoComplete ───────────────────────────────────────────
let capturedAutoCompleteProps = null;

jest.mock('primereact/autocomplete', () => ({
    // eslint-disable-next-line react/prop-types
    AutoComplete: (props) => {
        capturedAutoCompleteProps = props;
        return (
            <input
                data-testid="autocomplete-input"
                disabled={props.disabled}
                placeholder={props.placeholder}
                value={props.value !== null && props.value !== undefined ? String(props.value) : ''}
                onChange={() => {}}
            />
        );
    },
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => null,
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faSearch: 'faSearch',
}));

// ── Dados ──────────────────────────────────────────────────────────────────────
const ACOES_MOCK = [
    { nome: 'Escola Alfa', id: 1 },
    { nome: 'Escola Beta', id: 2 },
    { nome: 'Centro Gamma', id: 3 },
];

const makeProps = (overrides = {}) => ({
    todasAsAcoesAutoComplete: ACOES_MOCK,
    recebeAcaoAutoComplete: jest.fn(),
    index: 0,
    setFieldValue: jest.fn(),
    ...overrides,
});

// ── Setup ──────────────────────────────────────────────────────────────────────
beforeEach(() => {
    capturedAutoCompleteProps = null;
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

// ══════════════════════════════════════════════════════════════════════════════
describe('GestaoDePerfisFormAutocomplete', () => {

    // ── Renderização ───────────────────────────────────────────────────────────
    describe('renderização', () => {
        it('renderiza sem erros e expõe props ao AutoComplete', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            expect(capturedAutoCompleteProps).not.toBeNull();
        });

        it('passa o name correto usando o index fornecido', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps({ index: 2 })} />);
            expect(capturedAutoCompleteProps.name).toBe('unidades_vinculadas[2].unidade_vinculada');
        });

        it('passa name com index 0 por padrão', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            expect(capturedAutoCompleteProps.name).toBe('unidades_vinculadas[0].unidade_vinculada');
        });

        it('inicia selectedAcao como null', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            expect(capturedAutoCompleteProps.value).toBeNull();
        });

        it('inicia filteredAcoes (suggestions) como null', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            expect(capturedAutoCompleteProps.suggestions).toBeNull();
        });

        it('passa field="nome" para o AutoComplete', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            expect(capturedAutoCompleteProps.field).toBe('nome');
        });

        it('passa inputId="selectedAcao"', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            expect(capturedAutoCompleteProps.inputId).toBe('selectedAcao');
        });
    });

    // ── disabled e placeholder ─────────────────────────────────────────────────
    describe('disabled e placeholder', () => {
        it('disabled=false quando todasAsAcoesAutoComplete tem itens', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            expect(capturedAutoCompleteProps.disabled).toBe(false);
        });

        it('disabled=true quando todasAsAcoesAutoComplete está vazio', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps({ todasAsAcoesAutoComplete: [] })} />);
            expect(capturedAutoCompleteProps.disabled).toBe(true);
        });

        it('placeholder vazio quando lista tem itens', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            expect(capturedAutoCompleteProps.placeholder).toBe('');
        });

        it('placeholder de aviso quando lista está vazia', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps({ todasAsAcoesAutoComplete: [] })} />);
            expect(capturedAutoCompleteProps.placeholder).toBe(
                'Não existem unidades para o tipo de unidade selecionada'
            );
        });
    });

    // ── searchAcao (completeMethod) ────────────────────────────────────────────
    describe('searchAcao (completeMethod com setTimeout de 250ms)', () => {
        it('não atualiza suggestions antes de 250ms', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.completeMethod({ query: 'escola' });
                jest.advanceTimersByTime(249);
            });
            expect(capturedAutoCompleteProps.suggestions).toBeNull();
        });

        it('retorna todos os itens quando query está vazia', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.completeMethod({ query: '' });
                jest.advanceTimersByTime(250);
            });
            expect(capturedAutoCompleteProps.suggestions).toEqual(ACOES_MOCK);
        });

        it('retorna todos os itens quando query contém apenas espaços', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.completeMethod({ query: '   ' });
                jest.advanceTimersByTime(250);
            });
            expect(capturedAutoCompleteProps.suggestions).toEqual(ACOES_MOCK);
        });

        it('filtra itens por nome (case-insensitive, query minúscula)', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.completeMethod({ query: 'escola' });
                jest.advanceTimersByTime(250);
            });
            expect(capturedAutoCompleteProps.suggestions).toEqual([
                { nome: 'Escola Alfa', id: 1 },
                { nome: 'Escola Beta', id: 2 },
            ]);
        });

        it('filtra itens por nome (case-insensitive, query maiúscula)', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.completeMethod({ query: 'GAMMA' });
                jest.advanceTimersByTime(250);
            });
            expect(capturedAutoCompleteProps.suggestions).toEqual([
                { nome: 'Centro Gamma', id: 3 },
            ]);
        });

        it('filtra com correspondência parcial no meio do nome', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.completeMethod({ query: 'lf' });
                jest.advanceTimersByTime(250);
            });
            expect(capturedAutoCompleteProps.suggestions).toEqual([
                { nome: 'Escola Alfa', id: 1 },
            ]);
        });

        it('retorna lista vazia quando nenhum item corresponde', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.completeMethod({ query: 'xyz' });
                jest.advanceTimersByTime(250);
            });
            expect(capturedAutoCompleteProps.suggestions).toEqual([]);
        });

        it('busca em lista vazia retorna lista vazia', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps({ todasAsAcoesAutoComplete: [] })} />);
            act(() => {
                capturedAutoCompleteProps.completeMethod({ query: '' });
                jest.advanceTimersByTime(250);
            });
            expect(capturedAutoCompleteProps.suggestions).toEqual([]);
        });
    });

    // ── onChange ───────────────────────────────────────────────────────────────
    describe('onChange', () => {
        it('atualiza selectedAcao quando onChange é chamado com um objeto', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            const novaAcao = { nome: 'EMEF Nova', id: 99 };
            act(() => {
                capturedAutoCompleteProps.onChange({ value: novaAcao });
            });
            expect(capturedAutoCompleteProps.value).toEqual(novaAcao);
        });

        it('atualiza selectedAcao para null quando onChange passa null', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.onChange({ value: null });
            });
            expect(capturedAutoCompleteProps.value).toBeNull();
        });

        it('atualiza selectedAcao para string quando onChange passa string', () => {
            render(<GestaoDePerfisFormAutocomplete {...makeProps()} />);
            act(() => {
                capturedAutoCompleteProps.onChange({ value: 'texto digitado' });
            });
            expect(capturedAutoCompleteProps.value).toBe('texto digitado');
        });
    });

    // ── onSelect ───────────────────────────────────────────────────────────────
    describe('onSelect', () => {
        it('chama recebeAcaoAutoComplete com o valor e o setFieldValue corretos', () => {
            const recebeAcaoAutoComplete = jest.fn();
            const setFieldValue = jest.fn();
            render(<GestaoDePerfisFormAutocomplete {...makeProps({
                recebeAcaoAutoComplete,
                setFieldValue,
            })} />);
            const unidadeSelecionada = { nome: 'EMEF Teste', id: 5 };
            act(() => {
                capturedAutoCompleteProps.onSelect({ value: unidadeSelecionada });
            });
            expect(recebeAcaoAutoComplete).toHaveBeenCalledTimes(1);
            expect(recebeAcaoAutoComplete).toHaveBeenCalledWith(unidadeSelecionada, { setFieldValue });
        });

        it('passa o setFieldValue recebido via props', () => {
            const recebeAcaoAutoComplete = jest.fn();
            const setFieldValue = jest.fn();
            render(<GestaoDePerfisFormAutocomplete {...makeProps({
                recebeAcaoAutoComplete,
                setFieldValue,
            })} />);
            act(() => {
                capturedAutoCompleteProps.onSelect({ value: { nome: 'X', id: 1 } });
            });
            const chamada = recebeAcaoAutoComplete.mock.calls[0];
            expect(chamada[1].setFieldValue).toBe(setFieldValue);
        });
    });
});
