import React, { Component } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MroDictionaryViewer from "../MRODictionary/MRODictionaryViewer";
import "../MRODictionary/MRODictionaryViewerModal.scss";
import { toast } from "react-toastify";
toast.configure();

export default class showMroDictionaryViewerModal extends Component {
    constructor(props) {
        super(props);
        this.inputRefs = {
            button1: React.createRef(),
        }
        this.state = {
            mroDictionaryData: [],
            mroDictionaryVersion: '',
        }
    }
    //#region Component Did Mount
    componentDidMount() {
        this.setState({mroDictionaryVersion: this.props.mroDictionaryVersion})
        document.addEventListener('keydown', this.handleKeyDown);
    }
    //#endregion

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.showMroDictionaryViewerModal && this.props.showMroDictionaryViewerModal) {
            this.setState({ mroDictionaryData: [] });
        }
    }

    handleKeyDown = (e) => {
        if (e.altKey) {
            if (e.key === 'u') {
                this.props.toggleMroDictionaryViewerModal();
            }
        }
    }

    AssignNounModifier = (noun, modifier) => {
        this.setState({mroDictionaryData: [noun, modifier]})
    }

    AssignDictionaryValue = () => {
        if(this.state.mroDictionaryData.length === 0){
            toast.error("Please select MRO Dictionary Version, Noun and, Modifier ...");
            return;
        }
        this.props.AssignDictionaryValue(this.state.mroDictionaryData)
    }

    render() {
        const { showMroDictionaryViewerModal, toggleMroDictionaryViewerModal } = this.props;
        return (
            <Modal show={showMroDictionaryViewerModal} onHide={toggleMroDictionaryViewerModal} className="add-mroDictionary-modal">
                <div className="mroDictionary-modal-data">
                    <div>
                        <MroDictionaryViewer AssignNounModifier={this.AssignNounModifier} showMroDictionaryViewerModal={showMroDictionaryViewerModal}
                        mroDictionaryVersion={this.props.mroDictionaryVersion} hideRefresh={true}/>
                    </div>
                    <div className="mroDictionary-btn-center" style={{height: "10%"}}>
                        <div style={{height: "80%"}} className='d-flex align-items-center'>
                            <div className='pr-1 pl-1'>
                                <Button id="assign" className="mg-t-10 mg-md-t-0 btn btn-gray-700" tabindex="8" onClick={this.AssignDictionaryValue} ref={this.inputRefs.button1}> Assign </Button>
                            </div>
                            <div className='pr-1 pl-1'>
                                <OverlayTrigger className="mroDictionary-screens" delay={{ hide: 450, show: 300 }} placement="top" overlay={(props) => (
                                    <Tooltip id="tooltip" className="mroDictionary-tooltip mroDictionary-close-modal">
                                        ALT + U
                                    </Tooltip>
                                )}>
                                    <Button id="Save" className="mg-t-10 mg-md-t-0 btn btn-gray-700" tabindex="8" onClick={toggleMroDictionaryViewerModal} ref={this.inputRefs.button1}> Close </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}
