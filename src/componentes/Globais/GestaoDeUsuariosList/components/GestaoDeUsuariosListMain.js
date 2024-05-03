import React from "react";
import {useGruposAcesso} from "../hooks/useGruposAcesso";
import {GruposAcessoInfo} from "./GruposAcessoInfo";
import {ListaUsuarios} from "./ListaUsuarios";
import {useUsuarios} from "../hooks/useUsuarios";
import {BarraTopoLista} from "./BarraTopoLista";
import {FormFiltros} from "./FormFiltros";
import {Paginacao} from "./Paginacao";
import {visoesService} from "../../../../services/visoes.service";
import {MenuInterno} from "../../MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";

export const GestaoDeUsuariosListMain = () => {

    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');

    const { data: grupos } = useGruposAcesso();
    const { data: usuarios, isLoading } = useUsuarios();
    return (
        <>
            {visao_selecionada === "SME" &&
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
            }
            <p>Faça a gestão dos seus usuários e determine seus perfis atrelando-os aos grupos de acesso.</p>
            <GruposAcessoInfo grupos={grupos}/>
            <BarraTopoLista/>
            <FormFiltros grupos={grupos}/>
            <ListaUsuarios usuarios={usuarios?.results} isLoading={isLoading}/>
            {! isLoading &&
             <Paginacao/>
            }
        </>
    )
}