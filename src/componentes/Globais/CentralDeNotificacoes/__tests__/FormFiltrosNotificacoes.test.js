import { fireEvent, render, screen } from '@testing-library/react'
import { FormFiltrosNotificacoes } from '../FormFiltrosNotificacoes'

const mockTipoNotificacao = {id: '1234', nome: 'Tipo 1'}
const mockCategoria = {id: '1234', nome: 'Categoria 1'}
const mockRemetente = {id: '1234', nome: 'Remetente 1'}
const mockTiposNotificacoes = [mockTipoNotificacao]
const mockCategorias = [mockCategoria]
const mockRemetentes = [mockRemetente]
describe('FormFiltrosNotificacoes', ()=>{
    const props = {
        tabelaNotificacoes: {
            tipos_notificacao: mockTiposNotificacoes,
            categorias: mockCategorias,
            remetentes: mockRemetentes
        },
        stateFormFiltros: mockTiposNotificacoes,
        handleChangeFormFiltros: jest.fn(),
        handleSubmitFormFiltros: jest.fn(),
        limpaFormulario: jest.fn(),
    }
    beforeEach(()=>{
        render(<FormFiltrosNotificacoes {...props} />)
    })

    test('on change do select Tipo de notificação', () => {
        const selectForm = screen.getByLabelText('Por tipo de notificação')
        expect(selectForm).toBeInTheDocument()
        fireEvent.change(selectForm, {target: {value: '1234'}})
        expect(props.handleChangeFormFiltros).toHaveBeenCalledTimes(1)
    })

    test('on change do select Categoria', () => {
        const selectForm = screen.getByLabelText('Por categoria')
        expect(selectForm).toBeInTheDocument()
        fireEvent.change(selectForm, {target: {value: '1234'}})
        expect(props.handleChangeFormFiltros).toHaveBeenCalledTimes(1)
    })

    test('on change do select remetente', () => {
        const selectForm = screen.getByLabelText('Por remetente da notificação')
        expect(selectForm).toBeInTheDocument()
        fireEvent.change(selectForm, {target: {value: '1234'}})
        expect(props.handleChangeFormFiltros).toHaveBeenCalledTimes(1)
    })

    test('chama o limpaFormulario', () => {
        fireEvent.click(screen.getByText('Limpar Filtros'))
        expect(props.limpaFormulario).toHaveBeenCalledTimes(1)
    })
})