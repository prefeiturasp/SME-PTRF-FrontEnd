import { useState } from 'react';
import { Spin } from 'antd';
import { ModalRetificarPAA } from '../ModalRetificarPaa/ModalRetificarPaa';
import { useNavigate } from 'react-router-dom';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import { usePostIniciarRetificacaoPaa } from '../../../componentes/hooks/usePostIniciarRetificacaoPaa';

export const BotaoRetificarPaa = ({paa, statusDocumento}) => {
    const navigate = useNavigate();

    const [abrirRetificacao, setAbrirRetificacao] = useState(false);

    const [ isLoading, setIsLoading ] = useState(false);

    const { mutationPost } = usePostIniciarRetificacaoPaa()

    const handleAbrirModal = () => {
        if (paa.status === "EM_RETIFICACAO") {
            navigate(`/retificacao-paa/${paa.uuid}`, {
                state: { origem: 'paa-vigente-e-anteriores' },
            });
            return;
        }

        setAbrirRetificacao(true);
    }

    const handleFecharModal = () => {
        setAbrirRetificacao(false);
    }

    const handleRetificarPaa = async (justificativa) => {
        const payload = { justificativa }

        setIsLoading(true);
        try {
            const response = await mutationPost.mutateAsync({paaUuid: paa.uuid, payload: payload})

            toastCustom.ToastCustomSuccess(
                "Retificação",
                response?.data?.mensagem || "Retificação iniciada com sucesso!");
            handleFecharModal();

            // Redireciona o Paa para Tela de Retificação
            navigate(`/retificacao-paa/${paa.uuid}`, {
                state: { origem: 'paa-vigente-e-anteriores' },
            })
        } catch (error) {
            toastCustom.ToastCustomError(
                "Retificação",
                error?.response?.data?.mensagem || "Falha ao iniciar retificação do PAA!"
            );
            console.error("Falha ao iniciar retificação do PAA", error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Spin spinning={isLoading}>
                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={handleAbrirModal}
                    style={{ fontWeight: 600, marginRight: '10px' }}>
                    Retificar o PAA
                </button>
                
                <ModalRetificarPAA 
                    open={abrirRetificacao} 
                    onClose={() => setAbrirRetificacao(false)}
                    paaData={paa}
                    statusDocumento={statusDocumento}
                    onConfirm={justificativa => handleRetificarPaa(justificativa)}
                    isLoading={isLoading}
                />
            </Spin>
        </>
    );
};
