import { useState } from "react";
import { Table } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useGetResumoAcoesPddePorPrograma } from "./hooks/useGetResumoAcoesPddePorPrograma";
import { formatMoneyBRL } from "../../../../../utils/money";
import { EditIconButton } from "../../../../Globais/UI/Button";
import ModalEdicaoReceitaPrevistaPDDE from "./ModalEdicaoReceitaPrevistaPdde";

const CORES_PDDE = '#5151CF';

// Decide se mostra "-" (célula desativada, cinza) ou o valor formatado.
// Ajustar aqui no futuro caso decidam exibir "0,00" em vez de "-" para campos não aceitos.
const valorOuAssumirValor = (valor, aceitaCampo) => {
    const ASSUME_VALOR = "—";
    if (aceitaCampo === false) {
        return <div className="cell-desativada-pdde"> {ASSUME_VALOR} </div>;
    }
    return formatMoneyBRL(valor || 0);
};

const colunaNome = (text, record) => (
    
    <span
        style={{
            color: CORES_PDDE,
            fontWeight: record.level === 0 ? 'bold' : 'normal',
            paddingLeft: `${record.level * 20}px`,
            display: 'flex',
        }}>
        {text}
    </span>
);

const colunaValor = (campo) => (value, record) => (
    <span style={{ fontWeight: record.level === 0 ? 'bold' : 'normal' }}>
        {record.level === 0 ? formatMoneyBRL(value || 0) : valorOuAssumirValor(value, record[`aceita_${campo}`])}
    </span>
);

const TabelaAcoesPDDE = () => {
    const { isLoading, dados } = useGetResumoAcoesPddePorPrograma();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [showModalForm, setShowModalForm] = useState(false);
    const [modalFormData, setModalFormData] = useState(null);

    const handleOpenModalForm = (acaoOriginal) => {
        setModalFormData(acaoOriginal);
        setShowModalForm(true);
    };

    const columns = [
        {
            title: "Tipos de Programa",
            dataIndex: "nome",
            key: "nome",
            align: 'left',
            render: colunaNome,
            minWidth: 200,
            width: 'auto',
        },
        {
            title: "Custeio (R$)",
            dataIndex: "custeio",
            key: "custeio",
            align: "left",
            render: colunaValor("custeio"),
            onCell: () => ({ style: { textAlign: 'right' } }),
            width: 150,
        },
        {
            title: "Capital (R$)",
            dataIndex: "capital",
            key: "capital",
            align: "left",
            render: colunaValor("capital"),
            onCell: () => ({ style: { textAlign: 'right' } }),
            width: 150,
        },
        {
            title: "Livre Aplicação (R$)",
            dataIndex: "livre_aplicacao",
            key: "livre_aplicacao",
            align: "left",
            render: colunaValor("livre_aplicacao"),
            onCell: () => ({ style: { textAlign: 'right' } }),
            width: 150,
        },
        {
            title: "",
            dataIndex: "expand",
            key: "expand",
            align: 'center',
            render: () => null,
            onCell: () => ({ style: { textAlign: 'center' } }),
            width: 60,
        },
    ];

    const handleExpand = (expanded, record) => {
        // Caso haja necessidade na mudança de regra de negócio para expandir de forma exclusiva
        // setExpandedRowKeys(expanded ? [record.key] : []);

        // Cada Programa expande/recolhe de forma independente
        setExpandedRowKeys((prev) =>
            expanded ? [...prev, record.key] : prev.filter((key) => key !== record.key)
        );
    };

    // A MESMA coluna decide: chevron (tem filhos) OU lápis de editar (Ação) OU nada (Total do PDDE)
    const handleExpandIcon = ({ expanded, onExpand, record }) => {
        const temFilhos = record.children && record.children.length > 0;

        if (temFilhos) {
            const Icon = expanded ? UpOutlined : DownOutlined;
            return <Icon style={{ cursor: 'pointer' }} onClick={(e) => onExpand(record, e)} />;
        }

        if (record.level === 1) {
            return <EditIconButton
                onClick={() => handleOpenModalForm(record.acao)}
                buttonStyle={{ padding: 0 }}
                />;
        }

        return null;
    };

    const overrideTableHeader = (props) => {
        // Customiza o Header da tabela, conforme protótipo
        return (
            <td {...props} className="" style={{
                ...(props.style || {}),
                borderColor: '#dadada', // Customizar a cor da borda para um tom mais contraste no header
                fontWeight: 'bold', // define a fonte em negrito
                color: 'var(--color-primary)', // define a cor do header
                padding: '8px', // mantém padding original
            }} />
        );
    };

    const overrideTableBody = (props) => {
        // Customiza o Body da tabela, conforme protótipo
        return (
            <td {...props} style={{
                ...(props.style || {}), // dessa forma, mantemos o estilo original definido na const columns
                borderColor: '#dadada', // Customizar a cor da borda para um tom mais contraste
                padding: '6px', // definir um padding menor
                textAlign: (props.style && props.style.textAlign) || 'end',
            }} />
        );
    };

    return (
        <>
            <Table
                className="tabela-acoes-pdde-por-programa"
                loading={isLoading}
                bordered
                sticky={{ offsetHeader: 80 }}
                style={{ border: '1px solid #dadada', borderRadius: '4px' }}
                pagination={false}
                scroll={{ x: 768 }}
                columns={columns}
                dataSource={dados}
                components={{
                    header: { cell: (props) => overrideTableHeader(props) },
                    body: { cell: (props) => overrideTableBody(props)},
                }}
                expandable={{
                    expandedRowKeys,
                    onExpand: handleExpand,
                    expandIconColumnIndex: columns.length - 1,
                    expandIcon: handleExpandIcon,
                }}
            />
            <ModalEdicaoReceitaPrevistaPDDE
                open={showModalForm}
                onClose={() => setShowModalForm(false)}
                receitaPrevistaPDDE={modalFormData}
            />
        </>
    );
};

export default TabelaAcoesPDDE;
