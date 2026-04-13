import './scss/TagLabel.scss';

export default function TagLabel({label, index, ...rest}) {
    return(
        <div data-testid={`tag-label-${index}`} {...rest}>
            <small>
                {label}
            </small>                                                    
        </div>    
    )
}