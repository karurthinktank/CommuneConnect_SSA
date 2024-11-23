import React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";
import { DASHBOARD } from "helpers/url_helper";
import { GET } from "helpers/api_helper";
import CustomToast from "components/Common/Toast";
import { ToastContainer } from "react-toastify";
import Loader from "components/Common/Loader";


const Dashboard = props => {

  //meta title
  document.title = "Home | TMS";
  const [data, setData] = useState({});
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    fetchData();
}, []);

const fetchData = async () => {
  setShowLoader(true);
   const response = await GET(DASHBOARD);
   if (response.status === 200) {
       console.log(response)
       setData(response.data);
       setShowLoader(false);
   }
   else {
       CustomToast(response.data.message, "error");
       setShowLoader(false);
   }
}

  return (
    <React.Fragment>
      {showLoader && <Loader/>}
      {data && 
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("முகப்பு")}
            breadcrumbItem={props.t("முகப்பு")}
          />
          <div>
          <Row>
          <Col md="3" key="1">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-success">
                        <i className="mdi mdi-family-tree font-size-24"></i>
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="text-muted fw-medium">குடும்பங்கள்</p>
                      <h4 className="mb-0">{data?.family_count}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
          </Col>

          <Col md="3" key="2">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-success">
                        <i className="mdi mdi-timelapse font-size-24"></i>
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="text-muted fw-medium">குடிப்பாடுக்காரர்கள்</p>
                      <h4 className="mb-0">{data?.members_count}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
          </Col>
          <Col md="3" key="3">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-success">
                        <i className="mdi mdi-human-male font-size-24"></i>
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="text-muted fw-medium">ஆண்கள்</p>
                      <h4 className="mb-0">{data?.male_count}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
          </Col>
          <Col md="3" key="4">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-success">
                        <i className="mdi mdi-human-female font-size-24"></i>
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="text-muted fw-medium">பெண்கள்</p>
                      <h4 className="mb-0">{data?.female_count}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
          </Col>
          <Col md="3" key="5">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-success">
                        <i className="mdi mdi-card-account-details font-size-24"></i>
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="text-muted fw-medium">அடையாள அட்டை</p>
                      <h4 className="mb-0">{data?.id_card_count}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
          </Col>
          <Col md="3" key="5">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-success">
                        <i className="mdi mdi-phone-alert font-size-24"></i>
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="text-muted fw-medium">தொடர்பு எண் இல்லாதவை</p>
                      <h4 className="mb-0">{data?.no_mobile_count}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
          </Col>
          <Col md="3" key="5">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-success">
                        <i className="mdi mdi-check-circle font-size-24"></i>
                      </span>
                    </div>
                    <div className="ms-3">
                      <p className="text-muted fw-medium">புகைப்படம் இல்லாதவை </p>
                      <h4 className="mb-0">{data?.no_profile_count}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
          </Col>
            </Row>
            
          </div>
          </Container>
          </div>
          }
    </React.Fragment>
  );
};


export default withTranslation()(Dashboard);
