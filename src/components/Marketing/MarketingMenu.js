import React, { useState, useEffect } from "react";
import "./MarketingMenu.scss";
import "react-toastify/dist/ReactToastify.css";
import helper from "../../helpers/helpers";
import MarketingDocs from "./MarketingDocs";
import marketingDocsService from "../../services/marketingDocs.service";
import accessControlService from "../../services/accessControl.service";
import LatQueImg from "../../assets/icons/quest-icon.png";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
toast.configure();

export default function MarketingMenu() {
  const history = useHistory();
  const [canUserAccessMarketingModule, setCanUserAccessMarketingModule] =
    useState(false);

  //#region useEffect Hook
  useEffect(() => {
    if (!helper.getUser()) {
      history.push({ pathname: "/" });
      return;
    }
    checkUserAccessForPage("View Marketing Documents");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  //#region User Access For Page
  const checkUserAccessForPage = (pageName) => {
    accessControlService
      .CanUserAccessPage(helper.getUser(), pageName)
      .then((response) => {
        setCanUserAccessMarketingModule(response.data);
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  const AccordionItem = ({
    title,
    iconClass,
    subItems,
    isOpen,
    onToggle,
    onSelect,
  }) => {
    return (
      canUserAccessMarketingModule && (
        <div className="accordion-item">
          <div className="accordion-header" onClick={onToggle}>
            <div className="accordion-title">
              <i className={`fa ${iconClass}`}></i>
              <span>{title}</span>
            </div>
            <span className="accordion-toggle">{isOpen ? "−" : "+"}</span>
          </div>

          {isOpen && (
            <div className="accordion-content">
              <ul className="submenu">
                {subItems.map((sub, index) => (
                  <li
                    key={index}
                    className="submenu-item"
                    onClick={() => onSelect(sub.name, title)}
                  >
                    <i className={`fa ${sub.iconClass}`}></i>
                    <span>{sub.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    );
  };

  const [openItems, setOpenItems] = useState({});
  const [selectedComponent, setSelectedComponent] = useState("MarketingDocs"); // default component

  const items = [
    {
      id: 1,
      title: "Engineering",
      iconClass: "fa-file-alt1",
      subItems: [
        { name: "Proposals", iconClass: "fa-file-alt" },
        { name: "SOWs", iconClass: "fa-file-signature" },
        { name: "POCs", iconClass: "fa-clipboard-list" },
        { name: "NDAs", iconClass: "fa-file-contract" },
        { name: "Project Plans", iconClass: "fa-project-diagram" },
        { name: "Pricing Metrics", iconClass: "fa-tags" },
        { name: "Others", iconClass: "fa-ellipsis" },
      ],
    },
    {
      id: 2,
      title: "Healthcare",
      iconClass: "fa-dollar-sign1",
      subItems: [
        { name: "Proposals", iconClass: "fa-file-alt" },
        { name: "SOWs", iconClass: "fa-file-signature" },
        { name: "POCs", iconClass: "fa-clipboard-list" },
        { name: "NDAs", iconClass: "fa-file-contract" },
        { name: "Project Plans", iconClass: "fa-project-diagram" },
        { name: "Pricing Metrics", iconClass: "fa-tags" },
        { name: "Others", iconClass: "fa-ellipsis" },
      ],
    },
  ];

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelect = (componentName, domainName) => {
    setSelectedComponent({ name: componentName, domain: domainName });
  };

  // Render selected component on right side
  const renderComponent = () => {
    if (!selectedComponent)
      return <div className="content-box">Select a menu item on left.</div>;

    const { name, domain } = selectedComponent;

    switch (name) {
      case "Proposals":
        return <MarketingDocs domain={domain} docType={name} />;
      case "SOWs":
        return <MarketingDocs domain={domain} docType={name} />;
      case "POCs":
        return <MarketingDocs domain={domain} docType={name} />;
      case "NDAs":
        return <MarketingDocs domain={domain} docType={name} />;
      case "Project Plans":
        return <MarketingDocs domain={domain} docType={name} />;
      case "Pricing Metrics":
        return <MarketingDocs domain={domain} docType={name} />;
      case "Others":
        return <MarketingDocs domain={domain} docType={name} />;
      default:
        return <div className="content-box">Select a menu item on left.</div>;
    }
  };

  //#region  Download Marketing Help Guide
  const downloadMarketingHelpDocument = () => {
    marketingDocsService
      .downloadHelpDocument()
      .then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "UserGuide-Marketing.pptx");
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((e) => {
        toast.error(e.response.data.Message, { autoClose: false });
      });
  };
  //#endregion

  return (
    canUserAccessMarketingModule && (
      <div className="dashboard-container">
        <div
          className="accordion-panel"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px",
            width: "20%",
          }}
        >
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              title={item.title}
              iconClass={item.iconClass}
              subItems={item.subItems}
              isOpen={!!openItems[item.id]}
              onToggle={() => toggleItem(item.id)}
              onSelect={handleSelect}
            />
          ))}
          <div
            style={{
              paddingTop: "2%",
              paddingLeft: "55%",
              width: "2%",
            }}
          >
            <img
              src={LatQueImg}
              alt="query-img"
              onClick={downloadMarketingHelpDocument}
              className="mroDictionaryHelpImg"
            />
          </div>
        </div>

        <div className="content-panel">{renderComponent()}</div>
      </div>
    )
  );
}
