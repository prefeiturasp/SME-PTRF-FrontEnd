import { Row, Col } from 'antd'

export const RodapeFormsID = ({value}) => {
    return (
        <>
            {!!value && <Row className='mt-2'>
                <Col span={24} style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>
                    <div>ID</div>
                    <p >{value}</p>
                </Col>
            </Row>}
        </>
    )
}