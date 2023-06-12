import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { resetUrlVoltar } from "../../../store/reducers/componentes/escolas/PrestacaoDeContas/PendenciaCadastro/actions";

export const TopoComBotoes = ({tituloPagina = ''}) =>{
    const history = useHistory();
    const dispatch = useDispatch();
    const { popTo } = useSelector(state => state.PendenciaCadastro);

    const goBack = () => {
        dispatch(resetUrlVoltar());
        history.push(popTo);
    }
    return(
        <div className="d-flex bd-highlight align-items-center mt-5">
            {
                popTo ? (
                    <div className="bd-highlight">
                        <button onClick={() => goBack()} className="btn btn btn-outline-success mr-2">
                            <FontAwesomeIcon
                                style={{color: "#00585E", fontSize: '15px', marginRight: "3px"}}
                                icon={faArrowLeft}
                            />
                            Voltar
                        </button>
                    </div>
                ) : null
            }
            <div className="flex-grow-1 bd-highlight">
                <h1 className="titulo-itens-painel m-0">{tituloPagina}</h1>
            </div>            
        </div>
    )
}