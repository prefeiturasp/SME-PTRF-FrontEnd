import { useState, useCallback } from "react";
import {useDispatch} from "react-redux";
import { ObterUrlModeloArquivoPlanoAnual } from "../../../../services/escolas/Paa.service";
import { ModalVisualizarPdf } from "../../../Globais/ModalVisualizarPdf";
import { ModalConfirm } from "../../../Globais/Modal/ModalConfirm";

export const EstruturaCompletaModeloPaa = () => {
    const dispatch = useDispatch();

    const [modalPdf, setModalPdf] = useState({ show: false, url: null, titulo: "" });

    const handleVisualizarPlano = useCallback(async () => {
        try {
            const url = await ObterUrlModeloArquivoPlanoAnual('MODELO_PLANO_ANUAL');
            if (!url) return;
            setModalPdf({
                show: true,
                url,
                titulo: 'Modelo Plano Anual'
            });

        } catch (error) {
            if (error?.response?.status === 404) {
                ModalConfirm({
                    dispatch,
                    title: 'Não encontrado!',
                    message: 'O Modelo de arquivo do Plano Anual não foi encontrado.',
                    cancelText: 'Fechar',
                    confirmText: null,
                    dataQa: 'modal-confirmar-arquivo-nao-encontrado',
                    onConfirm: null
                })
            } else {
                console.error('Erro ao visualizar Modelo de Plano Anual', error);
            }
        }
    }, [ObterUrlModeloArquivoPlanoAnual]);
    
    const handleFecharModalPdf = useCallback(() => {
        if (modalPdf.url) {
          window.URL.revokeObjectURL(modalPdf.url);
        }
        setModalPdf({ show: false, url: null, titulo: "" });
      }, [modalPdf.url]);

    return (
        <>
            <div>
                <p>
                    Confira a estrutura completa&nbsp;
                    <a href="#" onClick={handleVisualizarPlano}>aqui</a>.
                </p>
            </div>
            <ModalVisualizarPdf
                show={modalPdf.show}
                onHide={handleFecharModalPdf}
                url={modalPdf.url}
                titulo={`Documento final ${modalPdf.titulo ? `- ${modalPdf.titulo}` : ''}`}
                iframeTitle="Documento Final PAA"
            />
        </>
    )
}
