import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import LatQueImg from "../../assets/icons/quest-icon.png";
import "./DescriptionGenerator.scss";
import LoadingOverlay from "react-loading-overlay";
import BarLoader from "react-spinners/BarLoader";
import helper from "../../helpers/helpers";
import projectService from "../../services/project.service";
import fileService from "../../services/GATServices/fileServices.service";
import descriptionGeneratorService from "../../services/GATServices/descriptionGenerator.service";
import checkmarkIcon from "../MRODictionary/checkmark.png";
import errorIcon from "../MRODictionary/error.gif";
import loaderIcon from "../MRODictionary/spinner.gif";
import { toast } from "react-toastify";
toast.configure();

export default function DescriptionGenerator() {
  //#region Initializing State
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState("");

  const [settingNames, setSettingNames] = useState([]);
  const [selectedSettingName, setSelectedSettingName] = useState("");

  const [uploadedInputFileName, setUploadedInputFileName] = useState("");
  const [inputFileName, setInputFileName] = useState("");
  const [inputFileKey, setInputFileKey] = useState(Date.now());

  const [uploadedAbbreviationFileName, setUploadedAbbreviationFileName] =
    useState("");
  const [abbreviationFileName, setAbbreviationFileName] = useState("");
  const [abbreviationFileKey, setAbbreviationFileKey] = useState(Date.now());

  const [uploadedIdentifiersFileName, setUploadedIdentifiersFileName] =
    useState("");
  const [identifiersFileName, setIdentifiersFileName] = useState("");
  const [identifiersFileKey, setIdentifiersFileKey] = useState(Date.now());

  const [isNounExcluded, setIsNounExcluded] = useState(false);
  const [isModifierExcluded, setIsModifierExcluded] = useState(false);
  const [isAttributeNameExcluded, setIsAttributeNameExcluded] = useState(true);
  const [isAttributeValueExcluded, setIsAttributeValueExcluded] =
    useState(false);
  const [isAddInfoExcluded, setIsAddInfoExcluded] = useState(false);
  const [isMFRNameExcluded, setIsMFRNameExcluded] = useState(false);
  const [isMFRPNExcluded, setIsMFRPNExcluded] = useState(false);
  const [specificModifierExcluded, setSpecificModifierExcluded] = useState("");

  const [
    isToInterpretAdditionalInformation,
    setIsToInterpretAdditionalInformation,
  ] = useState(true);
  const [
    isToIncludeAttributeNameFromAddInfo,
    setIsToIncludeAttributeNameFromAddInfo,
  ] = useState(false);
  const [isToIncludeMaxValues, setIsToIncludeMaxValues] = useState(true);
  const [isToInterpretAllAttributeValues, setIsToInterpretAllAttributeValues] =
    useState(true);

  const [isNounToBeAbbreviated, setIsNounToBeAbbreviated] = useState(false);
  const [isModifierToBeAbbreviated, setIsModifierToBeAbbreviated] =
    useState(false);
  const [isAttributeNameToBeAbbreviated, setIsAttributeNameToBeAbbreviated] =
    useState(false);
  const [isAttributeValueToBeAbbreviated, setIsAttributeValueToBeAbbreviated] =
    useState(true);
  const [isAddInfoToBeAbbreviated, setIsAddInfoToBeAbbreviated] =
    useState(false);
  const [isMFRNameToBeAbbreviated, setIsMFRNameToBeAbbreviated] =
    useState(false);

  const [delimiterAfterNoun, setDelimiterAfterNoun] = useState(", ");
  const [delimiterAfterModifier, setDelimiterAfterModifier] = useState(", ");
  const [delimiterAfterAttributeName, setDelimiterAfterAttributeName] =
    useState(": ");
  const [delimiterAfterAttributeValue, setDelimiterAfterAttributeValue] =
    useState("; ");
  const [delimiterAfterAddInfo, setDelimiterAfterAddInfo] = useState(", ");
  const [delimiterAfterMFRName, setDelimiterAfterMFRName] = useState(", ");
  const [delimiterAfterMFRPN, setDelimiterAfterMFRPN] = useState(", ");
  const [multipleValuesSeparator, setMultipleValuesSeparator] = useState(",");

  const [showDelAfterNounModal, setShowDelAfterNounModal] = useState(false);
  const [showDelAfterModifierModal, setShowDelAfterModifierModal] =
    useState(false);
  const [showDelAfterAttributeNameModal, setShowDelAfterAttributeNameModal] =
    useState(false);
  const [showDelAfterAttributeValueModal, setShowDelAfterAttributeValueModal] =
    useState(false);
  const [showDelAfterAdditionalInfoModal, setShowDelAfterAdditionalInfoModal] =
    useState(false);
  const [showDelAfterMFRNameModal, setShowDelAfterMFRNameModal] =
    useState(false);
  const [showDelAfterMFRPNModal, setShowDelAfterMFRPNModal] = useState(false);
  const [
    showMultipleValuesSeparatorModal,
    setShowMultipleValuesSeparatorModal,
  ] = useState(false);

  const [isToApplyIdentifiers, setIsToApplyIdentifiers] = useState(false);
  const [isToApplyIdentifiersToAttValue, setIsToApplyIdentifiersToAttValue] =
    useState(true);
  const [
    isToAddSpaceBetweenAttValueAndIdentifier,
    setIsToAddSpaceBetweenAttValueAndIdentifier,
  ] = useState(true);
  const [isToApplyIdentifiersToAddInfo, setIsToApplyIdentifiersToAddInfo] =
    useState(true);

  const [prefixForAddInfo, setPrefixForAddInfo] = useState("");
  const [prefixForMFRName, setPrefixForMFRName] = useState("");
  const [prefixForMFRPN, setPrefixForMFRPN] = useState("");

  const [
    isToIncludeAttributeNameWithNULLValues,
    setIsToIncludeAttributeNameWithNULLValues,
  ] = useState(false);
  const [isToIncludeAllOtherMFRNames, setIsToIncludeAllOtherMFRNames] =
    useState(false);
  const [isToIncludeAllOtherMFRPNs, setIsToIncludeAllOtherMFRPNs] =
    useState(false);
  const [isToPrefixAllMFRNames, setIsToPrefixAllMFRNames] = useState(false);
  const [isToPrefixAllMFRPNs, setIsToPrefixAllMFRPNs] = useState(false);

  const [descriptionToGenerate, setDescriptionToGenerate] = useState("S");
  const [truncationType, setTruncationType] = useState("M");
  const [characterLimit, setCharacterLimit] = useState(40);
  const [delimiterForTruncation, setDelimiterForTruncation] = useState(";");

  const [firstOrderLabel, setFirstOrderLabel] = useState("First: Noun");
  const [secondOrderLabel, setSecondOrderLabel] = useState("Second: Modifier");
  const [thirdOrderLabel, setThirdOrderLabel] = useState("Third");
  const [fourthOrderLabel, setFourthOrderLabel] = useState("Fourth");
  const [fifthOrderLabel, setFifthOrderLabel] = useState("Fifth");

  const [selectedThirdOrderOfData, setSelectedThirdOrderOfData] = useState("A");
  const [selectedFourthOrderOfData, setSelectedFourthOrderOfData] =
    useState("D");
  const [selectedFifthOrderOfData, setSelectedFifthOrderOfData] = useState("M");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [showSettingModal, setShowSettingModal] = useState(false);
  const [newSettingName, setNewSettingName] = useState("");

  const handleCloseDelAfterNoun = () => setShowDelAfterNounModal(false);
  const handleShowDelAfterNoun = () => setShowDelAfterNounModal(true);

  const handleCloseDelAfterModifier = () => setShowDelAfterModifierModal(false);
  const handleShowDelAfterModifier = () => setShowDelAfterModifierModal(true);

  const handleCloseDelAfterAttributeName = () =>
    setShowDelAfterAttributeNameModal(false);
  const handleShowDelAfterAttributeName = () =>
    setShowDelAfterAttributeNameModal(true);

  const handleCloseDelAfterAttributeValue = () =>
    setShowDelAfterAttributeValueModal(false);
  const handleShowDelAfterAttributeValue = () =>
    setShowDelAfterAttributeValueModal(true);

  const handleCloseDelAfterAdditionalInfo = () =>
    setShowDelAfterAdditionalInfoModal(false);
  const handleShowDelAfterAdditionalInfo = () =>
    setShowDelAfterAdditionalInfoModal(true);

  const handleCloseDelAfterMFRName = () => setShowDelAfterMFRNameModal(false);
  const handleShowDelAfterMFRName = () => setShowDelAfterMFRNameModal(true);

  const handleCloseDelAfterMFRPN = () => setShowDelAfterMFRPNModal(false);
  const handleShowDelAfterMFRPN = () => setShowDelAfterMFRPNModal(true);

  const handleCloseMultipleValuesSeparator = () =>
    setShowMultipleValuesSeparatorModal(false);
  const handleShowMultipleValuesSeparator = () =>
    setShowMultipleValuesSeparatorModal(true);

  const handleSettingModalClose = () => setShowSettingModal(false);

  const [showModal, setShowModal] = useState(false);
  const [inputFileValidationStatus, setInputFileValidationStatus] =
    useState("pending");
  const [
    abbreviationFileValidationStatus,
    setAbbreviationFileValidationStatus,
  ] = useState("pending");
  const [identifiersFileValidationStatus, setIdentifiersFileValidationStatus] =
    useState("pending");
  const [generateDescriptionStatus, setGenerateDescriptionStatus] =
    useState("pending");
  const [downloadingStatus, setDownloadingStatus] = useState("pending");

  const [showCloseButton, setShowCloseButton] = useState(false);

  const [isExcludeNounDisabled, setIsExcludeNounDisabled] = useState(false);
  const [isExcludeModifierDisabled, setIsExcludeModifierDisabled] =
    useState(false);
  const [isExcludeAttributeNameDisabled, setIsExcludeAttributeNameDisabled] =
    useState(false);
  const [isExcludeAttributeValueDisabled, setIsExcludeAttributeValueDisabled] =
    useState(false);
  const [isExcludeAddInfoDisabled, setIsExcludeAddInfoDisabled] =
    useState(false);
  const [isExcludeMFRNameDisabled, setIsExcludeMFRNameDisabled] =
    useState(false);
  const [isExcludeMFRPNDisabled, setIsExcludeMFRPNDisabled] = useState(false);
  const [
    isExcludeSpecificModifierDisabled,
    setIsExcludeSpecificModifierDisabled,
  ] = useState(false);

  const [isToInterpretAddInfoDisabled, setIsToInterpretAddInfoDisabled] =
    useState(false);
  const [
    isToIncludeAttNameFromAddInfoDisabled,
    setIsToIncludeAttNameFromAddInfoDisabled,
  ] = useState(false);
  const [isToIncludeMaxValuesDisabled, setIsToIncludeMaxValuesDisabled] =
    useState(false);
  const [
    isToInterpretAllAttributeValuesDisabled,
    setIsToInterpretAllAttributeValuesDisabled,
  ] = useState(false);

  const [isNounToBeAbbreviatedDisabled, setIsNounToBeAbbreviatedDisabled] =
    useState(false);
  const [
    isModifierToBeAbbreviatedDisabled,
    setIsModifierToBeAbbreviatedDisabled,
  ] = useState(false);
  const [
    isAttNameToBeAbbreviatedDisabled,
    setIsAttNameToBeAbbreviatedDisabled,
  ] = useState(false);
  const [
    isAttValueToBeAbbreviatedDisabled,
    setIsAttValueToBeAbbreviatedDisabled,
  ] = useState(false);
  const [
    isAddInfoToBeAbbreviatedDisabled,
    setIsAddInfoToBeAbbreviatedDisabled,
  ] = useState(false);
  const [
    isMFRNameToBeAbbreviatedDisabled,
    setIsMFRNameToBeAbbreviatedDisabled,
  ] = useState(false);
  const [
    isAbbreviationFileUploadDisabled,
    setIsAbbreviationFileUploadDisabled,
  ] = useState(false);

  const [isDelimiterAfterNounDisabled, setIsDelimiterAfterNounDisabled] =
    useState(false);
  const [
    isDelimiterAfterModifierDisabled,
    setIsDelimiterAfterModifierDisabled,
  ] = useState(false);
  const [isDelimiterAfterAttNameDisabled, setIsDelimiterAfterAttNameDisabled] =
    useState(false);
  const [
    isDelimiterAfterAttValueDisabled,
    setIsDelimiterAfterAttValueDisabled,
  ] = useState(false);
  const [isDelimiterAfterAddInfoDisabled, setIsDelimiterAfterAddInfoDisabled] =
    useState(false);
  const [isDelimiterAfterMFRNameDisabled, setIsDelimiterAfterMFRNameDisabled] =
    useState(false);
  const [isDelimiterAfterMFRPNDisabled, setIsDelimiterAfterMFRPNDisabled] =
    useState(false);
  const [
    isMultipleValuesSeparatorDisabled,
    setisMultipleValuesSeparatorDisabled,
  ] = useState(false);

  const [isToApplyIdentifiersDisabled, setIsToApplyIdentifiersDisabled] =
    useState(false);
  const [isIdentifiersFileUploadDisabled, setIsIdentifiersFileUploadDisabled] =
    useState(false);
  const [
    isToAddSpaceBeforeOrAfterIdentifierDisabled,
    setIsToAddSpaceBeforeOrAfterIdentifierDisabled,
  ] = useState(false);
  const [
    isToApplyIdentifiersToAddInfoDisabled,
    setIsToApplyIdentifiersToAddInfoDisabled,
  ] = useState(false);

  const [isPrefixToAddInfoDisabled, setIsPrefixToAddInfoDisabled] =
    useState(false);
  const [isPrefixToMFRNameDisabled, setIsPrefixToMFRNameDisabled] =
    useState(false);
  const [isPrefixToMFRPNDisabled, setIsPrefixToMFRPNDisabled] = useState(false);

  const [
    isToIncludeAttNameWithNULLValuesDisabled,
    setIsToIncludeAttNameWithNULLValuesDisabled,
  ] = useState(false);
  const [
    isToIncludeAllOtherMFRNamesDisabled,
    setIsToIncludeAllOtherMFRNamesDisabled,
  ] = useState(false);
  const [
    isToIncludeAllOtherMFRPNsDisabled,
    setIsToIncludeAllOtherMFRPNsDisabled,
  ] = useState(false);
  const [isToPrefixAllMFRNamesDisabled, setIsToPrefixAllMFRNamesDisabled] =
    useState(false);
  const [isToPrefixAllMFRPNsDisabled, setIsToPrefixAllMFRPNsDisabled] =
    useState(false);

  const [isDescriptionToGenerateDisabled, setIsDescriptionToGenerateDisabled] =
    useState(false);
  const [isTruncationTypeDisabled, setIsTruncationTypeDisabled] =
    useState(false);
  const [isCharacterLimitDisabled, setIsCharacterLimitDisabled] =
    useState(false);
  const [
    isDelimiterForTruncationDisabled,
    setIsDelimiterForTruncationDisabled,
  ] = useState(false);

  const [isThirdOrderOfDataDisabled, setIsThirdOrderOfDataDisabled] =
    useState(false);
  const [isFourthOrderOfDataDisabled, setIsFourthOrderOfDataDisabled] =
    useState(false);
  const [isFifthOrderOfDataDisabled, setIsFifthOrderOfDataDisabled] =
    useState(false);

  const [isSaveSettingsAsDisabled, setIsSaveSettingsAsDisabled] =
    useState(false);
  //#endregion

  //#region Use Effect
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    fetchSettingNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region Fetch Setting Names
  const fetchSettingNames = () => {
    setSpinnerMessage("Please wait while fetching Setting Names...");
    setLoading(true);

    descriptionGeneratorService
      .fetchSettingNames()
      .then((response) => {
        setSettingNames(response.data);
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });

    setLoading(false);
  };
  //#endregion

  //#region on Change Setting Name
  const onChangeSettingName = (e) => {
    const { value } = e.target;
    setSelectedSettingName(value);

    setSpinnerMessage("Please wait while fetching saved settings...");
    setLoading(true);

    descriptionGeneratorService
      .readDescriptionGeneratorSavedSetting(value)
      .then((resp) => {
        setIsNounExcluded(resp.data.IsNounExcluded);
        setIsModifierExcluded(resp.data.IsModifierExcluded);
        setIsAttributeNameExcluded(resp.data.IsAttributeNameExcluded);
        setIsAttributeValueExcluded(resp.data.IsAttributeValueExcluded);
        setIsAddInfoExcluded(resp.data.IsAdditionalInformationExcluded);
        setIsMFRNameExcluded(resp.data.IsMFRNameExcluded);
        setIsMFRPNExcluded(resp.data.IsMFRPartNoExcluded);
        setSpecificModifierExcluded(resp.data.SpecificModifierExcluded);

        setIsToInterpretAdditionalInformation(
          resp.data.IsToInterpretAdditionalInformation,
        );
        setIsToIncludeAttributeNameFromAddInfo(
          resp.data.IsToIncludeAttributeNameFromAdditionalInformation,
        );
        setIsToIncludeMaxValues(resp.data.IsToIncludeMaximumValues);
        setIsToInterpretAllAttributeValues(
          resp.data.IsToInterpretAllAttributeValues,
        );

        setIsNounToBeAbbreviated(resp.data.IsNounToBeAbbreviated);
        setIsModifierToBeAbbreviated(resp.data.IsModifierToBeAbbreviated);
        setIsAttributeNameToBeAbbreviated(
          resp.data.IsAttributeNameToBeAbbreviated,
        );
        setIsAttributeValueToBeAbbreviated(
          resp.data.IsAttributeValueToBeAbbreviated,
        );
        setIsAddInfoToBeAbbreviated(
          resp.data.IsAdditionalInformationToBeAbbreviated,
        );
        setIsMFRNameToBeAbbreviated(resp.data.IsMFRNameToBeAbbreviated);
        setAbbreviationFileName(resp.data.AbbreviationFileName);

        setDelimiterAfterNoun(resp.data.DelimiterAfterNoun);
        setDelimiterAfterModifier(resp.data.DelimiterAfterModifier);
        setDelimiterAfterAttributeName(resp.data.DelimiterAfterAttributeName);
        setDelimiterAfterAttributeValue(resp.data.DelimiterAfterAttributeValue);
        setDelimiterAfterAddInfo(resp.data.DelimiterAfterAdditionalInformation);
        setDelimiterAfterMFRName(resp.data.DelimiterAfterMFRName);
        setDelimiterAfterMFRPN(resp.data.DelimiterAfterMFRPartNo);
        setMultipleValuesSeparator(resp.data.MultipleValuesSeparator);

        setIsToApplyIdentifiers(resp.data.IsToApplyIdentifiers);
        if (resp.data.IsToApplyIdentifiers) {
          setIdentifiersFileName(resp.data.IdentifierFileName);
          setIsToAddSpaceBetweenAttValueAndIdentifier(
            resp.data.IsToAddSpaceBeforeORAfterIdentifier,
          );
          setIsToApplyIdentifiersToAddInfo(
            resp.data.IsToApplyIdentifierToAdditionalInformation,
          );
        }

        setPrefixForAddInfo(resp.data.PrefixForAdditionalInformation);
        setPrefixForMFRName(resp.data.PrefixForMFRName);
        setPrefixForMFRPN(resp.data.PrefixForMFRPartNo);

        setIsToIncludeAttributeNameWithNULLValues(
          resp.data.IsToIncludeAttributeNameWithNULLValues,
        );
        setIsToIncludeAllOtherMFRNames(resp.data.IsToIncludeAllOtherMFRNames);
        setIsToIncludeAllOtherMFRPNs(resp.data.IsToIncludeAllOtherMFRPartNos);
        setIsToPrefixAllMFRNames(resp.data.IsToPrefixAllMFRNames);
        setIsToPrefixAllMFRPNs(resp.data.IsToPrefixAllMFRPartNos);

        setDescriptionToGenerate(resp.data.DescriptionToGenerate);
        setTruncationType(resp.data.TruncationType);
        setCharacterLimit(resp.data.CharacterLimit);
        setDelimiterForTruncation(resp.data.DelimiterForTruncation);
        setSelectedThirdOrderOfData(resp.data.ThirdOrderOfDataInDescription);
        setSelectedFourthOrderOfData(resp.data.FourthOrderOfDataInDescription);
        setSelectedFifthOrderOfData(resp.data.FifthOrderOfDataInDescription);
      })
      .catch((error) => {
        console.log(error);
      });

    disableAllControls(true);
    setLoading(false);
  };
  //#endregion

  //#region disable all controls
  const disableAllControls = (isDisabled) => {
    setIsExcludeNounDisabled(isDisabled);
    setIsExcludeModifierDisabled(isDisabled);
    setIsExcludeAttributeNameDisabled(isDisabled);
    setIsExcludeAttributeValueDisabled(isDisabled);
    setIsExcludeAddInfoDisabled(isDisabled);
    setIsExcludeMFRNameDisabled(isDisabled);
    setIsExcludeMFRPNDisabled(isDisabled);
    setIsExcludeSpecificModifierDisabled(isDisabled);

    setIsToInterpretAddInfoDisabled(isDisabled);
    setIsToIncludeAttNameFromAddInfoDisabled(isDisabled);
    setIsToIncludeMaxValuesDisabled(isDisabled);
    setIsToInterpretAllAttributeValuesDisabled(isDisabled);

    setIsNounToBeAbbreviatedDisabled(isDisabled);
    setIsModifierToBeAbbreviatedDisabled(isDisabled);
    setIsAttNameToBeAbbreviatedDisabled(isDisabled);
    setIsAttValueToBeAbbreviatedDisabled(isDisabled);
    setIsAddInfoToBeAbbreviatedDisabled(isDisabled);
    setIsMFRNameToBeAbbreviatedDisabled(isDisabled);
    setIsAbbreviationFileUploadDisabled(isDisabled);

    setIsDelimiterAfterNounDisabled(isDisabled);
    setIsDelimiterAfterModifierDisabled(isDisabled);
    setIsDelimiterAfterAttNameDisabled(isDisabled);
    setIsDelimiterAfterAttValueDisabled(isDisabled);
    setIsDelimiterAfterAddInfoDisabled(isDisabled);
    setIsDelimiterAfterMFRNameDisabled(isDisabled);
    setIsDelimiterAfterMFRPNDisabled(isDisabled);
    setisMultipleValuesSeparatorDisabled(isDisabled);

    setIsToApplyIdentifiersDisabled(isDisabled);
    setIsIdentifiersFileUploadDisabled(isDisabled);
    setIsToAddSpaceBeforeOrAfterIdentifierDisabled(isDisabled);
    setIsToApplyIdentifiersToAddInfoDisabled(isDisabled);

    setIsPrefixToAddInfoDisabled(isDisabled);
    setIsPrefixToMFRNameDisabled(isDisabled);
    setIsPrefixToMFRPNDisabled(isDisabled);

    setIsToIncludeAttNameWithNULLValuesDisabled(isDisabled);
    setIsToIncludeAllOtherMFRNamesDisabled(isDisabled);
    setIsToIncludeAllOtherMFRPNsDisabled(isDisabled);
    setIsToPrefixAllMFRNamesDisabled(isDisabled);
    setIsToPrefixAllMFRPNsDisabled(isDisabled);

    setIsDescriptionToGenerateDisabled(isDisabled);
    setIsTruncationTypeDisabled(isDisabled);
    setIsCharacterLimitDisabled(isDisabled);
    setIsDelimiterForTruncationDisabled(isDisabled);

    setIsThirdOrderOfDataDisabled(isDisabled);
    setIsFourthOrderOfDataDisabled(isDisabled);
    setIsFifthOrderOfDataDisabled(isDisabled);

    setIsSaveSettingsAsDisabled(isDisabled);
  };
  //#endregion

  //#region  Download File Templates
  const downloadFileTemplate = (fileName) => {
    setSpinnerMessage("Please wait while downloading file template...");
    setLoading(true);

    fileService
      .downloadTemplateFile(fileName)
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //#endregion

  //#region Upload Input File to Server
  const uploadInputFile = (e) => {
    const files = e.target.files;
    const currentFile = files[0];

    if (currentFile) {
      // Check extension
      if (!currentFile.name.toLowerCase().endsWith(".xlsx")) {
        alert("Please select only .xlsx files");
        e.target.value = ""; // Clear the invalid file
        return;
      }

      const formData = new FormData();
      formData.append("File", currentFile);
      setSpinnerMessage("Please wait while uploading input file...");
      setLoading(true);
      setUploadedInputFileName(currentFile.name);

      projectService
        .saveFileupload(formData)
        .then((response) => {
          setInputFileName(response.data);
        })
        .catch((error) => {
          let errorMessage = error.response.data.Message;
          setInputFileName("");
          setErrorMessage(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });

      if (e.target.value !== "" && e.target.value !== null) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          inputFileError: "",
        }));
      }
    }
  };
  //#endregion

  //#region Upload Abbreviation File to Server
  const uploadAbbreviationFile = (e) => {
    const files = e.target.files;
    const currentFile = files[0];

    if (currentFile) {
      // Check extension
      if (!currentFile.name.toLowerCase().endsWith(".xlsx")) {
        alert("Please select only .xlsx files");
        e.target.value = ""; // Clear the invalid file
        return;
      }

      const formData = new FormData();
      formData.append("File", currentFile);
      setSpinnerMessage("Please wait while uploading abbreviation file...");
      setLoading(true);
      setUploadedAbbreviationFileName(currentFile.name);

      projectService
        .saveFileupload(formData)
        .then((response) => {
          setAbbreviationFileName(response.data);
        })
        .catch((error) => {
          let errorMessage = error.response.data.Message;
          setAbbreviationFileName("");
          setErrorMessage(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });

      if (e.target.value !== "" && e.target.value !== null) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          abbreviationFileError: "",
        }));
      }
    }
  };
  //#endregion

  //#region Upload Identifiers File to Server
  const uploadIdentifiersFile = (e) => {
    const files = e.target.files;
    const currentFile = files[0];

    if (currentFile) {
      // Check extension
      if (!currentFile.name.toLowerCase().endsWith(".xlsx")) {
        alert("Please select only .xlsx files");
        e.target.value = ""; // Clear the invalid file
        return;
      }

      const formData = new FormData();
      formData.append("File", currentFile);
      setSpinnerMessage("Please wait while uploading identifiers file...");
      setLoading(true);
      setUploadedIdentifiersFileName(currentFile.name);

      projectService
        .saveFileupload(formData)
        .then((response) => {
          setIdentifiersFileName(response.data);
        })
        .catch((error) => {
          let errorMessage = error.response.data.Message;
          setIdentifiersFileName("");
          setErrorMessage(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });

      if (e.target.value !== "" && e.target.value !== null) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          identifiersFileError: "",
        }));
      }
    }
  };
  //#endregion

  //#region Order of Data Options Array
  const orderOfDataOptions = [
    { value: "D", label: "Additional Info" },
    { value: "A", label: "Attribute" },
    { value: "M", label: "MFR Detail" },
  ];
  //#endregion

  //#region Exclude Noun
  const excludeNoun = (e) => {
    setIsNounExcluded(e.target.checked);
    if (e.target.checked && isModifierExcluded) {
      setFirstOrderLabel("");
      setSecondOrderLabel("");
      setThirdOrderLabel("First");
      setFourthOrderLabel("Second");
      setFifthOrderLabel("Third");
    } else if (e.target.checked && !isModifierExcluded) {
      setFirstOrderLabel("");
      setSecondOrderLabel("First: Modifier");
      setThirdOrderLabel("Second");
      setFourthOrderLabel("Third");
      setFifthOrderLabel("Fourth");
    } else if (!e.target.checked && isModifierExcluded) {
      setFirstOrderLabel("First: Noun");
      setSecondOrderLabel("");
      setThirdOrderLabel("Second");
      setFourthOrderLabel("Third");
      setFifthOrderLabel("Fourth");
    } else if (!e.target.checked && !isModifierExcluded) {
      setFirstOrderLabel("First: Noun");
      setSecondOrderLabel("Second: Modifier");
      setThirdOrderLabel("Third");
      setFourthOrderLabel("Fourth");
      setFifthOrderLabel("Fifth");
    }

    if (
      !(
        e.target.checked &&
        isModifierExcluded &&
        isAttributeNameExcluded &&
        isAttributeValueExcluded &&
        isAddInfoExcluded &&
        isMFRNameExcluded &&
        isMFRPNExcluded
      )
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        allColumnsExcludedError: "",
      }));
    }
  };
  //#endregion

  //#region Exclude Modifier
  const excludeModifier = (e) => {
    setIsModifierExcluded(e.target.checked);
    if (isNounExcluded && e.target.checked) {
      setFirstOrderLabel("");
      setSecondOrderLabel("");
      setThirdOrderLabel("First");
      setFourthOrderLabel("Second");
      setFifthOrderLabel("Third");
    } else if (!isNounExcluded && e.target.checked) {
      setFirstOrderLabel("");
      setSecondOrderLabel("First: Noun");
      setThirdOrderLabel("Second");
      setFourthOrderLabel("Third");
      setFifthOrderLabel("Fourth");
    } else if (isNounExcluded && !e.target.checked) {
      setFirstOrderLabel("First: Modifier");
      setSecondOrderLabel("");
      setThirdOrderLabel("Second");
      setFourthOrderLabel("Third");
      setFifthOrderLabel("Fourth");
    } else if (!isNounExcluded && !e.target.checked) {
      setFirstOrderLabel("First: Noun");
      setSecondOrderLabel("Second: Modifier");
      setThirdOrderLabel("Third");
      setFourthOrderLabel("Fourth");
      setFifthOrderLabel("Fifth");
    }

    if (
      !(
        isNounExcluded &&
        e.target.checked &&
        isAttributeNameExcluded &&
        isAttributeValueExcluded &&
        isAddInfoExcluded &&
        isMFRNameExcluded &&
        isMFRPNExcluded
      )
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        allColumnsExcludedError: "",
      }));
    }
  };
  //#endregion

  //#region Exclude Attribute Name
  const excludeAttributeName = (e) => {
    setIsAttributeNameExcluded(e.target.checked);
    if (
      !(
        isNounExcluded &&
        isModifierExcluded &&
        e.target.checked &&
        isAttributeValueExcluded &&
        isAddInfoExcluded &&
        isMFRNameExcluded &&
        isMFRPNExcluded
      )
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        allColumnsExcludedError: "",
      }));
    }
  };
  //#endregion

  //#region Exclude Attribute Value
  const excludeAttributeValue = (e) => {
    setIsAttributeValueExcluded(e.target.checked);
    if (
      !(
        isNounExcluded &&
        isModifierExcluded &&
        isAttributeNameExcluded &&
        e.target.checked &&
        isAddInfoExcluded &&
        isMFRNameExcluded &&
        isMFRPNExcluded
      )
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        allColumnsExcludedError: "",
      }));
    }
  };
  //#endregion

  //#region Exclude Add. Info.
  const excludeAddInfo = (e) => {
    setIsAddInfoExcluded(e.target.checked);
    if (
      !(
        isNounExcluded &&
        isModifierExcluded &&
        isAttributeNameExcluded &&
        isAttributeValueExcluded &&
        e.target.checked &&
        isMFRNameExcluded &&
        isMFRPNExcluded
      )
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        allColumnsExcludedError: "",
      }));
    }
  };
  //#endregion

  //#region Exclude MFR Name
  const excludeMFRName = (e) => {
    setIsMFRNameExcluded(e.target.checked);
    if (
      !(
        isNounExcluded &&
        isModifierExcluded &&
        isAttributeNameExcluded &&
        isAttributeValueExcluded &&
        isAddInfoExcluded &&
        e.target.checked &&
        isMFRPNExcluded
      )
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        allColumnsExcludedError: "",
      }));
    }
  };
  //#endregion

  //#region Exclude MFR P/N.
  const excludeMFRPN = (e) => {
    setIsMFRPNExcluded(e.target.checked);
    if (
      !(
        isNounExcluded &&
        isModifierExcluded &&
        isAttributeNameExcluded &&
        isAttributeValueExcluded &&
        isAddInfoExcluded &&
        isMFRNameExcluded &&
        e.target.checked
      )
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        allColumnsExcludedError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Noun To Be Abbreviated
  const onChangeNounToBeAbbreviated = (e) => {
    setIsNounToBeAbbreviated(e.target.checked);

    if (
      !e.target.checked &&
      !isModifierToBeAbbreviated &&
      !isAttributeNameToBeAbbreviated &&
      !isAttributeValueToBeAbbreviated &&
      !isAddInfoToBeAbbreviated &&
      !isMFRNameToBeAbbreviated
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        abbreviationFileError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Modifier To Be Abbreviated
  const onChangeModifierToBeAbbreviated = (e) => {
    setIsModifierToBeAbbreviated(e.target.checked);

    if (
      !isNounToBeAbbreviated &&
      !e.target.checked &&
      !isAttributeNameToBeAbbreviated &&
      !isAttributeValueToBeAbbreviated &&
      !isAddInfoToBeAbbreviated &&
      !isMFRNameToBeAbbreviated
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        abbreviationFileError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Att. Name To Be Abbreviated
  const onChangeAttNameToBeAbbreviated = (e) => {
    setIsAttributeNameToBeAbbreviated(e.target.checked);

    if (
      !isNounToBeAbbreviated &&
      !isModifierToBeAbbreviated &&
      !e.target.checked &&
      !isAttributeValueToBeAbbreviated &&
      !isAddInfoToBeAbbreviated &&
      !isMFRNameToBeAbbreviated
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        abbreviationFileError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Att. Value To Be Abbreviated
  const onChangeAttValueToBeAbbreviated = (e) => {
    setIsAttributeValueToBeAbbreviated(e.target.checked);

    if (
      !isNounToBeAbbreviated &&
      !isModifierToBeAbbreviated &&
      !isAttributeNameToBeAbbreviated &&
      !e.target.checked &&
      !isAddInfoToBeAbbreviated &&
      !isMFRNameToBeAbbreviated
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        abbreviationFileError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Add. Info. To Be Abbreviated
  const onChangeAddInfoToBeAbbreviated = (e) => {
    setIsAddInfoToBeAbbreviated(e.target.checked);

    if (
      !isNounToBeAbbreviated &&
      !isModifierToBeAbbreviated &&
      !isAttributeNameToBeAbbreviated &&
      !isAttributeValueToBeAbbreviated &&
      !e.target.checked &&
      !isMFRNameToBeAbbreviated
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        abbreviationFileError: "",
      }));
    }
  };
  //#endregion

  //#region on Change MFR Name To Be Abbreviated
  const onChangeMFRNameToBeAbbreviated = (e) => {
    setIsMFRNameToBeAbbreviated(e.target.checked);

    if (
      !isNounToBeAbbreviated &&
      !isModifierToBeAbbreviated &&
      !isAttributeNameToBeAbbreviated &&
      !isAttributeValueToBeAbbreviated &&
      !isAddInfoToBeAbbreviated &&
      !e.target.checked
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        abbreviationFileError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Delimiter After Noun
  const handleDelimiterAfterNoun = (e) => {
    setDelimiterAfterNoun(e.target.value);

    if (
      descriptionToGenerate === "S" &&
      truncationType === "M" &&
      (delimiterForTruncation.trim() === e.target.value.trim() ||
        delimiterForTruncation.trim() === delimiterAfterModifier.trim() ||
        delimiterForTruncation.trim() === delimiterAfterAttributeName.trim() ||
        delimiterForTruncation.trim() === delimiterAfterAttributeValue.trim() ||
        delimiterForTruncation.trim() === delimiterAfterAddInfo.trim() ||
        delimiterForTruncation.trim() === delimiterAfterMFRName.trim() ||
        delimiterForTruncation.trim() === delimiterAfterMFRPN.trim())
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Delimiter After Modifier
  const handleDelimiterAfterModifier = (e) => {
    setDelimiterAfterModifier(e.target.value);

    if (
      descriptionToGenerate === "S" &&
      truncationType === "M" &&
      (delimiterForTruncation.trim() === delimiterAfterNoun.trim() ||
        delimiterForTruncation.trim() === e.target.value.trim() ||
        delimiterForTruncation.trim() === delimiterAfterAttributeName.trim() ||
        delimiterForTruncation.trim() === delimiterAfterAttributeValue.trim() ||
        delimiterForTruncation.trim() === delimiterAfterAddInfo.trim() ||
        delimiterForTruncation.trim() === delimiterAfterMFRName.trim() ||
        delimiterForTruncation.trim() === delimiterAfterMFRPN.trim())
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Delimiter After Attribute Name
  const handleDelimiterAfterAttributeName = (e) => {
    setDelimiterAfterAttributeName(e.target.value);

    if (
      descriptionToGenerate === "S" &&
      truncationType === "M" &&
      (delimiterForTruncation.trim() === delimiterAfterNoun.trim() ||
        delimiterForTruncation.trim() === delimiterAfterModifier.trim() ||
        delimiterForTruncation.trim() === e.target.value.trim() ||
        delimiterForTruncation.trim() === delimiterAfterAttributeValue.trim() ||
        delimiterForTruncation.trim() === delimiterAfterAddInfo.trim() ||
        delimiterForTruncation.trim() === delimiterAfterMFRName.trim() ||
        delimiterForTruncation.trim() === delimiterAfterMFRPN.trim())
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Delimiter After Attribute Value
  const handleDelimiterAfterAttributeValue = (e) => {
    setDelimiterAfterAttributeValue(e.target.value);

    if (
      e.target.value !== multipleValuesSeparator ||
      (descriptionToGenerate === "S" &&
        truncationType === "M" &&
        (delimiterForTruncation.trim() === delimiterAfterNoun.trim() ||
          delimiterForTruncation.trim() === delimiterAfterModifier.trim() ||
          delimiterForTruncation.trim() ===
            delimiterAfterAttributeName.trim() ||
          delimiterForTruncation.trim() === e.target.value.trim() ||
          delimiterForTruncation.trim() === delimiterAfterAddInfo.trim() ||
          delimiterForTruncation.trim() === delimiterAfterMFRName.trim() ||
          delimiterForTruncation.trim() === delimiterAfterMFRPN.trim()))
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Delimiter After Add Info
  const handleDelimiterAfterAddInfo = (e) => {
    setDelimiterAfterAddInfo(e.target.value);

    if (
      e.target.value !== multipleValuesSeparator ||
      (descriptionToGenerate === "S" &&
        truncationType === "M" &&
        (delimiterForTruncation.trim() === delimiterAfterNoun.trim() ||
          delimiterForTruncation.trim() === delimiterAfterModifier.trim() ||
          delimiterForTruncation.trim() ===
            delimiterAfterAttributeName.trim() ||
          delimiterForTruncation.trim() ===
            delimiterAfterAttributeValue.trim() ||
          delimiterForTruncation.trim() === e.target.value.trim() ||
          delimiterForTruncation.trim() === delimiterAfterMFRName.trim() ||
          delimiterForTruncation.trim() === delimiterAfterMFRPN.trim()))
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Delimiter After MFR Name
  const handleDelimiterAfterMFRName = (e) => {
    setDelimiterAfterMFRName(e.target.value);

    if (
      e.target.value !== multipleValuesSeparator ||
      (descriptionToGenerate === "S" &&
        truncationType === "M" &&
        (delimiterForTruncation.trim() === delimiterAfterNoun.trim() ||
          delimiterForTruncation.trim() === delimiterAfterModifier.trim() ||
          delimiterForTruncation.trim() ===
            delimiterAfterAttributeName.trim() ||
          delimiterForTruncation.trim() ===
            delimiterAfterAttributeValue.trim() ||
          delimiterForTruncation.trim() === delimiterAfterAddInfo.trim() ||
          delimiterForTruncation.trim() === e.target.value.trim() ||
          delimiterForTruncation.trim() === delimiterAfterMFRPN.trim()))
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Delimiter After MFR P/N.
  const handleDelimiterAfterMFRPN = (e) => {
    setDelimiterAfterMFRPN(e.target.value);

    if (
      e.target.value !== multipleValuesSeparator ||
      (descriptionToGenerate === "S" &&
        truncationType === "M" &&
        (delimiterForTruncation.trim() === delimiterAfterNoun.trim() ||
          delimiterForTruncation.trim() === delimiterAfterModifier.trim() ||
          delimiterForTruncation.trim() ===
            delimiterAfterAttributeName.trim() ||
          delimiterForTruncation.trim() ===
            delimiterAfterAttributeValue.trim() ||
          delimiterForTruncation.trim() === delimiterAfterAddInfo.trim() ||
          delimiterForTruncation.trim() === delimiterAfterMFRName.trim() ||
          delimiterForTruncation.trim() === e.target.value.trim()))
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Multiple Values Separator
  const handleMultipleValuesSeparator = (e) => {
    setMultipleValuesSeparator(e.target.value);

    if (
      e.target.value !== delimiterAfterAttributeValue ||
      (descriptionToGenerate === "S" &&
        isToInterpretAllAttributeValues &&
        e.target.value.trim().length > 0)
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Add Info. Prefix
  const onChangeAddInfoPrefix = (e) => {
    setPrefixForAddInfo(e.target.value);
  };
  //#endregion

  //#region on Change MFR Name Prefix
  const onChangeMFRNamePrefix = (e) => {
    setPrefixForMFRName(e.target.value);

    if (e.target.value) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        MFRNamePrefixError: "",
      }));
    }
  };
  //#endregion

  //#region on Change MFR P/N. Prefix
  const onChangeMFRPNPrefix = (e) => {
    setPrefixForMFRPN(e.target.value);

    if (e.target.value) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        MFRPNPrefixError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Truncation Type
  const onChangeTruncationType = (e) => {
    setTruncationType(e.target.value);

    if (isToIncludeMaxValues && e.target.value !== "B") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        TruncationTypeError: "",
      }));
    }
  };
  //#endregion

  //#region on Change Character Limit
  const onChangeCharacterLimit = (e) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      value = 0; // fallback if input is cleared
    } else if (value < 0) {
      value = 0;
    } else if (value > 9999) {
      value = 9999;
    }

    if (
      (descriptionToGenerate === "S" && truncationType === "B" && value > 0) ||
      (isToIncludeMaxValues && value > 0) ||
      (descriptionToGenerate === "S" && value > 0)
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        CharacterLimitError: "",
      }));
    }

    setCharacterLimit(value);
  };
  //#endregion

  //#region Handle Delimiter For Truncation
  const handleDelimiterForTruncation = (e) => {
    setDelimiterForTruncation(e.target.value);

    if (
      descriptionToGenerate === "S" &&
      truncationType === "M" &&
      (e.target.value.trim() === delimiterAfterNoun.trim() ||
        e.target.value.trim() === delimiterAfterModifier.trim() ||
        e.target.value.trim() === delimiterAfterAttributeName.trim() ||
        e.target.value.trim() === delimiterAfterAttributeValue.trim() ||
        e.target.value.trim() === delimiterAfterAddInfo.trim() ||
        e.target.value.trim() === delimiterAfterMFRName.trim() ||
        e.target.value.trim() === delimiterAfterMFRPN.trim())
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        delimiterError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Third Order Of Data
  const handleThirdOrderOfData = (e) => {
    setSelectedThirdOrderOfData(e.target.value);

    if (
      e.target.value &&
      selectedFourthOrderOfData &&
      selectedFifthOrderOfData
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        orderOfDataError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Fourth Order Of Data
  const handleFourthOrderOfData = (e) => {
    setSelectedFourthOrderOfData(e.target.value);

    if (
      selectedThirdOrderOfData &&
      e.target.value &&
      selectedFifthOrderOfData
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        orderOfDataError: "",
      }));
    }
  };
  //#endregion

  //#region Handle Fifth Order Of Data
  const handleFifthOrderOfData = (e) => {
    setSelectedFifthOrderOfData(e.target.value);
    if (
      selectedThirdOrderOfData &&
      selectedFourthOrderOfData &&
      e.target.value
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        orderOfDataError: "",
      }));
    }
  };
  //#endregion

  //#region Validate and Generate
  const validateAndGenerate = (e) => {
    e.preventDefault();

    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }

    let isInputFileValidated = false;
    let isAbbreviationFileValidated = false;
    let isIdentifiersFileValidated = false;
    let isDescriptionGenerated = false;
    let isFileDownloaded = false;
    let outputFileName = "";

    const formErrors = {};
    let isValidForm = true;

    if (!inputFileName) {
      isValidForm = false;
      formErrors["inputFileError"] = "Input File is required";
      setFormErrors(formErrors);
      return isValidForm;
    }

    if (handleFormValidation()) {
      var data = {
        InputFileName: inputFileName,
        SpecificModifierExcluded: specificModifierExcluded,
        AbbreviationFileName: abbreviationFileName,
        DelimiterAfterNoun: delimiterAfterNoun,
        DelimiterAfterModifier: delimiterAfterModifier,
        DelimiterAfterAttributeName: delimiterAfterAttributeName,
        DelimiterAfterAttributeValue: delimiterAfterAttributeValue,
        DelimiterAfterAdditionalInformation: delimiterAfterAddInfo,
        DelimiterAfterMFRName: delimiterAfterMFRName,
        DelimiterAfterMFRPartNo: delimiterAfterMFRPN,
        MultipleValuesSeparator: multipleValuesSeparator,
        IdentifierFileName: identifiersFileName,
        PrefixForAdditionalInformation: prefixForAddInfo,
        PrefixForMFRName: prefixForMFRName,
        PrefixForMFRPartNo: prefixForMFRPN,
        DescriptionToGenerate: descriptionToGenerate,
        TruncationType: truncationType,
        DelimiterForTruncation: delimiterForTruncation,
        ThirdOrderOfDataInDescription: selectedThirdOrderOfData,
        FourthOrderOfDataInDescription: selectedFourthOrderOfData,
        FifthOrderOfDataInDescription: selectedFifthOrderOfData,
        IsNounExcluded: isNounExcluded,
        IsModifierExcluded: isModifierExcluded,
        IsAttributeNameExcluded: isAttributeNameExcluded,
        IsAttributeValueExcluded: isAttributeValueExcluded,
        IsAdditionalInformationExcluded: isAddInfoExcluded,
        IsMFRNameExcluded: isMFRNameExcluded,
        IsMFRPartNoExcluded: isMFRPNExcluded,
        IsToInterpretAdditionalInformation: isToInterpretAdditionalInformation,
        IsToInterpretAllAttributeValues: isToInterpretAllAttributeValues,
        IsToIncludeAttributeNameFromAdditionalInformation:
          isToIncludeAttributeNameFromAddInfo,
        IsToIncludeMaximumValues: isToIncludeMaxValues,
        IsNounToBeAbbreviated: isNounToBeAbbreviated,
        IsModifierToBeAbbreviated: isModifierToBeAbbreviated,
        IsAttributeNameToBeAbbreviated: isAttributeNameToBeAbbreviated,
        IsAttributeValueToBeAbbreviated: isAttributeValueToBeAbbreviated,
        IsAdditionalInformationToBeAbbreviated: isAddInfoToBeAbbreviated,
        IsMFRNameToBeAbbreviated: isMFRNameToBeAbbreviated,
        IsToApplyIdentifiers: isToApplyIdentifiers,
        IsToAddSpaceBeforeORAfterIdentifier:
          isToAddSpaceBetweenAttValueAndIdentifier,
        IsToApplyIdentifierToAdditionalInformation:
          isToApplyIdentifiersToAddInfo,
        IsToIncludeAttributeNameWithNULLValues:
          isToIncludeAttributeNameWithNULLValues,
        IsToIncludeAllOtherMFRNames: isToIncludeAllOtherMFRNames,
        IsToIncludeAllOtherMFRPartNos: isToIncludeAllOtherMFRPNs,
        IsToPrefixAllMFRNames: isToPrefixAllMFRNames,
        IsToPrefixAllMFRPartNos: isToPrefixAllMFRPNs,
        CharacterLimit: characterLimit,
      };

      setShowModal(true);
      setSuccessMessage("");
      setErrorMessage("");
      setLoading(false);
      setShowCloseButton(false);
      setInputFileValidationStatus("loading");

      descriptionGeneratorService
        .validateInputFileData(inputFileName)
        .then((response) => {
          setInputFileValidationStatus("success");
          isInputFileValidated = true;
        })
        .catch((error) => {
          let errorMessage = error.response.data.Message;
          setErrorMessage(errorMessage);
          setShowCloseButton(true);
          if (!isInputFileValidated) {
            setInputFileName("");
            setInputFileValidationStatus("error");
            return;
          }
        });

      if (
        isNounToBeAbbreviated ||
        isModifierToBeAbbreviated ||
        isAttributeNameToBeAbbreviated ||
        isAttributeValueToBeAbbreviated ||
        isAddInfoToBeAbbreviated ||
        isMFRNameToBeAbbreviated
      ) {
        setAbbreviationFileValidationStatus("loading");
        descriptionGeneratorService
          .validateAbbreviationFileData(abbreviationFileName)
          .then((response) => {
            setAbbreviationFileValidationStatus("success");
            isAbbreviationFileValidated = true;
          })
          .catch((error) => {
            let errorMessage = error.response.data.Message;
            setErrorMessage(errorMessage);
            setShowCloseButton(true);
            if (!isAbbreviationFileValidated) {
              setAbbreviationFileName("");
              setAbbreviationFileValidationStatus("error");
              return;
            }
          });
      }

      if (isToApplyIdentifiers) {
        setIdentifiersFileValidationStatus("loading");
        descriptionGeneratorService
          .validateIdentifiersFileData(identifiersFileName)
          .then((response) => {
            setIdentifiersFileValidationStatus("success");
            isIdentifiersFileValidated = true;
          })
          .catch((error) => {
            let errorMessage = error.response.data.Message;
            setErrorMessage(errorMessage);
            setShowCloseButton(true);
            if (!isIdentifiersFileValidated) {
              setIdentifiersFileName("");
              setIdentifiersFileValidationStatus("error");
              return;
            }
          });
      }

      setGenerateDescriptionStatus("loading");
      descriptionGeneratorService
        .generateDescription(data)
        .then((response) => {
          outputFileName = response.data;
          setGenerateDescriptionStatus("success");
          setDownloadingStatus("loading");
          isDescriptionGenerated = true;
          return fileService.downloadOutputFile(outputFileName);
        })
        .then((response) => {
          setDownloadingStatus("success");
          isFileDownloaded = true;
          setSuccessMessage(
            "Description generated successfully and output is updated in the downloaded file.",
          );
          let fileName = "Output_" + uploadedInputFileName;
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", fileName);
          document.body.appendChild(fileLink);
          fileLink.click();
          setShowCloseButton(true);
        })
        .catch((error) => {
          let errorMessage = error.response.data.Message;
          setErrorMessage(errorMessage);
          setShowCloseButton(true);
          if (!isDescriptionGenerated) {
            setInputFileName("");
            setGenerateDescriptionStatus("error");
            return;
          }

          if (!isFileDownloaded) {
            setDownloadingStatus("error");
            return;
          }
        });
    }
  };
  //#endregion

  //#region Validating the input data
  const handleFormValidation = () => {
    const formErrors = {};
    let isValidForm = true;

    if (
      isNounExcluded &&
      isModifierExcluded &&
      isAttributeNameExcluded &&
      isAttributeValueExcluded &&
      isAddInfoExcluded &&
      isMFRNameExcluded &&
      isMFRPNExcluded
    ) {
      isValidForm = false;
      formErrors["allColumnsExcludedError"] = "All columns cannot be excluded";
    }

    if (
      isNounToBeAbbreviated ||
      isModifierToBeAbbreviated ||
      isAttributeNameToBeAbbreviated ||
      isAttributeValueToBeAbbreviated ||
      isAddInfoToBeAbbreviated ||
      isMFRNameToBeAbbreviated
    ) {
      if (!abbreviationFileName) {
        isValidForm = false;
        formErrors["abbreviationFileError"] = "Please upload abbreviation file";
      }
    }

    if (abbreviationFileName) {
      if (
        !isNounToBeAbbreviated &&
        !isModifierToBeAbbreviated &&
        !isAttributeNameToBeAbbreviated &&
        !isAttributeValueToBeAbbreviated &&
        !isAddInfoToBeAbbreviated &&
        !isMFRNameToBeAbbreviated
      ) {
        isValidForm = false;
        formErrors["abbreviationFileError"] =
          "Abbreviation column has to be selected when abbreviation file is uploaded";
      }
    }

    if (!isAttributeNameExcluded && !isAttributeValueExcluded) {
      if (delimiterAfterAttributeName === delimiterAfterAttributeValue) {
        isValidForm = false;
        formErrors["delimiterError"] =
          "Delimiter after attribute name and attribute value cannot be same";
      }
    }

    if (!isAttributeValueExcluded) {
      if (delimiterAfterAttributeValue === multipleValuesSeparator) {
        isValidForm = false;
        formErrors["delimiterError"] =
          "Delimiter after attribute value and multiple values separator cannot be same";
      }
    }

    if (isToApplyIdentifiers) {
      if (!identifiersFileName) {
        isValidForm = false;
        formErrors["identifiersFileError"] = "Please upload identifiers file";
      }
    }

    if (isToPrefixAllMFRNames) {
      if (!prefixForMFRName) {
        isValidForm = false;
        formErrors["MFRNamePrefixError"] = "MFR Name prefix is required";
      }
    }

    if (isToPrefixAllMFRPNs) {
      if (!prefixForMFRPN) {
        isValidForm = false;
        formErrors["MFRPNPrefixError"] = "MFR P/N. prefix is required";
      }
    }

    //#region Validating Character Limit
    if (descriptionToGenerate === "S" && truncationType === "B") {
      if (characterLimit <= 0) {
        isValidForm = false;
        formErrors["CharacterLimitError"] = "Character Limit is required";
      }
    }
    //#endregion

    //#region Validating Truncation Type and Character limit when Include maximum values selected
    if (isToIncludeMaxValues) {
      if (truncationType === "B") {
        isValidForm = false;
        formErrors["TruncationTypeError"] =
          "Truncation type cannot be 'Blind', when 'Include maximum values' is checked.";
      }

      if (characterLimit <= 0) {
        isValidForm = false;
        formErrors["CharacterLimitError"] =
          "Character limit is mandatory, when 'Include maximum values' is checked.";
      }
    }
    //#endregion

    //#region Validating Interpret All Attribute Values flag applicable only for short description
    if (descriptionToGenerate === "S") {
      if (
        isToInterpretAllAttributeValues &&
        multipleValuesSeparator.trim().length === 0
      ) {
        isValidForm = false;
        formErrors["delimiterError"] =
          "Please enter Multiple Values separator. This cannot be white space.";
      }
    }
    //#endregion

    //#region When truncation type is meaningful, Delimiter for truncation character must be a character from one of the delimiter.
    if (descriptionToGenerate === "S" && truncationType === "M") {
      if (
        (isNounExcluded ||
          delimiterForTruncation.trim() !== delimiterAfterNoun.trim()) &&
        (isModifierExcluded ||
          delimiterForTruncation.trim() !== delimiterAfterModifier.trim()) &&
        (isAttributeNameExcluded ||
          delimiterForTruncation.trim() !==
            delimiterAfterAttributeName.trim()) &&
        (isAttributeValueExcluded ||
          delimiterForTruncation.trim() !==
            delimiterAfterAttributeValue.trim()) &&
        (isAddInfoExcluded ||
          delimiterForTruncation.trim() !== delimiterAfterAddInfo.trim()) &&
        (isMFRNameExcluded ||
          delimiterForTruncation.trim() !== delimiterAfterMFRName.trim()) &&
        (isMFRPNExcluded ||
          delimiterForTruncation.trim() !== delimiterAfterMFRPN.trim())
      ) {
        isValidForm = false;
        formErrors["delimiterError"] =
          "When truncation type is meaningful, Delimiter for truncation character must be a character from one of the delimiter.";
      }
    }
    //#endregion

    if (descriptionToGenerate === "S" && characterLimit <= 0) {
      isValidForm = false;
      formErrors["CharacterLimitError"] =
        "Character limit is mandatory to generate short description";
    }

    //#region Order of data validations
    if (
      !selectedThirdOrderOfData ||
      !selectedFourthOrderOfData ||
      !selectedFifthOrderOfData
    ) {
      if (
        !isAttributeNameExcluded ||
        !isAttributeValueExcluded ||
        !isAddInfoExcluded ||
        !isMFRNameExcluded ||
        !isMFRPNExcluded
      ) {
        isValidForm = false;
        formErrors["orderOfDataError"] =
          "Please specify order of data in description";
      }
    }

    if (!isAttributeNameExcluded || !isAttributeValueExcluded) {
      if (
        selectedThirdOrderOfData !== "A" &&
        selectedFourthOrderOfData !== "A" &&
        selectedFifthOrderOfData !== "A"
      ) {
        isValidForm = false;
        formErrors["orderOfDataError"] =
          "'Attribute' order of data not specified in description";
      }
    }

    if (!isMFRNameExcluded || !isMFRPNExcluded) {
      if (
        selectedThirdOrderOfData !== "M" &&
        selectedFourthOrderOfData !== "M" &&
        selectedFifthOrderOfData !== "M"
      ) {
        isValidForm = false;
        formErrors["orderOfDataError"] =
          "'MFR Detail' order of data not specified in description";
      }
    }

    if (!isAddInfoExcluded) {
      if (
        selectedThirdOrderOfData !== "D" &&
        selectedFourthOrderOfData !== "D" &&
        selectedFifthOrderOfData !== "D"
      ) {
        isValidForm = false;
        formErrors["orderOfDataError"] =
          "'Additional Info' order of data not specified in description";
      }
    }

    if (
      !selectedThirdOrderOfData &&
      (selectedFourthOrderOfData || selectedFifthOrderOfData)
    ) {
      isValidForm = false;
      formErrors["orderOfDataError"] =
        "Third order of data not specified in description while having fourth or fifth";
    }

    if (!selectedFourthOrderOfData && selectedFifthOrderOfData) {
      isValidForm = false;
      formErrors["orderOfDataError"] =
        "Fourth order of data not specified in description while having fifth";
    }

    if (selectedThirdOrderOfData && selectedFourthOrderOfData) {
      if (selectedThirdOrderOfData === selectedFourthOrderOfData) {
        isValidForm = false;
        formErrors["orderOfDataError"] =
          "Third and Fourth order of data in description cannot be same";
      }
    }

    if (selectedFourthOrderOfData && selectedFifthOrderOfData) {
      if (selectedFourthOrderOfData === selectedFifthOrderOfData) {
        isValidForm = false;
        formErrors["orderOfDataError"] =
          "Fourth and Fifth order of data in description cannot be same";
      }
    }

    if (selectedThirdOrderOfData && selectedFifthOrderOfData) {
      if (selectedThirdOrderOfData === selectedFifthOrderOfData) {
        isValidForm = false;
        formErrors["orderOfDataError"] =
          "Third and Fifth order of data in description cannot be same";
      }
    }
    //#endregion

    setFormErrors(formErrors);
    return isValidForm;
  };
  //#endregion

  //#region Save Description Generator Settings
  const saveDescriptionGeneratorSettings = () => {
    let isValidForm = true;

    if (!newSettingName) {
      isValidForm = false;
      formErrors["newSettingNameError"] = "Setting Name is required";
      setFormErrors(formErrors);
      return isValidForm;
    }

    setSpinnerMessage("Please wait while saving settings...");
    setLoading(true);

    var data = {
      SettingName: newSettingName,
      SpecificModifierExcluded: specificModifierExcluded,
      UploadedAbbreviationFileName: uploadedAbbreviationFileName,
      AbbreviationFileName: abbreviationFileName,
      DelimiterAfterNoun: delimiterAfterNoun,
      DelimiterAfterModifier: delimiterAfterModifier,
      DelimiterAfterAttributeName: delimiterAfterAttributeName,
      DelimiterAfterAttributeValue: delimiterAfterAttributeValue,
      DelimiterAfterAdditionalInformation: delimiterAfterAddInfo,
      DelimiterAfterMFRName: delimiterAfterMFRName,
      DelimiterAfterMFRPartNo: delimiterAfterMFRPN,
      MultipleValuesSeparator: multipleValuesSeparator,
      UploadedIdentifierFileName: uploadedIdentifiersFileName,
      IdentifierFileName: identifiersFileName,
      PrefixForAdditionalInformation: prefixForAddInfo,
      PrefixForMFRName: prefixForMFRName,
      PrefixForMFRPartNo: prefixForMFRPN,
      DescriptionToGenerate: descriptionToGenerate,
      TruncationType: truncationType,
      DelimiterForTruncation: delimiterForTruncation,
      ThirdOrderOfDataInDescription: selectedThirdOrderOfData,
      FourthOrderOfDataInDescription: selectedFourthOrderOfData,
      FifthOrderOfDataInDescription: selectedFifthOrderOfData,
      IsNounExcluded: isNounExcluded,
      IsModifierExcluded: isModifierExcluded,
      IsAttributeNameExcluded: isAttributeNameExcluded,
      IsAttributeValueExcluded: isAttributeValueExcluded,
      IsAdditionalInformationExcluded: isAddInfoExcluded,
      IsMFRNameExcluded: isMFRNameExcluded,
      IsMFRPartNoExcluded: isMFRPNExcluded,
      IsToInterpretAdditionalInformation: isToInterpretAdditionalInformation,
      IsToInterpretAllAttributeValues: isToInterpretAllAttributeValues,
      IsToIncludeAttributeNameFromAdditionalInformation:
        isToIncludeAttributeNameFromAddInfo,
      IsToIncludeMaximumValues: isToIncludeMaxValues,
      IsNounToBeAbbreviated: isNounToBeAbbreviated,
      IsModifierToBeAbbreviated: isModifierToBeAbbreviated,
      IsAttributeNameToBeAbbreviated: isAttributeNameToBeAbbreviated,
      IsAttributeValueToBeAbbreviated: isAttributeValueToBeAbbreviated,
      IsAdditionalInformationToBeAbbreviated: isAddInfoToBeAbbreviated,
      IsMFRNameToBeAbbreviated: isMFRNameToBeAbbreviated,
      IsToApplyIdentifiers: isToApplyIdentifiers,
      IsToAddSpaceBeforeORAfterIdentifier:
        isToAddSpaceBetweenAttValueAndIdentifier,
      IsToApplyIdentifierToAdditionalInformation: isToApplyIdentifiersToAddInfo,
      IsToIncludeAttributeNameWithNULLValues:
        isToIncludeAttributeNameWithNULLValues,
      IsToIncludeAllOtherMFRNames: isToIncludeAllOtherMFRNames,
      IsToIncludeAllOtherMFRPartNos: isToIncludeAllOtherMFRPNs,
      IsToPrefixAllMFRNames: isToPrefixAllMFRNames,
      IsToPrefixAllMFRPartNos: isToPrefixAllMFRPNs,
      CharacterLimit: characterLimit,
    };

    descriptionGeneratorService
      .saveDescriptionGeneratorSettings(data)
      .then((response) => {
        toast.success("Settings Saved Successfully...!");
        fetchSettingNames();
      })
      .catch((error) => {
        let errorMessage = error.response.data.Message;
        toast.error(errorMessage);
      });

    setShowSettingModal(false);
    setLoading(false);
  };
  //#endregion

  //#region Handle Setting Modal Show
  const handleSettingModalShow = () => {
    if (handleFormValidation()) {
      formErrors["newSettingNameError"] = "";
      setFormErrors(formErrors);
      setShowSettingModal(true);
    }
  };
  //#endregion

  //#region Refresh Page
  const refreshPage = () => {
    setLoading(false);
    setSpinnerMessage("");
    setSelectedSettingName("");
    setUploadedInputFileName("");
    setInputFileName("");
    setInputFileKey(Date.now());
    setUploadedAbbreviationFileName("");
    setAbbreviationFileName("");
    setAbbreviationFileKey(Date.now());
    setUploadedIdentifiersFileName("");
    setIdentifiersFileName("");
    setIdentifiersFileKey(Date.now());
    setIsNounExcluded(false);
    setIsModifierExcluded(false);
    setIsAttributeNameExcluded(true);
    setIsAttributeValueExcluded(false);
    setIsAddInfoExcluded(false);
    setIsMFRNameExcluded(false);
    setIsMFRPNExcluded(false);
    setIsToInterpretAdditionalInformation(true);
    setIsToIncludeAttributeNameFromAddInfo(false);
    setIsToIncludeMaxValues(true);
    setIsToInterpretAllAttributeValues(true);

    setIsNounToBeAbbreviated(false);
    setIsModifierToBeAbbreviated(false);
    setIsAttributeNameToBeAbbreviated(false);
    setIsAttributeValueToBeAbbreviated(true);
    setIsAddInfoToBeAbbreviated(false);
    setIsMFRNameToBeAbbreviated(false);

    setDelimiterAfterNoun(", ");
    setDelimiterAfterModifier(", ");
    setDelimiterAfterAttributeName(": ");
    setDelimiterAfterAttributeValue("; ");
    setDelimiterAfterAddInfo(", ");
    setDelimiterAfterMFRName(", ");
    setDelimiterAfterMFRPN(", ");
    setMultipleValuesSeparator(",");

    setShowDelAfterNounModal(false);
    setShowDelAfterModifierModal(false);
    setShowDelAfterAttributeNameModal(false);
    setShowDelAfterAttributeValueModal(false);
    setShowDelAfterAdditionalInfoModal(false);
    setShowDelAfterMFRNameModal(false);
    setShowDelAfterMFRPNModal(false);
    setShowMultipleValuesSeparatorModal(false);

    setIsToApplyIdentifiers(false);
    setIsToApplyIdentifiersToAttValue(true);
    setIsToAddSpaceBetweenAttValueAndIdentifier(true);
    setIsToApplyIdentifiersToAddInfo(true);

    setPrefixForAddInfo("");
    setPrefixForMFRName("");
    setPrefixForMFRPN("");

    setIsToIncludeAttributeNameWithNULLValues(false);
    setIsToIncludeAllOtherMFRNames(false);
    setIsToIncludeAllOtherMFRPNs(false);
    setIsToPrefixAllMFRNames(false);
    setIsToPrefixAllMFRPNs(false);

    setDescriptionToGenerate("S");
    setTruncationType("M");
    setCharacterLimit(40);
    setDelimiterForTruncation(";");

    setFirstOrderLabel("First: Noun");
    setSecondOrderLabel("Second: Modifier");
    setThirdOrderLabel("Third");
    setFourthOrderLabel("Fourth");
    setFifthOrderLabel("Fifth");

    setSelectedThirdOrderOfData("A");
    setSelectedFourthOrderOfData("D");
    setSelectedFifthOrderOfData("M");

    setErrorMessage("");
    setSuccessMessage("");
    setFormErrors({});

    setShowSettingModal(false);
    setNewSettingName("");

    setShowDelAfterNounModal(false);
    setShowDelAfterModifierModal(false);
    setShowDelAfterAttributeNameModal(false);
    setShowDelAfterAttributeValueModal(false);
    setShowDelAfterAdditionalInfoModal(false);
    setShowDelAfterMFRNameModal(false);
    setShowDelAfterMFRPNModal(false);
    setShowMultipleValuesSeparatorModal(false);

    disableAllControls(false);

    setShowModal(false);
    setInputFileValidationStatus("pending");
    setAbbreviationFileValidationStatus("pending");
    setIdentifiersFileValidationStatus("pending");
    setGenerateDescriptionStatus("pending");
    setDownloadingStatus("pending");

    setShowCloseButton(false);
  };
  //#endregion

  const onChangeLongDescriptionToGenerate = (e) => {
    setDescriptionToGenerate(e.target.value);
  };

  //#region main return
  return (
    <div className="mg-l-10 container-fluid " style={{ width: "100%" }}>
      <h4>Description Generator</h4>
      <div className="p-3 border rounded bg-white">
        <LoadingOverlay
          active={loading}
          className="custom-loader"
          spinner={
            <div className="spinner-background text-center">
              <BarLoader
                css={helper.getcss()}
                color={"#38D643"}
                width={"100%"}
                height={"10px"}
                speedMultiplier={0.3}
              />
              <p className="mt-2 text-dark">{spinnerMessage}</p>
            </div>
          }
        >
          <div className="p-3 border rounded bg-white ml-1">
            <Row>
              <Col xs={12} md={3}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>Setting &nbsp;</div>
                  <div>
                    <select
                      className="form-control"
                      style={{ width: "200px" }}
                      id="settingName"
                      name="settingName"
                      value={selectedSettingName}
                      onChange={onChangeSettingName}
                    >
                      <option value="">--Select option--</option>
                      {settingNames.map((settingName) => (
                        <option key={settingName}>{settingName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Col>

              <Col xs={12} md={5}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    Select Input File <span className="text-danger">*</span>
                  </div>
                  <div>
                    <input
                      type="file"
                      className="form-control"
                      tabIndex="15"
                      id="InputFile"
                      name="InputFile"
                      accept=".xlsx"
                      style={{ width: "400px" }}
                      key={inputFileKey}
                      onChange={uploadInputFile}
                      title="Upload the input file to be processed"
                    />
                    <div className="error-message">
                      {formErrors["inputFileError"]}
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} md={4}>
                <div className="mt-3">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>Download Templates:</div>
                    <div style={{ marginLeft: "8px" }}>
                      <Link
                        to="#/"
                        onClick={() =>
                          downloadFileTemplate("DGInputFileNewTemplate.xlsx")
                        }
                      >
                        Input File
                      </Link>
                    </div>
                    <div style={{ marginLeft: "30px" }}>
                      <Link
                        to="#/"
                        onClick={() =>
                          downloadFileTemplate(
                            "DGAbbreviationFileTemplate.xlsx",
                          )
                        }
                      >
                        Abbreviation File
                      </Link>
                    </div>
                    <div style={{ marginLeft: "30px" }}>
                      <Link
                        to="#/"
                        onClick={() =>
                          downloadFileTemplate("DGIdentifiersFileTemplate.xlsx")
                        }
                      >
                        Identifiers File
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col xs={12} md={9}>
                <div className="p-3 border rounded bg-white ml-1 mt-1">
                  <div className="container mt-3">
                    <div
                      className="row align-items-center mb-1"
                      style={{ height: "70px" }}
                    >
                      <div>Exclude:</div>
                      <div className="d-flex align-items-center pb-3 ml-5">
                        <label
                          className="switch"
                          title="If checked, excludes Noun while generating description"
                        >
                          <input
                            type="checkbox"
                            name="chkExcludeNoun"
                            id="chkExcludeNoun"
                            checked={isNounExcluded}
                            onChange={excludeNoun}
                            disabled={isExcludeNounDisabled}
                          />
                          <span className="slider"></span>
                        </label>
                        &nbsp; Noun
                      </div>
                      <div className="d-flex align-items-center pb-3 ml-5">
                        <label
                          className="switch"
                          title="if checked, excludes Modifier while generating description"
                        >
                          <input
                            type="checkbox"
                            name="chkExcludeModifier"
                            id="chkExcludeModifier"
                            checked={isModifierExcluded}
                            onChange={excludeModifier}
                            disabled={isExcludeModifierDisabled}
                          />
                          <span className="slider"></span>
                        </label>
                        &nbsp; Modifier
                      </div>
                      <div className="d-flex align-items-center pb-3 ml-5">
                        <label
                          className="switch"
                          title="if checked, excludes Attribute Name while generating description"
                        >
                          <input
                            type="checkbox"
                            name="chkExcludeAttributeName"
                            id="chkExcludeAttributeName"
                            checked={isAttributeNameExcluded}
                            onChange={excludeAttributeName}
                            disabled={isExcludeAttributeNameDisabled}
                          />
                          <span className="slider"></span>
                        </label>
                        &nbsp; Attribute Name
                      </div>
                      <div className="d-flex align-items-center pb-3 ml-5">
                        <label
                          className="switch"
                          title="if checked, excludes Attribute Value while generating description"
                        >
                          <input
                            type="checkbox"
                            name="chkExcludeAttributeValue"
                            id="chkExcludeAttributeValue"
                            checked={isAttributeValueExcluded}
                            onChange={excludeAttributeValue}
                            disabled={isExcludeAttributeValueDisabled}
                          />
                          <span className="slider"></span>
                        </label>
                        &nbsp; Attribute Value
                      </div>
                      <div className="d-flex align-items-center pb-3 ml-5">
                        <label
                          className="switch"
                          title="if checked, excludes Additional Information while generating description"
                        >
                          <input
                            type="checkbox"
                            name="chkExcludeAddInfo"
                            id="chkExcludeAddInfo"
                            checked={isAddInfoExcluded}
                            onChange={excludeAddInfo}
                            disabled={isExcludeAddInfoDisabled}
                          />
                          <span className="slider"></span>
                        </label>
                        &nbsp; Additional Information
                      </div>
                      <div
                        className="row"
                        style={{
                          marginTop: "5px",
                          marginLeft: "60px",
                        }}
                      >
                        {!isModifierExcluded && (
                          <>
                            <div className="col-auto">
                              <label htmlFor="modifierInput">Modifier</label>
                            </div>
                            <div>
                              <input
                                type="text"
                                id="specificModifierExcluded"
                                value={specificModifierExcluded}
                                onChange={(e) =>
                                  setSpecificModifierExcluded(e.target.value)
                                }
                                disabled={isExcludeSpecificModifierDisabled}
                                title="Enter the modifier text to be replaced with blank/empty e.g. 'NONE' will be replaced by blank/empty"
                              />
                            </div>
                          </>
                        )}

                        <div className="d-flex align-items-center pb-3 ml-4">
                          <label
                            className="switch me-2"
                            title="if checked, excludes Manufacturer Name while generating description"
                          >
                            <input
                              type="checkbox"
                              name="chkExcludeMFRName"
                              id="chkExcludeMFRName"
                              checked={isMFRNameExcluded}
                              onChange={excludeMFRName}
                              disabled={isExcludeMFRNameDisabled}
                            />
                            <span className="slider"></span>
                          </label>
                          <span>&nbsp; MFR Name</span>
                        </div>

                        <div className="d-flex align-items-center pb-3 pl-3">
                          <label
                            className="switch me-2"
                            title="if checked, excludes Manufacturer Part No. while generating description"
                          >
                            <input
                              type="checkbox"
                              name="chkExcludeMFRPN"
                              id="chkExcludeMFRPN"
                              checked={isMFRPNExcluded}
                              onChange={excludeMFRPN}
                              disabled={isExcludeMFRPNDisabled}
                            />
                            <span className="slider"></span>
                          </label>
                          <span>&nbsp; MFR Part No.</span>
                        </div>
                      </div>
                    </div>
                    <div className="error-message">
                      {formErrors["allColumnsExcludedError"]}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={3}>
                <div className="p-3 border rounded bg-white mt-1">
                  <div className="mb-3" style={{ height: "75px" }}>
                    {!isAddInfoExcluded && (
                      <div style={{ marginLeft: "10px" }}>
                        <label
                          className="switch"
                          title="if checked, includes and applies rules to Additional Info. while generating description"
                        >
                          <input
                            type="checkbox"
                            name="chkInterpretAdditionalInformation"
                            id="chkInterpretAdditionalInformation"
                            checked={isToInterpretAdditionalInformation}
                            onChange={(e) =>
                              setIsToInterpretAdditionalInformation(
                                e.target.checked,
                              )
                            }
                            disabled={isToInterpretAddInfoDisabled}
                          />
                          <span className="slider"></span>
                        </label>
                        <span>&nbsp; Interpret Additional Information</span>
                      </div>
                    )}
                    {!(isAttributeNameExcluded || isAddInfoExcluded) && (
                      <div style={{ marginLeft: "10px" }}>
                        <label
                          className="switch"
                          title="if checked, includes attribute name from additional information in generated description"
                        >
                          <input
                            type="checkbox"
                            name="chkIncludeAttributeNameFromAddInfo"
                            id="chkIncludeAttributeNameFromAddInfo"
                            checked={isToIncludeAttributeNameFromAddInfo}
                            onChange={(e) =>
                              setIsToIncludeAttributeNameFromAddInfo(
                                e.target.checked,
                              )
                            }
                            disabled={isToIncludeAttNameFromAddInfoDisabled}
                          />
                          <span className="slider"></span>
                        </label>
                        <span>
                          &nbsp; Include Attribute Name from Add. Info
                        </span>
                      </div>
                    )}
                    {!isAttributeValueExcluded &&
                      descriptionToGenerate === "S" && (
                        <div style={{ marginLeft: "10px" }}>
                          <label
                            className="switch"
                            title="if checked, includes maximum values to fit into description in the specified character limit"
                          >
                            <input
                              type="checkbox"
                              name="chkIncludeMaxValues"
                              id="chkIncludeMaxValues"
                              checked={isToIncludeMaxValues}
                              onChange={(e) =>
                                setIsToIncludeMaxValues(e.target.checked)
                              }
                              disabled={isToIncludeMaxValuesDisabled}
                            />
                            <span className="slider"></span>
                          </label>
                          <span>&nbsp; Include maximum values</span>
                        </div>
                      )}

                    {!isAttributeValueExcluded &&
                      descriptionToGenerate === "S" && (
                        <div style={{ marginLeft: "10px" }}>
                          <label
                            className="switch"
                            title="if checked, interprets All attribute values to fit into description in the specified character limit"
                          >
                            <input
                              type="checkbox"
                              name="chkInterpretAllAttributeValues"
                              id="chkInterpretAllAttributeValues"
                              checked={isToInterpretAllAttributeValues}
                              onChange={(e) =>
                                setIsToInterpretAllAttributeValues(
                                  e.target.checked,
                                )
                              }
                              disabled={isToInterpretAllAttributeValuesDisabled}
                            />
                            <span className="slider"></span>
                          </label>
                          <span>&nbsp; Interpret All Attribute Values</span>
                        </div>
                      )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="p-3 border rounded bg-white ml-1 mt-1">
            <div className="row align-items-center">
              <div
                className="col-auto"
                title="Abbreviations to be applied for included columns"
              >
                Abbreviation:
              </div>
              {!isNounExcluded && (
                <div className="d-flex align-items-center ml-2">
                  <label
                    className="switch"
                    title="if checked, abbreviates Noun"
                  >
                    <input
                      type="checkbox"
                      name="chkNounAbbreviation"
                      id="chkNounAbbreviation"
                      checked={isNounToBeAbbreviated}
                      onChange={onChangeNounToBeAbbreviated}
                      disabled={isNounToBeAbbreviatedDisabled}
                    />
                    <span className="slider"></span>
                  </label>
                  &nbsp; Noun
                </div>
              )}
              {!isModifierExcluded && (
                <div className="d-flex align-items-center ml-3">
                  <label
                    className="switch"
                    title="if checked, abbreviates Modifier"
                  >
                    <input
                      type="checkbox"
                      name="chkModifierAbbreviation"
                      id="chkModifierAbbreviation"
                      checked={isModifierToBeAbbreviated}
                      onChange={onChangeModifierToBeAbbreviated}
                      disabled={isModifierToBeAbbreviatedDisabled}
                    />
                    <span className="slider"></span>
                  </label>
                  &nbsp; Modifier
                </div>
              )}
              {!isAttributeNameExcluded && (
                <div className="d-flex align-items-center ml-3">
                  <label
                    className="switch"
                    title="if checked, abbreviates Attribute Name"
                  >
                    <input
                      type="checkbox"
                      name="chkAttributeNameAbbreviation"
                      id="chkAttributeNameAbbreviation"
                      checked={isAttributeNameToBeAbbreviated}
                      onChange={onChangeAttNameToBeAbbreviated}
                      disabled={isAttNameToBeAbbreviatedDisabled}
                    />
                    <span className="slider"></span>
                  </label>
                  &nbsp; Attribute Name
                </div>
              )}
              {!isAttributeValueExcluded && (
                <div className="d-flex align-items-center ml-3">
                  <label
                    className="switch"
                    title="if checked, abbreviates Attribute Value"
                  >
                    <input
                      type="checkbox"
                      name="chkAttributeValueAbbreviation"
                      id="chkAttributeValueAbbreviation"
                      checked={isAttributeValueToBeAbbreviated}
                      onChange={onChangeAttValueToBeAbbreviated}
                      disabled={isAttValueToBeAbbreviatedDisabled}
                    />
                    <span className="slider"></span>
                  </label>
                  &nbsp; Attribute Value
                </div>
              )}
              {!isAddInfoExcluded && (
                <div className="d-flex align-items-center ml-3">
                  <label
                    className="switch"
                    title="if checked, abbreviates Additional Information"
                  >
                    <input
                      type="checkbox"
                      name="chkAddInfoAbbreviation"
                      id="chkAddInfoAbbreviation"
                      checked={isAddInfoToBeAbbreviated}
                      onChange={onChangeAddInfoToBeAbbreviated}
                      disabled={isAddInfoToBeAbbreviatedDisabled}
                    />
                    <span className="slider"></span>
                  </label>
                  &nbsp; Additional Information
                </div>
              )}
              {!isMFRNameExcluded && (
                <div className="d-flex align-items-center ml-3">
                  <label
                    className="switch"
                    title="if checked, abbreviates Manufacturer Name"
                  >
                    <input
                      type="checkbox"
                      name="chkMFRNameAbbreviation"
                      id="chkMFRNameAbbreviation"
                      checked={isMFRNameToBeAbbreviated}
                      onChange={onChangeMFRNameToBeAbbreviated}
                      disabled={isMFRNameToBeAbbreviatedDisabled}
                    />
                    <span className="slider"></span>
                  </label>
                  &nbsp; MFR Name
                </div>
              )}
              <div className="d-flex align-items-center ml-3">
                &nbsp; Select Abbreviation File{" "}
              </div>
              <div className="ml-2" style={{ width: "240px" }}>
                <div>
                  <input
                    type="file"
                    className="form-control"
                    tabIndex="15"
                    id="AbbreviationFile"
                    name="AbbreviationFile"
                    accept=".xlsx"
                    style={{ width: "245px" }}
                    key={abbreviationFileKey}
                    onChange={uploadAbbreviationFile}
                    disabled={isAbbreviationFileUploadDisabled}
                    title="Upload file containing Abbreviations in the format of Abbreviations file template"
                  />
                </div>
                <div className="error-message">
                  {formErrors["abbreviationFileError"]}
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 border rounded bg-white ml-1 mt-1">
            <div
              className="row align-items-center mb-1"
              style={{ height: "20px" }}
            >
              <div
                className="col-auto"
                title="Delimiter to be applied after a column value"
              >
                Delimiter:
              </div>
              {!isNounExcluded && (
                <div style={{ marginLeft: "20px" }}>
                  Noun
                  <input
                    type="text"
                    id="delimiterAfterNoun"
                    value={delimiterAfterNoun}
                    style={{ width: "25px", marginLeft: "5px" }}
                    maxLength="2"
                    onChange={handleDelimiterAfterNoun}
                    disabled={isDelimiterAfterNounDisabled}
                    title="Delimiter to be applied after a Noun"
                  />
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={handleShowDelAfterNoun}
                    className="quest-mark-img"
                  />
                </div>
              )}
              {!isModifierExcluded && (
                <div style={{ marginLeft: "20px" }}>
                  Modifier
                  <input
                    type="text"
                    id="delimiterAfterModifier"
                    value={delimiterAfterModifier}
                    style={{ width: "25px", marginLeft: "5px" }}
                    maxLength="2"
                    onChange={handleDelimiterAfterModifier}
                    disabled={isDelimiterAfterModifierDisabled}
                    title="Delimiter to be applied after a modifier"
                  />
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={handleShowDelAfterModifier}
                    className="quest-mark-img"
                  />
                </div>
              )}
              {!isAttributeNameExcluded && (
                <div style={{ marginLeft: "20px" }}>
                  Attribute Name
                  <input
                    type="text"
                    id="delimiterAfterAttributeName"
                    value={delimiterAfterAttributeName}
                    style={{ width: "25px", marginLeft: "5px" }}
                    maxLength="2"
                    onChange={handleDelimiterAfterAttributeName}
                    disabled={isDelimiterAfterAttNameDisabled}
                    title="Delimiter to be applied after a attribute name"
                  />
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={handleShowDelAfterAttributeName}
                    className="quest-mark-img"
                  />
                </div>
              )}
              {!isAttributeValueExcluded && (
                <div style={{ marginLeft: "20px" }}>
                  Attribute Value
                  <input
                    type="text"
                    id="delimiterAfterAttributeValue"
                    value={delimiterAfterAttributeValue}
                    style={{ width: "25px", marginLeft: "5px" }}
                    maxLength="2"
                    onChange={handleDelimiterAfterAttributeValue}
                    disabled={isDelimiterAfterAttValueDisabled}
                    title="Delimiter to be applied after a attribute value"
                  />
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={handleShowDelAfterAttributeValue}
                    className="quest-mark-img"
                  />
                </div>
              )}
              {!isAddInfoExcluded && (
                <div style={{ marginLeft: "20px" }}>
                  Additional Info
                  <input
                    type="text"
                    id="delimiterAfterAttributeValue"
                    value={delimiterAfterAddInfo}
                    maxLength="2"
                    onChange={handleDelimiterAfterAddInfo}
                    style={{
                      marginLeft: "5px",
                      width: "25px",
                      height: "22px",
                      cursor: "pointer",
                      border: "1px solid #ccc",
                    }}
                    disabled={isDelimiterAfterAddInfoDisabled}
                    title="Delimiter to be applied after additional info"
                  />
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={handleShowDelAfterAdditionalInfo}
                    className="quest-mark-img"
                  />
                </div>
              )}
              {!isMFRNameExcluded && (
                <div style={{ marginLeft: "20px" }}>
                  MFR Name
                  <input
                    type="text"
                    id="delimiterAfterMFRName"
                    value={delimiterAfterMFRName}
                    maxLength="2"
                    onChange={handleDelimiterAfterMFRName}
                    style={{ width: "25px", marginLeft: "5px" }}
                    disabled={isDelimiterAfterMFRNameDisabled}
                    title="Delimiter to be applied after Mfr. Name"
                  />
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={handleShowDelAfterMFRName}
                    className="quest-mark-img"
                  />
                </div>
              )}
              {!isMFRPNExcluded && (
                <div style={{ marginLeft: "20px" }}>
                  MFR P/N.
                  <input
                    type="text"
                    id="delimiterAfterMFRPN"
                    value={delimiterAfterMFRPN}
                    maxLength="2"
                    onChange={handleDelimiterAfterMFRPN}
                    style={{ width: "25px", marginLeft: "5px" }}
                    disabled={isDelimiterAfterMFRPNDisabled}
                    title="Delimiter to be applied after Mfr. Part No."
                  />
                  <img
                    src={LatQueImg}
                    alt="query-img"
                    onClick={handleShowDelAfterMFRPN}
                    className="quest-mark-img"
                  />
                </div>
              )}
              {/* {isAttributeNameExcluded && ( */}
              <div style={{ marginLeft: "20px" }}>
                Multiple Values Separator
                <input
                  type="text"
                  id="multipleValuesSeparator"
                  value={multipleValuesSeparator}
                  maxLength="1"
                  onChange={handleMultipleValuesSeparator}
                  style={{ width: "25px", marginLeft: "5px" }}
                  disabled={isMultipleValuesSeparatorDisabled}
                  title="Separator between multiple values of same attribute"
                />
                <img
                  src={LatQueImg}
                  alt="query-img"
                  onClick={handleShowMultipleValuesSeparator}
                  className="quest-mark-img"
                />
              </div>
              {/* )} */}
            </div>
            <div className="error-message" style={{ marginLeft: "300px" }}>
              {formErrors["delimiterError"]}
            </div>
          </div>
          <div className="p-3 border rounded bg-white ml-1 mt-1">
            <div
              className="row align-items-center mb-1"
              style={{ height: "35px" }}
            >
              <div className="col-auto">Identifiers:</div>
              {!isAttributeValueExcluded && (
                <>
                  <div style={{ marginLeft: "20px" }}>
                    <label
                      className="switch"
                      title="Identifiers to be applied with a suffix/prefix to the attribute values"
                    >
                      <input
                        type="checkbox"
                        name="chkApplyIdentifiers"
                        id="chkApplyIdentifiers"
                        checked={isToApplyIdentifiers}
                        onChange={(e) =>
                          setIsToApplyIdentifiers(e.target.checked)
                        }
                        disabled={isToApplyIdentifiersDisabled}
                      />
                      <span className="slider"></span>
                    </label>
                    <span>&nbsp; Apply Identifiers</span>
                  </div>

                  {/* Show below section only if isToApplyIdentifiers is true */}
                  {isToApplyIdentifiers && (
                    <>
                      <div style={{ marginLeft: "20px" }}>
                        <span>&nbsp; Select Identifiers File:</span>
                        <span className="text-danger ms-1"> *</span>
                      </div>
                      <div
                        style={{
                          marginLeft: "20px",
                          width: "20%",
                        }}
                      >
                        <input
                          type="file"
                          className="form-control"
                          tabIndex="15"
                          id="IdentifiersFile"
                          name="IdentifiersFile"
                          accept=".xlsx"
                          style={{ width: "305px" }}
                          key={identifiersFileKey}
                          onChange={uploadIdentifiersFile}
                          disabled={isIdentifiersFileUploadDisabled}
                          title="Upload file containing Identifiers in the format of template"
                        />
                        <div className="error-message">
                          {formErrors["identifiersFileError"]}
                        </div>
                      </div>

                      <div style={{ marginLeft: "70px" }}>
                        <label
                          className="switch"
                          title="if checked, applies identifiers with suffix/prefix to attribute values"
                        >
                          <input
                            type="checkbox"
                            name="chkApplyIdentifiersToAttValue"
                            id="chkApplyIdentifiersToAttValue"
                            checked={isToApplyIdentifiersToAttValue}
                            disabled={true}
                            onChange={(e) =>
                              setIsToApplyIdentifiersToAttValue(
                                e.target.checked,
                              )
                            }
                          />
                          <span className="slider"></span>
                        </label>
                        &nbsp; Attribute Value
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <label
                          className="switch"
                          title="if checked, adds a space between attribute value and identifier."
                        >
                          <input
                            type="checkbox"
                            name="chkAddSpaceBetweenIdentifierAndAttValue"
                            id="chkAddSpaceBetweenIdentifierAndAttValue"
                            checked={isToAddSpaceBetweenAttValueAndIdentifier}
                            onChange={(e) =>
                              setIsToAddSpaceBetweenAttValueAndIdentifier(
                                e.target.checked,
                              )
                            }
                            disabled={
                              isToAddSpaceBeforeOrAfterIdentifierDisabled
                            }
                          />
                          <span className="slider"></span>
                        </label>
                        &nbsp; Add Space
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <label
                          className="switch"
                          title="if checked, applies identifiers with suffix/prefix to additional information attributes/values"
                        >
                          <input
                            type="checkbox"
                            name="chkApplyIdentifiersToAddInfo"
                            id="chkApplyIdentifiersToAddInfo"
                            checked={isToApplyIdentifiersToAddInfo}
                            onChange={(e) =>
                              setIsToApplyIdentifiersToAddInfo(e.target.checked)
                            }
                            disabled={isToApplyIdentifiersToAddInfoDisabled}
                          />
                          <span className="slider"></span>
                        </label>
                        &nbsp; Additional Information
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="p-3 border rounded bg-white ml-1 mt-1">
            <div
              className="row align-items-center mb-1"
              style={{ height: "20px" }}
            >
              <div
                className="col-auto"
                title="Prefix to be applied before a column value"
              >
                Prefix:
              </div>
              {!isAddInfoExcluded && (
                <>
                  <div className="col-auto">
                    <label htmlFor="modifierInput">
                      Additional Information:
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="prefixAddInfo"
                      value={prefixForAddInfo}
                      onChange={onChangeAddInfoPrefix}
                      disabled={isPrefixToAddInfoDisabled}
                      title="Prefix to be applied before additional info. column value e.g. Addl Info:"
                    />
                  </div>
                  <div className="error-message">
                    &nbsp; {formErrors["AddInfoPrefixError"]}
                  </div>
                </>
              )}
              {!isMFRNameExcluded && (
                <>
                  <div className="col-auto" style={{ marginLeft: "150px" }}>
                    <label htmlFor="modifierInput">MFR Name:</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="prefixMFRName"
                      value={prefixForMFRName}
                      onChange={onChangeMFRNamePrefix}
                      disabled={isPrefixToMFRNameDisabled}
                      title="Prefix to be applied before MFR. Name column value e.g. MFR:"
                    />
                  </div>
                </>
              )}
              <div className="error-message">
                &nbsp; {formErrors["MFRNamePrefixError"]}
              </div>
              {!isMFRPNExcluded && (
                <>
                  <div className="col-auto" style={{ marginLeft: "150px" }}>
                    <label htmlFor="modifierInput">MFR P/N:</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      id="prefixMFRPN"
                      value={prefixForMFRPN}
                      onChange={onChangeMFRPNPrefix}
                      disabled={isPrefixToMFRPNDisabled}
                      title="Prefix to be applied before MFR. Part No. column value e.g. MFR P/N:"
                    />
                  </div>
                </>
              )}
              <div className="error-message">
                &nbsp; {formErrors["MFRPNPrefixError"]}
              </div>
            </div>
          </div>
          <div className="p-3 border rounded bg-white ml-1 mt-1">
            <div
              className="row align-items-center mb-1"
              style={{ height: "10px" }}
            >
              {!(isAttributeNameExcluded || isAttributeValueExcluded) && (
                <div style={{ marginLeft: "30px" }}>
                  <div className="d-flex align-items-center">
                    <label
                      className="switch"
                      title="Include Attribute Name even if it's value is null?"
                    >
                      <input
                        type="checkbox"
                        name="chkIncludeAttributeNameWithNULLValues"
                        id="chkIncludeAttributeNameWithNULLValues"
                        checked={isToIncludeAttributeNameWithNULLValues}
                        onChange={(e) =>
                          setIsToIncludeAttributeNameWithNULLValues(
                            e.target.checked,
                          )
                        }
                        disabled={isToIncludeAttNameWithNULLValuesDisabled}
                      />
                      <span className="slider"></span>
                    </label>
                    &nbsp; Include Attribute Name with null values
                  </div>
                </div>
              )}
              {!isMFRNameExcluded && (
                <div style={{ marginLeft: "50px" }}>
                  <div className="d-flex align-items-center">
                    <label className="switch" title="Include all 10 MFR Names?">
                      <input
                        type="checkbox"
                        name="chkIncludeAllOtherMFRNames"
                        id="chkIncludeAllOtherMFRNames"
                        checked={isToIncludeAllOtherMFRNames}
                        onChange={(e) =>
                          setIsToIncludeAllOtherMFRNames(e.target.checked)
                        }
                        disabled={isToIncludeAllOtherMFRNamesDisabled}
                      />
                      <span className="slider"></span>
                    </label>
                    &nbsp; Include all other MFR Names
                  </div>
                </div>
              )}
              {!isMFRPNExcluded && (
                <div style={{ marginLeft: "60px" }}>
                  <div className="d-flex align-items-center">
                    <label
                      className="switch"
                      title="Include all 10 MFR Part Nos.?"
                    >
                      <input
                        type="checkbox"
                        name="chkIncludeAllOtherMFRPNs"
                        id="chkIncludeAllOtherMFRPNs"
                        checked={isToIncludeAllOtherMFRPNs}
                        onChange={(e) =>
                          setIsToIncludeAllOtherMFRPNs(e.target.checked)
                        }
                        disabled={isToIncludeAllOtherMFRPNsDisabled}
                      />
                      <span className="slider"></span>
                    </label>
                    &nbsp; Include all other MFR Part Nos.
                  </div>
                </div>
              )}
              {!isMFRNameExcluded && (
                <div style={{ marginLeft: "60px" }}>
                  <div className="d-flex align-items-center">
                    <label className="switch" title="Prefix All MFR Names?">
                      <input
                        type="checkbox"
                        name="chkPrefixAllMFRNames"
                        id="chkPrefixAllMFRNames"
                        checked={isToPrefixAllMFRNames}
                        onChange={(e) =>
                          setIsToPrefixAllMFRNames(e.target.checked)
                        }
                        disabled={isToPrefixAllMFRNamesDisabled}
                      />
                      <span className="slider"></span>
                    </label>
                    &nbsp; Prefix All MFR Names
                  </div>
                </div>
              )}
              {!isMFRPNExcluded && (
                <div style={{ marginLeft: "60px" }}>
                  <div className="d-flex align-items-center">
                    <label className="switch" title="Prefix All MFR Part Nos.?">
                      <input
                        type="checkbox"
                        name="chkPrefixAllMFRPNs"
                        id="chkPrefixAllMFRPNs"
                        checked={isToPrefixAllMFRPNs}
                        onChange={(e) =>
                          setIsToPrefixAllMFRPNs(e.target.checked)
                        }
                        disabled={isToPrefixAllMFRPNsDisabled}
                      />
                      <span className="slider"></span>
                    </label>
                    &nbsp; Prefix All MFR Part Nos.
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-3 border rounded bg-white ml-1 mt-1">
            <div
              className="row align-items-center mb-1"
              style={{ height: "10px" }}
            >
              <div style={{ marginLeft: "20px" }}>
                <label htmlFor="noun">Description To Generate:</label>
              </div>
              <div style={{ marginLeft: "30px" }}>
                <input
                  type="radio"
                  name="group1"
                  id="radio-short"
                  value="S"
                  checked={descriptionToGenerate === "S"}
                  onChange={(e) => setDescriptionToGenerate(e.target.value)}
                  disabled={isDescriptionToGenerateDisabled}
                  title="Generate Short Description"
                />
                <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                  Short
                </label>
              </div>
              <div style={{ marginLeft: "30px" }}>
                <input
                  type="radio"
                  name="group1"
                  id="radio-long"
                  value="L"
                  checked={descriptionToGenerate === "L"}
                  onChange={onChangeLongDescriptionToGenerate}
                  disabled={isDescriptionToGenerateDisabled}
                  title="Generate long Description"
                />
                <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                  Long
                </label>
              </div>
              {descriptionToGenerate === "S" && (
                <>
                  <div style={{ marginLeft: "60px" }}>
                    <label htmlFor="noun">Truncation Type:</label>
                  </div>
                  <div style={{ marginLeft: "30px" }}>
                    <input
                      type="radio"
                      name="group2"
                      id="radio-meaningful"
                      value="M"
                      checked={truncationType === "M"}
                      onChange={onChangeTruncationType}
                      disabled={isTruncationTypeDisabled}
                      title="Meaningful truncation"
                    />
                    <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                      Meaningful
                    </label>
                  </div>
                  <div style={{ marginLeft: "30px" }}>
                    <input
                      type="radio"
                      name="group2"
                      id="radio-blind"
                      value="B"
                      checked={truncationType === "B"}
                      onChange={onChangeTruncationType}
                      disabled={isTruncationTypeDisabled}
                      title="Blind truncation"
                    />
                    <label htmlFor="noun" style={{ marginLeft: "5px" }}>
                      Blind
                    </label>
                  </div>
                  <div className="error-message">
                    &nbsp; {formErrors["TruncationTypeError"]}
                  </div>
                  <div style={{ marginLeft: "10px" }}>Character Limit:</div>
                  <div style={{ marginLeft: "10px" }}>
                    <input
                      type="number"
                      id="txtCharacterLimit"
                      min="0"
                      max="9999"
                      value={characterLimit}
                      onChange={onChangeCharacterLimit}
                      style={{ width: "35px", marginLeft: "5px" }}
                      disabled={isCharacterLimitDisabled}
                      title="Generated Description will be limited to these many characters."
                    />
                  </div>
                  <div className="error-message">
                    &nbsp; {formErrors["CharacterLimitError"]}
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    Delimiter for truncation:
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <input
                      type="text"
                      id="delimiterForTruncation"
                      maxLength="2"
                      value={delimiterForTruncation}
                      onChange={handleDelimiterForTruncation}
                      style={{ width: "35px", marginLeft: "10px" }}
                      disabled={isDelimiterForTruncationDisabled}
                      title="Generated Description will be cut at this character less than no. of characters limit."
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <Row>
              <Col xs={12} md={8}>
                <div
                  className="p-3 border rounded bg-white ml-1 mt-1"
                  style={{ height: "110px" }}
                >
                  <Row>
                    <Col>Order of data in description:</Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="mt-3">{firstOrderLabel}</div>
                    </Col>
                    <Col>
                      <div className="mt-3">{secondOrderLabel}</div>
                    </Col>
                    <Col>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div>{thirdOrderLabel}</div>
                        <div>
                          <select
                            className="form-control"
                            tabIndex="1"
                            name="Attribute"
                            style={{ width: "150px" }}
                            value={selectedThirdOrderOfData}
                            onChange={handleThirdOrderOfData}
                            disabled={isThirdOrderOfDataDisabled}
                            title="Order of data in generated description"
                          >
                            <option value="">--Select option--</option>
                            {orderOfDataOptions
                              .filter(
                                (opt) =>
                                  !(isAddInfoExcluded && opt.value === "D"),
                              )
                              .filter(
                                (opt) =>
                                  !(
                                    isAttributeNameExcluded &&
                                    isAttributeValueExcluded &&
                                    opt.value === "A"
                                  ),
                              )
                              .filter(
                                (opt) =>
                                  !(
                                    isMFRNameExcluded &&
                                    isMFRPNExcluded &&
                                    opt.value === "M"
                                  ),
                              )
                              .map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>{fourthOrderLabel}</div>
                        <div>
                          <select
                            className="form-control"
                            tabIndex="1"
                            name="Attribute"
                            style={{ width: "150px" }}
                            value={selectedFourthOrderOfData}
                            onChange={handleFourthOrderOfData}
                            disabled={isFourthOrderOfDataDisabled}
                            title="Order of data in generated description"
                          >
                            <option value="">--Select option--</option>
                            {orderOfDataOptions
                              .filter(
                                (opt) =>
                                  !(isAddInfoExcluded && opt.value === "D"),
                              )
                              .filter(
                                (opt) =>
                                  !(
                                    isAttributeNameExcluded &&
                                    isAttributeValueExcluded &&
                                    opt.value === "A"
                                  ),
                              )
                              .filter(
                                (opt) =>
                                  !(
                                    isMFRNameExcluded &&
                                    isMFRPNExcluded &&
                                    opt.value === "M"
                                  ),
                              )
                              .map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>{fifthOrderLabel}</div>
                        <div>
                          <select
                            className="form-control"
                            tabIndex="1"
                            name="Attribute"
                            style={{ width: "150px" }}
                            value={selectedFifthOrderOfData}
                            onChange={handleFifthOrderOfData}
                            disabled={isFifthOrderOfDataDisabled}
                            title="Order of data in generated description"
                          >
                            <option value="">--Select option--</option>
                            {orderOfDataOptions
                              .filter(
                                (opt) =>
                                  !(isAddInfoExcluded && opt.value === "D"),
                              )
                              .filter(
                                (opt) =>
                                  !(
                                    isAttributeNameExcluded &&
                                    isAttributeValueExcluded &&
                                    opt.value === "A"
                                  ),
                              )
                              .filter(
                                (opt) =>
                                  !(
                                    isMFRNameExcluded &&
                                    isMFRPNExcluded &&
                                    opt.value === "M"
                                  ),
                              )
                              .map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="error-message">
                        {formErrors["orderOfDataError"]}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={12} md={4}>
                <div className="p-3 border rounded bg-white mt-1 d-flex justify-content-center align-items-center">
                  <div className="mb-3" style={{ height: "70px" }}>
                    <div className="d-flex align-items-center gap-2">
                      {/* Validate and Generate Button */}
                      <button
                        type="button"
                        style={{ height: "80px", marginRight: "5px" }}
                        className="btn btn-gray-700"
                        onClick={validateAndGenerate}
                        title="Validates uploaded files and field values and if valid, starts generating description"
                      >
                        Validate and Generate
                      </button>

                      <div className="d-flex flex-column gap-2">
                        {/* Save Setting As Button */}
                        <button
                          type="button"
                          className="btn btn-gray-700"
                          style={{ marginBottom: "5px" }}
                          onClick={handleSettingModalShow}
                          disabled={isSaveSettingsAsDisabled}
                          title="Saves the setting of selected values"
                        >
                          Save Setting As..
                        </button>

                        {/* Reset Button */}
                        <button
                          type="button"
                          className="btn btn-gray-700"
                          onClick={refreshPage}
                          title="Refreshes the controls setting to default values"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </LoadingOverlay>
        {/* Delimiter after Noun Modal */}
        <Modal
          show={showDelAfterNounModal}
          onHide={handleCloseDelAfterNoun}
          size="sm"
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">Delimiter after Noun</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center fs-5">
            &lt;noun&gt;
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                margin: "0 6px",
              }}
            ></span>
            &lt;modifier&gt;
          </Modal.Body>
        </Modal>
        {/* Delimiter after Modifier Modal */}
        <Modal
          show={showDelAfterModifierModal}
          onHide={handleCloseDelAfterModifier}
          size="sm"
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">Delimiter after Modifier</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center fs-5">
            &lt;noun&gt;,&lt;modifier&gt;
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                margin: "0 6px",
              }}
            ></span>
            &lt;attribute name&gt;
          </Modal.Body>
        </Modal>
        {/* Delimiter After Attribute Name Modal  */}
        <Modal
          show={showDelAfterAttributeNameModal}
          onHide={handleCloseDelAfterAttributeName}
          size="sm"
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">
              Delimiter after Attribute Name
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center fs-5">
            &lt;noun&gt;,&lt;modifier&gt;:&lt;attribute name&gt;
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                margin: "0 6px",
              }}
            ></span>
            &lt;attribute value&gt;
          </Modal.Body>
        </Modal>
        {/* Delimiter After Attribute Value Modal */}
        <Modal
          show={showDelAfterAttributeValueModal}
          onHide={handleCloseDelAfterAttributeValue}
          size="sm"
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">
              Delimiter after Attribute Value
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center fs-5">
            &lt;attribute name1&gt;,&lt;attribute value1&gt;
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                margin: "0 6px",
              }}
            ></span>
            &lt;attribute name2&gt;
          </Modal.Body>
        </Modal>
        {/* Delimiter After Additional Info Modal  */}
        <Modal
          show={showDelAfterAdditionalInfoModal}
          onHide={handleCloseDelAfterAdditionalInfo}
          size="sm"
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">
              Delimiter after Additional Info.
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center fs-5">
            &lt;additional info&gt;
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                margin: "0 6px",
              }}
            ></span>
            &lt;mfr name&gt;
          </Modal.Body>
        </Modal>
        {/* Delimiter After MFR Name Modal */}
        <Modal
          show={showDelAfterMFRNameModal}
          onHide={handleCloseDelAfterMFRName}
          size="sm"
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">Delimiter after MFR Name</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center fs-5">
            &lt;mfr name&gt;
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                margin: "0 6px",
              }}
            ></span>
            &lt;mfr value&gt;
          </Modal.Body>
        </Modal>
        {/* Delimiter After MFR P/N Modal */}
        <Modal
          show={showDelAfterMFRPNModal}
          onHide={handleCloseDelAfterMFRPN}
          size="sm"
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">Delimiter after MFR P/N</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center fs-5">
            &lt;mfr part no.&gt;
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                margin: "0 6px",
              }}
            ></span>
          </Modal.Body>
        </Modal>
        {/* Multiple Values Separator Modal */}
        <Modal
          show={showMultipleValuesSeparatorModal}
          onHide={handleCloseMultipleValuesSeparator}
          size="sm"
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">
              Multiple Values Separator
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center fs-5">
            Noun, Modifier: Attribute Name: Value1
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundColor: "red",
                margin: "0 6px",
              }}
            ></span>
            Value2
          </Modal.Body>
        </Modal>
        {/* Save Setting Modal */}
        <Modal
          show={showSettingModal}
          onHide={handleSettingModalClose}
          centered
        >
          <Modal.Header closeButton className="py-2">
            <Modal.Title className="fs-6">Save Setting As</Modal.Title>
          </Modal.Header>

          <Modal.Body className="bg-light">
            <Form>
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="me-2 fw-semibold">
                  Setting Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  value={newSettingName}
                  onChange={(e) => setNewSettingName(e.target.value)}
                  placeholder="Enter setting name"
                  required
                />
                <span className="text-danger ms-1">*</span>
              </Form.Group>
              <div className="error-message">
                {formErrors["newSettingNameError"]}
              </div>
            </Form>

            <div className="d-flex justify-content-center gap-4">
              <Button
                className="mr-3"
                onClick={saveDescriptionGeneratorSettings}
              >
                Save
              </Button>
              <Button onClick={handleSettingModalClose}>Cancel</Button>
            </div>
          </Modal.Body>
        </Modal>
        {/* Validate and Generate Modal */}
        <Modal
          show={showModal}
          onHide={refreshPage}
          className="edit-gop-modal mymnmdl viewsug mrdictionary"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Validating and Processing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="mymdldata"
              style={{ paddingBottom: "0px", width: "100%" }}
            >
              <table className="table table-bordered">
                <tbody className="mrodicttblebdy">
                  {[
                    {
                      status: inputFileValidationStatus,
                      label: "Validating input file",
                    },
                    ...(isNounToBeAbbreviated ||
                    isModifierToBeAbbreviated ||
                    isAttributeNameToBeAbbreviated ||
                    isAttributeValueToBeAbbreviated ||
                    isAddInfoToBeAbbreviated ||
                    isMFRNameToBeAbbreviated
                      ? [
                          {
                            status: abbreviationFileValidationStatus,
                            label: "Validating abbreviation file",
                          },
                        ]
                      : []),
                    ...(isToApplyIdentifiers
                      ? [
                          {
                            status: identifiersFileValidationStatus,
                            label: "Validating identifiers file",
                          },
                        ]
                      : []),
                    {
                      status: generateDescriptionStatus,
                      label:
                        "Generating description and writing to the output file",
                    },
                    {
                      status: downloadingStatus,
                      label: "Downloading the output file",
                    },
                  ].map((item, index) => (
                    <tr className="txt-plce mrodictcnt mt-2 mb-2" key={index}>
                      <td
                        style={{
                          width: "25px",
                          textAlign: "center",
                          visibility: "hidden",
                        }}
                      >
                        {/* {processingStatus === "success" && ( */}
                        <img
                          src={checkmarkIcon}
                          alt="checkmark"
                          style={{ width: "23px", height: "23px" }}
                        />
                        {/* )} */}
                      </td>
                      <td style={{ width: "25px", textAlign: "center" }}>
                        {item.status === "loading" && (
                          <img
                            src={loaderIcon}
                            alt="loadericon"
                            style={{ width: "23px", height: "23px" }}
                          />
                        )}
                        {item.status === "success" && (
                          <img
                            src={checkmarkIcon}
                            alt="checkmark"
                            style={{ width: "23px", height: "23px" }}
                          />
                        )}
                        {item.status === "error" && (
                          <img
                            src={errorIcon}
                            alt="erroricon"
                            style={{ width: "23px", height: "23px" }}
                          />
                        )}
                        {item.status !== "success" &&
                          item.status !== "loading" &&
                          item.status !== "error" && (
                            <span className="reptimg">Pending</span>
                          )}
                      </td>
                      <td>
                        <b>
                          {index + 1}. {item.label}
                        </b>
                      </td>
                      <td
                        style={{
                          width: "25px",
                          textAlign: "center",
                          visibility: "hidden",
                        }}
                      >
                        {/* {processingStatus === "success" && ( */}
                        <img
                          src={checkmarkIcon}
                          alt="checkmark"
                          style={{ width: "23px", height: "23px" }}
                        />
                        {/* )} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className="insttxt">
                <b></b>
              </span>
              <div className="mt-2 mysgtdta successmsg">
                {(successMessage || errorMessage) && (
                  <div className="mt-2 mysgtdta successmsg">
                    {successMessage && (
                      <div className="alert alert-success">
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="mrodta alert alert-danger">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {showCloseButton && (
              <Button
                variant="secondary"
                onClick={refreshPage}
                className="vewsubmit-button"
              >
                <i className="fa fa-close mr-1"></i> Close
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
  //#endregion
}
