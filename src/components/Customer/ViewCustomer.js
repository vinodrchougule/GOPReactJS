import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import helpers from '../../helpers/helpers'
import { useHistory, useLocation, Link } from 'react-router-dom';
import customerService from '../../services/customer.service';
import { toast } from 'react-toastify';
import accessControlService from '../../services/accessControl.service';
import LoadingOverlay from 'react-loading-overlay';
import { BarLoader } from 'react-spinners';
import { Button, Modal } from 'react-bootstrap';
toast.configure();

function ViewCustomer() {
  let history = useHistory();
  const location = useLocation();
  const [initStates, setInitStates] = useState({
    customers: [
      {
        CustomerID: 0,
        CustomerCode: "",
      },
    ],
    showModal: false,
    canAccessEditCustomer: false,
    canAccessDeleteCustomer: false,
    loading: false,
    spinnerMessage: "",
  })

  const handleNo = () => {
    setInitStates((prevState) => ({
      ...prevState, showModal: false
    }))
  }

  const showPopUp = () => {
    setInitStates((prevState) => ({
      ...prevState, showModal: true
    }))
  }

  //#region Use effect
  useEffect(() => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }

    canUserAccessPage("Edit Customer");
    canUserAccessPage("Delete Customer");
    fetchCustomers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  //#endregion

  //#region Fetching selected customer details
  const fetchCustomers = () => {
    const { state } = location; // Customer ID passed from Customer List Page
    if (state === 0 || state === null || state === undefined) {
      history.push("/Masters/Customers");
      return;
    }
    setInitStates((prevState) => ({
      ...prevState, 
      spinnerMessage: "Please wait while loading Customer...",
      loading: true,
    }))

    customerService
      .getCustomer(state, helpers.getUser())
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState, 
          customers: response.data,
          loading: false,
        }))
      })
      .catch((e) => {
        setInitStates((prevState) => ({
          ...prevState,
          loading: false,
        }))
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region fetching Customer page access
  const canUserAccessPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helpers.getUser(), pageName)
      .then((response) => {
        if (pageName === "Edit Customer") {
          setInitStates((prevState) => ({
            ...prevState,
            canAccessEditCustomer: response.data,
          }))
        } else if (pageName === "Delete Customer") {
          setInitStates((prevState) => ({
            ...prevState,
            canAccessDeleteCustomer: response.data,
          }))
        }
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  }
  //#endregion

  //#region Delete Customer
  const handleYes = () => {
    if (!helpers.getUser()) {
      history.push({
        pathname: "/",
      });
      return;
    }
    setInitStates((prevState) => ({
      ...prevState,
      spinnerMessage: "Please wait while deleting Customer...",
      loading: true,
    }))

    customerService
      .deleteCustomer(initStates.customers.CustomerID, helpers.getUser())
      .then((response) => {
        setInitStates((prevState) => ({
          ...prevState,
          showModal: false, loading: false
        }))
        toast.success("Customer Deleted Successfully");
        history.push({
          pathname: "/Masters/Customers",
        });
      })
      .catch((e) => {
        setInitStates((prevState) => ({
          ...prevState,
          loading: false
        }))
        toast.error(e.response.data.Message, { autoClose: false });
        handleNo();
      });
  }
  //#endregion

  const { CustomerID, CustomerCode } = initStates.customers;

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
        <div style={{height: "100%", position: "relative"}}>
        <div className="az-content-breadcrumb mg-l-10">
          <span>Master</span>
          <span>Customers</span>
        </div>
        <h4 className="d-flex align-items-center mg-l-10">
        View Customer{" "}
        <span className="icon-size">
              {" "}
              <Link to="/Masters/Customers" title="Back to Customer List">
                <i className="far fa-arrow-alt-circle-left mg-l-5"></i>
              </Link>
            </span>
        </h4>
        <div>
            <div className="row">
              <div className="col-md-8 mg-t-10">
                <div className="row row-sm">
                  <div className="col-md-3">
                    <b>Customer ID</b>
                  </div>
                  <div className="col-md-2">
                    <p>{CustomerID}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 mg-t-10">
                <div className="row row-sm">
                  <div className="col-md-3">
                    <b>Customer Code</b>
                  </div>
                  <div className="col-md-2">
                    <p>{CustomerCode}</p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="row row-sm">
              {initStates.canAccessEditCustomer && (
                <div className="col-md-2">
                  <Link
                    to={{
                      pathname: "/Masters/EditCustomer",
                      state: CustomerID, 
                    }}
                    className="mg-t-5 mg-md-t-0 btn  btn-gray-700 btn-block"
                  >
                    Edit
                  </Link>
                </div>
              )}
              
              {initStates.canAccessDeleteCustomer && (
                <div className="col-md-2">
                  <button
                    onClick={showPopUp}
                    className="mg-t-5 mg-md-t-0 btn  btn-gray-700 btn-block"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </LoadingOverlay>

      <Modal
          show={initStates.showModal}
          aria-labelledby="contained-modal-title-vcenter"
          onHide={handleNo}
          backdrop="static"
          className="confirm-delete-modal"
          enforceFocus={false}
        >
          <Modal.Header>
            <Modal.Title>Delete Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>Are you sure to delete this Customer?</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleYes}>
              Yes
            </Button>
            <Button variant="primary" onClick={handleNo}>
              No
            </Button>
          </Modal.Footer>
        </Modal>

    </div>
  )
  //#endregion
}

export default ViewCustomer
