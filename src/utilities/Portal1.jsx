import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

function Portal1({children, isOpen, onClose}) {

  useEffect(() => { 
    function hanlder(e) {            
        if(e.key === 'Escape') onClose()

          console.log('key pressed', e.key);
    }
    
    document.addEventListener('keydown', hanlder);

    return ()=> {
        document.removeEventListener('keydown', hanlder)
    }

 }, [onClose])

 if (!isOpen) return null

return createPortal(
    <div className={`model-overlay ${!isOpen && 'hidden'}`} >
        <div className={`alertDailog`}>
            {children}
            <div className='alerClose' onClick={onClose}> x </div>
        </div>
    </div>
    ,
    document.querySelector('#alter-div')
    

)
}

export default Portal1