import React, { Component } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Unspsc from './Unspsc';
import "./Unspsc.scss";
import { toast } from "react-toastify";
toast.configure();

export default class UnSpscModal extends Component {

    constructor(props) {
        super(props);
        this.inputRefs = {
            button1: React.createRef(),
        }
        this.state = {
            unspscCategoryData: [],
            unspscVerion: '',
        }
    }

    componentDidMount() {
        
        this.setState({unspscVerion: this.props.unspscVerion})
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps) {
        // Check if showUnspscModal changed from false to true
        if (!prevProps.showUnspscModal && this.props.showUnspscModal) {
            // Reset the unspscCategoryData state
            this.setState({ unspscCategoryData: [] });
        }
    }

    handleKeyDown = (e) => {
        if (e.altKey) {
            if (e.key === 'u') {
                this.props.toggleUnspscModal();
            }
        }
    }

    AssignCategory = (unspscCategoryValue) => {
        this.setState({unspscCategoryData: unspscCategoryValue})
    }

    AssignCategoryValue = () => {
        if(this.state.unspscCategoryData.length === 0){
            toast.error("Category not selected...");
            return;
        }
        
        this.props.AssignCategoryValue(this.state.unspscCategoryData)
    }

    render() {

        const { showUnspscModal, toggleUnspscModal } = this.props;

        return (

            <Modal show={showUnspscModal} onHide={toggleUnspscModal} className="add-unspsc-modal">
                <div className="unspsc-modal-data">
                    <div style={{height: "94%"}}>
                    <Unspsc AssignCategory={this.AssignCategory} showUnspscModal={showUnspscModal}
                    unspscVerion={this.props.unspscVerion} />
                    </div>
                    <div className="unspsc-btn-center" style={{height: "6%"}}>
                        <div style={{height: "80%"}} className='d-flex align-items-center'>
                            <div className='pr-1 pl-1'>
                                    <Button id="assign" className="mg-t-10 mg-md-t-0 btn btn-gray-700 modal-btn" tabindex="8" onClick={this.AssignCategoryValue} ref={this.inputRefs.button1}> Assign </Button>
                            </div>
                            <div className='pr-1 pl-1'>
                                <OverlayTrigger className="unspsc-screens" delay={{ hide: 450, show: 300 }} placement="top" overlay={(props) => (
                                    <Tooltip id="tooltip" className="unspsc-tooltip unspsc-close-modal">
                                        ALT + U
                                    </Tooltip>
                                )}>
                                    <Button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700 modal-btn" tabindex="8" onClick={toggleUnspscModal} ref={this.inputRefs.button1}> Close </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}
