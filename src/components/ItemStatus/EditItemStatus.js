import React, { Component } from "react";
import ItemStatusService from "../../services/itemStatus.service";
import helper from "../../helpers/helpers";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class EditItemStatus extends Component {
  constructor(props) {
    super(props); //reference to the parents constructor() function.

    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeIsActive = this.onChangeIsActive.bind(this);
    this.moveToItemStatusList = this.moveToItemStatusList.bind(this);
    this.saveItemStatus = this.saveItemStatus.bind(this);
    this.reset = this.reset.bind(this);

    //Component state
    this.state = {
      itemStatusID: 0,
      status: "",
      isActive: true,
      formErrors: {},
      loading: false,
      spinnerMessage: "",
    };
  }

  //#region Component Mount
  componentDidMount() {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    this.fetchItemStatus();
  }
  //#endregion

  //#region Fetching selected Item Status details
  fetchItemStatus() {
    const { state } = this.props.location; 

    if (state === 0 || state === null || state === undefined) {
      this.props.history.push("/Masters/ItemStatusList");
      return;
    }

    this.setState({
      spinnerMessage: "Please wait while loading Item Status...",
      loading: true,
    });

    ItemStatusService.getItemStatus(state, helper.getUser())
      .then((response) => {
        this.setState({
          itemStatusID: response.data.ItemStatusID,
          status: response.data.Status,
          isActive: response.data.IsActive,
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({ loading: false });
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region  Validating the input data
  handleFormValidation() {
    const status = this.state.status.trim();
    let formErrors = {};
    let isValidForm = true;

    if (!status) {
      isValidForm = false;
      formErrors["statusError"] = "Status is required";
    }

    this.setState({ formErrors: formErrors });
    return isValidForm;
  }
  //#endregion

  //#region Bind control value to state variable
  onChangeStatus(e) {
    this.setState({
      status: e.target.value,
    });

    if (e.target.value !== "" || e.target.value !== null)
      this.setState({ formErrors: {} });
  }
  //#endregion

  //#region get IsActive value
  onChangeIsActive(e) {
    this.setState({
      isActive: e.target.checked,
    });
  }
  //#endregion

  //#region Redirect to Item Status List Page
  moveToItemStatusList = (e) => {
    this.props.history.push("/Masters/ItemStatusList");
  };
  //#endregion

  //#region Reset the page
  reset() {
    this.fetchItemStatus();
    this.setState({ formErrors: {} });
  }
  //#endregion

  //#region Save Item Status
  saveItemStatus = (e) => {
    if (!helper.getUser()) {
      this.props.history.push({
        pathname: "/",
      });
      return;
    }

    if (this.handleFormValidation()) {
      this.setState({
        spinnerMessage: "Please wait while saving Item Status...",
        loading: true,
      });

      var data = {
        ItemStatusID: this.state.itemStatusID,
        Status: this.state.status.trim(),
        IsActive: this.state.isActive,
        UserID: helper.getUser(),
      };

      ItemStatusService.updateItemStatus(this.state.itemStatusID, data)
        .then(() => {
          toast.success("Item Status Updated Successfully");
          this.setState(this.initialState);
          this.props.history.push({
            pathname: "/Masters/ItemStatusList",
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Render
  render() {
    const { statusError } = this.state.formErrors;
    return (
      <div className="pro-main-display">
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
          <div className="az-content-breadcrumb">
            <span>Master</span>
            <span>Item Status</span>
          </div>
          <h4>
            Edit Item Status{" "}
            <span className="icon-size">
              <i
                className="far fa-arrow-alt-circle-left text-primary pointer"
                onClick={this.moveToItemStatusList}
                title="Back to Item Status List"
              ></i>
            </span>
          </h4>
          <div>
            <div className="row row-sm">
              <div className="col-md-2">
                <label>
                  <b>Item Status ID </b>{" "}
                  <span className="text-danger asterisk-size">*</span>
                </label>
              </div>
              <div className="col-md-5 mg-t-7">
                <p> {this.state.itemStatusID}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2">
                <label>
                  <b>Status</b>{" "}
                  <span className="text-danger asterisk-size">*</span>
                </label>
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  id="Status"
                  name="Status"
                  maxLength="50"
                  value={this.state.status}
                  onChange={this.onChangeStatus}
                />
                {statusError && (
                  <div className="error-message">{statusError}</div>
                )}
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-2">
                <label>
                  <b>Is Active?</b>
                </label>
              </div>
              <div className="col-md-5 mg-t-5">
                <input
                  type="checkbox"
                  value={this.state.isActive}
                  onChange={this.onChangeIsActive}
                  checked={this.state.isActive}
                  id="IsActive"
                />
              </div>
            </div>
            <br />
            <div className="row row-sm">
              <div className="col-md-1"></div>
              <div className="col-md-2">
                <button
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                  id="Save"
                  onClick={this.saveItemStatus}
                >
                  Save
                </button>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-2">
                <button
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                  id="Reset"
                  onClick={this.reset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </div>
    );
  }
  //#endregion
}

export default EditItemStatus;
