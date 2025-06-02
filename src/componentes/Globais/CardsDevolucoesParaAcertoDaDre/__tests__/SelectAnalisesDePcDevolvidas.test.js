import { render, screen, fireEvent } from '@testing-library/react'

import SelectAnalisesDePcDevolvidas from '../SelectAnalisesDePcDevolvidas'

const mockData = {
    uuidAnalisePcDevolvida: '123456',
    handleChangeSelectAnalisesDePcDevolvidas: jest.fn(),
    analisesDePcDevolvidas: [
        {
            uuid: '1234',
            label_formatada: 'Teste A'
        },
        {
            uuid: '5678',
            label_formatada: 'Teste B'
        }
    ]
}

describe('SelectAnalisesDePcDevolvidas', ()=>{
    test('Renderiza componente', ()=>{
        render(<SelectAnalisesDePcDevolvidas {...mockData}/>)

        expect(screen.getByText('Visualize as devoluções pelas datas:')).toBeInTheDocument()
    })

    test('chama handleChange', ()=>{
        render(<SelectAnalisesDePcDevolvidas {...mockData}/>)

        const campo = screen.getByTestId('select-filtro-ajuste')
        fireEvent.change(campo, {target: {value: '5678'}})


        expect(mockData.handleChangeSelectAnalisesDePcDevolvidas).toHaveBeenCalled()
    })
})