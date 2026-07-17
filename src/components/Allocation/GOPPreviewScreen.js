import React, { Component } from "react";
import {
    Col,
    Form,
    Row,
    Modal,
    Table,
    Button,
} from "react-bootstrap";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { withRouter } from 'react-router-dom';
import "ag-grid-community/styles/ag-grid.css";
import "react-toastify/dist/ReactToastify.css";
import "./gopscreens.css";
import helper from "../../helpers/helpers";
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { setNMUniqurVaue, rowDataPass } from '../../redux/action';
import LoadingOverlay from "react-loading-overlay";
import { BarLoader } from "react-spinners";
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
toast.configure();

class GOPPreviewScreen extends Component {


    render() {

        const tableHeader = [
            { name: "AttributeName", align: "left", width: "100px" },
            { name: "AttributeValue", align: "left", width: "300px" },
        ];

        //  #endregion
        const { showPreview, closePreviewModal, stateValue } = this.props;

        // #region main return
        return (
            <Modal show={showPreview} onHide={closePreviewModal} className="edit-gop-modal">
                <div style={{ height: "100%" }}>
                    <LoadingOverlay
                        active={stateValue.loading}
                        className="custom-loader"
                        spinner={
                            <div className="spinner-background">
                                <BarLoader
                                    css={helper.getcss()}
                                    color={"#38D643"}
                                    width={"350px"}
                                    height={"10px"}
                                    speedMultiplier={0.3}
                                />
                                <p style={{ color: "black", marginTop: "5px" }}>
                                    {stateValue.spinnerMessage}
                                </p>
                            </div>
                        }
                    >

                        <div style={{ height: "100%" }}>
                            <div style={{height: '89%', overflow: 'auto'}}>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen reference-field-div"
                                    style={{ height: "10%" }}
                                >
                                    <Col lg={2} className="ref-left-div" style={{ padding: "0" }} >
                                        <Row style={{ marginTop: "5px" }} >
                                            <Col lg={10}>
                                                <h4 className="reference-head"> Reference Fields </h4>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={10} className="ref-right-div">
                                        <div className="page-header-div">
                                            <div className="page-header-sections">
                                                <h6>Unique ID:</h6>&nbsp;
                                                <p>{stateValue.uniqueId}</p>
                                            </div>
                                            <div className="page-header-sections">
                                                <h6>Customer Code:</h6>&nbsp;
                                                <p>{stateValue.customerCode}</p>
                                            </div>
                                            <div className="page-header-sections">
                                                <h6>Project Code:</h6>&nbsp;
                                                <p>{stateValue.projectCode}</p>
                                            </div>
                                            {stateValue.batchNo && (
                                                <div className="page-header-sections">
                                                    <h6>Batch No:</h6>&nbsp;
                                                    <p>{stateValue.batchNo}</p>
                                                </div>
                                            )}
                                            <div className="page-header-sections">
                                                <h6>Production User:</h6>&nbsp;
                                                <p>{helper.getUser()}</p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="border-screen" style={{ height: "90%" }}>

                                    <div className="gop-mfr-row-section">
                                        <Form.Label className="readGOPHead"></Form.Label>
                                        <div className="gop-mfr-row">
                                            <Form.Label className="gop-mfr-label"> MFR </Form.Label>&nbsp;
                                            <div className="gop-mfr-value input-gray">{stateValue.mfrName}</div>
                                        </div>
                                        &nbsp;&nbsp;
                                        <div className="gop-mfr-row">
                                            <Form.Label className="gop-mfr-label"> MFR PN </Form.Label>
                                            &nbsp;
                                            <div className="gop-mfr-value input-gray">{stateValue.mfrPN}</div>
                                        </div>
                                        &nbsp;&nbsp;
                                        <div className="gop-mfr-row">
                                            <Form.Label className="gop-mfr-label"> Vendor </Form.Label>
                                            &nbsp;
                                            <div className="gop-mfr-value input-gray">{stateValue.vendorName}</div>
                                        </div>
                                        &nbsp;&nbsp;
                                        <div className="gop-mfr-row">
                                            <Form.Label className="gop-mfr-label">Vendor PN</Form.Label>
                                            &nbsp;
                                            <div className="gop-mfr-value  input-gray">{stateValue.vendorPN}</div>
                                        </div>
                                        &nbsp;&nbsp;
                                        <div className="gop-mfr-row">
                                            <Form.Label className="gop-mfr-label"> UOM </Form.Label>&nbsp;
                                            <Form.Control
                                                type="text"
                                                className="pro-input"
                                                style={{ height: "100%", padding: "2% 6px" }}
                                                name="uOM"
                                                value={stateValue.uOM}
                                                onChange={this.inputChangeHandler}
                                            />
                                        </div>
                                    </div>

                                    <div className="gop-mfr-row-section">
                                        <Form.Label className="readGOPHead"></Form.Label>
                                        <div className="custom-input-div">
                                            <Row className="mr-0">
                                                {stateValue.customColumnName1 &&
                                                    <Col md={4}>
                                                        <div className="gop-mfr-row">
                                                            <Form.Label className="gop-mfr-label"> {stateValue.customColumnName1} </Form.Label>&nbsp;
                                                            <Form.Control
                                                                type="text"
                                                                className="pro-input input-gray"
                                                                style={{ height: "100%", padding: "1% 6px" }}
                                                                name="uOM"
                                                                value={stateValue.customColumnName1Value}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>
                                                }
                                                {stateValue.customColumnName2 &&
                                                    <Col md={4}>
                                                        <div className="gop-mfr-row">
                                                            <Form.Label className="gop-mfr-label"> {stateValue.customColumnName2} </Form.Label>&nbsp;
                                                            <Form.Control
                                                                type="text"
                                                                className="pro-input input-gray"
                                                                style={{ height: "100%", padding: "1% 6px" }}
                                                                name="uOM"
                                                                value={stateValue.customColumnName2Value}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>
                                                }
                                                {stateValue.customColumnName3 &&
                                                    <Col md={4}>
                                                        <div className="gop-mfr-row">
                                                            <Form.Label className="gop-mfr-label"> {stateValue.customColumnName3} </Form.Label>&nbsp;
                                                            <Form.Control
                                                                type="text"
                                                                className="pro-input input-gray"
                                                                style={{ height: "100%", padding: "1% 6px" }}
                                                                name="uOM"
                                                                value={stateValue.customColumnName3Value}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </Col>
                                                }
                                            </Row>
                                        </div>
                                    </div>

                                    <div className="form-row-div">
                                        <Form.Label className="readGOPHead">
                                            Short Description
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            as="textarea"
                                            className="pro-input input-gray hide-scrollbar"
                                            name="shortDescription"
                                            defaultValue={stateValue.shortDescription}
                                            onChange={this.inputChangeHandler}
                                            ref={this.textareaRef1}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-row-div">
                                        <Form.Label className="readGOPHead">
                                            Long Description
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            as="textarea"
                                            className="pro-input input-gray hide-scrollbar"
                                            name="longDescription"
                                            defaultValue={stateValue.longDescription}
                                            onChange={this.inputChangeHandler}
                                            ref={this.textareaRef2}
                                            readOnly
                                        />
                                    </div>
                                    <hr className="differ-input-output" />
                                    <div className="form-row-div">
                                        <Form.Label className="readGOPHead">
                                            New Short Description
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="pro-input input-lightblue"
                                            name="newShortDescription"
                                            value={stateValue.newShortDescription}
                                            onChange={this.inputChangeHandler}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-row-div">
                                        <Form.Label className="readGOPHead">
                                            New Long Description
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            className="pro-input input-lightblue"
                                            name="newLongDescription"
                                            value={stateValue.newLongDescription}
                                            style={{ overflow: "hidden" }}
                                            onChange={this.inputChangeHandler}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-row-div">
                                        <Form.Label className="readGOPHead">Missing Words</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            className="pro-input input-lightblue"
                                            name="missingWords"
                                            value={stateValue.missingWords}
                                            onChange={this.inputChangeHandler}
                                            style={{ overflow: "hidden", color: "#ff0000" }}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <div className="border-screen info-div-preview" style={{ height: "100%" }}>
                                    <Row>
                                        <Col md={4}>Noun / Modifier: <b>{stateValue.selectedNounModifier.value}</b></Col>
                                        <Col md={2}>Status: <b>{stateValue.selectedStatus}</b></Col>
                                        <Col md={2}>Level: <b>{stateValue.selectedLevel}</b></Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> NM Attributes </h4>
                                </Row>
                                <div className="border-screen" style={{ height: "90%" }}>

                                    <div className="ag-theme-alpine production-theme-alpine">
                                        <Paper style={{ height: "100%", overflow: "hidden" }}>
                                            <TableContainer
                                                sx={{ width: "100%", overflow: "auto", height: "92%" }}
                                                className="table-main-div"
                                            >
                                                <Table
                                                    aria-label="sticky table table-responsive"
                                                    className="attribute-table"
                                                >
                                                    <TableHead className="custom-table-header">
                                                        <TableRow>
                                                            {tableHeader.map((header, i) => (
                                                                <TableCell
                                                                    key={i}
                                                                    align={header.align}
                                                                    style={{ minWidth: `${header.width}` }}
                                                                >
                                                                    {header.name}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {stateValue.itemAttributes.length === 0 ?
                                                            <TableRow>
                                                                <TableCell colSpan={tableHeader.length}>No Data Found</TableCell>
                                                            </TableRow>
                                                            :
                                                            stateValue.itemAttributes.map((attributes, i) => (
                                                                <TableRow key={i}>
                                                                    <TableCell>{attributes.AttributeName}</TableCell>
                                                                    <TableCell >{attributes.AttributeValue}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                    </div>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> Manufacturer Info </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                    <Row>
                                        <Col md={2}>MFR Name 1: <b>{stateValue.mfrName1.label}</b></Col>
                                        <Col md={2}>MFR PN 1: <b>{stateValue.mfrPN1.label}</b></Col>
                                        <Col md={2}>MFR Name 2: <b>{stateValue.mfrName2.label}</b></Col>
                                        <Col md={2}>MFR PN 2: <b>{stateValue.mfrPN2.label}</b></Col>
                                        <Col md={2}>MFR Name 3: <b>{stateValue.mfrName3.label}</b></Col>
                                        <Col md={2}>MFR PN 3: <b>{stateValue.mfrPN3.label}</b></Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> Vendor Info </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                    <Row>
                                        <Col md={2}>Vendor Name 1: <b>{stateValue.vendorName1.label}</b></Col>
                                        <Col md={2}>Vendor PN 1: <b>{stateValue.vendorPN1.label}</b></Col>
                                        <Col md={2}>Vendor Name 2: <b>{stateValue.vendorName2.label}</b></Col>
                                        <Col md={2}>Vendor PN 2: <b>{stateValue.vendorPN2.label}</b></Col>
                                        <Col md={2}>Vendor Name 3: <b>{stateValue.vendorName3.label}</b></Col>
                                        <Col md={2}>Vendor PN 3: <b>{stateValue.vendorPN3.label}</b></Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> Additional Info </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                    <Row>
                                        <Col md={2}>From Web:</Col>
                                        <Col md={10}><b>{stateValue.additionalInfoFromWeb}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>From Input:</Col>
                                        <Col md={10}><b>{stateValue.additionalInfo}</b></Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> UNSPSC </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                    <Row>
                                        <Col md={2}>UNSPSC Code:</Col>
                                        <Col md={10}><b>{stateValue.unspscCode}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>UNSPSC Category:</Col>
                                        <Col md={10}><b>{stateValue.unspscCategory}</b></Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> Web Reference </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                    <Row>
                                        <Col md={2}>URL 1:</Col>
                                        <Col md={10}><b>{stateValue.webRefURL1}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>URL 2:</Col>
                                        <Col md={10}><b>{stateValue.webRefURL2}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>URL 3:</Col>
                                        <Col md={10}><b>{stateValue.webRefURL3}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>PDF URL:</Col>
                                        <Col md={10}><b>{stateValue.webRefPdfURL}</b></Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> Remarks </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                    <Row>
                                        {stateValue.remarks}
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> Query </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                    <Row>
                                        {stateValue.query}
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> Application </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                    
                                    <Row>
                                    <Col md={2}>Value:</Col>
                                    <Col md={10}><b>{stateValue.application}</b></Col>
                                        
                                    </Row>
                                </div>
                            </div>
                            <div className="gd-read-screen">
                                <Row
                                    className="border-screen prev-header-div"
                                    style={{ height: "10%" }}
                                >
                                    <h4 className="reference-head"> Other References </h4>
                                </Row>
                                <div className="border-screen info-div-preview" style={{ height: "90%" }}>
                                <Row>
                                        <Col md={2}>DWG:</Col>
                                        <Col md={10}><b>{stateValue.dwg}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>POS:</Col>
                                        <Col md={10}><b>{stateValue.pos}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>ITEM NO:</Col>
                                        <Col md={10}><b>{stateValue.itemNo}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>SERIAL NO:</Col>
                                        <Col md={10}><b>{stateValue.serialNo}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>OTHER NUMBER:</Col>
                                        <Col md={10}><b>{stateValue.otherNo}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>KKS Code:</Col>
                                        <Col md={10}><b>{stateValue.kksCode}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>Assembly/Part?:</Col>
                                        <Col md={10}><b>{stateValue.assemblyOrPart === 'A' ? 'Assembly' : stateValue.assemblyOrPart === 'P' ? 'Part' : ''}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>BOM:</Col>
                                        <Col md={10}><b>{stateValue.bom}</b></Col>
                                    </Row>
                                    <Row>
                                        <Col md={2}>Green Items (Yes / Not Applicable):</Col>
                                        <Col md={10}><b>{stateValue.greenItems === 'Y' ? 'Yes' : stateValue.greenItems === 'N' ? 'Not Applicable' : ''}</b></Col>
                                    </Row>
                                </div>
                            </div>
                            
                            </div>
                            <div
                                className="d-grid gap-2 d-md-flex justify-content-md-end pt-3 pb-3"
                                style={{minHeight: '8%'}}
                            >
                                <Button
                                    varinat="primary"
                                    className="saveEditScreenData float-end mr-4"
                                    onClick={closePreviewModal}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </LoadingOverlay>
                </div>
            </Modal>
        );
        // #endregion
    }
}

const mapStateToProps = (state) => ({
    data: state.productionsData,
});

export default withRouter(connect(mapStateToProps, { setNMUniqurVaue, rowDataPass })(GOPPreviewScreen));
