import React, { useEffect, useState } from "react";

import { List, Divider } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import {postNotificarPendenciaGeracaoAtaApresentacao} from '../../../../services/dres/PrestacaoDeContas.service';
import { toastCustom } from "../../../Globais/ToastCustom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

export function PendenciasRecebimento({prestacaoDeContas}) {
    const [pendencias, setPendencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notificationSent, setNotificationSent] = useState(false);

    async function notificar() {
        setLoading(true);
        try {
            await postNotificarPendenciaGeracaoAtaApresentacao(prestacaoDeContas.uuid)   
            setNotificationSent(true);
            toastCustom.ToastCustomSuccess('Notificação enviada com sucesso!')
        } catch (error) {
            toastCustom.ToastCustomError('Ops! Houve um erro ao tentar enviar notificação.')
        } finally {
            setLoading(false);
        }
    }

    const ataApresentacao = {
        title: 'Associação - Geração da ata de apresentação (PDF)',
        subtitle: 'Notificar a associação sobre a geração da ata',
        actions: [
            <button
                id="btn-avancar"
                onClick={() => notificar()}
                className="btn btn-success ml-2"
                disabled={loading || notificationSent}
            >
                {
                    loading ? (
                        <FontAwesomeIcon
                            style={{marginRight: "3px", color: '#fff'}}
                            icon={faSpinner}
                        />      
                    ) : 'Notificar associação'
                }          
            </button>                    
        ]
    }

    const handlePendencias = () => {
        let _pendencias = [];
        if (!prestacaoDeContas.ata_aprensentacao_gerada){
            _pendencias.push(ataApresentacao);
        }
        setPendencias(_pendencias);
    };

    
    useEffect(() => {
        handlePendencias();
    }, [loading]);

    if(!pendencias.length) return null;
    
    return (
        <>
        <h4>Pendências para o recebimento da prestação de contas</h4>
        <List
            itemLayout="horizontal"
            dataSource={pendencias}
            style={{background: "#F4F4F4", padding: "1px 8px", marginBottom: 16}}
            renderItem={(item) => (
            <List.Item
                actions={item.actions}
                style={{background: "#ffff", padding: 12, marginBottom: 8, marginTop: 8}}
            >
                <List.Item.Meta
                    avatar={<ExclamationCircleFilled style={{color: "#DE5F04",  fontSize: '16px'}}/>}
                    title={<span style={{color: "#DE5F04", fontWeight: 600}}>{item.title}</span>}
                    description={<span style={{color: "#424848"}}>{item.subtitle}</span>}
                />
            </List.Item>
            )}
        />
        <Divider/>
        </>
    );
}