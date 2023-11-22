import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import { useGruposDisponiveisAcesso } from "../hooks/useGruposDisponiveisAcesso";
import { GestaoDeUsuariosFormContext } from "../context/GestaoDeUsuariosFormProvider";
import { useDesabilitarGrupoAcesso } from "../hooks/useDesabilitarGrupoAcesso";
import { useHabilitarGrupoAcesso } from "../hooks/useHabilitarGrupoAcesso";

import "../style/grupos-acesso.scss"

export const GrupoAcesso = ({usuario}) => {
    const { visaoBase } = useContext(GestaoDeUsuariosFormContext)

    const {isLoading, data: grupos } = useGruposDisponiveisAcesso(usuario ? usuario : null, visaoBase ? visaoBase : null);

    const {mutationDesabilitarGrupoAcesso} = useDesabilitarGrupoAcesso();
    const {mutationHabilitarGrupoAcesso} = useHabilitarGrupoAcesso();

    const exibeMensagemAvisoSelecionarGrupo = () => {
        return grupos && grupos.length > 0 ? grupos.every(grupo => grupo.possui_acesso === false) : false;
    }

    const handleChangeCheckboxAcesso = (rowData) => {
        let payload = {
            "username": usuario ? usuario.username : null,
            "id_grupo": rowData.id
        }

        if(rowData.possui_acesso) {
            mutationDesabilitarGrupoAcesso.mutate({payload: payload});
        } else {
            mutationHabilitarGrupoAcesso.mutate({payload: payload})
        }
    }

    return (
        <>
          <section className="row mt-3">
            <section className="col-8">
              <p className="titulo-info-grupos-acesso mb-0">Grupos de acesso</p>
              <span>Escolha o nível de acesso para este usuário</span>
            </section>
          </section>
      
          {exibeMensagemAvisoSelecionarGrupo() && (
            <section className="row mt-2">
              <section className="col-12">
                <div className="barra-mensagem-info">
                  <p className="pt-1 pb-1 mb-0">
                    <FontAwesomeIcon
                      className="icone-barra-mensagem-info"
                      icon={faExclamationCircle}
                    />
                    Selecione pelo menos um grupo de acesso para este usuário.
                  </p>
                </div>
              </section>
            </section>
          )}
      
          {grupos && grupos.length > 0 ? (
            <div className="tabela-grupos-acesso mt-2">
              {grupos.map((group, index) => (
                <div className="linha d-flex flex-row p-3" key={`grupo-${index}`}>
                  <div className="mr-2 mt-1">
                    <input
                      className="checkbox-grupos-acessos"
                      type="checkbox"
                      onChange={() => handleChangeCheckboxAcesso(group)}
                      checked={group.possui_acesso}
                    />
                  </div>
                  <div className="d-flex flex-column">
                    <span className="nome-grupo">{group.grupo}</span>
                    <span className="descricao-grupo">{group.descricao ? `[${group.descricao}]` : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="box-unidades-usuario">
              <p className="mb-0 text-center texto-info">Selecione uma unidade para visualizar os</p>
              <p className="mb-0 text-center texto-info">grupos de acesso disponíveis para seleçao.</p>
            </div>
          )}
        </>
      );
}
