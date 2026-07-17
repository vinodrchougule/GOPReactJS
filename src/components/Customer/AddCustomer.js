import React, { useEffect, useState } from 'react'
import helpers from '../../helpers/helpers';
import { useHistory } from 'react-router-dom';
import customerService from '../../services/customer.service';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import { BarLoader } from 'react-spinners';
import FloatingLabel from "react-bootstrap/FloatingLabel";
toast.configure();

function AddCustomer() {
  let history = useHistory();
  //#region Initial State
  const [initStates, setInitStates] = useState({
      CustomerID: 0,
      CustomerCode: "",
      formErrors: "",
      loading: false,
      spinnerMessage: "",
  })
  //#endregion

  //#region Use effect
  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //#endregion

  //#region  Validating the input data
  const handleFormValidation = () => {
    const custCode = initStates.CustomerCode;
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
    setInitStates((prevState) => ({...prevState, formErrors: formErrors }));
    return isValidForm;
  }
  //#endregion

  //#region Bind control value to state variable
  const onChangeCustomer = (e) => {
    const re = /^[A-Za-z]+$/;
    if (e.target.value === "" || re.test(e.target.value))
      setInitStates((prevState) => ({...prevState, CustomerCode: e.target.value }));

    if (e.target.value !== "" || e.target.value !== null)
      setInitStates((prevState) => ({...prevState, formErrors: "" }));
  }
  //#endregion

  //#region Reset the page
  const resetAddCustomer = () => {
    setInitStates({
      CustomerID: 0,
      CustomerCode: "",
      formErrors: "",
      loading: false,
      spinnerMessage: "",
    });
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
      setInitStates((prevState) => ({...prevState, 
        spinnerMessage: "Please wait while adding Customer...",
        loading: true, }));

      //Bind state data to object
      var data = {
        CustomerID: initStates.CustomerID,
        CustomerCode: initStates.CustomerCode,
        UserID: helpers.getUser(),
      };

      //Service call
      customerService
        .createCustomer(data)
        .then(() => {
          toast.success("Customer Added Successfully");
          resetAddCustomer()
          history.push({
            pathname: "/Masters/Customers",
          });
        })
        .catch((error) => {
          setInitStates((prevState) => ({...prevState, 
            loading: false, }));
          toast.error(error.response.data.Message, { autoClose: false });
        });
    }
  };
  //#endregion

  //#region Return
  return (
    <div className="pro-main-display">
      <LoadingOverlay
        active={initStates.loading}
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
              {initStates.spinnerMessage}
            </p>
          </div>
        }
      >
        <div
          style={{ height: "100%", position: "relative"}}
        >
          <div className="az-content-breadcrumb mg-l-10">
            <span>Master</span>
            <span>Customers</span>
          </div>
          <h4 className="d-flex align-items-center mg-l-10">
            Create Customer{" "}
            <span className="icon-size">
              <i
                className="far fa-arrow-alt-circle-left text-primary pointer mg-l-5"
                onClick={() => history.goBack()}
                title="Back to Customer List"
              ></i>
            </span>
          </h4>
          <div>
            <div className="row row-sm">
              <div className="col-lg-4 mg-t-15 mg-b-5">
                <div className="addCustomerFloatingInput">
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
                      maxLength={3}
                      id="SubSubActivity" 
                      value={initStates.CustomerCode}
                      onChange={onChangeCustomer}
                    />
                    {initStates.formErrors && (
                      <div className="error-message">{initStates.formErrors}</div>
                    )}
                  </FloatingLabel>
                </div>
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0"></div>
            </div>
            <br />
            <div className="row row-sm">
              <div className="col-md-2 mg-t-10 mg-lg-t-0">
                <button
                  id="Save"
                  onClick={saveCustomer}
                  className="mg-t-10 mg-md-t-0 btn btn-gray-700 btn-block"
                  tabIndex="3"
                >
                  Save
                </button>
              </div>
              <div className="col-md-2  mg-t-10 mg-lg-t-0">
                <button
                  className="btn btn-gray-700 btn-block"
                  tabIndex="4"
                  id="Reset"
                  onClick={resetAddCustomer}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
  //#endregion
}

export default AddCustomer
