import React from 'react';
import ReactDOM from 'react-dom';


function PopUpModal(props){
    const setter = props.setter

return ReactDOM.createPortal(
    <div onClick={()=>{
        setter(false)
    }}>
        <h3>
        {props.children}
        </h3>
    </div>,
document.getElementById("modal"))
}


export default PopUpModal;