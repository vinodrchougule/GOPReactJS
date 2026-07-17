import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import "react-toastify/dist/ReactToastify.css";
import "./NounModifierTemplateList.scss";
import helper from "../../helpers/helpers";
import { Row, Col } from "react-bootstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { MaterialReactTable } from "material-react-table";
// import { Box, IconButton, Tooltip } from "@mui/material";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
import moment from "moment";
import mroDictionaryService from "../../services/mroDictionary.service";
// import { CSVLink } from "react-csv";
toast.configure();

class NounModifierTemplateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      spinnerMessage: "",
      UserID: helper.getUser(),
      nounModifierTableColumns: [],
      nounModifierTableData: [],
      activeRowId: null,
      pageIndex: 0,
      pageSize: 100,
      totalPages: 0,
    };
    const { nounModifierTableColumns, nounModifierTableData } =
      this.nounModifierTemplateTable();
    this.state.nounModifierTableColumns = nounModifierTableColumns;
    this.state.nounModifierTableData = nounModifierTableData;
    this.moveToViewNounModifierTemplate =
      this.moveToViewNounModifierTemplate.bind(this);
  }

  moveToViewNounModifierTemplate(Noun, Modifier, VersionNameOrNo) {
    this.props.history.push({
      pathname: "/ViewNounModifierTemplate",
      state: { Noun, Modifier, VersionNameOrNo },
    });
  }

  //#region Export to CSV
  handleNounModifierCSVExport = () => {
    this.csvLink.link.click();
  };
  getTransformedNounModifierDataForExport = () => {
    return this.state.nounModifierTableData.map((item, index) => ({
      ...item,
      Noun_Modifier: `${item.Noun} _ ${item.Modifier}`,
      CreatedOn: item.CreatedOn
        ? moment(item.CreatedOn).format("DD-MMM-YYYY")
        : "",
      UpdatedOn: item.UpdatedOn
        ? moment(item.UpdatedOn).format("DD-MMM-YYYY")
        : "",
      SlNo: index + 1,
    }));
  };
  //#endregion

  //#region Component Did Mount
  componentDidMount() {
    this.fetchNounModifiersData();
  }
  //#endregion

  //#region Read Noun-Modifier Template List Of All Versions
  fetchNounModifiersData = () => {
    const UserID = helper.getUser();
    const VersionNameOrNo = "";
    this.setState({
      spinnerMessage:
        "Please wait while loading Noun-Modifier Template List...",
      loading: true,
    });
    mroDictionaryService
      .readNounModifiersTemplateList(UserID, VersionNameOrNo)
      .then((response) => {
        const currentDataLength = this.state.nounModifierTableData.length;
        const newData = response.data.map((item, index) => ({
          ...item,
          Noun_Modifier: `${item.Noun} _ ${item.Modifier}`,
          CreatedOn: `${moment(item.CreatedOn).format("DD-MMM-YYYY")}`,
          UpdatedOn: item.UpdatedOn
            ? moment(item.UpdatedOn).format("DD-MMM-YYYY")
            : "",
          SlNo: currentDataLength + index + 1,
        }));

        this.setState((prevState) => ({
          nounModifierTableData: [
            ...prevState.nounModifierTableData,
            ...newData,
          ],
          loading: false,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ loading: false });
      });
  };
  //#endregion

  // #region Table Columns
  nounModifierTemplateTable() {
    const nounModifierTableColumns = [
      {
        accessorKey: "SlNo",
        header: "Sl No.",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "VersionNameOrNo",
        header: "Version Name / No.",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Noun_Modifier",
        header: "Noun _ Modifier",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "80%",
          },
        },
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        muiTableBodyCellProps: {
          align: "left",
        },
        Cell: ({ row }) => {
          const { Noun, Modifier, VersionNameOrNo } = row.original;
          return (
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() =>
                this.moveToViewNounModifierTemplate(
                  Noun,
                  Modifier,
                  VersionNameOrNo,
                )
              }
            >
              {`${Noun} _ ${Modifier}`}
            </span>
          );
        },
      },
      {
        accessorKey: "CreatedOn",
        header: "Created On",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "CreatedBy",
        header: "Created By",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "12%",
          },
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "UpdatedOn",
        header: "Updated On",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "12%",
          },
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "UpdatedBy",
        header: "Updated By",
        textAlign: "center",
        muiTableHeadCellProps: {
          align: "center",
          style: {
            width: "12%",
          },
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ];
    const nounModifierTableData = [];
    return { nounModifierTableColumns, nounModifierTableData };
  }
  //#endregion

  //#region Render
  render() {
    const setHeight = (value) => {
      return { height: `${value}%` };
    };
    const { nounModifierTableData, nounModifierTableColumns, activeRowId } =
      this.state;
    return (
      <div
        style={setHeight(100)}
        className="production-update-main nmlist-main"
      >
        <LoadingOverlay
          active={this.state.loading}
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
                {this.state.spinnerMessage}
              </p>
            </div>
          }
        >
          <Row className="mg-t-5 mg-l-10 mg-r-15">
            <Col lg={12} style={{ maxWidth: "100%" }}>
              <div
                style={{ border: "1px solid #cdd4e0" }}
                className="mg-l-0 mg-r-0 mg-t-0 nounModifierTemplateData"
              >
                <div className="col-md-12 pd-t-10 pd-b-10 ">
                  <ToolkitProvider>
                    {() => (
                      <div className="mg-t-0">
                        <div className="pdqcmro masters-material-table nmmodifiertemplist">
                          <div onScroll={this.handleScroll}>
                            <MaterialReactTable
                              data={nounModifierTableData}
                              columns={nounModifierTableColumns}
                              muiPaginationProps={{
                                color: "primary",
                                shape: "rounded",
                                showRowsPerPage: false,
                                variant: "outlined",
                                sx: {
                                  "& .MuiPaginationItem-root": {
                                    borderColor: "#5B47FB",
                                  },
                                  "& .Mui-selected": {
                                    backgroundColor: "#5B47FB",
                                    color: "white",
                                  },
                                  "& .MuiPaginationItem-ellipsis": {
                                    borderColor: "#5B47FB",
                                  },
                                  marginTop: "16px",
                                },
                              }}
                              paginationDisplayMode="pages"
                              enableColumnFilterModes={true}
                              enableColumnOrdering={false}
                              enableStickyHeader={true}
                              enableDensityToggle={false}
                              enableGlobalFilter={true}
                              enableRowSelection={false}
                              initialState={{
                                pagination: { pageIndex: 0, pageSize: 100 },
                              }}
                              getRowProps={(row) => ({
                                style: {
                                  backgroundColor:
                                    activeRowId === row.original.id
                                      ? "#e0e0e0"
                                      : "transparent",
                                },
                              })}
                              // renderTopToolbarCustomActions={() => (
                              //   <Box
                              //     sx={{
                              //       display: "flex",
                              //       gap: "16px",
                              //       padding: "8px",
                              //       flexWrap: "wrap",
                              //     }}
                              //   >
                              //     <Tooltip title="Download CSV">
                              //       <IconButton
                              //         onClick={this.handleNounModifierCSVExport}
                              //       >
                              //         <FileDownloadIcon
                              //           title="Export to CSV"
                              //           style={{
                              //             color: "#5B47FB",
                              //             width: "1em",
                              //             height: "1em",
                              //           }}
                              //         />
                              //       </IconButton>
                              //     </Tooltip>
                              //     <CSVLink
                              //       data={this.getTransformedNounModifierDataForExport()}
                              //       headers={[
                              //         { label: "Sl No.", key: "SlNo" },
                              //         {
                              //           label: "Version Name / No.",
                              //           key: "VersionNameOrNo",
                              //         },
                              //         {
                              //           label: "Noun _ Modifier",
                              //           key: "Noun_Modifier",
                              //         },
                              //         { label: "Created On", key: "CreatedOn" },
                              //         { label: "Created By", key: "CreatedBy" },
                              //         { label: "Updated On", key: "UpdatedOn" },
                              //         { label: "Updated By", key: "UpdatedBy" },
                              //       ]}
                              //       filename="Noun-Modifier Template Data.csv"
                              //       ref={(r) => (this.csvLink = r)}
                              //       style={{ display: "none" }}
                              //     />
                              //   </Box>
                              // )}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
            </Col>
          </Row>
        </LoadingOverlay>
      </div>
    );
  }
  //#endregion
}

export default withRouter(NounModifierTemplateList);
