import React, {useContext} from "react";
import { GestaoDeUsuariosFormContext } from "../context/GestaoDeUsuariosFormProvider";
import { useQueryClient } from "@tanstack/react-query";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from "../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios";


export const BarraTopoListagem = () => {
    const TEM_PERMISSAO_EDICAO_GESTAO_USUARIOS = RetornaSeTemPermissaoEdicaoGestaoUsuarios()

    const { visaoBase, modo, usuarioId } = useContext(GestaoDeUsuariosFormContext)
    const queryClient = useQueryClient()
    const data = queryClient.getQueryData(['unidades-usuario-list'])
    

    const exibeMensagemAviso = () => {
        if(modo === 'Editar Usuário' && data && data.length > 0){
            let unidades_sem_acesso = data.filter((item) => (item.tem_acesso === false))
            
            if(data.length === unidades_sem_acesso.length){
                return true;
            }
        }
        return false;
    }

    const removeQuery = () => {
        // Necessário para sempre que entrar na página de adicionar unidades, a lista inicie vazia
        const query_unidades_disponiveis = queryClient.getQueryData(['unidades-disponiveis-inclusao', 1])
        
        if(query_unidades_disponiveis !== undefined){
            query_unidades_disponiveis.count = 0
            query_unidades_disponiveis.results = []
        }
        
        
    }

    return(
        <>
            <section className="row">
                <section className="col-8">
                    <p className="titulo-info-unidades mb-0">Unidades do usuário</p>
                    <span>Habilite ou desabilite o acesso do usuário às unidades {visaoBase === 'DRE' ? 'desta DRE' : null} </span>
                </section>

                {visaoBase === 'SME' && usuarioId &&
                    <section className="col-4">
                        <div className="d-flex">
                            <div className="ml-auto">
                                <Link
                                    className={`btn btn-success mt-2 ml-2 ${!TEM_PERMISSAO_EDICAO_GESTAO_USUARIOS ? 'link-adicionar-unidade-disable' : ''}`}
                                    to={{
                                        pathname: `/gestao-de-usuarios-adicionar-unidade/${usuarioId}`,
                                    }}
                                    onClick={() => removeQuery()}
                                >
                                    <FontAwesomeIcon
                                        style={{fontSize: '15px', marginRight: "5", color: "#fff"}}
                                        icon={faPlus}
                                    />
                                    Adicionar
                                </Link>
                            </div>                        
                        </div>
                    </section>
                }
                    
            </section>

            {exibeMensagemAviso() &&
                <section className="row mt-2">
                    <section className="col-12">
                            <div className="barra-mensagem-info">
                                <p className="pt-1 pb-1 mb-0">
                                    <FontAwesomeIcon
                                        className="icone-barra-mensagem-info"
                                        icon={faExclamationCircle}
                                    />
                                    Selecione pelo menos uma unidade de acesso para este usuário.
                                </p>
                            </div>
                    </section>
                </section>
            }
        </>
    )
}
