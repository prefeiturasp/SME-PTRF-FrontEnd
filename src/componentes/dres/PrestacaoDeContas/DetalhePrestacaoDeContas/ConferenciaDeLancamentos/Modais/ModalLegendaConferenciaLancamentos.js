import React, {Fragment, useCallback, useEffect, useState} from "react";
import {getTagsConferenciaLancamento} from "../../../../../../services/dres/PrestacaoDeContas.service";
import {Button, Modal} from "react-bootstrap";
import Loading from "../../../../../../utils/Loading";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faMinus} from "@fortawesome/free-solid-svg-icons";
import IconeConferidoAutomaticamente from "../../../../../../assets/img/icone-conferido-automaticame.svg";

export const ModalLegendaConferenciaLancamentos = (propriedades) => {
    const [listaTagsConferencia, setListaTagsConferencia] = useState([])
    const [loading, setLoading] = useState(true)

    const types = {
        1: <FontAwesomeIcon
                className="align-middle mr-2"
                style={{color: '#297805', fontSize: '1.2rem'}}
                icon={faCheckCircle}
            />,
        2: <FontAwesomeIcon
                className="align-middle mr-2"
                style={{color: '#B40C02', fontSize: '1.2rem'}}
                icon={faCheckCircle}
            />,
        3: <img
                className="align-middle mr-2"
                src={IconeConferidoAutomaticamente}
                alt="Conferido automaticamente"
                style={{width: '1.2rem'}}
            />,
        4: <FontAwesomeIcon
                className="align-middle mr-2"
                style={{color: '#42474A', fontSize: '1.2rem'}}
                icon={faMinus}
            />,
    }


    const handleTagConferencia = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getTagsConferenciaLancamento()
            setListaTagsConferencia(response)
        } catch (e) {
            console.error('Erro ao carregar tags de conferência de lançamento', e)
        }
        setLoading(false)

    }, [])

    useEffect(() => {
        handleTagConferencia()
    }, [handleTagConferencia])

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
                    ) : listaTagsConferencia?.length > 0 ? listaTagsConferencia.map((tag) => {
                        return (
                            <div className="row ml-2 pb-4 align-items-center" key={tag.id}>

                                <p className="ml-0">
                                    <span className="icon-container">{types[tag.id]}</span>
                                    <span style={{display:"inline-block", marginTop:"10px"}}>{tag.descricao}</span>
                                </p>
                            </div>
                        )
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