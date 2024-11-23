import { React, useState, useEffect } from "react";
import { useParams } from 'react-router';
import { USER_URL } from "helpers/url_helper";
import { GET } from "helpers/api_helper";
import CustomToast from "components/Common/Toast";
import { ToastContainer } from "react-toastify";
import Breadcrumb from "components/Common/Breadcrumb";
import classnames from "classnames";
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Row, CardBody, Card, Col, Container, Label, CardText, Badge, CardHeader } from "reactstrap";
import "../../assets/scss/_listview.scss";
import noprofile from '../../assets/images/noprofile.jpg';
import Loader from "components/Common/Loader";
import MemberModal from "./MemberModal";
import { Link } from "react-router-dom";
function ViewUser() {


    const { id } = useParams();
    const [data, setData] = useState({});
    const [showLoader, setShowLoader] = useState(false);
    const [showAddButton, setShowAddButton] = useState(false);


    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        setShowLoader(true);
        let url = USER_URL + id + '/';
        const response = await GET(url);
        if (response.status === 200) {
            console.log(response)
            setData(response.data.data);
            if (response.data.data.is_profile_completed && !response.data.data.is_card_mapped)
                setShowAddButton(true);
            setShowLoader(false);
            
        }
       
        else {
            CustomToast(response.data.message, "error");
            setShowLoader(false);
        }
    }
    return (
        <>
            {showLoader && <Loader />}
            <div className="page-content">
                <Breadcrumb title="டேஷ்போர்டு" parentPath="/home" currentPath="/users" breadcrumbItem="குடும்பங்கள்" />
                <Container fluid>
                    <Card>
                        <CardHeader className="head-member border">
                            <h5 >உறுப்பினர் விபரங்கள்</h5>
                        </CardHeader>
                        <CardBody>
                            <div>

                                {/* உறுப்பினர் விபரங்கள் */}
                                <div className="row p-3 gap-5">
                                    <div className="col-md-5  p-3 member-details" >
                                        <div className="d-flex justify-content-center">
                                            {data?.profile_image ? (<img className="photo" src={data?.profile_image.signed_url} alt="User Avatar" />)
                                                : <img className="photo" src={noprofile} alt="User Profie" />}

                                        </div>
                                        <div className="mt-1 text-center">
                                            <Badge className="rounded-pill d-inlineflex p-2 fs-6" color="secondary"> உறுப்பினர்  எண்<span>
                                                <Badge color="success" className="rounded-pill ms-2 fw-bold fs-6">{data?.member_id}</Badge></span></Badge>
                                        </div>
                                        {showAddButton && (<div className="d-flex align-items-center justify-content-center" >
                                            <Label className="mb-0">ID Card இணைப்பு</Label>
                                            <MemberModal slug={id}  is_charity_member={data?.is_charity_member}/>
                                        </div>)
                                        }
                                        {data?.is_card_mapped && (<div className="d-flex align-items-center justify-content-center" >
                                            <Label className="mb-0 text-success">Card Mapped</Label>
                                            <span class="mdi mdi-checkbox-marked-circle-outline text-success fs-1"></span>
                                        </div>)}


                                        <div className="profile-info ms-2">
                                            <div className="row justify-content-center p-3 ">
                                                <div className="col-md-6 mb-3">
                                                    <label>பெயர்</label>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <strong>{data?.name}</strong>
                                                </div>


                                                <div className="col-md-6 mb-3">
                                                    <label>த/க பெயர்</label>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <strong>{data?.father_or_husband}</strong>
                                                </div>


                                                <div className="col-md-6 mb-3">
                                                    <label>தற்போதைய முகவரி</label>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <strong>{data?.current_address}</strong>
                                                </div>


                                                <div className="col-md-6 mb-3">
                                                    <label> அலை பேசி எண்</label>
                                                </div>

                                                <div className="col-md-6">
                                                    <strong>{data?.mobile_number}</strong>
                                                </div>


                                            </div>


                                            <div>
                                                {data?.is_profile_completed ? (<>
                                                    <span className="">Profile completed</span>
                                                    <div class="progress bg-transparent progress-sm">

                                                        <div class="progress-bar bg-success rounded" role="progressbar" style={{ width: "100%" }} aria-valuenow="94" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </>) : (
                                                    <>

                                                        <div class="progress bg-transparent progress-sm">
                                                            <div class="progress-bar bg-danger rounded" role="progressbar" style={{ width: "100%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                                        </div>
                                                        <span className="text-muted">Profile Not completed</span>
                                                    </>)}
                                            </div>

                                        </div>

                                    </div>
                                    <div className="col-md-6  p-3 member-details">
                                        <div className="row fs-5">
                                            <div className="col-md-6" key="இரசீது தேதி">
                                                <Label className="text-muted">இரசீது தேதி:</Label>
                                                <p className="fw-bold">{data?.receipt_date}</p>
                                            </div>
                                            <div className="col-md-6" key="மாற்று அலைபேசி எண்">
                                                <Label className="text-muted">மாற்று அலைபேசி எண்:</Label>
                                                <p className="fw-bold">
                                                    {data?.secondary_mobile_number ? (<p>{data?.secondary_mobile_number}</p>) : <p>---------------</p>}
                                                </p>
                                            </div>

                                            <div className="col-md-6" key="இரசீது புத்தக எண்">
                                                <Label className="text-muted">இரசீது புத்தக எண் : </Label>
                                                <p className="fw-bold">{data?.receipt_book_no}</p>
                                            </div>

                                            {/* <div className="col-md-6" key="உறுப்பினர் பதிவு எண் ">
                                                <Label className="text-muted">உறுப்பினர் பதிவு எண்: </Label>
                                                <strong><p>{data?.charity_registration_number}</p></strong>
                                            </div> */}
                                            <div className="col-md-6" key="பூர்விக முகவரி">
                                                <Label className="text-muted">பூர்விக முகவரி:</Label>
                                                <p className="fw-bold">
                                                    {data?.permanent_address ? (<p>{data?.permanent_address}</p>) : <p>---------------</p>}
                                                </p>
                                            </div>


                                            <div className="col-md-6" key="இரசீது எண்">
                                                <Label className="text-muted">இரசீது எண் : </Label>
                                                <p className="fw-bold">{data?.receipt_no}</p>
                                            </div>
                                            <div className="col-md-6" key="வட்டம்">
                                                <Label className="text-muted">வட்டம்:</Label>
                                                <p className="fw-bold">
                                                    {data?.taluk ? (<p>{data?.taluk}</p>) : <p>---------------</p>}
                                                </p>
                                            </div>
                                            <div className="col-md-6" key="நாடு">
                                                <Label className="text-muted">நாடு:</Label>
                                                <p className="fw-bold">{data?.country}</p>
                                            </div>
                                            <div className="col-md-6" key="பஞ்சாயத்து">
                                                <Label className="text-muted">பஞ்சாயத்து:</Label>
                                                <p className="fw-bold">
                                                    {data?.panchayat ? (<p>{data?.panchayat}</p>) : <p>---------------</p>}
                                                </p>
                                            </div>
                                            <div className="col-md-6" key="மாநிலம்">
                                                <Label className="text-muted">மாநிலம்:</Label>
                                                <p className="fw-bold">{data?.state}</p>
                                            </div>
                                            <div className="col-md-6" key="பஞ்சாயத்து">
                                                <Label className="text-muted">சிற்றூர் / கிராமம்:</Label>
                                                <p className="fw-bold">
                                                    {data?.village ? (<p>{data?.village}</p>) : <p>---------------</p>}
                                                </p>
                                            </div>

                                            <div className="col-md-6" key="மாவட்டம்">
                                                <Label className="text-muted">மாவட்டம்:</Label>
                                                <p className="fw-bold">{data?.district}</p>
                                            </div>
                                            <div className="col-md-6" key="மாவட்டம்">
                                                <Label className="text-muted">மாவட்டம்:</Label>
                                                <p className="fw-bold">{data?.district}</p>
                                            </div>



                                        </div>
                                    </div>
                                </div>
                                <Accordion>
                                    <AccordionTab header="குடும்ப உறுப்பினர்களின் தகவல்கள் :- ">
                                        {/* <Row>
                                            <Col lg="12"> */}

                                        <div className="row">
                                            {data?.family_members && data?.family_members.map((values, index) => (
                                                <div class="col-md-6">
                                                    <div class="family-member">
                                                        <div className="row" key={index}>

                                                            {/* <>

                                                                        <div key={index} className="member-profile">
                                                                            <div class="col-md-5 col-sm-4">
                                                                                <p className="text-muted">பெயர்<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7 col-sm-8">
                                                                                <strong>{values.name}</strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile col-md-12">
                                                                            <div class="col-md-5 col-sm-4">
                                                                                <p className="text-muted">ஆதார் எண்<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7 col-sm-8">
                                                                                <strong>
                                                                                    {values.aadhar_no ? (<p>{values.aadhar_no}</p>) : <p>---------------</p>}
                                                                                </strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile col-md-12">
                                                                            <div class="col-md-5 col-sm-4">
                                                                                <p className="text-muted">அலைபேசி எண்<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7 col-sm-8">
                                                                                <strong>
                                                                                    {values.mobile_number ? (<p>{values.mobile_number}</p>) : <p>---------------</p>}
                                                                                </strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile col-md-12">
                                                                            <div class="col-md-5 col-sm-4">
                                                                                <p className="text-muted">பாலினம்<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7 col-sm-8">
                                                                                <strong>
                                                                                    <strong><p>{values.gender}</p>
                                                                                    </strong>                                                                        </strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile col-md-12">
                                                                            <div class="col-md-5 col-sm-4">
                                                                                <p className="text-muted">பிறந்த தேதி<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7 col-sm-8">
                                                                                <strong>
                                                                                    {values.date_of_birth ? (<p>{values.date_of_birth}</p>) : <p>---------------</p>}
                                                                                </strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile col-md-12">
                                                                            <div class="col-md-5 col-sm-4"> <p className="text-muted">உறவுமுறை<span>:</span></p></div>
                                                                            <div class="col-md-7 col-sm-8"><strong>{values.relationship}</strong></div>
                                                                        </div>
                                                                        <div className="member-profile col-md-12">
                                                                            <div class="col-md-5 col-sm-4"> <p className="text-muted">திருமண நிலை<span>:</span></p></div>
                                                                            <div class="col-md-7 col-sm-8">  <strong>{values.martial_status}</strong></div>
                                                                        </div>

                                                                        <div className="member-profile col-md-12">
                                                                            <div class="col-md-5 col-sm-4"><p className="text-muted">தொழில்<span>:</span></p></div>
                                                                            <div class="col-md-7 col-sm-8"><strong>
                                                                                {values.occupation ? (<p>{values.occupation}</p>) : <p>---------------</p>}
                                                                            </strong></div>
                                                                        </div>
                                                                        <div className="member-profile col-md-12">
                                                                            <div class="col-md-5 col-sm-4"><p className="text-muted">இரத்தப் பிரிவு: <span>:</span></p></div>
                                                                            <div class="col-md-7 col-sm-8"><strong>
                                                                                {values.blood_group ? (<p>{values.blood_group}</p>) : <p>---------------</p>}
                                                                            </strong></div>
                                                                        </div>

                                                                    </> */}
                                                            <>

                                                               
                                                                    <div class="col-md-6">
                                                                        <p className="text-muted">பெயர்<span>:</span></p>
                                                                    </div>
                                                                    <div class="col-md-6">
                                                                        <p className="fw-bold">{values.name}</p>
                                                                    </div>
                                                                
                                                              
                                                                    <div class="col-md-6">
                                                                        <p className="text-muted">ஆதார் எண்<span>:</span></p>
                                                                    </div>
                                                                    <div class="col-md-6">
                                                                        <p className="fw-bold">
                                                                            {values.aadhar_no ? (<p>{values.aadhar_no}</p>) : <p>---------------</p>}
                                                                        </p>
                                                                    </div>
                                                               
                                                               
                                                                    <div class="col-md-6">
                                                                        <p className="text-muted">அலைபேசி எண்<span>:</span></p>
                                                                    </div>
                                                                    <div class="col-md-6">
                                                                        <p className="fw-bold">
                                                                            {values.mobile_number ? (<p>{values.mobile_number}</p>) : <p>---------------</p>}
                                                                        </p>
                                                                    </div>
                                                                
                                                               
                                                                    <div class="col-md-6">
                                                                        <p className="text-muted">பாலினம்<span>:</span></p>
                                                                    </div>
                                                                    <div class="col-md-6">
                                                                       
                                                                            <p className="fw-bold">{values.gender}</p>
                                                                                                                                                
                                                                    </div>
                                                                
                                                              
                                                                    <div class="col-md-6">
                                                                        <p className="text-muted">பிறந்த தேதி<span>:</span></p>
                                                                    </div>
                                                                    <div class="col-md-6">
                                                                        <p className="fw-bold">
                                                                            {values.date_of_birth ? (<p>{values.date_of_birth}</p>) : <p>---------------</p>}
                                                                        </p>
                                                                    </div>
                                                              
                                                             
                                                                    <div class="col-md-6"> <p className="text-muted">உறவுமுறை<span>:</span></p></div>
                                                                    <div class="col-md-6"><p className="fw-bold">{values.relationship}</p></div>
                                                             
                                                                
                                                                    <div class="col-md-6"> <p className="text-muted">திருமண நிலை<span>:</span></p></div>
                                                                    <div class="col-md-6">  <p className="fw-bold">{values.martial_status}</p></div>
                                                                

                                                             
                                                                    <div class="col-md-6"><p className="text-muted">தொழில்<span>:</span></p></div>
                                                                    <div class="col-md-6"><p className="fw-bold">
                                                                        {values.occupation ? (<p>{values.occupation}</p>) : <p>---------------</p>}
                                                                    </p ></div>
                                                               
                                                                
                                                                    <div class="col-md-6"><p className="text-muted">இரத்தப் பிரிவு: <span>:</span></p></div>
                                                                    <div class="col-md-6"><p className="fw-bold">
                                                                        {values.blood_group ? (<p>{values.blood_group}</p>) : <p>---------------</p>}
                                                                    </p></div>
                                                               

                                                            </>

                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* </Col>
                                        </Row> */}
                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </CardBody>
                    </Card>


                </Container>
            </div>
            <ToastContainer />
        </>
    )
}


export default ViewUser;