import React, { useState, useEffect } from "react";
import Breadcrumb from "components/Common/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from "primereact/paginator";
import { GET } from "helpers/api_helper";
import { USER_URL, GET_USER_BY_CARD } from "helpers/url_helper";
import "../../assets/scss/_listusers.scss";
import noprofile from '../../assets/images/noprofile.jpg';
import Loader from "components/Common/Loader";
import CustomToast from "components/Common/Toast";
import { ToastContainer } from "react-toastify";
import { Input, Button, Label, FormGroup } from "reactstrap";
import Sanscript from "@indic-transliteration/sanscript";
import tamil from '../../assets/images/tamil.png'
import english from '../../assets/images/english.png'

function UsersListTable() {
    const [users, setUsers] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(25);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showLoader, setShowLoader] = useState(false);
    const [filter, setFilter] = useState("");
    const [previous, setPreviousValue] = useState("");
    const [language, setLanguage] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchUsers(currentPage);
    }, []);

    const fetchUsers = async (page, count = rows, additionalParams = {}) => {
        setShowLoader(true);
        let queryParams = {
            page: page,
            count: count,
            ...additionalParams
        };
        let url = `${USER_URL}?${new URLSearchParams(queryParams).toString()}`;
        const response = await GET(url);
        if (response.status === 200) {
            setUsers(response.data.data);
            setTotalRows(response.data.total_count);
            setShowLoader(false);
        } else {
            setShowLoader(false);
            CustomToast(response.data.message, "error");
        }
    };

    const selectLanguage = () => {
        setLanguage(!language);
            };

    const handleFilter = (event) => {
        let value = event.target.value;
        let translate = "";
        let previousValue = previous;

        if (language) {
            if (previousValue) {
                if (event.nativeEvent.data == null)
                    previousValue = previousValue.slice(0, -1);
                else if (!event.nativeEvent.data.replace(/\s/g, ""))
                    previousValue = "";
                else if (event.nativeEvent.data)
                    previousValue += event.nativeEvent.data;
            } else {
                if (event.nativeEvent.data != null && !event.nativeEvent.data.replace(/\s/g, ""))
                    previousValue = "";
                else if (event.nativeEvent.data)
                    previousValue = event.nativeEvent.data;
            }
            setPreviousValue(previousValue);
        } else {
            setPreviousValue("");
        }

        if (previousValue) {
            translate = Sanscript.t(previousValue, "itrans_dravidian", "tamil");
            let splitBySpace = value.split(/\s/g);
            let noCharRemv = 0;
            if (splitBySpace.length <= 1) {
                noCharRemv = "-" + previousValue.length;
                value = value.slice(0, parseInt(noCharRemv));
                value = translate;
            } else {
                noCharRemv = "-" + splitBySpace[splitBySpace.length - 1].length;
                let trans = (splitBySpace[splitBySpace.length - 1], translate);
                splitBySpace[splitBySpace.length - 1] = trans;
                value = splitBySpace.join(" ");
            }
        }
        setFilter(value);
    };

    const handleSearch = () => {
        fetchUsers(currentPage, rows, { "search": filter });
    };

    const retrieveUserbycard = async () => {
        setShowLoader(true);
        let url = GET_USER_BY_CARD
        console.log(url);
        try {
          var res = await GET(url);
          console.log(res, 'ressss')
          if (res.status === 200) {
            setShowLoader(false);
            CustomToast(res.data.message, "success");
            if (res.data.member_id){
                navigate(`/users/view/${res.data.member_id}`);
            }
          } else {
            setShowLoader(false);
            CustomToast(res.data.message, "error");
          }
        } catch (error) {
          setShowLoader(false);
          CustomToast('An error occurred', 'error');
          console.error('Error:', error);
        }
    }

    const handleClear = () => {
        setFilter("");
        fetchUsers(currentPage, rows);
    };

    const handlePageChange = (event) => {
        let page = event.page + 1;
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(page);
        fetchUsers(page, event.rows);
    };

    const getImage = (row) => {
        if (row.profile_image) {
            return (
                <div className="user-profile">
                    <img src={row.profile_image.signed_url} className="rounded-circle header-profile-user" style={{ border: row.is_profile_completed ? "2px solid green" : "2px solid red" }} />
                    {row.is_card_mapped && <div className="ms-3"><i className="mdi mdi-checkbox-marked-circle-outline fs-2 text-success"></i></div>}
                </div>
            );
        }
        return (
            <div className="user-profile">
                <img src={noprofile} className="rounded-circle header-profile-user" style={{ border: "2px solid red" }} />
            </div>
        );
    };

    const actionItems = (row) => (
        <div className="fs-2 d-block gap-2 user-actions">
            <Link to={"/users/view/" + row?.member_id}><i className="mdi mdi-eye-circle fs-1" /></Link>
            <Link to={"/users/edit/" + row?.member_id}><i className="mdi mdi-pencil-circle fs-1 text-secondary" /></Link>
            {row.is_profile_completed && <Link to={"/users/idcard/" + row?.member_id}><i className="mdi mdi-card-account-details text-success fs-1" /></Link>}
        </div>
    );

    const customBodyTemplate = (rowData, column) => {
        const isMobileView = () => {
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            return viewportWidth < 768; // Adjust breakpoint as per your design's mobile view criteria
        };
    
        return (
            <div>
                {isMobileView() && (
                    <div className="mobile-row">
                        <span className="mobile-label">{column.header}:</span>
                        <span className="mobile-value">{rowData[column.field]}</span>
                    </div>
                )}
                {!isMobileView() && (
                    <span>{rowData[column.field]}</span>
                )}
            </div>
        );
    };
    return (
        <>
            {showLoader && <Loader />}
            <div className="page-content">
                <Breadcrumb title="டேஷ்போர்டு" parentPath="/home" currentPath="/users" breadcrumbItem="குடும்பங்கள்" />
                <div className="row p-2 align-items-center">
                    <div className="col-12 col-md-2">
                        <FormGroup switch className="d-flex justify-content-center align-items-center gap-3">
                            {/* <Label className="m-0 fw-bold">{language}</Label> */}
                            {language ? 
                            <img src={tamil} className="" width="40">
                            
                            </img> 
                            : 
                             (
                                // <Label className="m-0 fw-bold">English</Label>
                                <img src={english} className="" width="40"></img>
                             )
                             }
                            
                            <Input type="switch" onClick={selectLanguage} checked={language} className="fs-2 ms-1" defaultValue={true} />
                        </FormGroup>
                    </div>
                    <div className="col-12 col-md-7 ">
                        <div className="row align-items-center ps-1 mt-2">
                            <div className="col-8 col-md-6">
                                <form>
                                    <Input type="text" id="search" name="search" onChange={handleFilter} value={filter} placeholder="Filter by Name, Mobile Number, or Member Id" />
                                </form>
                            </div>
                            <div className="col-4 col-md-6 d-sm-flex text-end">
                                <Button type="button" onClick={handleSearch} className="btn-success"><span className="mdi mdi-magnify"></span></Button>
                                <Button type="button" onClick={retrieveUserbycard} className="btn-success ms-1" data-bs-toggle="tooltip" title="Tap your card to retrieve the User!"><span className="mdi mdi-cellphone-nfc"></span></Button>
                                <Button type="button" onClick={handleClear} className="btn-secondary ms-1"><span className="mdi mdi-close"></span></Button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="d-flex">
                            <div className="ms-auto d-flex align-items-center gap-2 center-button">
                                <Link to={`/users/add`}>
                                    <button className="btn btn-primary btn-block ms-auto" type="button">
                                        <span className="mdi mdi-plus">
                                            </span>
                                            </button>
                                            </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="card datatable-container p-datatable-responsive">
                            <DataTable value={users} scrollable scrollHeight="600px" className="custom-datatable" rowClassName="card-row">
                                <Column field="image" body={(rowData) => getImage(rowData)} header="குடும்ப தலைவர் புகைப்படம்"></Column>
                                <Column field="name" header="குடும்ப தலைவர் பெயர்" body={(rowData) => customBodyTemplate(rowData, { field: "name", header: "குடும்ப தலைவர் பெயர்" })} sortable></Column>
                                <Column field="father_or_husband" header="த/க பெயர்" body={(rowData) => customBodyTemplate(rowData, { field: "father_or_husband", header: "த/க பெயர்" })} sortable></Column>
                                <Column field="member_id" header="உறுப்பினர் எண்" body={(rowData) => customBodyTemplate(rowData, { field: "member_id", header: "உறுப்பினர் எண்" })} sortable></Column>
                                <Column field="mobile_number" header="தொலைபேசி எண்" body={(rowData) => customBodyTemplate(rowData, { field: "mobile_number", header: "தொலைபேசி எண்" })} sortable></Column>
                                <Column field="current_address" header="முகவரி" body={(rowData) => customBodyTemplate(rowData, { field: "current_address", header: "முகவரி" })} sortable></Column>
                                <Column field="status" header="செயல்" body={actionItems}></Column>
                            </DataTable>
                            <div className="card">
                            <Paginator first={first} rows={rows} totalRecords={totalRows} rowsPerPageOptions={[25, 50, 75, 100]} onPageChange={handlePageChange} />
                            
                            </div>
                            </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default UsersListTable;
