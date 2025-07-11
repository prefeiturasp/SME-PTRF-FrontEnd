import { fireEvent, render, screen } from '@testing-library/react'
import { CardNotificacoes } from '../CardNotificacoes'


describe('CardNotificacoes', () => {
    const props = {
        // notificacoes: {data: 'Notificações'},
        notificacoes: [{infos: [{uuid: '0001', tipo: 'tipo 1', lido: true}]}],
        toggleBtnNotificacoes: jest.fn(),
        clickBtnNotificacoes: jest.fn(),
        handleChangeMarcarComoLida: jest.fn(),
        paginacaoPaginasTotal: jest.fn(),
        metodoQueBuscaInfos: jest.fn(),
    }
    beforeEach(()=>{
        render(<CardNotificacoes {...props} />)
    })

    test('teste render do componente CardNotificacoes', ()=> {
        
        expect(screen.getByText(props.notificacoes[0].infos[0].tipo)).toBeInTheDocument()
        fireEvent.click(screen.getAllByRole('button', { selector: `button[aria-controls=collapse_${props.notificacoes[0].infos[0].uuid}]`})[0])
        fireEvent.click(screen.getAllByRole('button', { selector: `button[aria-controls=collapse_${props.notificacoes[0].infos[0].uuid}]`})[1])
        fireEvent.click(screen.getAllByRole('checkbox', { selector: `#checkBox__${props.notificacoes[0].infos[0].uuid}]`})[0])
        expect(props.toggleBtnNotificacoes).toHaveBeenCalledTimes(3)
        expect(props.handleChangeMarcarComoLida).toHaveBeenCalledTimes(1)
        expect(props.toggleBtnNotificacoes).toHaveBeenCalledWith(props.notificacoes[0].infos[0].uuid)
    })
    
})