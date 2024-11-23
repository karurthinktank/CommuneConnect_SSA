import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function ModalPopUp({isOpen, toggle, content}){
   
    return(
        <>
         <div>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader>{content}</ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to save this changes ?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                    <Button color="primary" onClick={toggle}>Save</Button>
                </ModalFooter>
            </Modal>

         </div>
        </>
    )
}
export default ModalPopUp;