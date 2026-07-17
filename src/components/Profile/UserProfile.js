import React, { useState } from 'react';
import './userProfile.scss';
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Modal, Table } from 'react-bootstrap';
import { useEffect } from 'react';
import { loadUserProfile, loadUserRoleAccess } from '../../services/userProfile.service';
import helpers from '../../helpers/helpers';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from "material-ui-search-bar";

function UserProfile(props) {

    const tableHeader = [
        { name: "Sl.No", align: "center", width: "80px" },
        { name: "Role Name", align: "left", width: "100px" },
        { name: "Page Name", align: "left", width: "120px" },
        { name: "Is Access Granted?", align: "center", width: "120px" },
    ]

    const { userProfile } = useSelector((state) => state.userProfileData);
    const { userRoles } = useSelector((state) => state.userProfileData);
    const dispatch = useDispatch();

    const [rows, setRows] = useState(userRoles);
    const [searched, setSearched] = useState("");
    //   const classes = useStyles();

    const requestSearch = (searchedVal) => {
        const filteredRows = userRoles.filter((row) => {
            return (row.RoleName.toLowerCase().includes(searchedVal.toLowerCase()) || row.PageName.toLowerCase().includes(searchedVal.toLowerCase()));
        });
        setRows(filteredRows);
    };

    const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
    };

    useEffect(() => {
        const userName = helpers.getUser();
        dispatch(loadUserProfile(userName));
        dispatch(loadUserRoleAccess(userName));
    }, [dispatch])


    useEffect(() => {
        if (userRoles.length !== 0) {
            setRows(userRoles)
        }
    }, [userRoles])

    return (
        <Modal show={props.openProfile}
            onHide={props.closeProfileModal}
            className="profile-modal">
            <div className="user-profile-page" style={{
                height: "100%",
            }}>

                <div className="user-profile-container" style={{
                    height: "100%", overflow: "auto"
                }}>
                    <div className='modal-header'>
                        <h2 className="az-dashboard-title">User Profile</h2>
                        <h2 className="close-btn" style={{ float: "right" }}
                            onClick={props.closeProfileModal}>X</h2>
                    </div>
                    <div className='gop-up-user-details' style={{ minHeight: "6%" }}>
                        <div className='ud-user-name'>
                            <div className='ud-user-name-div'>
                                <label>First Name:</label>
                                <span>{userProfile.FirstName}</span>
                            </div>
                            <div className='ud-user-name-div'>
                                <label>Middle Name:</label>
                                <span>{userProfile.MiddleName}</span>
                            </div>
                            <div className='ud-user-name-div'>
                                <label>Last Name:</label>
                                <span>{userProfile.LastName}</span>
                            </div>
                        </div>
                    </div>
                    <div className='gop-up-user-details' style={{ minHeight: "10%" }}>
                        <div className='ud-user-name'>
                            <div className='ud-user-name-div'>
                                <label>User Name:</label>
                                <span>{userProfile.UserName}</span>
                            </div>
                            <div className='ud-user-name-div'>
                                <label>Email Id:</label>
                                <span>{userProfile.Email}</span>
                            </div>
                            <div className='ud-user-name-div'>
                                <label>Department:</label>
                                <span>{userProfile.DepartmentName}</span>
                            </div>
                        </div>
                        <div className='ud-user-name'>
                            <div className='ud-user-name-div'>
                                <label>Manager:</label>
                                <span>{userProfile.ManagerName}</span>
                            </div>
                        </div>
                    </div>
                    <div className='gop-up-user-details p-0 up-table-div'>
                        <Paper style={{ height: "100%", overflow: "hidden" }}>
                            <SearchBar
                                className='table-search-bar'
                                value={searched}
                                onChange={(searchVal) => requestSearch(searchVal)}
                                onCancelSearch={() => cancelSearch()}
                            />
                            <TableContainer sx={{ width: '100%', overflow: 'auto', height: "92%" }} className='table-main-div'>
                                <Table aria-label="sticky table table-responsive">
                                    <TableHead className='custom-table-header'>
                                        <TableRow>
                                            {tableHeader.map((header, i) => (
                                                <TableCell key={i} align={header.align} style={{ minWidth: `${header.width}` }}>
                                                    {/* <TableSortLabel
                                    active={orderBy === header.property}
                                    direction={orderBy === header.property ? order : 'asc'}
                                    onClick={() => handleSort(header.property)}
                                    > */}
                                                    {header.name}
                                                    {/* </TableSortLabel> */}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    {/* The rest of your table code remains the same */}
                                    <TableBody>
                                        {rows && rows.map((roles, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="center">
                                                    {i+1}
                                                </TableCell>
                                                <TableCell >
                                                    {roles.RoleName}
                                                </TableCell>
                                                <TableCell >
                                                    {roles.PageName}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {roles.IsActive ?
                                                        "Yes" : "No"
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                    <div className='gop-up-close-div' style={{ minHeight: "5%" }}>
                        <span
                            className="btn btn-gray-700 btn-block profile-close-btn"
                            onClick={props.closeProfileModal}
                        >
                            Close
                        </span>
                    </div>
                </div>

            </div>
        </Modal>
    )
}

export default UserProfile;
