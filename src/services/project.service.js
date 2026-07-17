import http from "../http-common";

class projectService {
  //#region Save File Upload
  saveFileupload(formData) {
    return http.post("/project/uploadfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  //#endregion

  //#region Download File
  downloadFile(fileName, fileType) {
    return http.get(
      "/project/downloadfile?FileName=" + fileName + "&FileType=" + fileType,
      {
        responseType: "blob",
      }
    );
  }
  //#endregion

  //#region Delete File
  deleteFile(fileName) {
    return http.post("/project/deletefile?FileName=" + fileName);
  }
  //#endregion

  //#region Create Project
  createProject(data) {
    return http.post("/project", data);
  }
  //#endregion

  //#region Get All Projects
  getAllProjects(UserID, status) {
    return http.get(`/project/projectlist/${UserID}/${status}`);
  }
  //#endregion

  //#region Read On Going Projects List
  readOnGoingProjectsList(data) {
    return http.post(`/project/ReadOnGoingProjectsList`, data);
  }
  //#endregion

  //#region Read Delivered Projects List
  readDeliveredProjectsList(data) {
    return http.post(`/project/ReadDeliveredProjectsList`, data);
  }
  //#endregion

  //#region Get Project Details by ID
  getProjectDetailsByID(id, userID) {
    return http.get(`/project/${id}/${userID}`);
  }
  //#endregion

  //#region Update Project
  updateProject(id, data) {
    return http.put(`/project/${id}`, data);
  }
  //#endregion

  //#region Delete Project
  deleteProject(id, userID) {
    return http.patch(`/project/${id}/${userID}`);
  }
  //#endregion

  //#region Change Project Code
  changeProjectCode(customerCode, projectCode, changeToProjectCode, userID) {
    return http.post(
      `/project/ChangeProjectCode/${customerCode}/${projectCode}/${changeToProjectCode}/${userID}`
    );
  }
  //#endregion

  //#region Download Project List to Excel
  exportOnGoingProjectListToExcel(data) {
    return http.post(`/project/ExportOnGoingProjectsListToExcel`, data, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Download Delivered Project List to Excel
  exportDeliveredProjectsListToExcel(data) {
    return http.post(`/project/ExportDeliveredProjectsListToExcel`, data, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region Fetch Change Project Status to List
  fetchChangeProjectStatusToList(customerCode, projectCode) {
    return http.get(
      `/project/FetchChangeProjectStatusToList/${customerCode}/${projectCode}`
    );
  }
  //#endregion

  //#region Change Project Status
  ChangeProjectStatus(data) {
    return http.put("/project/ChangeProjectStatus", data);
  }
  //#endregion

  //#region Revert Project Status
  revertProjectStatus(customerCode, projectCode, userID) {
    return http.put(
      `/project/RevertProjectStatus/${customerCode}/${projectCode}/${userID}`
    );
  }
  //#endregion

  //#region Fetch Project Activity Details
  fetchProjectActivityDetils(projectID) {
    return http.get(
      `/project/ReadProjectActivitiesWithHoursWorked/${projectID}`
    );
  }
  //#endregion

  //#region Fetch Project Activity Details
  readProjectActivityResourcesWithHoursWorked(projectID, projectActivityID) {
    return http.get(
      `/project/ReadProjectActivityResourcesWithHoursWorked/${projectID}/${projectActivityID}`
    );
  }
  //#endregion

  //#region Get Not Started Projects
  readNotStartedProjectsList(data) {
    return http.post(`/project/ReadNotStartedProjectsList`, data);
  }
  //#endregion

  //#region export Not Started Project List to Excel
  exportNotStartedProjectListToExcel(data) {
    return http.post(`/project/ExportNotStartedProjectsListToExcel`, data, {
      responseType: "blob",
    });
  }
  //#endregion

  //#region update Project Settings
  updateProjectSettings(data) {
    return http.post(`/project/UpdateProjectSettings`, data);
  }
  //#endregion

  //#region update Project Settings
  readProjectSettings(customerCode, projectCode) {
    return http.get(
      `/project/ReadProjectSettingsByProject?CustomerCode=${customerCode}&ProjectCode=${projectCode}`
    );
  }
  //#endregion

  //#region update Project Settings
  readCustomColumnsNames(customerCode, projectCode) {
    return http.get(
      `/project/ReadCustomerInputFileColumnNamesOfProjectOrBatch/${customerCode}/${projectCode}/{BatchNo}`
    );
  }
  //#endregion

  //#region update Project Settings
  readCustomColumnsNameswithBatch(customerCode, projectCode, batchNo) {
    return http.get(
      `/project/ReadCustomerInputFileColumnNamesOfProjectOrBatch/${customerCode}/${projectCode}/${
        batchNo && batchNo
      }`
    );
  }
  //#endregion

  //#region project update details
  saveProjectUpdateDetails(data) {
    return http.post(`/project/SaveProjectUpdateDetails`, data);
  }
  //#endregion

  //#region Read Project Update Details
  readProjectUpdateDetails(CustomerCode, ProjectCode) {
    return http.get(
      `/project/ReadProjectUpdateDetails?CustomerCode=${CustomerCode}&ProjectCode=${ProjectCode}`
    );
  }
  //#endregion

  //#region Download the Project Update Details
  downloadProjectUpdateDetailsUploadedDocument(
    ProjectUpdateDetailsID,
    FileName
  ) {
    return http.get(
      `/project/DownloadProjectUpdateDetailsUploadedDocument?ProjectUpdateDetailsID=${ProjectUpdateDetailsID}&FileName=${FileName}`,
      { responseType: "blob" }
    );
  }
  //#endregion

  //#region Delete Project Update Details
  deleteProjectUpdateDetails(id, UploadedFileName, UserID) {
    return http.patch(
      `/project/DeleteProjectUpdateDetails?id=${id}&UploadedFileName=${UploadedFileName}&UserID=${UserID}`
    );
  }
  //#endregion
}

export default new projectService();
