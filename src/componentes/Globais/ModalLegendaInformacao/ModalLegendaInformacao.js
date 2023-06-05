import React, {Fragment, useEffect, useState} from "react";
import { getTagInformacao } from "../../../services/escolas/Despesas.service";
import { getTagInformacaoAssociacao } from "../../../services/escolas/Associacao.service"
import {Button, Modal} from "react-bootstrap";
import Loading from "../../../utils/Loading";
import { TagInformacao } from "../TagInformacao"

export const ModalLegendaInformacao = (propriedades) => {
    const [listaTagInformacao, setListaTagInformacao] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true;
      
        const handleTagInformacao = async () => {
          setLoading(true);
      
          try {
            let tagsInformacao = [];
      
            if (propriedades.entidadeDasTags === "associacao") {
              tagsInformacao = await getTagInformacaoAssociacao();
            } else {
              tagsInformacao = await getTagInformacao();
            }
      
            if (isMounted) {
              setListaTagInformacao(tagsInformacao);
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
                        return <React.Fragment key={index}>{<TagInformacao data={tag} localDaTag="modal-legenda-informacao"/>}</React.Fragment>
                    }) : <span>Nenhuma informação encontrada</span>
                } </Modal.Body>
                <Modal.Footer>
                    <Button variant={
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