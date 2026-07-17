import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./MarketingDocs.scss";
import helper from "../../helpers/helpers";
import "react-toastify/dist/ReactToastify.css";
import BarLoader from "react-spinners/BarLoader";
import LoadingOverlay from "react-loading-overlay";
import projectService from "../../services/project.service";
import marketingDocsService from "../../services/marketingDocs.service";
import { toast } from "react-toastify";
toast.configure();

export default function MarketingDocs({ domain, docType }) {
  const history = useHistory();

  // UI state
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");

  // Upload state
  const [uploadedInputFileName, setUploadedInputFileName] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputFileKey, setInputFileKey] = useState(Date.now());

  // const [formErrors, setFormErrors] = useState({});

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Preview state
  const [previewFile, setPreviewFile] = useState(null); // object from server (has FileName, FileType, Id, UploadedOn)
  const [showPreview, setShowPreview] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  // Search / sort / list
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [files, setFiles] = useState([]);

  // Fetch list on mount / when domain/docType change
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    fetchDocuments();
    // cleanup preview URL on unmount
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, docType]);

  const fetchDocuments = () => {
    setLoading(true);
    setSpinnerMessage("Fetching documents please wait...");
    marketingDocsService
      .readAllMarketingDocuments(domain, docType, helper.getUser())
      .then((response) => {
        // safe guard: response.data should be the array
        if (response && response.data) {
          setFiles(Array.isArray(response.data) ? response.data : []);
        } else {
          setFiles([]);
          toast.error("No data found in response.");
        }
      })
      .catch((e) => {
        console.error("Fetch documents error:", e);
        toast.error(e?.response?.data?.Message || "Failed to load documents.", {
          autoClose: false,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ---------- Upload handlers ----------
  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const pickedFiles = e.target.files;
    if (!pickedFiles || pickedFiles.length === 0) return;

    const currentFile = pickedFiles[0];

    // Optional frontend size limit (10 MB example)
    if (currentFile && currentFile.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      alert("File too large! Please select a file smaller than 10 MB.");
      return;
    }

    if (currentFile) {
      // Check extension
      if (
        !currentFile.name.toLowerCase().endsWith(".xls") &&
        !currentFile.name.toLowerCase().endsWith(".xlsx") &&
        !currentFile.name.toLowerCase().endsWith(".doc") &&
        !currentFile.name.toLowerCase().endsWith(".docx") &&
        !currentFile.name.toLowerCase().endsWith(".ppt") &&
        !currentFile.name.toLowerCase().endsWith(".pptx") &&
        !currentFile.name.toLowerCase().endsWith(".pdf") &&
        !currentFile.name.toLowerCase().endsWith(".png") &&
        !currentFile.name.toLowerCase().endsWith(".jpg") &&
        !currentFile.name.toLowerCase().endsWith(".jpeg") &&
        !currentFile.name.toLowerCase().endsWith(".gif") &&
        !currentFile.name.toLowerCase().endsWith(".txt") &&
        !currentFile.name.toLowerCase().endsWith(".htm")
      ) {
        alert(
          "Please select only xls/xlsx/doc/docx/ppt/pptx/pdf/png/jpg/jpeg/gif/txt/htm type file"
        );
        e.target.value = ""; // Clear the invalid file
        return;
      }
    }

    // Start upload to temporary storage (projectService.saveFileupload)
    const formData = new FormData();
    // NOTE: your backend expects key "File"
    formData.append("File", currentFile);

    setSpinnerMessage("Please wait while copying the file...");
    setLoading(true);
    setUploadedInputFileName(currentFile.name);
    setSelectedFile(currentFile);

    projectService
      .saveFileupload(formData)
      .then((response) => {
        // Expect response.data to be the stored filename or some identifier
        // Save it to inputFileName to be used while saving metadata
        setInputFileName(response?.data || "");
      })
      .catch((error) => {
        console.error("Upload to temp storage failed:", error);
        setInputFileName("");
        toast.error(error?.response?.data?.Message || "File upload failed.", {
          autoClose: false,
        });
        setSelectedFile(null);
        setUploadedInputFileName("");
      })
      .finally(() => {
        setLoading(false);
        // keep modal open to allow user to confirm metadata save
      });

    // clear any input-level errors
    // setFormErrors((prev) => ({ ...prev, inputFileError: "" }));
  };

  const handleUploadConfirm = () => {
    if (!selectedFile || !inputFileName) {
      alert("Please select and upload a file first.");
      return;
    }

    setLoading(true);
    setSpinnerMessage("Saving document metadata...");

    const data = {
      Id: 0,
      UserUploadedFileName: uploadedInputFileName,
      FileName: inputFileName,
      Domain: domain,
      DocType: docType,
      UserID: helper.getUser(),
    };

    marketingDocsService
      .uploadMarketingDocument(data)
      .then((response) => {
        toast.success(`File "${selectedFile.name}" saved successfully.`);
        // refresh list
        fetchDocuments();
        // reset upload modal state
        setShowUploadModal(false);
        setSelectedFile(null);
        setInputFileName("");
        setUploadedInputFileName("");
        setInputFileKey(Date.now());
      })
      .catch((error) => {
        console.error("Save metadata failed:", error);
        toast.error(
          error?.response?.data?.Message || "Failed to save document.",
          {
            autoClose: false,
          }
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setInputFileName("");
    setInputFileKey(Date.now());
    setUploadedInputFileName("");
  };

  // ---------- Preview / download / delete ----------
  // Preview: request blob from backend and show modal
  const handlePDFImagePreview = async (file) => {
    try {
      setLoading(true);
      setSpinnerMessage("Preparing preview...");
      if (
        file.FileName.endsWith(".xls") ||
        file.FileName.endsWith(".xlsx") ||
        file.FileName.endsWith(".docx") ||
        file.FileName.endsWith(".doc") ||
        file.FileName.endsWith(".ppt") ||
        file.FileName.endsWith(".pptx")
      ) {
        const response = await marketingDocsService.previewAsPdf(
          domain,
          docType,
          file.FileName
        );

        const blob = response?.data;
        if (!blob) {
          throw new Error("Empty file response");
        }

        // Create object URL and show preview
        if (previewURL) {
          URL.revokeObjectURL(previewURL);
        }
        const url = URL.createObjectURL(blob);
        setPreviewURL(url);
        setPreviewFile(file);
        setShowPreview(true);
      } else {
        const response1 = await marketingDocsService.downloadMarketingDocument(
          domain,
          docType,
          file.FileName
        );

        const blob1 = response1?.data;
        if (!blob1) {
          throw new Error("Empty file response");
        }

        // Create object URL and show preview
        if (previewURL) {
          URL.revokeObjectURL(previewURL);
        }
        const url1 = URL.createObjectURL(blob1);
        setPreviewURL(url1);
        setPreviewFile(file);
        setShowPreview(true);
      }
    } catch (err) {
      console.error("Preview error:", err);
      toast.error(err?.response?.data?.Message || "Failed to load preview.", {
        autoClose: false,
      });
    } finally {
      setLoading(false);
      setSpinnerMessage("");
    }
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    setPreviewFile(null);
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
    }
  };

  // Download: reuse the same download endpoint; open in new tab or force download
  const handleDownload = async (file) => {
    try {
      setLoading(true);
      setSpinnerMessage("Preparing download...");
      const response = await marketingDocsService.downloadMarketingDocument(
        domain,
        docType,
        file.FileName
      );
      const blob = response?.data;
      if (!blob) throw new Error("No file blob");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.FileName || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      toast.error(err?.response?.data?.Message || "Failed to download file.", {
        autoClose: false,
      });
    } finally {
      setLoading(false);
      setSpinnerMessage("");
    }
  };

  // Delete: call delete endpoint and refresh list
  const handleFileDelete = async (file) => {
    if (!window.confirm(`Delete "${file.FileName}"?`)) return;
    try {
      setLoading(true);
      setSpinnerMessage("Deleting file...");
      await marketingDocsService.deleteMarketingDocument(
        file.Id,
        domain,
        docType,
        file.FileName,
        helper.getUser()
      );
      toast.success(`Deleted ${file.FileName}`);
      // refresh list
      fetchDocuments();
      handlePreviewClose();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err?.response?.data?.Message || "Failed to delete file.", {
        autoClose: false,
      });
    } finally {
      setLoading(false);
      setSpinnerMessage("");
    }
  };

  // ------------ Filtering & Sorting (use API fields) ------------
  const filteredFiles = searchTerm
    ? files.filter((f) =>
        (f.FileName || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : files;

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return (a.FileName || "").localeCompare(b.FileName || "");
      case "name-desc":
        return (b.FileName || "").localeCompare(a.FileName || "");
      case "date-asc":
        return new Date(a.UploadedOn || 0) - new Date(b.UploadedOn || 0);
      case "date-desc":
        return new Date(b.UploadedOn || 0) - new Date(a.UploadedOn || 0);
      default:
        return 0;
    }
  });

  // ---------- Helper to render icons by FileType ----------
  const getFileIcon = (fileType) => {
    const t = (fileType || "").toLowerCase();
    switch (t) {
      case "pdf":
      case "application/pdf":
        return (
          <i
            className="fa fa-file-pdf"
            style={{ fontSize: "40px", color: "red" }}
          ></i>
        );
      case "xlsx":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.ms-excel":
        return <i className="fa fa-file-excel file-icon excel" />;
      case "docx":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return <i className="fa fa-file-word file-icon word" />;
      case "pptx":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return <i className="fa fa-file-powerpoint file-icon ppt" />;
      case "htm":
      case "text/html":
        return <i className="fa fa-file-code file-icon html" />;
      case "txt":
      case "text/plain":
        return <i className="fa fa-file-alt file-icon text" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <i className="fa fa-file-image file-icon image" />;
      default:
        return <i className="fa fa-file file-icon" />;
    }
  };

  // ---------- Render ----------
  return (
    <div className="proposals-container">
      <LoadingOverlay
        active={loading}
        spinner={<BarLoader color="#007bff" />}
        text={spinnerMessage}
      >
        <div className="proposals-header">
          <h3>
            📁 {domain} {docType}
          </h3>

          <div className="header-actions">
            <div className="search-section">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search by file name..."
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm("")}>
                  <i className="fa fa-times" /> Clear
                </button>
              )}
            </div>

            <div className="sort-section">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="sort-select"
              >
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="date-desc">Uploaded on (Newest)</option>
                <option value="date-asc">Uploaded on (Oldest)</option>
              </select>
            </div>

            <button className="upload-btn" onClick={handleUploadClick}>
              <i className="fa fa-upload" /> Upload
            </button>
          </div>
        </div>

        <div className="card-grid">
          {sortedFiles.length === 0 ? (
            <div className="no-files">No files found.</div>
          ) : (
            sortedFiles.map((file) => (
              <div key={file.Id || file.FileName} className="file-card">
                {getFileIcon(file.FileType)}
                <div className="file-name">{file.FileName}</div>
                <div className="card-actions">
                  <button
                    className="preview-btn"
                    onClick={() => handlePDFImagePreview(file)}
                  >
                    <i className="fa fa-eye" /> Preview
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h4>📤 Upload File</h4>
              <input
                key={inputFileKey}
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept="*/*"
              />
              {selectedFile && (
                <p className="file-selected">Selected: {selectedFile.name}</p>
              )}
              <div className="modal-actions">
                <button
                  className="upload-confirm-btn"
                  onClick={handleUploadConfirm}
                >
                  <i className="fa fa-check" /> Upload
                </button>
                <button className="cancel-btn" onClick={handleCancelUpload}>
                  <i className="fa fa-times" /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && previewFile && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <h4 style={{ color: "white" }}>📄 {previewFile.FileName}</h4>
                <button className="close-btn" onClick={handlePreviewClose}>
                  ✖
                </button>
              </div>

              <div className="modal-content">
                {(() => {
                  const ft = (previewFile.FileType || "").toLowerCase();
                  const fn = previewFile.FileName?.toLowerCase() || "";

                  // Image files
                  if (ft.match(/(jpg|jpeg|png|gif)$/)) {
                    return (
                      <img
                        src={previewURL}
                        alt={previewFile.FileName}
                        className="preview-image"
                      />
                    );
                  }

                  // PDF files
                  if (
                    ft === "pdf" ||
                    fn.endsWith(".pdf") ||
                    fn.endsWith(".txt") ||
                    fn.endsWith(".xlsx") ||
                    fn.endsWith(".xls") ||
                    fn.endsWith(".doc") ||
                    fn.endsWith(".docx") ||
                    fn.endsWith(".ppt") ||
                    fn.endsWith(".pptx") ||
                    fn.endsWith(".htm")
                  ) {
                    return (
                      <iframe
                        src={previewURL}
                        title="PDF Preview"
                        className="preview-frame"
                      />
                    );
                  }

                  // if (fn.endsWith(".pptx")) {
                  //   return <p>No preview available.</p>;
                  // }

                  // Fallback
                  //return <p>No preview available.</p>;
                })()}
              </div>
              <br />
              <div className="modal-actions">
                <button
                  className="download-btn"
                  onClick={() => handleDownload(previewFile)}
                >
                  <i className="fa fa-download" /> Download
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleFileDelete(previewFile)}
                >
                  <i className="fa fa-trash" /> Delete
                </button>
                <button className="cancel-btn" onClick={handlePreviewClose}>
                  <i className="fa fa-times" /> Close
                </button>
              </div>
            </div>
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
}
