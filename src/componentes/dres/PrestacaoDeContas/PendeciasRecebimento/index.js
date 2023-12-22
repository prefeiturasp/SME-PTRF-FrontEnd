import React, { useEffect, useState } from "react";

import { List, Divider } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

export function PendenciasRecebimento({prestacaoDeContas}) {
    const [pendencias, setPendencias] = useState([]);

    const ataApresentacao = {
        title: 'Associação - Geração da ata de apresentação (PDF)',
        subtitle: 'Notificar a associação sobre a geração da ata',
        actions: [
            <button
                id="btn-avancar"
                // onClick={metodoAvancar}
                // disabled={disabledBtnAvancar}
                className="btn btn-success ml-2"
            >
                Notificar associação
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
    }, []);

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