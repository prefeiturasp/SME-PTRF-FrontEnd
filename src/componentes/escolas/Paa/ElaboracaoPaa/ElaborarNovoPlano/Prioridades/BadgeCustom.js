import { Badge, Button } from 'antd';

const ButtonCustom = ({
        buttonLabel='-',
        buttonColor='#a4a4a4',
        handleClick=()=>{}
    }) => {
    return (
        <Button
            variant="solid"
            size="small"
            style={
                {
                    backgroundColor: buttonColor,
                    borderColor:'transparent',
                    color:'white',
                    fontSize: '11px',
                    height: '18px'
                }
            }
            onClick={handleClick}>
            {buttonLabel}
        </Button>
    );
};

export const BadgeCustom = ({
        badge=false,
        buttonColor='#a4a4a4',
        buttonLabel='',
        handleClick=()=>{}
    }) => {
    return (
        <>
        {badge ?
            <>
                <Badge color="#cda910" count={'!'} size='small' offset={[-85, 0]}>
                    <ButtonCustom
                        buttonColor={buttonColor}
                        buttonLabel={buttonLabel}
                        handleClick={handleClick}/>
                </Badge>
            </>
        :
            <ButtonCustom
                buttonColor={buttonColor}
                buttonLabel={buttonLabel}
                handleClick={handleClick}/>
        }  
        </>
    );
};