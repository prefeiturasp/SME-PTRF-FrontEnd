import React, {useEffect, useState} from "react";
import { FormFiltrosDownloads } from "./FormFiltrosDownloads";
import { TabelaDownloads } from "./TabelaDownloads";
import { getArquivosDownload, getDownloadArquivo, deleteArquivo, putMarcarDesmarcarLido, getArquivosDownloadFiltros, getStatus } from "../../../services/CentralDeDownload.service";
import moment from "moment";

export const CentralDeDownloads = () => {
    const initialStateFormFiltros = {
        filtro_por_identificador: "",
        filtro_por_status: "",
        filtro_por_atualizacao: "",
        filtro_por_visto: ""
    }

    const [listaArquivos, setListaArquivos] = useState([]);
    const [stateFormFiltros, setStateFormFiltros] = useState(initialStateFormFiltros);
    const [listaStatus, setListaStatus] = useState([]);


    useEffect(()=> {
        trazerArquivos()
    }, []);

    useEffect(() => {
        trazerStatus()
    }, []);

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

    const excluirArquivo = async(arquivo_download_uuid) => {
        let decisao = window.confirm("Deseja realmente excluir ?");

        if(decisao){
            try{
                await deleteArquivo(arquivo_download_uuid);
                await trazerArquivos();
            }catch(e){
                console.log("Erro ao efetuar exclusão ", e.response);
            }
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
                excluirArquivo={excluirArquivo}
                marcarDesmarcarLido={marcarDesmarcarLido}
            />
    
        </>
    )
}