import { Typography } from "antd";

export const VincularUnidades = ({outroRecursoPeriodo}) => {
    return (
        <>
            <Typography.Text level={5} strong>Vincular unidades ao {outroRecursoPeriodo?.outro_recurso_nome}</Typography.Text>
        </>
    );
};