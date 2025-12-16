import { Badge, Button } from 'antd';

const ButtonCustom = (props) => {
    return (
        <Button
            {...props}
            style={{
                backgroundColor: props.buttoncolor,
                borderColor:'transparent',
                color:'white',
                fontSize: '11px',
                height: '18px',
                ...props.style,
            }}
            variant="solid"
            size="small"
            onClick={props.handleClick}>
            {props.buttonlabel}
        </Button>
    );
};

export const BadgeCustom = (props) => {
    return (
        <>
        {props.badge ?
            <>
                <Badge color="#cda910" count={'!'} size='small' offset={[-85, 0]}>
                    <ButtonCustom
                        {...props}/>
                </Badge>
            </>
        :
            <ButtonCustom
                {...props}/>
        }  
        </>
    );
};