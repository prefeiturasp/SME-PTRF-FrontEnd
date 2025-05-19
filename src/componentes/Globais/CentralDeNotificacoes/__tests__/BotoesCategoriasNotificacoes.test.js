import { fireEvent, screen, render, waitFor } from "@testing-library/react";
import { BotoesCategoriasNotificacoes } from "../BotoesCategoriasNotificacoes";


const mockHandleClickBtnCategorias = jest.fn();

describe('CentralDeNotificacoes', () => {
    beforeEach(() => {
        render(
            <BotoesCategoriasNotificacoes
                handleClickBtnCategorias={mockHandleClickBtnCategorias}/>
            )
    });

    test('testa se todos os checkbox estão exibindo', ()=>{
        expect(screen.getByLabelText('Todas')).toBeInTheDocument()
        expect(screen.getByLabelText('Não Lidas')).toBeInTheDocument()
        expect(screen.getByLabelText('Lidas')).toBeInTheDocument()
    })

    test('testa se, somente Todas, está como checked inicialmente', ()=>{
        expect(screen.getByLabelText('Todas')).toBeChecked()
        expect(screen.getByLabelText('Não Lidas')).not.toBeChecked()
        expect(screen.getByLabelText('Lidas')).not.toBeChecked()
    })

    test('testa handleClick', ()=>{
        const lidas = screen.getByLabelText('Lidas')
        const naoLidas = screen.getByLabelText('Não Lidas')
        const todas = screen.getByLabelText('Todas')
        fireEvent.click(lidas)
        fireEvent.click(naoLidas)
        fireEvent.click(todas)
        expect(mockHandleClickBtnCategorias).toHaveBeenCalledTimes(3)
    })

})
