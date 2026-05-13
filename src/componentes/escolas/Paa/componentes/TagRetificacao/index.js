import { Tag } from "antd";

export const TagRetificacao = ({label}) => {
    const styleTag = {
        backgroundColor: 'white',
        color: '#01585E',
        border: '2px solid #01585E'
    }
    return (
        <Tag style={styleTag}>{label || 'Em retificação'}</Tag>
    )
}