import React from 'react';
import {Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom'
import './styles.scss'

export const TopoComBotoes = () => {
    let history = useHistory();

    return (
        <div className='d-flex justify-content-between'>
        <h2 className='text-resumo'>
            Resumo de acertos
        </h2>
        <div className="container-botoes">
            <Button variant="outline-success"
                onClick={() => history.push('/analises-relatorios-consolidados-dre/')}>
                Voltar
            </Button>
            <Button variant="success"
                onClick={
                    e => console.log("charmander")
            }>
                Devolver para DRE
            </Button>
        </div>
        </div>
    )
}
