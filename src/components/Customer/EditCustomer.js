import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import helpers from '../../helpers/helpers';
import { useHistory, useLocation } from 'react-router-dom';
import customerService from '../../services/customer.service';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import { BarLoader } from 'react-spinners';
import FloatingLabel from "react-bootstrap/FloatingLabel";
// import { TextField } from '@mui/material';
toast.configure();

function EditCustomer() {
  let history = useHistory();
  const location = useLocation();
  const [initialStates, setInitialStates] = useState({
    CustomerID: 0,
    CustomerCode: "",
    formErrors: "",
    loading: false,
    spinnerMessage: "",
  })

  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //#region Fetching selected customer details
  const fetchCustomers = () => {
    const { state } = location; // Customer ID passed from View Customer Page

    if (state === 0 || state === null || state === undefined) {
      history.push("/Masters");
      return;
    }
    setInitialStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while loading Customer...",
      loading: true,
    }))

    customerService
      .getCustomer(state, helpers.getUser())
      .then((response) => {
        setInitialStates((prevState) => ({
          ...prevState,
          CustomerID: response.data.CustomerID,
          CustomerCode: response.data.CustomerCode,
          loading: false,
        }))
      })
      .catch((e) => {
        setInitialStates((prevState) => ({
          ...prevState,
          loading: false,
        }))
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Bind control value to state variable
  const onChangeCustomer = (e) => {
    const re = /^[A-Za-z]+$/;
    if (e.target.value === "" || re.test(e.target.value))
      setInitialStates((prevState) => ({
        ...prevState,
        CustomerCode: e.target.value,
      }))

    if (e.target.value !== "" || e.target.value !== null)
      setInitialStates((prevState) => ({
        ...prevState,
        formErrors: ""
      }))
  }
  //#endregion

  //#region Redirect to Customer List Page
  const moveToCustomerList = (e) => {
    history.push("/Masters/Customers");
  };
  //#endregion

  //#region Reset the page
  const reset = () => {
    setInitialStates((prevState) => ({
      ...prevState,
      formErrors: ""
    }))
    fetchCustomers();
  }
  //#endregion

  //#region Validations
  const handleFormValidation = () => {
    const custCode = initialStates.CustomerCode;
    let formErrors = "";
    let isValidForm = true;

    //Customer code
    if (!custCode) {
      isValidForm = false;
      formErrors = "Customer Code is required.";
    } else if (custCode.length !== 3) {
      isValidForm = false;
      formErrors = "Customer Code must be 3 letters.";
    }
    setInitialStates((prevState) => ({
      ...prevState, formErrors: formErrors
    }));
    return isValidForm;
  }
  //#endregion

  //#region Save Customer Code
  const saveCustomer = (e) => {
    e.preventDefault();

    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    if (handleFormValidation()) {
      setInitialStates((prevState) => ({
        ...prevState,
        spinnerMessage: "Please wait while editing the Customer...",
        loading: true,
      }));

      //Bind state data to object
      var data = {
        CustomerID: initialStates.CustomerID,
        CustomerCode: initialStates.CustomerCode,
        UserID: helpers.getUser(),
      };

      //Service call
      customerService
        .updateCustomer(initialStates.CustomerID, data)
        .then((response) => {
          toast.success("Customer Code Updated Successfully");
          setInitialStates({
            CustomerID: 0,
            CustomerCode: "",
            formErrors: "",
            loading: false,
            spinnerMessage: "",
          });
          history.push({
            pathname: "/Masters/Customers",
          });
        })
        .catch((error) => {
          setInitialStates((prevState) => ({
            ...prevState,
            loading: false,
          }));
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={initialStates.loading}
        className="custom-loader"
        spinner={
          <div className="spinner-background">
            <BarLoader
              css={helpers.getcss()}
              color={"#38D643"}
              width={"350px"}
              height={"10px"}
              speedMultiplier={0.3}
            />
            <p style={{ color: "black", marginTop: "5px" }}>
              {initialStates.spinnerMessage}
            </p>
          </div>
        }
      >
        <div style={{ height: "100%", position: "relative" }}>
          <div className="az-content-breadcrumb mg-l-10">
            <span>Master</span>
            <span>Customers</span>
          </div>
          <h4 className="d-flex align-items-center mg-l-10">
            Edit Customer{" "}
            <span className="icon-size">
              <i
                className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5"
                onClick={moveToCustomerList}
                title="Back to List"
              ></i>
            </span>
          </h4>
          <div id="Add_form">
            <div className="row row-sm">
              <div className="col-lg-4 mg-t-15">
                <div className="editCustomerFloatingInput">
                  <FloatingLabel
                    label={
                      <>
                        <b>Customer ID</b> <span className="text-danger">*</span>
                      </>
                    }
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      id="SubSubActivity"
                      value={initialStates.CustomerID}
                      onChange={onChangeCustomer}
                      readOnly
                    />
                  </FloatingLabel>
                </div>
              </div>

              <div className="col-lg mg-t-10 mg-lg-t-0"></div>
            </div>
            <div className="row  row-sm">
              <div className="col-lg-4 mg-t-20">
                <div className="editCustomerFloatingInput">
                  <FloatingLabel
                    label={
                      <>
                        <b>Customer Code</b> <span className="text-danger">*</span>
                      </>
                    }
                    className="float-hidden float-select"
                  >
                    <input
                      type="text"
                      className="form-control"
                      id="SubSubActivity"
                      value={initialStates.CustomerCode}
                      onChange={onChangeCustomer}
                      maxLength={3}
                    />
                    {initialStates.formErrors && (
                      <div className="error-message">{initialStates.formErrors}</div>
                    )}
                  </FloatingLabel>
                </div>
              </div>

              <div className="col-lg mg-t-10 mg-lg-t-0"></div>
            </div>
            <br />
            <div className="row row-sm">
              <div className="col-md-2">
                <button
                  className="mg-t-10 mg-md-t-0 btn  btn-gray-700 btn-block"
                  tabIndex="3"
                  onClick={saveCustomer}
                  id="Save"
                >
                  Save
                </button>
              </div>
              <div className="col-md-2">
                <button
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                  tabIndex="4"
                  id="Reset"
                  onClick={reset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  )
}

export default EditCustomer
