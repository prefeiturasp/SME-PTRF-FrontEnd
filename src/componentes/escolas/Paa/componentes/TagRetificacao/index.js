import { Tag } from "antd";

export const TagRetificacao = () => {
    const styleTag = {
        backgroundColor: 'white',
        color: '#01585E',
        border: '2px solid #01585E'
    }
    return (
        <Tag style={styleTag}>Em retificação</Tag>
    )
}