import { React, useState, useEffect } from "react";
import { useParams } from 'react-router';
import Breadcrumb from "components/Common/Breadcrumb";
import {
    Card, CardBody, CardFooter, CardHeader, Input, Label, Form,
    FormFeedback, FormGroup, Button
} from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";
import { Link } from "react-router-dom";
// Formik Validation
import * as Yup from "yup";
import { useFormik, FieldArray, FormikProvider, Formik, Field, ErrorMessage } from "formik";
import { CAST_lIST, mobileRegExp } from "constants/constants";
import { USER_URL } from "helpers/url_helper";
import { GET, UPDATE_UPLOAD } from "helpers/api_helper";
import {
    DISTRICT_LIST, STATE_LIST, COUNTRY_LIST, RECEIPT_BOOK_NO, RELATIONSHIP, OCCUPATION,
    GENDER, MARTIAL_STATUS
} from "constants/constants";
import noprofile from '../../assets/images/noprofile.jpg'; 

import Sanscript from "@indic-transliteration/sanscript";
import Loader from "components/Common/Loader";
import tamil from '../../assets/images/tamil.png'
import english from '../../assets/images/english.png'


function EditUser() {

    const IMAGE_MAX_SIZE = 2e+6; //2Mb
    const IMAGE_EXTENSIONS = ['image/jpg', 'image/png', 'image/jpeg', 'image/svg', 'image/webp'];
    const [isSameAddress, setAddress] = useState(false);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState()
    const [language, setLanguage] = useState(true);
    const [inputs, setInputs] = useState({});
    const [deletedMembers, setDeletedMembers] = useState([]);
    const { id } = useParams();
    const [data, setData] = useState({});
    const [profile, setProfile] = useState('');
    const addressvalue = (event) => {
        setAddress(event.target.checked);
    }
    const [showLoader, setShowLoader] = useState(false);
    const [fieldValue, setFieldValue] = useState({});
    

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        setShowLoader(true);
        let url = USER_URL + id + '/';
        const response = await GET(url);
        if (response.status === 200) {
            setData(response.data.data);
            setShowLoader(false);
            if(response.data.data?.profile_image)
                setProfile(response.data.data?.profile_image.signed_url);
            else
            setProfile(noprofile);
        }
        else {
            setShowLoader(false);
            CustomToast("This user does not exist", "error");
        }
    }


    const editUserForm = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            name: data?.name,
            father_or_husband: data?.father_or_husband,
            member_id: data?.member_id,
            gender: data?.gender,
            mobile_number: data?.mobile_number,
            receipt_no: data?.receipt_no,
            receipt_date: data?.receipt_date,
            receipt_book_no: data?.receipt_book_no,
            is_charity_member: String(data?.is_charity_member),
            charity_registration_number: data?.charity_registration_number,
            current_address: data?.current_address,
            permanent_address: data?.permanent_address,
            country: data?.country,
            state: data?.state,
            district: data?.district,
            caste:data?.caste,
            taluk: data?.taluk,
            panchayat: data?.panchayat,
            village: data?.village,
            postal_code: data?.postal_code,
            secondary_mobile_number: data?.secondary_mobile_number,
            country_code: data?.country_code,
            international_mobile_number: data?.international_mobile_number,
            std_code: data?.std_code,
            phone_number: data?.phone_number,
            profile_image: "",
            members: data?.family_members,
        },

        validationSchema: Yup.object({
            name: Yup.string().required("This field is required!"),
            father_or_husband: Yup.string().required("This field is required!"),
            member_id: Yup.string().required("This field is required!"),
            receipt_book_no: Yup.string().required("This field is required!"),
            receipt_no: Yup.string().required("This field is required!"),
            profile_image: Yup.string(),
            is_charity_member:Yup.boolean().required("This field is required!"),
            current_address: Yup.string().required("This field is required!"),
            country: Yup.string().required("This field is required!"),
            state: Yup.string().required("This field is required!"),
            district: Yup.string().required("This field is required!"),
            caste: Yup.string().required("This field is required!"),
            
            mobile_number: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
            secondary_mobile_number: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
            std_code: Yup.number().nullable(true),
            receipt_date: Yup.string().nullable(true),
            members: Yup.array().of(
                Yup.object({
                    name: Yup.string().required("This field is required!"),
                    mobile_number: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
                    gender: Yup.string().required("This field is required!"),
                    relationship: Yup.string().required('Must have Family Members'),
                    aadhar_no : Yup.string().matches(/^\d{12}$/, 'Aadhar number must be 12 digits'),
                    date_of_birth: Yup.string().nullable(true),
                    martial_status: Yup.string(),
                    occupation: Yup.string(),
                    career_reference: Yup.string().nullable(true),
                    blood_group: Yup.string(),
                    card_details: Yup.string().nullable(true),
                })
            )
               
        }),
        onSubmit: async (values) => {
            setShowLoader(true);
            const formData = new FormData();
            if (profileImage)
                formData.append("profile_image", profileImage);
            values['files'] = formData;
            values['deleted_members'] = deletedMembers;
            values['profile_image'] = "";
            formData.append("form_data", JSON.stringify(values));
            let url = USER_URL + id + "/";

            var res = await UPDATE_UPLOAD(url, formData);
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                setShowLoader(false);
                CustomToast(res.data.message, "success");
                navigate('/users');
            }
            else {
                setShowLoader(false);
                CustomToast(res.data.message, "error");
            }
        },
    });


    const handleCancle = () => {
        editUserForm.resetForm();
        navigate('/users');
    }

    const handleBlur = (event) => {
        let translate = "";
        let value = event.target.value;

        let name = event.target.name;

        if (inputs[name]) {
            translate = Sanscript.t(inputs[name], "itrans_dravidian", "tamil");
        }
        value = value.replace(inputs[name], translate);
        setInputs(values => ({ ...values, [name]: '' }));
        editUserForm.setFieldValue(name, value);
        
    }

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        let translate = "";
        let current_value = ""
        let previousValue = ""

        if(language){
            previousValue = fieldValue[name]
            if(previousValue){
                if(event.nativeEvent.data == null)
                previousValue = previousValue.slice(0,-1)
                else if(!event.nativeEvent.data.replace(/\s/g, ""))
                previousValue = "";
                else if(event.nativeEvent.data)
                    previousValue += event.nativeEvent.data
                
            }
            else{
                if(event.nativeEvent.data != null && !event.nativeEvent.data.replace(/\s/g, ""))
                previousValue = "";
                else if(event.nativeEvent.data)
                    previousValue = event.nativeEvent.data
            }
            console.log(previousValue)
            setFieldValue(values => ({ ...values, [name]:previousValue }))
            // if (event.nativeEvent.data != null)
            //     current_value = event.nativeEvent.data;
        }
        else{
            setFieldValue(values => ({ ...values, [name]:"" }))
        }
        if(previousValue){
            translate = Sanscript.t(previousValue, "itrans_dravidian", "tamil");
            let splitBySpace = value.split(/\s/g);
            let no_char_remv = 0;
            if(splitBySpace.length <= 1){
                no_char_remv = "-" + previousValue.length;
                value = value.slice(0, parseInt(no_char_remv));
                value = translate;
            }
            else 
            {
                no_char_remv = "-" + splitBySpace[splitBySpace.length -1].length;
                let trans = (splitBySpace[splitBySpace.length -1], translate);
                splitBySpace[splitBySpace.length -1] = trans;
                value = splitBySpace.join(" ");
            }
        }
        editUserForm.setFieldValue(name, value);
    }



    function chooseLanguage(event) {
        console.log(event.target.checked);
        setLanguage(!language);
    };


    const handleFiles = (event) => {
        let files = event.target.files[0];
        if(!IMAGE_EXTENSIONS.includes(files.type)){
            CustomToast("Invalid File Format: " + IMAGE_EXTENSIONS.join(','), "error");
            editUserForm.setFieldValue('profile_image', "");
        }
        else if(files.size > IMAGE_MAX_SIZE){
            CustomToast("File size too large!, Maximum allowed size is 2Mb", "error");
            editUserForm.setFieldValue('profile_image', "");
        }
        else{
            setProfileImage(files);
            editUserForm.setFieldValue('profile_image', event.target.value);
        }
    }

    const handleRemove = (arrayHelpers, index, member) => {
        arrayHelpers.remove(index);
        let deleted = deletedMembers;
        console.log(member)
        if(member.id)
            deleted.push(member);
        setDeletedMembers(deleted);

    }


    return (
        <>      {
        showLoader && <Loader/>}
        
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <Breadcrumb  title="டேஷ்போர்டு" parentPath="/home" currentPath="/users" breadcrumbItem="குடும்பங்கள்" />
                        <Card className="usercard">
                        <CardHeader className="position-sticky top-0">
                                <FormGroup switch className="d-flex justify-content-center align-items-center gap-3">
                                    {/* <Label className="m-0 fw-bold">மொழியை தேர்ந்தெடுங்கள்</Label> */}
                                    {language ? 
                            <img src={tamil} className="" width="40">
                            
                            </img> 
                            : 
                             (
                                // <Label className="m-0 fw-bold">English</Label>
                                <img src={english} className="" width="40"></img>
                             )
                             }
                                    <Input
                                        type="switch"
                                        onClick={chooseLanguage}
                                        checked={language}
                                        className="fs-2 ms-1"
                                        defaultValue={true}
                                    />
                                    {/* <Label check>{language ? "தமிழ்" : "English"}  </Label> */}
                                </FormGroup>
                            </CardHeader>
                            <CardBody style={{maxHeight:"650px",overflow:"scroll"}}>
                                <FormikProvider value={editUserForm}>
                                    <Form
                                        className="form-horizontal"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            console.log(editUserForm)
                                            editUserForm.isValid ? CustomToast() : CustomToast("Please fill all the required fields.", "error");
                                            editUserForm.handleSubmit();
                                            return false;
                                        }}
                                    >

                                        <div>

                                            <div className="row">
                                                <div className="col-md-6">


                                                    <div className="mb-3">
                                                        <Label>குடும்ப தலைவர் பெயர் <span className="text-danger">*</span> </Label>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            className="form-control"
                                                            placeholder="குடும்பத் தலைவரின் பெயரை உள்ளிடவும்                                                                        "
                                                            type="text"
                                                            onChange={handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.name}
                                                            invalid={editUserForm.touched.name && editUserForm.errors.name ? true : false}
                                                        />
                                                        {editUserForm.touched.name && editUserForm.errors.name ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.name}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label>த/க பெயர்<span className="text-danger">*</span> </Label>
                                                        <Input
                                                            id="father_or_husband"
                                                            name="father_or_husband"
                                                            className="form-control"
                                                            placeholder="தபெ/கபெ பெயரை உள்ளிடவும் "
                                                            type="text"
                                                            onChange={handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.father_or_husband}
                                                            invalid={editUserForm.touched.father_or_husband && editUserForm.errors.father_or_husband ? true : false}
                                                        />
                                                        {editUserForm.touched.father_or_husband && editUserForm.errors.father_or_husband ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.father_or_husband}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">குலம்<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="caste"
                                                            name="caste"
                                                            className="form-control"
                                                            placeholder="Select caste"
                                                            type="select"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.caste || ''}
                                                            invalid={editUserForm.touched.caste && editUserForm.errors.caste ? true : false}
                                                        >
                                                            <option value="" disabled defaultValue="">குலத்தை தேர்ந்தெடுக்கவும்</option>
                                                            {CAST_lIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                        </Input>
                                                        {editUserForm.touched.caste && editUserForm.errors.caste ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.caste}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">பாலினம்</Label>
                                                        <Input
                                                            id="gender"
                                                            name="gender"
                                                            className="form-control"
                                                            placeholder="Select Gender"
                                                            type="select"
                                                            onChange={editUserForm.handleChange}
                                                            value={editUserForm.gender}
                                                            invalid={editUserForm.touched.gender && editUserForm.errors.gender ? true : false}
                                                        >
                                                            <option value="" disabled defaultValue="" selected>பாலினத்தைத் தேர்ந்தெடுக்கவும்</option>
                                                            {GENDER.map((code) => (<option key={code} value={code}>{code}</option>))}

                                                        </Input>
                                                        {editUserForm.touched.gender && editUserForm.errors.gender ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.gender}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label>உறுப்பினர் எண்<span className="text-danger">*</span> </Label>
                                                        <Input
                                                            id="member_id"
                                                            name="member_id"
                                                            className="form-control"
                                                            placeholder="Enter member ID"
                                                            type="number"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.member_id}
                                                            invalid={editUserForm.touched.member_id && editUserForm.errors.member_id ? true : false}
                                                            readOnly
                                                            disabled
                                                        />
                                                        {editUserForm.touched.member_id && editUserForm.errors.member_id ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.member_id}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">அறக்கட்டளையின் உறுப்பினரா?<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="is_charity_member"
                                                            name="is_charity_member"
                                                            className="form-control"

                                                            type="select"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.is_charity_member || ''}
                                                            invalid={editUserForm.touched.is_charity_member && editUserForm.errors.is_charity_member ? true : false}
                                                        >
                                                            <option value="" disabled defaultValue="">அவர் இந்த அறக்கட்டளையின் உறுப்பினரா?</option>
                                                            <option key="ஆம்" value="true">ஆம்</option>
                                                            <option key="இல்லை" value="false">இல்லை</option>
                                                        </Input>
                                                        {editUserForm.touched.is_charity_member && editUserForm.errors.is_charity_member ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.is_charity_member}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    {editUserForm.values.is_charity_member  == "true" && (<div className="mb-3">
                                                        <Label>உறுப்பினர் பதிவு எண் <span className="text-danger">*</span> </Label>
                                                        <Input
                                                            id="charity_registration_number"
                                                            name="charity_registration_number"
                                                            className="form-control"
                                                            placeholder="உறுப்பினர் பதிவு எண்ணை உள்ளிடவும்"
                                                            type="text"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.charity_registration_number}
                                                            invalid={editUserForm.touched.charity_registration_number && editUserForm.errors.charity_registration_number ? true : false}
                                                            readOnly
                                                            disabled
                                                        />
                                                        {editUserForm.touched.charity_registration_number && editUserForm.errors.charity_registration_number ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.charity_registration_number}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>)}
                                                    <div className="mb-3">
                                                        <Label> தற்போதைய முகவரி  <span className="text-danger">*</span> </Label>
                                                        <Input
                                                            id="current_address"
                                                            name="current_address"
                                                            className="form-control"
                                                            placeholder="தற்போதைய முகவரியை உள்ளிடவும்"
                                                            type="textarea"
                                                            onChange={handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.current_address}
                                                            invalid={editUserForm.touched.current_address && editUserForm.errors.current_address ? true : false}
                                                        />
                                                        {editUserForm.touched.current_address && editUserForm.errors.current_address ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.current_address}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        {/* <Label> தற்போதைய முகவரியும் நிரந்தர முகவரியும் ஒன்றா?</Label> */}
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="checkbox" onChange={addressvalue} />
                                                                தற்போதைய முகவரியும் நிரந்தர முகவரியும் ஒன்றா?
                                                            </Label>
                                                        </FormGroup>
                                                    </div>
                                                    {(() => {
                                                        if (isSameAddress) {
                                                            return (
                                                                <>
                                                                    <div className="mb-3">
                                                                        <Label> பூர்விக முகவரி</Label>
                                                                        <Input
                                                                            id="permanent_address"
                                                                            name="permanent_address"
                                                                            className="form-control"
                                                                            type="textarea"
                                                                            onChange={editUserForm.handleChange}
                                                                            value={editUserForm.values.current_address}

                                                                        />

                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <>
                                                                    <div className="mb-3">
                                                                        <Label> பூர்விக முகவரி</Label>
                                                                        <Input
                                                                            id="permanent_address"
                                                                            name="permanent_address"
                                                                            className="form-control"
                                                                            placeholder="பூர்விக முகவரியை உள்ளிடவும்"
                                                                            type="textarea"
                                                                            onChange={handleChange}
                                                                            onBlur={editUserForm.handleBlur}
                                                                            value={editUserForm.values.permanent_address}

                                                                        />

                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    }

                                                    )()}
                                                    <div className="mb-3">
                                                        <FormGroup>
                                                            <Label className="form-label">இரசீது தேதி</Label>
                                                            <Input type="date"
                                                                name="receipt_date"
                                                                id="receipt_date"
                                                                onChange={editUserForm.handleChange}
                                                                onBlur={editUserForm.handleBlur}
                                                                value={editUserForm.values.receipt_date}
                                                            >
                                                            </Input>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">இரசீது புத்தக எண் </Label>
                                                        <Input
                                                            id="receipt_book_no"
                                                            name="receipt_book_no"
                                                            className="form-control"
                                                            type="select"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.receipt_book_no || ''}
                                                            invalid={editUserForm.touched.receipt_book_no && editUserForm.errors.receipt_book_no ? true : false}
                                                        >
                                                            <option value="" disabled defaultValue="">ரசீது புத்தக எண்ணைத் தேர்ந்தெடுக்கவும்</option>
                                                            {RECEIPT_BOOK_NO.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                        </Input>
                                                        {editUserForm.touched.receipt_book_no && editUserForm.errors.receipt_book_no ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.receipt_book_no}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">இரசீது எண்<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="receipt_no"
                                                            name="receipt_no"
                                                            className="form-control"
                                                            placeholder="இரசீது எண்ணைத் தேர்ந்தெடுக்கவும்"
                                                            type="number"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.receipt_no}
                                                            invalid={editUserForm.touched.receipt_no && editUserForm.errors.receipt_no ? true : false}
                                                        />
                                                        {editUserForm.touched.receipt_no && editUserForm.errors.receipt_no ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.receipt_no}</FormFeedback>
                                                        ) : null}

                                                    </div>
                                                   
                                                   
                                                </div>
                                                <div className="col-md-6">
                                                    
                                                <div className="mb-3">
                                                        <Label className="form-label">நாடு <span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="country"
                                                            name="country"
                                                            className="form-control"
                                                            placeholder="நாட்டினை தேர்வுசெய்"
                                                            type="select"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.country || ''}
                                                            invalid={editUserForm.touched.country && editUserForm.errors.country ? true : false}
                                                        >
                                                            <option value="" disabled defaultValue="">நாடு தேர்ந்தெடுக்கவும்</option>
                                                            {COUNTRY_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                        </Input>
                                                        {editUserForm.touched.country && editUserForm.errors.country ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.country}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">மாநிலம் <span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="state"
                                                            name="state"
                                                            className="form-control"
                                                            placeholder="மாநிலத்தைத் தேர்ந்தெடுக்கவும்"
                                                            type="select"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.state || ''}
                                                            invalid={editUserForm.touched.state && editUserForm.errors.state ? true : false}
                                                        >
                                                            <option value="" disabled defaultValue="">மாநிலம் தேர்ந்தெடுக்கவும்</option>
                                                            {STATE_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                        </Input>
                                                        {editUserForm.touched.state && editUserForm.errors.state ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.state}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">மாவட்டம்<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="district"
                                                            name="district"
                                                            className="form-control"
                                                            placeholder="Select district"
                                                            type="select"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.district || ''}
                                                            invalid={editUserForm.touched.district && editUserForm.errors.district ? true : false}
                                                        >
                                                            <option value="" disabled defaultValue="">மாவட்டம் தேர்ந்தெடுக்கவும்</option>
                                                            {DISTRICT_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                        </Input>
                                                        {editUserForm.touched.district && editUserForm.errors.district ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.district}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">வட்டம்</Label>
                                                        <Input
                                                            id="taluk"
                                                            name="taluk"
                                                            className="form-control"
                                                            placeholder="வட்டத்தை தேர்ந்தெடுக்கவும்"
                                                            type="text"
                                                            onChange={handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.taluk}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">பஞ்சாயத்து</Label>
                                                        <Input
                                                            id="panchayat"
                                                            name="panchayat"
                                                            className="form-control"
                                                            placeholder="பஞ்சாயத்து  தேர்ந்தெடுக்கவும்"
                                                            type="text"
                                                            onChange={handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.panchayat}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">சிற்றூர் / கிராமம்</Label>
                                                        <Input
                                                            id="village"
                                                            name="village"
                                                            className="form-control"
                                                            placeholder="கிராமப் பெயரை உள்ளிடவும்"
                                                            type="text"
                                                            onChange={handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.village}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">தபால் குறியீடு எண்</Label>
                                                        <Input
                                                            id="postal_code"
                                                            name="postal_code"
                                                            className="form-control"
                                                            placeholder="தபால் அலுவலக எண்ணை உள்ளிடவும்"
                                                            type="text"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.postal_code}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">அலைபேசி எண்</Label>
                                                        <Input
                                                            id="mobile_number"
                                                            name="mobile_number"
                                                            className="form-control"
                                                            placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                                                            type="number"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.mobile_number}
                                                            invalid={editUserForm.touched.mobile_number && editUserForm.errors.mobile_number ? true : false}
                                                            readOnly={editUserForm.values.mobile_number?.length === 10}
                                                            disabled={editUserForm.values.mobile_number?.length === 10}
                                                        />
                                                        {editUserForm.touched.mobile_number && editUserForm.errors.mobile_number ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.mobile_number}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">மாற்று அலைபேசி எண்</Label>
                                                        <Input
                                                            id="secondary_mobile_number"
                                                            name="secondary_mobile_number"
                                                            className="form-control"
                                                            placeholder="கூடுதல் தொலைபேசி எண்ணை உள்ளிடவும்"
                                                            type="number"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.secondary_mobile_number}
                                                            invalid={editUserForm.touched.secondary_mobile_number && editUserForm.errors.secondary_mobile_number ? true : false}
                                                        />
                                                        {editUserForm.touched.secondary_mobile_number && editUserForm.errors.secondary_mobile_number ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.secondary_mobile_number}
                                                            </FormFeedback>
                                                        ) : null}

                                                    </div>
                                                  
                                                    {editUserForm.values.country !== "இந்தியா" && (<><div className="mb-3">
                                                        <Label className="form-label">International Country Code</Label>
                                                        <Input
                                                            id="country_code"
                                                            name="country_code"
                                                            className="form-control"
                                                            placeholder="International Country Code"
                                                            type="number"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.country_code}
                                                        />

                                                    </div>
                                                        <div className="mb-3">
                                                            <Label className="form-label">சர்வதேச அலைபேசி எண் </Label>
                                                            <Input
                                                                id="international_mobile_number"
                                                                name="international_mobile_number"
                                                                className="form-control"
                                                                placeholder="சர்வதேச அலைபேசி எண்ணை உள்ளிடவும்"
                                                                type="number"
                                                                onChange={editUserForm.handleChange}
                                                                onBlur={editUserForm.handleBlur}
                                                                value={editUserForm.values.international_mobile_number}
                                                            />

                                                        </div>
                                                    </>)}
                                                    <div className="mb-3">
                                                        <Label className="form-label">சதரைவழி STD Code </Label>
                                                        <Input
                                                            id="std_code"
                                                            name="std_code"
                                                            className="form-control"
                                                            placeholder="தரைவழி STD Code உள்ளிடவும்"
                                                            type="number"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.std_code}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">தரைவழி தொலைபேசி எண்  </Label>
                                                        <Input
                                                            id="phone_number"
                                                            name="phone_number"
                                                            className="form-control"
                                                            placeholder="தரைவழி தொலைபேசி எண்ணை உள்ளிடவும்"
                                                            type="number"
                                                            onChange={editUserForm.handleChange}
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.phone_number}
                                                        />

                                                    </div>
                                                    
                                                    <div className="mb-3">
                                                        <Label className="form-label">குடும்ப தலைவரின் புகைப்படம்</Label>
                                                        <Input
                                                            id="profile_image"
                                                            name="profile_image"
                                                            className="form-control"
                                                            placeholder="குடும்ப தலைவரின் புகைப்படத்தை பதிவேற்றவும் "
                                                            type="file"
                                                            onBlur={editUserForm.handleBlur}
                                                            value={editUserForm.values.profile_image}
                                                            onChange={handleFiles}
                                                            invalid={editUserForm.touched.profile_image && editUserForm.errors.profile_image ? true : false}

                                                        />
                                                        {editUserForm.touched.profile_image && editUserForm.errors.profile_image ? (
                                                            <FormFeedback type="invalid">{editUserForm.errors.profile_image}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    {profileImage ?( 
                                                        <>
                                                        <div className="preview-container text-center col-md-6">
                                                          <img src={URL.createObjectURL(profileImage)}
                                                          className="preview-image"
                                                          alt="selected-file"
                                                          ></img>
                                                        </div>
                                                        </>
                                                    ): (
                                                        <div className="preview-container text-center col-md-6">
                                                        <img src={profile}
                                                        className="preview-image"
                                                        alt="selected-file"
                                                        ></img>
                                                      </div> 
                                                    )
                                                }

                                                </div>
                                            </div>
                                        </div>

                                        <Card className="usercard">

                                            <CardBody>
                                                <FieldArray
                                                    name="members"
                                                    render={(arrayHelpers) => (
                                                        <div>
                                                            <div className="d-flex align-items-center p-3 mb-3" style={{ backgroundColor: "#f8f8f1" }}>
                                                                <h5 className="m-0">குடும்ப உறுப்பினர்களின் தகவல்கள் :-</h5>
                                                                <input
                                                                    type="button"
                                                                    className="btn btn-success  ms-auto"
                                                                    value="Add Member"
                                                                    onClick={() => arrayHelpers.push({
                                                                       name: '', aadhar_no: '', mobile_number: '', gender: '', relationship: '',
                                                                        date_of_birth: '', martial_status: '', occupation: '', career_reference: '', blood_group: '', card_details: ''
                                                                    })}
                                                                />



                                                            </div>
                                                            {editUserForm.values.members && editUserForm.values.members.map((member, index) => (
                                                                <div key={index} className=" p-3 mb-3 rounded" style={{ border: "1px solid #D3D3D3" }}>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">பெயர்<span className="text-danger">*</span></Label>
                                                                                <Input
                                                                                    id={`members.${index}.name`}
                                                                                    name={`members.${index}.name`}
                                                                                    className="form-control"
                                                                                    placeholder="பெயரை உள்ளிடுக"
                                                                                    type="text"
                                                                                    value={editUserForm.values.members[index].name}
                                                                                    onChange={handleChange}
                                                                                    onBlur={editUserForm.handleBlur}
                                                                                    invalid={editUserForm.values.members[index]?.name ? false : true}
                                                                                />
                                                                                {editUserForm.values.members[index]?.name ? null : (
                                                                                    <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">ஆதார் எண்</Label>
                                                                                <Input
                                                                                    id={`members.${index}.aadhar_no`}
                                                                                    name={`members.${index}.aadhar_no`}
                                                                                    className="form-control"
                                                                                    placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                                                                                    type="number"
                                                                                    onChange={editUserForm.handleChange}
                                                                                    onBlur={editUserForm.handleBlur}
                                                                                    value={editUserForm.values.members[index].aadhar_no}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">அலைபேசி எண்  <span className="text-danger">*</span></Label>
                                                                                <Input
                                                                                    id={`members.${index}.mobile_number`}
                                                                                    name={`members.${index}.mobile_number`}
                                                                                    className="form-control"
                                                                                    placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                                                                                    type="number"
                                                                                    onChange={editUserForm.handleChange}
                                                                                    invalid={editUserForm.values.members[index]?.mobile_number ? false : true}
                                                                                    value={editUserForm.values.members[index].mobile_number}
                                                                                />
                                                                                {editUserForm.values.members[index]?.mobile_number ? null : (
                                                                                    <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">பாலினம்</Label>
                                                                                <Input
                                                                                    id={`members.${index}.gender`}
                                                                                    name={`members.${index}.gender`}
                                                                                    className="form-control"
                                                                                    placeholder="Select Gender"
                                                                                    type="select"
                                                                                    onChange={editUserForm.handleChange}
                                                                                    value={editUserForm.values.members[index].gender}
                                                                                    invalid={editUserForm.values.members[index]?.gender ? false : true}
                                                                                >
                                                                                    <option value="" disabled defaultValue="">பாலினத்தைத் தேர்ந்தெடுக்கவும்</option>
                                                                                    {GENDER.map((code) => (<option key={code} value={code}>{code}</option>))}

                                                                                </Input>
                                                                                {editUserForm.values.members[index]?.gender ? null : (
                                                                                    <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                            </div>

                                                                            <div className="mb-3">
                                                                                <FormGroup>
                                                                                    <Label className="form-label">பிறந்த தேதி</Label>
                                                                                    <Input type="date"
                                                                                        name={`members.${index}.date_of_birth`}
                                                                                        id={`members.${index}.date_of_birth`}
                                                                                        onChange={editUserForm.handleChange}
                                                                                        value={editUserForm.values.members[index].date_of_birth}
                                                                                    >
                                                                                    </Input>
                                                                                </FormGroup>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">உறவுமுறை</Label>
                                                                                <Input
                                                                                    id={`members.${index}.relationship`}
                                                                                    name={`members.${index}.relationship`}
                                                                                    className="form-control"
                                                                                    type="select"
                                                                                    onChange={editUserForm.handleChange}
                                                                                    value={editUserForm.values.members[index].relationship}
                                                                                    invalid={editUserForm.values.members[index]?.relationship ? false : true}
                                                                                >
                                                                                    <option value="" disabled defaultValue="">உறவைத் தேர்ந்தெடுக்கவும்</option>
                                                                                    {RELATIONSHIP.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                                                </Input>
                                                                                {editUserForm.values.members[index]?.relationship ? null : (
                                                                                    <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">திருமண நிலை</Label>
                                                                                <Input
                                                                                    id={`members.${index}.martial_status`}
                                                                                    name={`members.${index}.martial_status`}
                                                                                    className="form-control"
                                                                                    placeholder="திருமண நிலை"
                                                                                    type="select"
                                                                                    onChange={editUserForm.handleChange}
                                                                                    value={editUserForm.values.members[index].martial_status}
                                                                                >
                                                                                    <option value="" disabled defaultValue="">திருமண நிலை தேர்ந்தெடுக்கவும்</option>
                                                                                    {MARTIAL_STATUS.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                                                </Input>
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">தொழில்</Label>
                                                                                <Input
                                                                                    id={`members.${index}.occupation`}
                                                                                    name={`members.${index}.occupation`}
                                                                                    className="form-control"
                                                                                    placeholder="தொழில்"
                                                                                    type="select"
                                                                                    onChange={editUserForm.handleChange}
                                                                                    value={editUserForm.values.members[index].occupation}

                                                                                >
                                                                                    <option value="" disabled defaultValue="">தொழில் தேர்ந்தெடுக்கவும்</option>
                                                                                    {OCCUPATION.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                                                </Input>
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label>தொழில் குறிப்பு </Label>
                                                                                <Input
                                                                                    id={`members.${index}.career_reference`}
                                                                                    name={`members.${index}.career_reference`}
                                                                                    className="form-control"
                                                                                    placeholder="உங்கள் தொழில் விவரங்களை உள்ளிடவும்"
                                                                                    type="textarea"
                                                                                    onChange={handleChange}
                                                                                    onBlur={editUserForm.handleBlur}
                                                                                    value={editUserForm.values.members[index].career_reference}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">இரத்தப் பிரிவு</Label>
                                                                                <Input
                                                                                    id={`members.${index}.blood_group`}
                                                                                    name={`members.${index}.blood_group`}
                                                                                    className="form-control"
                                                                                    placeholder="Select Blood Group"
                                                                                    type="select"
                                                                                    onChange={editUserForm.handleChange}
                                                                                    value={editUserForm.values.members[index].blood_group}
                                                                                >
                                                                                    <option value="" disabled defaultValue="">இரத்தப் பிரிவு தேர்ந்தெடுக்கவும்</option>
                                                                                    <option key="O+" value="O+">O+</option>
                                                                                    <option key="A-" value="A-">A-</option>
                                                                                    <option key="A+" value="A+">A+</option>
                                                                                    <option key="B-" value="B-">B-</option>
                                                                                    <option key="AB+" value="AB+">AB+</option>
                                                                                    <option key="AB-" value="AB-">AB-</option>
                                                                                </Input>
                                                                            </div>
                                                                            {/* <div className="mb-3">
                                                                                <Label className="form-label">Card Details</Label>
                                                                                <Input
                                                                                    id={`members.${index}.card_details`}
                                                                                    name={`members.${index}.card_details`}
                                                                                    className="form-control"
                                                                                    placeholder="Enter Card Details"
                                                                                    type="password"
                                                                                    onChange={editUserForm.handleChange}
                                                                                    value={editUserForm.values.members[index].card_details}
                                                                                />
                                                                            </div> */}
                                                                        </div>

                                                                    </div>
                                                                    <div className="d-flex justify-content-end gap-3">
                                                                        {editUserForm.values.members.length > 1 && (<input
                                                                            type="button"
                                                                            className="btn btn-danger"
                                                                            value="Remove"
                                                                            onClick={() => handleRemove(arrayHelpers, index, member)}
                                                                        />)}
                                                                        <input
                                                                            type="button"
                                                                            className="btn btn-success"
                                                                            value="Add Another Member"
                                                                            onClick={() => arrayHelpers.push({
                                                                                name: '', aadhar_no: '', mobile_number: '', gender: '', relationship: '', 
                                                                                date_of_birth: '', martial_status: '', occupation: '', career_reference: '', blood_group: '', card_details: '',
                                                                            })}
                                                                        />

                                                                    </div>

                                                                </div>

                                                            ))}
                                                        </div>
                                                    )}
                                                />

                                            </CardBody>
                                        </Card>

                                        <div className="mt-4 text-center">
                                            <button type="button" className="btn btn-secondary me-2" onClick={handleCancle}>Cancel</button>
                                            <button className="btn btn-primary btn-block " type="submit">
                                                Save Changes
                                            </button>
                                        </div>
                                    </Form>
                                </FormikProvider>

                            </CardBody>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />

        </>
    )
}
export default EditUser;