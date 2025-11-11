import { Table, Typography } from "antd";
import "./RelatorioTabelaGrupo.scss";

const { Title, Text } = Typography;

export const RelatorioTabelaGrupo = ({
  title,
  description,
  columns,
  dataSource,
  rowKey,
  tableProps = {},
  headerExtra = null,
  containerClassName = "relatorio-tabela-grupo",
  titleClassName = "relatorio-tabela-grupo__title",
  descriptionClassName = "relatorio-tabela-grupo__description",
}) => (
  <section className={containerClassName}>
    <div className="relatorio-tabela-grupo__header">
      <Title level={4} className={titleClassName}>
        {title}
      </Title>
      {headerExtra && (
        <div className="relatorio-tabela-grupo__actions">{headerExtra}</div>
      )}
    </div>

    {description && (
      <Text type="secondary" className={descriptionClassName}>
        {description}
      </Text>
    )}

    <Table
      rowKey={rowKey}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered
      {...tableProps}
    />
  </section>
);

