import React, { Component } from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Table } from "react-bootstrap";
import QCEditableSelectDropdown from "./QCEditableSelectDropdown";
import { withRouter } from "react-router-dom";
import { setNMUniqurVaue, rowDataPass } from "../../redux/action";
import { connect } from "react-redux";
import productionTemplate from "../../services/productionTemplate.service";

const tableHeader = [
  { name: "AttributeName", align: "left", width: "100px" },
  { name: "AttributeValue", align: "left", width: "300px" },
  { name: "QCAttributeValue", align: "left", width: "300px" },
  { name: "QCAttributeValueComments", align: "left", width: "300px" },
];

class QCNMAttributeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NMAttributeOptions: [],
    };
  }

  handleCommentChange = (event) => {
    return event.target.value;
  };

  onCellClicked = (data) => {
    this.props.rowDataPass(data);
    const storedDataArray = JSON.parse(sessionStorage.getItem("ProdItemData"));
    let noun_Modifier = this.props.selectedNounModifier.label.split("_");
    let noun = noun_Modifier[0].trim();
    let modifier = noun_Modifier[1].trim();
    var postData = {
      CustomerCode: storedDataArray.CustomerCode,
      ProjectCode: storedDataArray.ProjectCode,
      Noun: noun,
      Modifier: modifier,
      AttributeName: data.AttributeName,
    };
    productionTemplate
      .NMUniqueAttributeValue(postData)
      .then((resp) => {
        let find = resp.data.every((value) => value === "");
        if (!find) {
          let options = resp.data.map((item) => {
            return {
              label: item,
              value: item,
              name: data.AttributeName,
            };
          });

          this.setState({ NMAttributeOptions: options });
          this.props.setNMUniqurVaue(options);
        } else {
          this.setState({ NMAttributeOptions: [] });
          this.props.setNMUniqurVaue([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
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
              {this.props.itemAttributes &&
                this.props.itemAttributes.map((attributes, i) => (
                  <TableRow key={i}>
                    <TableCell>{attributes.AttributeName}</TableCell>
                    <TableCell>{attributes.AttributeValue}</TableCell>
                    <TableCell onClick={() => this.onCellClicked(attributes)}>
                      <QCEditableSelectDropdown
                        AttributeValue={attributes.AttributeValue}
                        AttributeName={attributes.AttributeName}
                        QCAttributeValue={attributes.QCAttributeValue}
                        options={this.state.NMAttributeOptions}
                        getValueToPass={this.props.getValueToPass}
                        projectSettings={this.props.projectSettings}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        style={{ width: "300px" }}
                        value={attributes.QCAttributeValueComments || ""} // controlled component
                        onChange={(e) =>
                          this.props.handleCommentChange(i, e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
}

QCNMAttributeTable.propTypes = {};

const mapStateToProps = (state) => ({
  data: state.productionsData,
});

export default withRouter(
  connect(mapStateToProps, { setNMUniqurVaue, rowDataPass })(QCNMAttributeTable)
);
