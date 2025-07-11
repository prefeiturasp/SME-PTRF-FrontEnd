import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import { resetUrlVoltar } from "../../../store/reducers/componentes/escolas/PrestacaoDeContas/PendenciaCadastro/actions";

export const TopoComBotoes = ({tituloPagina = ''}) =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { popTo } = useSelector(state => state.PendenciaCadastro);

    const goBack = () => {
        dispatch(resetUrlVoltar());
        navigate(-1);
    }
    return(
        <div className="d-flex bd-highlight justify-content-between align-items-center mt-5">
            <div className="flex-grow-1 bd-highlight">
                <h1 className="titulo-itens-painel m-0">{tituloPagina}</h1>
            </div>            
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
        </div>
    )
}