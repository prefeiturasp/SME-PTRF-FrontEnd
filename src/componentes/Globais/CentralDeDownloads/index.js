import React, {useEffect, useState, useContext} from "react";
import { FormFiltrosDownloads } from "./FormFiltrosDownloads";
import { TabelaDownloads } from "./TabelaDownloads";
import { getArquivosDownload, getDownloadArquivo, deleteArquivo, putMarcarDesmarcarLido, getArquivosDownloadFiltros, getStatus } from "../../../services/CentralDeDownload.service";
import moment from "moment";
import {CentralDeDownloadContext} from "../../../context/CentralDeDownloads";
import {ModalConfirmarExclusaoArquivo} from "./ModalConfirmarExclusaoArquivo"
import {toastCustom} from "../../Globais/ToastCustom";

export const CentralDeDownloads = () => {

    const centralDeDownloadContext = useContext(CentralDeDownloadContext);

    const initialStateFormFiltros = {
        filtro_por_identificador: "",
        filtro_por_status: "",
        filtro_por_atualizacao: "",
        filtro_por_visto: ""
    }

    const [listaArquivos, setListaArquivos] = useState([]);
    const [stateFormFiltros, setStateFormFiltros] = useState(initialStateFormFiltros);
    const [listaStatus, setListaStatus] = useState([]);
    const [showModalConfirmarExclusaoArquivo, setShowModalConfirmarExclusaoArquivo] = useState(false);
    const [arquivoSelecionadoParaExclusao, setArquivoSelecionadoParaExclusao] = useState(null);


    useEffect(()=> {
        trazerArquivos()
    }, []);

    useEffect(() => {
        trazerStatus()
    }, []);

    useEffect(()=>{
        qtdeNotificacoesNaoLidas()
    }, []);


    const qtdeNotificacoesNaoLidas = async () =>{
        await centralDeDownloadContext.getQtdeNotificacoesNaoLidas()
    };

    const trazerArquivos = async () => {
        let arquivos = await getArquivosDownload();
        setListaArquivos(arquivos);
    }

    const trazerArquivosFiltros = async() => {
        let data = stateFormFiltros.filtro_por_atualizacao ? moment(new Date(stateFormFiltros.filtro_por_atualizacao), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        

        let lista_retorno_filtros = await getArquivosDownloadFiltros(
            stateFormFiltros.filtro_por_identificador,
            stateFormFiltros.filtro_por_status,
            data,
            stateFormFiltros.filtro_por_visto
        );
        setListaArquivos(lista_retorno_filtros);
    }

    const trazerStatus = async() => {
        let status = await getStatus();
        setListaStatus(status);
    }

    const downloadArquivo = async(nome_do_arquivo_com_extensao, arquivo_download_uuid) => {
        try{
            await getDownloadArquivo(nome_do_arquivo_com_extensao, arquivo_download_uuid);
        }catch(e){
            console.log("Erro ao efetuar o download ", e.response);
        }
    }

    const excluirArquivo = async() => {
        try {
            if(arquivoSelecionadoParaExclusao) {
                await deleteArquivo(arquivoSelecionadoParaExclusao);
                await trazerArquivos();
                setShowModalConfirmarExclusaoArquivo(false);
                toastCustom.ToastCustomSuccess('Exclusão realizada com sucesso')
            }
        } catch (error) {
            toastCustom.ToastCustomError('Erro ao tentar excluir arquivo')
        }
    }

    const marcarDesmarcarLido = async(e, uuid) => {
        let lido = e.target.checked;
        let payload = {
            "uuid": uuid,
            "lido": lido
        }
        
        try{
            await putMarcarDesmarcarLido(payload);
            await trazerArquivos();
            await qtdeNotificacoesNaoLidas();
        }catch(e){
            console.log("Erro ao efetuar atualização ", e.response);
        }
    }

    const handleChangeFormFiltros = (name, value) => {
        setStateFormFiltros({
            ...stateFormFiltros,
            [name]: value
        });
    };


    const handleSubmitFormFiltros = async(event) => {
        event.preventDefault();

        try {
            await trazerArquivosFiltros();
        } catch (e) {
            console.log("Erro ao efetuar filtragem ", e.response);
        }
    }

    const handleOpenModalExcluirArquivo = (arquivoId) => {
        setShowModalConfirmarExclusaoArquivo(true);
        setArquivoSelecionadoParaExclusao(arquivoId);
    }

    const hangleCloseModalExcluirArquivo = () => {
        setShowModalConfirmarExclusaoArquivo(false);
        setArquivoSelecionadoParaExclusao(null);
    }

    return (
        <>
            <FormFiltrosDownloads
                listaStatus={listaStatus}
                stateFormFiltros={stateFormFiltros}
                handleSubmitFormFiltros={handleSubmitFormFiltros}
                handleChangeFormFiltros={handleChangeFormFiltros}
            />
            <TabelaDownloads
                listaArquivos={listaArquivos}
                downloadArquivo={downloadArquivo}
                excluirArquivo={(e) => handleOpenModalExcluirArquivo(e)}
                marcarDesmarcarLido={marcarDesmarcarLido}
            />
            <ModalConfirmarExclusaoArquivo
                open={showModalConfirmarExclusaoArquivo}
                onOk={() => excluirArquivo()}
                onCancel={() => hangleCloseModalExcluirArquivo()}
                titulo="Excluir arquivo"
                bodyText={"Deseja realmente excluir o arquivo selecionado?"}
                okText={"Excluir"}
                cancelText={"Cancelar"}
            />
        </>
    )
}