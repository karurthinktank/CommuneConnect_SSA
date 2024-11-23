import React, { useState } from 'react';
import { Button, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import { POST } from 'helpers/api_helper';
import { CARD_MAP } from 'helpers/url_helper';
import CustomToast from "components/Common/Toast";
import { useFormik, FieldArray, FormikProvider, } from 'formik';
import * as Yup from "yup";
import { mobileRegExp } from "constants/constants";
import Loader from "components/Common/Loader";

function MemberModal(props) {
  const { slug, is_charity_member } = props;
  const [modal, setModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [error, setError] = useState('');

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setSelectedCard('');
      setError('');
    }
  };

  const handleSelectChange = (event) => {
    setSelectedCard(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedCard === '') {
      setError('Please select a card type.');
      return;
    }

    if (!is_charity_member && selectedCard === 'Trustee') {
      setError('You are not eligible for a trustee card.');
      return;
    }

    setShowLoader(true);
    setError('');

    let url = CARD_MAP.replace(":slug", slug);
    console.log(url);
    try {
      var res = await POST(url, { cardType: selectedCard, member_id: slug });
      if (res.status === 200) {
        setShowLoader(false);
        CustomToast(res.data.message, "success");
        toggle();
        window.location.reload();
      } else {
        setShowLoader(false);
        CustomToast(res.data.message, "error");
      }
    } catch (error) {
      setShowLoader(false);
      CustomToast('An error occurred', 'error');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {showLoader && <Loader />}
      <Link onClick={toggle}><i className="mdi mdi-plus-circle fs-1 text-primary" /></Link>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Card Mapping</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="cardType">Select Card Type</label>
            <select
              id="cardType"
              className="form-control"
              value={selectedCard}
              onChange={handleSelectChange}
            >
              <option value="">-- Select Card Type --</option>
              <option value="Family">Family Card</option>
              <option value="Trustee">Trustee Card</option>
            </select>
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <Button color="primary" onClick={handleSubmit}>
            Authenticate Device
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
}


export default MemberModal;