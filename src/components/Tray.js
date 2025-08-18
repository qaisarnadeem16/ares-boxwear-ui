import React, { useState } from "react";
import "./Tray.css";
import {
  DesignerHelper,
  DesignerSignature,
  DesignerLogo,
} from "./tray/DesignerHelper";
import {
  useZakeke,
} from "zakeke-configurator-react";

const Tray = ({ groupNameList, filteredAreas, toggleFunc, UpdateGroupId, updCurrentIndex, selectedTray, selectStepName }) => {
  const { addItemText, fonts, defaultColor, items, groups, translations } = useZakeke();
	const staticsVals = translations?.statics; 
  const dynamicsVals = translations?.dynamics; 
  
  const itemAvailable = items?.filter((item) => item.type === 0).length > 0;
  const tipIndex_ = groupNameList.findIndex(
    (x) => x.name.toUpperCase() === "OVERLAY TYPE"
  );

  if (items && !itemAvailable) {
      const tipIndex_ = groupNameList.findIndex(
        (x) => x.name === "OVERLAY TYPE"
      );
      if (tipIndex_ > 0) groupNameList.splice(tipIndex_, 1);
    }

    else {
      const checkIfNull = groupNameList.findIndex(
        (x) => x.name.toUpperCase() === "OVERLAY TYPE"                          
      );

      if (checkIfNull < 0) {
        const tipIndex_ = groups.findIndex(
          (x) => x.name.toUpperCase() === "OVERLAY TYPE"
        );
  
        const acopName = groups[tipIndex_];
      
        groupNameList.push({
          id: acopName.id,
          name: acopName.name,
          imageUrl: acopName.imageUrl,
  
        })

        // updCurrentIndex(tipIndex_);
      }

    }
  


  const templates = DesignerSignature();
  const templatesLogo = DesignerLogo();

  const handleMultipleClicks = (event) => {
    UpdateGroupId(event.target.id, "colors");
    toggleFunc("colors");
  };

  const handleTextItem = (actualAreaId) => {
    const itemText = {
      guid: "",
      name: "",
      text: `${dynamicsVals?.get("Enter Your Name") ?? "Enter Your Name"}`,
      fillColor: defaultColor,
      fontFamily: fonts[0].name,
      fontSize: 48,
      fontWeight: "normal normal",
      isTextOnPath: false,
      constraints: null,
      placeholder: "Input your text here",
      backgroundColor: "rgb(235, 237, 242)",
    };

    UpdateGroupId(actualAreaId, "signature"); // This is for setting index
    addItemText(itemText, actualAreaId);
    toggleFunc("signature");
    selectStepName('')
    // updCurrentIndex();
  };

  const handleImageItem = (actualAreaId) => {
    selectStepName('')
    UpdateGroupId(actualAreaId, "logos"); // This is for setting index
    toggleFunc("logos");
  };

  return (
    <div
      style={{ transition: "all 0.6s cubic-bezier(0.075, 0.82, 0.165, 1) 0s" }}
    >
      {groupNameList && (
        <div>
          <div className="full-tray">
            {/* <div className="tray-container"> */}
            <div className="tray-mc-header">
              {/* class="d-sm-flx flx-ai-sm-c flx-jc-sm-c css-154hl8z" */}
              <button
                className="tray-trigger-close-button"
                onClick={() => toggleFunc(null)}
              >
                 {dynamicsVals?.get('Close') ?? 'Close'}  
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 25 25"
                  role="img"
                  width="25px"
                  height="25px"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M18.973 5.027L5.028 18.972M5.027 5.027l13.945 13.945"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="tray-mc-content">
              <div className="tray-mc-list-wrapper">                
                <div className="mc-list-title"> {dynamicsVals?.get('Select Colors') ?? 'Select Colors'} </div>
                <div className="tray-mc-grid">
                  {groupNameList.map((groupName, i) => {
                    return (
                      <div className="heading" id={groupName.name}>
                        <div
                          className="sitems"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexGrow: 1,
                            justifyContent: "flex-start",
                          }}
                          onClick={handleMultipleClicks}
                          id={groupName.id}
                        >
                          <img
                            className="tray-image"
                            id={groupName.id}
                            style={{
                              width: "69px",
                              height: "76px",
                              borderRadius: "4px 4px 0px 0px",
                            }}
                            src={groupName.imageUrl}
                          />
                          <div id={groupName.id} className="slabel">
                            <span
                              id={groupName.id}
                              style={{
                                fontSize: "9px",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              {groupName.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SIGNATURE */}
            <div className="tray-mc-content signature">
              <div className="tray-mc-list-wrapper">
                <div className="mc-list-title">{dynamicsVals?.get('Select Signature') ?? 'Select Signature'}</div>
                <div className="tray-mc-grid">
                  {templates.map((template, i) => {
                    return (
                      <div className="heading" id={template.id} key={i}>
                        <div
                          className="sitems"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexGrow: 1,
                            justifyContent: "flex-start",
                          }}
                          onClick={() => handleTextItem(template.id)}
                          id={template.id}
                        >
                          <div id={template.id} className="slabel">
                            <span
                              id={template.id}
                              style={{
                                fontSize: "9px",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              {template.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LOGOS */}
            <div className="tray-mc-content logos">
              <div className="tray-mc-list-wrapper">
                <div className="mc-list-title">{dynamicsVals?.get('Select Logos') ?? 'Select Logos'}</div>
                <div className="tray-mc-grid">
                  {templatesLogo.map((template, i) => {
                    return (
                      <div className="heading" id={template.id}>
                        <div
                          className="sitems"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flexGrow: 1,
                            justifyContent: "flex-start",
                          }}
                          onClick={() => handleImageItem(template.id)}
                          id={template.id}
                        >
                          <div id={template.id} className="slabel">
                            <span
                              id={template.id}
                              style={{
                                fontSize: "9px",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              {template.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Tray;
