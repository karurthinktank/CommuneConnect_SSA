import { React, useState, useEffect } from "react";
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
import * as Yup from 'yup';

import { useFormik, FieldArray, FormikProvider, Formik, Field, ErrorMessage } from "formik";
import { mobileRegExp, mobileReg } from "constants/constants";
import { USER_URL } from "helpers/url_helper";
import { POST, GET, UPLOAD } from "helpers/api_helper";
import {
    DISTRICT_LIST, STATE_LIST, COUNTRY_LIST, RECEIPT_BOOK_NO, RELATIONSHIP, OCCUPATION,
    GENDER, MARTIAL_STATUS
} from "constants/constants";
import "../../App.css";
import Sanscript from "@indic-transliteration/sanscript";
import Loader from "components/Common/Loader";
import tamil from '../../assets/images/tamil.png'
import english from '../../assets/images/english.png'


function AddUser() {
    const IMAGE_MAX_SIZE = 2e+6; //2Mb
    const IMAGE_EXTENSIONS = ['image/jpg', 'image/png', 'image/jpeg', 'image/svg', 'image/webp'];
    const [isSameAddress, setAddress] = useState(false);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState()
    const [language, setLanguage] = useState(true);
    const [showLoader, setShowLoader] = useState(false);
    const addressvalue = (event) => {
        setAddress(event.target.checked);
    }
    const [fieldValue, setFieldValue] = useState({});


    const addUserForm = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: false,
        initialValues: {
            name: '',
            father_or_husband: '',
            member_id: '',
            mobile_number: '',
            receipt_no: '',
            receipt_date: null,
            receipt_book_no: '',
            is_charity_member: false,
            charity_registration_number: '',
            current_address: '',
            permanent_address: '',
            country: '',
            state: '',
            district: '',
            taluk: '',
            panchayat: '',
            village: '',
            postal_code: '',
            secondary_mobile_number: '',
            country_code: '',
            international_mobile_number: '',
            std_code: '',
            phone_number: '',
            profile_image: '',
            gender: '',
            members: [{
                member_name: '', aadhar_no: '', member_mobile_number: '', gender: '', relationship: '',
                date_of_birth: '', martial_status: '', occupation: '', career_reference: '', blood_group: '', card_details: '',
            }],
        },

        validationSchema: Yup.object({
            name: Yup.string().required("This field is required!"),
            father_or_husband: Yup.string().required("This field is required!"),
            member_id: Yup.string().required("This field is required!"),
            receipt_book_no: Yup.string().required("This field is required!"),
            receipt_no: Yup.string().required("This field is required!"),
            gender: Yup.string().required("This field is required!"),
            profile_image: Yup.string(),
            is_charity_member: Yup.boolean().required("This field is required!"),
            current_address: Yup.string().required("This field is required!"),
            country: Yup.string().required("This field is required!"),
            state: Yup.string().required("This field is required!"),
            district: Yup.string().required("This field is required!"),
            mobile_number: Yup.string()
                .required('Mobile number is required')
                .test('valid-mobile', 'Invalid mobile number', function (value) {
                    const { country } = this.parent; // Get the country value
                    if (!value) return false; // Handle undefined or empty value
                    if (country === 'INDIA') {
                        return mobileRegExp.test(value); // Validate for India
                    }
                    return mobileReg.test(value); // Validate for other countries
                }),
            // mobile_number: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
            secondary_mobile_number: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
            members: Yup.array().of(
                Yup.object({
                    member_name: Yup.string().required("This field is required!"),
                    member_mobile_number: Yup.string()
                        .required('Mobile number is required')
                        .test('valid-mobile', 'Invalid mobile number', function (value) {
                            const { country } = this.parent; // Accessing the country from parent schema
                            if (country === 'INDIA') {
                                return mobileRegExp.test(value); // Validate for India
                            }
                            return mobileReg.test(value); // Validate for other countries
                        }),

                    gender: Yup.string().required("This field is required!"),
                    relationship: Yup.string(),
                    // aadhar_no: Yup.number().min(12, 'Too Short!'),
                    aadhar_no: Yup.string().matches(/^\d{12}$/, 'Aadhar number must be 12 digits'),

                    date_of_birth: Yup.string(),
                    martial_status: Yup.string(),
                    occupation: Yup.string(),
                    career_reference: Yup.string(),
                    blood_group: Yup.string(),
                    card_details: Yup.string(),
                })
            )
                .required('Must have Family Members')
        }),
        onSubmit: async (values) => {
            setShowLoader(true);
            const formData = new FormData();
            if (profileImage)
                formData.append("profile_image", profileImage);
            values['files'] = formData;
            formData.append("form_data", JSON.stringify(values));
            var res = await UPLOAD(USER_URL, formData);
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
        addUserForm.resetForm();
        navigate('/users');
    }

    // const handleBlur = (event) => {
    //     let translate = "";
    //     let value = event.target.value;

    //     let name = event.target.name;

    //     if (inputs[name]) {
    //         translate = Sanscript.t(inputs[name], "itrans", "tamil");
    //     }
    //     value = value.replace(inputs[name], translate);
    //     setInputs(values => ({ ...values, [name]: '' }));
    //     addUserForm.setFieldValue(name, value);

    // }

    const handleChange = (event) => {
        console.log(event)
        let name = event.target.name;
        let value = event.target.value;
        let translate = "";
        let current_value = ""
        let previousValue = ""
        if (language) {
            // if (inputs[name]) {
            //     if (event.nativeEvent.data != null)
            //         current_value += inputs[name] + event.nativeEvent.data;
            //     else{
            //         let value = inputs[name].slice(0, -1)
            //         current_value += value;
            //     }
            // }
            // else if (event.nativeEvent.data != null)
            //     current_value += event.nativeEvent.data;

            // if(!event.target.value)
            //     current_value = "";
            // setInputs(values => ({ ...values, [name]: current_value }));
            previousValue = fieldValue[name]
            if (previousValue) {
                if (event.nativeEvent.data == null)
                    previousValue = previousValue.slice(0, -1)
                else if (!event.nativeEvent.data.replace(/\s/g, ""))
                    previousValue = "";
                else if (event.nativeEvent.data)
                    previousValue += event.nativeEvent.data

            }
            else {
                if (event.nativeEvent.data != null && !event.nativeEvent.data.replace(/\s/g, ""))
                    previousValue = "";
                else if (event.nativeEvent.data)
                    previousValue = event.nativeEvent.data
            }
            console.log(previousValue)
            setFieldValue(values => ({ ...values, [name]: previousValue }))

            // if (event.nativeEvent.data != null)
            //     current_value = event.nativeEvent.data;
            // else{
            //     let value = inputs[name].slice(0, -1)
            //     current_value += value;
            // }
        }
        else {
            setFieldValue(values => ({ ...values, [name]: "" }))
        }
        if (previousValue) {
            translate = Sanscript.t(previousValue, "itrans_dravidian", "tamil");
            // value = value.replace(current_value, translate);
            let splitBySpace = value.split(/\s/g);
            let no_char_remv = 0;
            if (splitBySpace.length <= 1) {
                no_char_remv = "-" + previousValue.length;
                value = value.slice(0, parseInt(no_char_remv));
                value = translate;
            }
            else {
                no_char_remv = "-" + splitBySpace[splitBySpace.length - 1].length;
                let trans = (splitBySpace[splitBySpace.length - 1], translate);
                splitBySpace[splitBySpace.length - 1] = trans;
                value = splitBySpace.join(" ");
            }
        }
        addUserForm.setFieldValue(name, value);
        // addUserForm.setFieldValue(name, event.target.value);
    }



    function chooseLanguage(event) {
        console.log(event.target.checked);
        setLanguage(!language);
    };


    const handleFiles = (event) => {
        let files = event.target.files[0];
        if (!IMAGE_EXTENSIONS.includes(files.type)) {
            CustomToast("Invalid File Format: " + IMAGE_EXTENSIONS.join(','), "error");
            addUserForm.setFieldValue('profile_image', "");
        }
        else if (files.size > IMAGE_MAX_SIZE) {
            CustomToast("File size too large!, Maximum allowed size is 2Mb", "error");
            addUserForm.setFieldValue('profile_image', "");
        }
        else {
            setProfileImage(files);
            addUserForm.setFieldValue('profile_image', event.target.value);
        }
    }

    const errorSubmit = () => {
        console.log("error")
    }


    return (
        <>
            {showLoader && <Loader />}
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <Breadcrumb title="டேஷ்போர்டு" parentPath="/home" currentPath="/users" breadcrumbItem="குடும்பங்கள்" />
                            <Card className="usercard">
                                <CardHeader className="position-sticky top-0">
                                    <FormGroup switch className="d-flex justify-content-center align-items-center gap-3">
                                        {/* <Label className="m-0 fw-bold">மொழி</Label> */}
                                        {language ?
                                            <img src={english} className="" width="40">

                                            </img>
                                            :
                                            (
                                                // <Label className="m-0 fw-bold">English</Label>
                                                <img src={tamil} className="" width="40"></img>
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
                                <CardBody style={{ maxHeight: "650px", overflow: "scroll" }}>
                                    <FormikProvider value={addUserForm}>
                                        <Form
                                            className="form-horizontal"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                console.log(addUserForm)
                                                addUserForm.handleSubmit();
                                                addUserForm.isValid ? errorSubmit() : CustomToast(JSON.stringify(addUserForm.errors), "error");;
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
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.name}
                                                                invalid={addUserForm.touched.name && addUserForm.errors.name ? true : false}
                                                            />
                                                            {addUserForm.touched.name && addUserForm.errors.name ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.name}
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
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.father_or_husband}
                                                                invalid={addUserForm.touched.father_or_husband && addUserForm.errors.father_or_husband ? true : false}
                                                            />
                                                            {addUserForm.touched.father_or_husband && addUserForm.errors.father_or_husband ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.father_or_husband}
                                                                </FormFeedback>
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
                                                                onChange={addUserForm.handleChange}
                                                                value={addUserForm.gender}
                                                                invalid={addUserForm.touched.gender && addUserForm.errors.gender ? true : false}
                                                            >
                                                                <option value="" disabled defaultValue="" selected>பாலினத்தைத் தேர்ந்தெடுக்கவும்</option>
                                                                {GENDER.map((code) => (<option key={code} value={code}>{code}</option>))}

                                                            </Input>
                                                            {addUserForm.touched.gender && addUserForm.errors.gender ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.gender}
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.member_id}
                                                                invalid={addUserForm.touched.member_id && addUserForm.errors.member_id ? true : false}
                                                            />
                                                            {addUserForm.touched.member_id && addUserForm.errors.member_id ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.member_id}
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.is_charity_member || ''}
                                                                invalid={addUserForm.touched.is_charity_member && addUserForm.errors.is_charity_member ? true : false}
                                                            >
                                                                <option value="" disabled defaultValue="">அவர் இந்த அறக்கட்டளையின் உறுப்பினரா?</option>
                                                                <option key="ஆம்" value="true">ஆம்</option>
                                                                <option key="இல்லை" value="false">இல்லை</option>
                                                            </Input>
                                                            {addUserForm.touched.is_charity_member && addUserForm.errors.is_charity_member ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.is_charity_member}</FormFeedback>
                                                            ) : null}
                                                        </div>
                                                        {addUserForm.values.is_charity_member == "true" && (<div className="mb-3">
                                                            <Label>உறுப்பினர் பதிவு எண் <span className="text-danger">*</span> </Label>
                                                            <Input
                                                                id="charity_registration_number"
                                                                name="charity_registration_number"
                                                                className="form-control"
                                                                placeholder="உறுப்பினர் பதிவு எண்ணை உள்ளிடவும்"
                                                                type="text"
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.charity_registration_number}
                                                                invalid={addUserForm.touched.charity_registration_number && addUserForm.errors.charity_registration_number ? true : false}
                                                            />
                                                            {addUserForm.touched.charity_registration_number && addUserForm.errors.charity_registration_number ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.charity_registration_number}
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
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.current_address}
                                                                invalid={addUserForm.touched.current_address && addUserForm.errors.current_address ? true : false}
                                                            />
                                                            {addUserForm.touched.current_address && addUserForm.errors.current_address ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.current_address}
                                                                </FormFeedback>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-3">
                                                            {/* <Label> தற்போதைய முகவரியும் நிரந்தர முகவரியும் ஒன்றா?</Label> */}
                                                            <FormGroup check className="d-flex align-items-center gap-2">
                                                                <Label>

                                                                </Label>
                                                                <Input type="checkbox" className="fs-4" onChange={addressvalue} />
                                                                தற்போதைய முகவரியும் நிரந்தர முகவரியும் ஒன்றா?
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
                                                                                onChange={addUserForm.handleChange}
                                                                                value={addUserForm.values.current_address}

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
                                                                                onBlur={addUserForm.handleBlur}
                                                                                value={addUserForm.values.permanent_address}

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
                                                                    onChange={addUserForm.handleChange}
                                                                    onBlur={addUserForm.handleBlur}
                                                                    value={addUserForm.values.receipt_date}
                                                                >
                                                                </Input>
                                                                {addUserForm.touched.receipt_date && addUserForm.errors.receipt_date ? (
                                                                    <FormFeedback type="invalid">{addUserForm.errors.receipt_date}
                                                                    </FormFeedback>
                                                                ) : null}
                                                            </FormGroup>
                                                        </div>
                                                        <div className="mb-3">
                                                            <Label className="form-label">இரசீது புத்தக எண் </Label>
                                                            <Input
                                                                id="receipt_book_no"
                                                                name="receipt_book_no"
                                                                className="form-control"
                                                                type="select"
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.receipt_book_no || ''}
                                                                invalid={addUserForm.touched.receipt_book_no && addUserForm.errors.receipt_book_no ? true : false}
                                                            >
                                                                <option value="" disabled defaultValue="">ரசீது புத்தக எண்ணைத் தேர்ந்தெடுக்கவும்</option>
                                                                {RECEIPT_BOOK_NO.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                            </Input>
                                                            {addUserForm.touched.receipt_book_no && addUserForm.errors.receipt_book_no ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.receipt_book_no}</FormFeedback>
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.receipt_no}
                                                                invalid={addUserForm.touched.receipt_no && addUserForm.errors.receipt_no ? true : false}
                                                            />
                                                            {addUserForm.touched.receipt_no && addUserForm.errors.receipt_no ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.receipt_no}</FormFeedback>
                                                            ) : null}

                                                        </div>
                                                        <div className="mb-3">
                                                            <Label className="form-label">தபால் குறியீடு எண்</Label>
                                                            <Input
                                                                id="postal_code"
                                                                name="postal_code"
                                                                className="form-control"
                                                                placeholder="தபால் அலுவலக எண்ணை உள்ளிடவும்"
                                                                type="text"
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.postal_code}
                                                            />

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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.country || ''}
                                                                invalid={addUserForm.touched.country && addUserForm.errors.country ? true : false}
                                                            >
                                                                <option value="" disabled defaultValue="">நாடு தேர்ந்தெடுக்கவும்</option>
                                                                {COUNTRY_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                            </Input>
                                                            {addUserForm.touched.country && addUserForm.errors.country ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.country}</FormFeedback>
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.state || ''}
                                                                invalid={addUserForm.touched.state && addUserForm.errors.state ? true : false}
                                                            >
                                                                <option value="" disabled defaultValue="">மாநிலம் தேர்ந்தெடுக்கவும்</option>
                                                                {STATE_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                            </Input>
                                                            {addUserForm.touched.state && addUserForm.errors.state ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.district}</FormFeedback>
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.district || ''}
                                                                invalid={addUserForm.touched.district && addUserForm.errors.district ? true : false}
                                                            >
                                                                <option value="" disabled defaultValue="">மாவட்டம் தேர்ந்தெடுக்கவும்</option>
                                                                {DISTRICT_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                            </Input>
                                                            {addUserForm.touched.district && addUserForm.errors.district ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.district}</FormFeedback>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-3">
                                                            <Label className="form-label">வட்டம்/தாலுகா</Label>
                                                            <Input
                                                                id="taluk"
                                                                name="taluk"
                                                                className="form-control"
                                                                placeholder="வட்டம்/தாலுகாவை தேர்ந்தெடுக்கவும்"
                                                                type="text"
                                                                onChange={handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.taluk}
                                                            />

                                                        </div>
                                                        <div className="mb-3">
                                                            <Label className="form-label">பஞ்சாயத்து/ஊராட்சி</Label>
                                                            <Input
                                                                id="panchayat"
                                                                name="panchayat"
                                                                className="form-control"
                                                                placeholder="பஞ்சாயத்து/ஊராட்சியை  தேர்ந்தெடுக்கவும்"
                                                                type="text"
                                                                onChange={handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.panchayat}
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
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.village}
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.mobile_number}
                                                                invalid={addUserForm.touched.mobile_number && addUserForm.errors.mobile_number ? true : false}
                                                            />
                                                            {addUserForm.touched.mobile_number && addUserForm.errors.mobile_number ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.mobile_number}</FormFeedback>
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.secondary_mobile_number}
                                                                invalid={addUserForm.touched.secondary_mobile_number && addUserForm.errors.secondary_mobile_number ? true : false}
                                                            />
                                                            {addUserForm.touched.secondary_mobile_number && addUserForm.errors.secondary_mobile_number ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.secondary_mobile_number}
                                                                </FormFeedback>
                                                            ) : null}

                                                        </div>

                                                        {addUserForm.values.country !== "இந்தியா" && (<><div className="mb-3">
                                                            <Label className="form-label">International Country Code</Label>
                                                            <Input
                                                                id="country_code"
                                                                name="country_code"
                                                                className="form-control"
                                                                placeholder="International Country Code"
                                                                type="number"
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.country_code}
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
                                                                    onChange={addUserForm.handleChange}
                                                                    onBlur={addUserForm.handleBlur}
                                                                    value={addUserForm.values.international_mobile_number}
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.std_code}
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
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.phone_number}
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
                                                                accept="image/*"
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.profile_image}
                                                                onChange={handleFiles}
                                                                invalid={addUserForm.touched.profile_image && addUserForm.errors.profile_image ? true : false}

                                                            />
                                                            {addUserForm.touched.profile_image && addUserForm.errors.profile_image ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.profile_image}</FormFeedback>
                                                            ) : null}
                                                            {profileImage && (
                                                                <>
                                                                    <div className="preview-container text-center col-md-6">
                                                                        <img src={URL.createObjectURL(profileImage)}
                                                                            alt="Selected File"
                                                                            className="preview-image">
                                                                        </img>



                                                                    </div>
                                                                    <small className="help-text">இந்த படம் பயன்பாட்டின் அட்டவணையின் மேல் காட்டப்படும்.</small>
                                                                </>
                                                            )
                                                            }
                                                        </div>

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
                                                                            member_name: '', aadhar_no: '', member_mobile_number: '', gender: '', relationship: '',
                                                                            date_of_birth: '', martial_status: '', occupation: '', career_reference: '', blood_group: '', card_details: '',
                                                                        })}
                                                                    />
                                                                </div>
                                                                {addUserForm.values.members.map((member, index) => (
                                                                    <div key={index} className=" p-3 mb-3 rounded" style={{ border: "1px solid #D3D3D3" }}>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <div className="mb-3">
                                                                                    <Label className="form-label">பெயர்<span className="text-danger">*</span></Label>
                                                                                    <Input
                                                                                        id={`members.${index}.member_name`}
                                                                                        name={`members.${index}.member_name`}
                                                                                        className="form-control"
                                                                                        placeholder="பெயரை உள்ளிடுக"
                                                                                        type="text"
                                                                                        value={addUserForm.values.members[index].member_name}
                                                                                        onChange={handleChange}
                                                                                        onBlur={addUserForm.handleBlur}
                                                                                        invalid={addUserForm.values.members[index]?.member_name ? false : true}
                                                                                    />
                                                                                    {addUserForm.values.members[index]?.member_name ? null : (
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
                                                                                        onChange={addUserForm.handleChange}
                                                                                        onBlur={addUserForm.handleBlur}
                                                                                        value={addUserForm.values.members[index].aadhar_no}
                                                                                    />
                                                                                </div>
                                                                                <div className="mb-3">
                                                                                    <Label className="form-label">அலைபேசி எண்  <span className="text-danger">*</span></Label>
                                                                                    <Input
                                                                                        id={`members.${index}.member_mobile_number`}
                                                                                        name={`members.${index}.member_mobile_number`}
                                                                                        className="form-control"
                                                                                        placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                                                                                        type="text" // Use 'text' for phone input
                                                                                        onChange={addUserForm.handleChange}
                                                                                        onBlur={addUserForm.handleBlur}
                                                                                        value={addUserForm.values.members[index].member_mobile_number}
                                                                                        invalid={addUserForm.touched.members?.[index]?.member_mobile_number && !!addUserForm.errors.members?.[index]?.member_mobile_number}
                                                                                    />
                                                                                    {addUserForm.touched.members?.[index]?.member_mobile_number && addUserForm.errors.members?.[index]?.member_mobile_number && (
                                                                                        <FormFeedback type="invalid">{addUserForm.errors.members[index].member_mobile_number}</FormFeedback>
                                                                                    )}
                                                                                </div>

                                                                                <div className="mb-3">
                                                                                    <Label className="form-label">பாலினம்</Label>
                                                                                    <Input
                                                                                        id={`members.${index}.gender`}
                                                                                        name={`members.${index}.gender`}
                                                                                        className="form-control"
                                                                                        placeholder="Select Gender"
                                                                                        type="select"
                                                                                        onChange={addUserForm.handleChange}
                                                                                        value={addUserForm.values.members[index].gender}
                                                                                        invalid={addUserForm.values.members[index]?.gender ? false : true}
                                                                                    >
                                                                                        <option value="" disabled defaultValue="">பாலினத்தைத் தேர்ந்தெடுக்கவும்</option>
                                                                                        {GENDER.map((code) => (<option key={code} value={code}>{code}</option>))}

                                                                                    </Input>
                                                                                    {addUserForm.values.members[index]?.gender ? null : (
                                                                                        <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                                </div>

                                                                                <div className="mb-3">
                                                                                    <FormGroup>
                                                                                        <Label className="form-label">பிறந்த தேதி </Label>
                                                                                        <Input type="date"
                                                                                            name={`members.${index}.date_of_birth`}
                                                                                            id={`members.${index}.date_of_birth`}
                                                                                            onChange={addUserForm.handleChange}
                                                                                            value={addUserForm.values.members[index].date_of_birth}
                                                                                            placeholder="DD/MMM/YYYY"
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
                                                                                        onChange={addUserForm.handleChange}
                                                                                        value={addUserForm.values.members[index].relationship}
                                                                                        invalid={addUserForm.values.members[index]?.relationship ? false : true}
                                                                                    >
                                                                                        <option value="" disabled defaultValue="">உறவைத் தேர்ந்தெடுக்கவும்</option>
                                                                                        {RELATIONSHIP.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                                                    </Input>
                                                                                    {addUserForm.values.members[index]?.relationship ? null : (
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
                                                                                        onChange={addUserForm.handleChange}
                                                                                        value={addUserForm.values.members[index].martial_status}
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
                                                                                        onChange={addUserForm.handleChange}
                                                                                        value={addUserForm.values.members[index].occupation}

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
                                                                                        onBlur={addUserForm.handleBlur}
                                                                                        value={addUserForm.values.members[index].career_reference}
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
                                                                                        onChange={addUserForm.handleChange}
                                                                                        value={addUserForm.values.members[index].blood_group}
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
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].card_details}
                                                                                />
                                                                            </div> */}
                                                                            </div>

                                                                        </div>
                                                                        <div className="d-flex justify-content-end gap-3">
                                                                            {addUserForm.values.members.length > 1 && (<input
                                                                                type="button"
                                                                                className="btn btn-danger"
                                                                                value="Remove"
                                                                                onClick={() => arrayHelpers.remove(index)}
                                                                            />)}
                                                                            <input
                                                                                type="button"
                                                                                className="btn btn-success"
                                                                                value="Add Another Member"
                                                                                onClick={() => arrayHelpers.push({
                                                                                    member_name: '', aadhar_no: '', member_mobile_number: '', gender: '', relationship: '',
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
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddUser;