import React  from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import './Cabecalho.scss'

export const Cabecalho = () => {

    return (
        <>
        <div className="d-flex bd-highlight mt-3 mb-0 container-cabecalho">
            <div className="flex-grow-1 bd-highlight">
                <p className='titulo-explicativo mb-0'>AGUA AZUL</p>
            </div>

            <div className="p-2 bd-highlight">
                <Link
                    to={`/dre-lista-prestacao-de-contas/`}
                    className="btn btn-outline-success btn-ir-para-listagem ml-2"
                    >
                    <FontAwesomeIcon
                        style={{marginRight: "5px", color: '#00585E'}}
                        icon={faArrowLeft}
                        />
                    Ir para a listagem
                </Link>
            </div>
            <div className="p-2 bd-highlight">
                <button
                    onClick={() => console.log("clicou")}
                    className="btn btn-success"
                    disabled={true}
                >
                    Salvar
                </button>
            </div>
        </div>
        <div className="info-cabecalho">
            <div className='periodo-info-cabecalho'>
                <p><strong>Périodo: </strong> 2020.1 - 20/06/2020  até 20/05/2020</p>
            </div>
            <div className='tipo-relatorio-info-cabecalho'>
                <p><strong>Tipo Relatório: </strong> Parcial #1</p>
            </div>
        </div>
        <div className='col-12'>
            <hr className='mt-2 mb-2'/>
        </div>
    </>
        
    )

}
