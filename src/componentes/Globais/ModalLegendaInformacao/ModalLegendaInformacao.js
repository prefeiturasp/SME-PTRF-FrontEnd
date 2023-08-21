import React, {Fragment, useEffect, useState} from "react";
import { getTagInformacao } from "../../../services/escolas/Despesas.service";
import { getTagInformacaoAssociacao } from "../../../services/escolas/Associacao.service"
import {Button, Modal} from "react-bootstrap";
import Loading from "../../../utils/Loading";
import { TagModalLegendaInformacao } from "./TagModalLegendaInformacao"
import { coresTagsAssociacoes, coresTagsDespesas } from "../../../utils/CoresTags";

export const ModalLegendaInformacao = (propriedades) => {
    const [listaTagInformacao, setListaTagInformacao] = useState([])
    const [loading, setLoading] = useState(true)
    const [coresTags, setCoresTags] = useState("")
    const { excludedTags = [] } = propriedades;

    useEffect(() => {
        let isMounted = true;
      
        const handleTagInformacao = async () => {
          setLoading(true);
      
          try {
            let tagsInformacao = [];
      
            if (propriedades.entidadeDasTags === "associacao") {
              tagsInformacao = await getTagInformacaoAssociacao();
              setCoresTags(coresTagsAssociacoes)
            } else {
              tagsInformacao = await getTagInformacao();
              setCoresTags(coresTagsDespesas)
            }
      
            if (isMounted) {
              setListaTagInformacao(tagsInformacao.filter((tag) => !excludedTags.includes(tag.nome)));
            }
          } catch (e) {
            console.error('Erro ao carregar tag informação', e);
          }
      
          if (isMounted) {
            setLoading(false);
          }
        };
      
        handleTagInformacao();
      
        return () => {
          isMounted = false;
        };
      }, [propriedades.entidadeDasTags]);

    return (
        <Fragment>
            <Modal centered size="lg"
                   show={
                       propriedades.show
                   }
                   onHide={
                       propriedades.onHide
                   }>
                <Modal.Header>
                    <Modal.Title style={
                        {fontWeight: 'bold'}
                    }>
                        {
                            propriedades.titulo
                        }</Modal.Title>
                </Modal.Header>
                <Modal.Body> {
                    loading ? (
                        <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0"/>
                    ) : listaTagInformacao?.length > 0 ? listaTagInformacao.map((tag, index) => {
                        tag.texto = tag.nome
                        return <React.Fragment key={index}>{<TagModalLegendaInformacao data={tag} coresTags={coresTags}/>}</React.Fragment>
                    }) : <span data-qa="span-nenhuma-info-encontrada">Nenhuma informação encontrada</span>
                } </Modal.Body>
                <Modal.Footer>
                    <Button data-qa="btn-fechar-modal-legenda-info" variant={
                        propriedades.primeiroBotaoCss ? propriedades.primeiroBotaoCss : "info"
                    }
                            onClick={
                                propriedades.primeiroBotaoOnclick
                            }>
                        {
                            propriedades.primeiroBotaoTexto
                        } </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )

}