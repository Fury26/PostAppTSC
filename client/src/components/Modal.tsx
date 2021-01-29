import React from 'react';

type ModalProps = {
    display: boolean,
    close(): void,
    id: string,
}

const Modal: React.FC<ModalProps> = (props) => {

    let className = "modal fade ";
    const style = {
        display: 'none',
        padding: '17px'
    }

    if(props.display) {
        className = className.concat('show');
        style.display = 'block';
    }


    return (
        <div className={className} id={props.id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true" style={style} >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`modal-label-${props.id}`}>Modal title</h5>
                        <button type="button" className="btn-close" onClick={props.close}/>
                    </div>
                    <div className="modal-body">
                        {
                            props.children
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={props.close}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;