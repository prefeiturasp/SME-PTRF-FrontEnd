import React, {memo, useCallback, useEffect, useState} from "react";
import { FormikForm } from "./FormikForm";
import { ModalEditarDeletarComentario } from "./ModalEditarDeletarComentario";
import { ModalDeleteComentarioSme } from "./ModalDeletarComentario";
import { ModalNotificarComentarios } from "./ModalNotificarComentario";
import { 
    getComentariosDeAnaliseConsolidadoDre, 
    getReordenarComentariosConsolidadoDre,
    editarComentarioDeAnaliseConsolidadoDre,
    deleteComentarioDeAnalise,
    criarComentarioDeAnalise,
    postNotificarComentariosDre
} from "../../../../../services/sme/DashboardSme.service";
import arrayMove from 'array-move';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

const Comentarios = ({relatorioConsolidado}) => {

    const initialComentarios = {
        uuid: '',
        consolidado_dre: '',
        ordem: '',
        comentario: ''
    };

    // Comentários que NÃO foram notificados ainda e que podem ser alterados ou excluídos
    const [comentarios, setComentarios] = useState(initialComentarios);
    // Comentários que JÁ foram notificados e que NÃO podem ser alterados ou excluídos
    const [comentariosNotificados, setComentariosNotificados] = useState([]);
    const [toggleExibeBtnAddComentario, setToggleExibeBtnAddComentario] = useState(true);
    const [showModalComentario, setShowModalComentario] = useState(false);
    const [showModalDeleteComentario, setShowModalDeleteComentario] = useState(false);
    const [showModalNotificarComentarios, setShowModalNotificarComentarios] = useState(false);
    const [comentarioEdicao, setComentarioEdicao] = useState(false);
    const [disabledBtnAddComentario, setDisabledBtnAddComentario] = useState(true);
    const [comentarioChecked, setComentarioChecked] = useState([]); // notificar comentários

    const carregaComentarios = useCallback(async () => {
        if(relatorioConsolidado && relatorioConsolidado.uuid){
            let comentarios = await getComentariosDeAnaliseConsolidadoDre(relatorioConsolidado.uuid);
            // Comentários que NÃO foram notificados ainda e que podem ser alterados ou excluídos
            setComentarios(comentarios.comentarios_nao_notificados);
            // Comentários que JÁ foram notificados e que NÃO podem ser alterados ou excluídos
            setComentariosNotificados(comentarios.comentarios_notificados)
        }

        
    }, [relatorioConsolidado]);

    useEffect(() => {
        carregaComentarios();
    }, [carregaComentarios]);

    const onSubmit = async (values) => {
        const payload = {
            consolidado_dre: relatorioConsolidado.uuid,
            ordem: comentarios.length + 1,
            comentario: values.comentarios[0].comentario,
            uuid: values.comentarios[0].uuid
        };

        await criarComentarioDeAnalise(payload);
        setToggleExibeBtnAddComentario(true);
        await carregaComentarios();
    };

    const onHandleClose = () => {
        setShowModalComentario(false);
        setComentarioEdicao(false);
        setShowModalNotificarComentarios(false);
    };

    const onHandleCloseDeletarComentario = () => {
        setShowModalDeleteComentario(false);
    };

    const onDeleteComentarioTrue = () => {
        setShowModalDeleteComentario(false);
        onDeletarComentario();
    };

    const setComentarioParaEdicao = (comentario)=>{
        console.log("eu entrei aqui")
        setComentarioEdicao(comentario);
        setShowModalComentario(true);
    };

    const onChangeComentario = (comentario, objComentario) =>{
        setComentarioEdicao({
            ...comentarioEdicao,
            consolidado_dre: relatorioConsolidado.uuid,
            comentario: comentario,
            ordem: objComentario.ordem,
            uuid: objComentario.uuid
        });
    };

    const onEditarComentario = async () => {
        setShowModalComentario(false);
        await editarComentarioDeAnaliseConsolidadoDre(comentarioEdicao.uuid, comentarioEdicao);
        setToggleExibeBtnAddComentario(true);
        await carregaComentarios();
    };

    const onDeletarComentario = async () => {
        setShowModalComentario(false);
        setShowModalDeleteComentario(false);
        await deleteComentarioDeAnalise(comentarioEdicao.uuid);
        setToggleExibeBtnAddComentario(true);
        setComentarioChecked([]);
        await carregaComentarios()
    };

    const validaConteudoComentario = (conteudoComentario) =>{
        if (conteudoComentario) {
            setDisabledBtnAddComentario(false)
        }else {
            setDisabledBtnAddComentario(true)
        }
    };

    const verificaSeChecado = (comentario_uuid) =>{
        if (comentarioChecked && comentarioChecked.length > 0){
            return comentarioChecked.find(element=> element === comentario_uuid)
        }
    };

    const handleChangeCheckboxNotificarComentarios = (event, comentario_uuid) =>{
        const comentarioClicado = comentarioChecked.indexOf(comentario_uuid);
        const all = [...comentarioChecked];
        if (comentarioClicado === -1) {
            all.push(comentario_uuid);
        } else {
            all.splice(comentarioClicado, 1);
        }
        setComentarioChecked(all);
    };

    const notificarComentarios = async () =>{
        const payload = {
            dre: relatorioConsolidado.dre.uuid,
            periodo: relatorioConsolidado.periodo.uuid,
            comentarios: comentarioChecked
        };
        try {
            let notificar = await postNotificarComentariosDre(payload);
            console.log(notificar.mensagem)
        }catch (e) {
            console.log("Erro ao enviar notificações ", e)
        }
        setShowModalNotificarComentarios(false);
        setComentarioChecked([])
        await carregaComentarios()
    };
    

    // *********** Sortable Comentário
    const onSortEnd = async ({oldIndex, newIndex}) => {
        
        let novoArrayComentarios = arrayMove(comentarios, oldIndex, newIndex);
        
        if (novoArrayComentarios && novoArrayComentarios.length > 0 ){
            let arrayAnalises = [];
            novoArrayComentarios.map((comentario, index)=>{
                
                arrayAnalises.push({
                    uuid: comentario.uuid,
                    consolidado_dre: relatorioConsolidado.uuid,
                    ordem: index+1,
                    comentario: comentario.comentario
                })
            });
            setComentarios(arrayAnalises);
            const payload = {
                comentarios_de_analise: [
                    ...arrayAnalises
                ]
            };
            await getReordenarComentariosConsolidadoDre(payload);
            await carregaComentarios()
        }
    };

    const SortableItem = SortableElement(({comentario}) =>
        <li className="d-flex bd-highlight border mt-2">
            <div className="p-2 flex-grow-1 bd-highlight container-item-comentario">
                <input
                    type='checkbox'
                    onChange={(event)=>handleChangeCheckboxNotificarComentarios(event, comentario.uuid)}
                    checked={verificaSeChecado(comentario.uuid)}
                    className="checkbox-comentario-de-analise"
                />
                {comentario.comentario}
            </div>
            <div className="p-2 bd-highlight" >
                <button onClick={()=>{setComentarioParaEdicao(comentario)}} type="button" className="btn-cancelar-comentario ml-2">
                    <FontAwesomeIcon
                        style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                        icon={faEdit}
                    />
                </button>
            </div>
        </li>

        
    );

    const SortableList = SortableContainer(({comentarios, distance=10}) => {
        return (
            <>
                <ul className='p-0'>
                    {comentarios && comentarios.length > 0 && comentarios.map((comentario, index) => (
                        <SortableItem comentario={comentario} key={`item-${index}`} index={index}/>
                    ))}
                </ul>
            </>
        );
    });
    // *********** Fim Sortable Comentário

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-2'>Comentários</h4>
            <p>Crie os comentários e arraste as caixas para cima ou para baixo para reorganizar.</p>

            <>
                <FormikForm
                    comentarios={comentarios}
                    comentariosNotificados={comentariosNotificados}
                    comentarioChecked={comentarioChecked}
                    SortableList={SortableList}
                    onSortEnd={onSortEnd}
                    validaConteudoComentario={validaConteudoComentario}
                    setToggleExibeBtnAddComentario={setToggleExibeBtnAddComentario}
                    toggleExibeBtnAddComentario={toggleExibeBtnAddComentario}
                    setDisabledBtnAddComentario={setDisabledBtnAddComentario}
                    disabledBtnAddComentario={disabledBtnAddComentario}
                    setShowModalNotificarComentarios={setShowModalNotificarComentarios}
                    onSubmit={onSubmit}
                />

                <section>
                    <ModalEditarDeletarComentario
                        show={showModalComentario}
                        handleClose={onHandleClose}
                        onEditarComentario={onEditarComentario}
                        setShowModalDeleteComentario={setShowModalDeleteComentario}
                        comentario={comentarioEdicao}
                        onChangeComentario={onChangeComentario}
                        titulo="Edição de comentário"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>

                <section>
                    <ModalDeleteComentarioSme
                        show={showModalDeleteComentario}
                        handleClose={onHandleCloseDeletarComentario}
                        onDeleteComentarioTrue={onDeleteComentarioTrue}
                        titulo="Excluir Comentário"
                        texto="<p>Deseja realmente excluir este comentário?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Excluir"
                    />
                </section>

                <section>
                    <ModalNotificarComentarios
                        show={showModalNotificarComentarios}
                        handleClose={onHandleClose}
                        notificarComentarios={notificarComentarios}
                        titulo="Notificar comentários"
                        texto="<p>Deseja enviar os comentários selecionados como notificações para a DRE?</p>"
                        primeiroBotaoTexto="Sim"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Não"
                    />
                </section>
            </>
        </>
    )
};

export default memo(Comentarios)