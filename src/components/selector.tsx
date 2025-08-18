import "./selector.css";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useZakeke } from "zakeke-configurator-react";
import {
  List,
  ListX,
  ListItemX,
  ListItemX_,
  ListItemColor,
  ListItemImageX,
  ListItemImageNoCarousel,
} from "./list";
import { PreviewContainer, BlurOverlay } from "./previewContainer";
import Tray from "./Tray";

import ProgressBarLoadingOverlay from "./widgets/ProgressBarLoadingOverlay";
import DesignerSignature from "./layouts/DesignerSignature";
import DesignerLogo from "./layouts/DesignerLogo";
import useStore from "../Store";
import {
  makeFirstLetterCaps,
  T,
  useActualGroups,
  downloadImage,
  updateSelectedTray,
} from "../Helpers";
import Footer from "./layouts/Footer";
import FooterMobile from "./layouts/FooterMobile";

import "./selectors/colsgrid.css";
import { ColorMenuSeleciton } from "./selectors/ColorMenuSelection";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const dialogsPortal = document.getElementById("dialogs-portal")!;

interface TrayPreviewOpenButton3DProps {
  trayPreviewOpenButton3DFunc: (data: any) => void;
}

const Selector: FunctionComponent<TrayPreviewOpenButton3DProps> = ({
  trayPreviewOpenButton3DFunc,
}) => {
  const {
    isSceneLoading,
    groups,
    selectOption,
    templates,
    product,
    setTemplate,
    setCamera,
    productName,
    items,
    getOnlineScreenshot,
    productCode,
    translations,
  } = useZakeke();

  const staticsVals = translations?.statics;
  const dynamicsVals = translations?.dynamics;
  const { setIsLoading, isMobile } = useStore();

  const useActualGroups_ = useActualGroups();

  // Keep saved the ID and not the refereces, they will change on each update
  const [selectedGroupId, selectGroup] = useState<number | null>(null);
  const [selectedStepId, selectStep] = useState<number | null>(null);
  const [selectedStepName, selectStepName] = useState<string | null>(null);
  const [selectedAttributeId, selectAttribute] = useState<number | null>(null);
  const [selectedOptionId, selectOptionId] = useState<number | null>(null);
  const [selectedOptionName, selectOptionName] = useState<string | null>(
    "PRINTED"
  );
  const [selectedGroupIDFromTray, setSelectedGroupIDFromTray] = useState<
    number | null
  >(null);
  const [selectedColorName, selectColorName] = useState<any | null>(null);
  const [hasTypeZero, setHasTypeZero] = useState<boolean | null>(null);
  const [stitchTypeGroup, setStitchTypeGroup] = useState<any | null>(null);

  const [tipIndex, setTipIndex] = useState<number | null>(null);

  // Get a list of all group names so we can populate on the tray
  const [selectedGroupList, selectGroupList] = useState<any | null>(null);

  // Open tray for menu
  const [isTrayOpen, setIsTrayOpen] = useState<any | null>(false);
  const [selectedTrayType, setSelectedTrayType] = useState<any | null>("");

  // Get the id of the selected group from the tray
  const [selectedGroupIdFromTray, selectGroupIdFromTray] = useState<
    number | null
  >(null);

  // Update tray preview open button
  const [selectedTrayPreviewOpenButton, selectTrayPreviewOpenButton] =
    useState<boolean>(false);

  // Selection of colours
  const [activeColorOption, setActiveColorOption] = useState("");

  const updateActiveColorOption = (label: any) => {
    setActiveColorOption(label);
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  function updCurrentIndex(indexVal: number) {
    // setCurrentIndex(indexVal);
  }

  const [width, setWidth] = useState(window.innerWidth);

  const [isCustomDropDownOpen, setIsCustomDropDownOpen] = useState(false);

  // const selectedGroup = useActualGroups_.find((group) => group.id === selectedGroupId);

  // const selectedStep = selectedGroup
  //   ? selectedGroup.steps.find((step) => step.id === selectedStepId)
  //   : null;

  const [selectedPersonalize, setSelectedPersonalize] = useState<any | null>(
    false
  );

  // Filter logos and signature for tray
  const filteredAreas = null;

  const selectedGroup = selectedGroupId
    ? useActualGroups_.find((group) => group.id === selectedGroupId)
    : null;
  //console.log(selectedGroup,selectedGroupId,useActualGroups_,'actualGroups 2');

  const selectedStep = selectedGroupId
    ? useActualGroups_
        .find((group) => group.id === selectedGroupId)
        ?.steps.find((step) => step.id === selectedStepId)
    : null;
  const currentAttributes = selectedStep
    ? selectedStep.attributes
    : selectedGroup
    ? selectedGroup.attributes
    : [];
  const currentTemplateGroups = selectedStep
    ? selectedStep.templateGroups
    : selectedGroup
    ? selectedGroup.templateGroups
    : [];

  const currentItems = [...currentAttributes, ...currentTemplateGroups].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  // Attributes can be in both groups and steps, so show the attributes of step or in a group based on selection
  const attributes = useMemo(
    () => (selectedStep || selectedGroup)?.attributes ?? [],
    [selectedGroup, selectedStep]
  );

  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
  );

  // console.log(selectedGroup, attributes,'attributes');

  const fitlerAttributes = attributes.filter((x) => {
    // if (productCode != '9266869076293') {
    if (x.name === x.name.toUpperCase() && x.name != "Select Color") {
      return x;
      // }

      //   if (x.name === 'Plain' || x.name === 'Normal' || x.name === 'Metallic' || x.name === 'Matte' || x.name === 'Fluorescent' ) {
      //     return x.name.toUpperCase();
      //   }
      // }
      // else {

      //   if (x.name === 'Plain' || x.name === 'Normal' || x.name === 'Metallic' || x.name === 'Matte' || x.name === 'Fluorescent'
      //    || x.name === x.name.toUpperCase() ) {
      //     return x.name.toUpperCase();
      //   }
    }

    // if (x.name === )
  });

  // console.log(fitlerAttributes,'attributes');

  fitlerAttributes.filter((x) => x !== undefined);

  useEffect(() => {
    if (selectedGroupIDFromTray) {
      // const foundItem = filteredArrayId[0];
      const tipIndex_ = useActualGroups_.findIndex(
        (x) => x.id === selectedGroupIDFromTray
      );
      setCurrentIndex(tipIndex_);
    }

    const tipIndex_ = useActualGroups_.findIndex(
      (x) => x.id === selectedGroupId
    );
    setCurrentIndex(tipIndex_);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupIDFromTray, useActualGroups_]);

  // const selectedTemplateGroup = currentTemplateGroups
  // 	? currentTemplateGroups.find((templGr) => templGr.templateGroupID === selectedTemplateGroupId)
  // 	: null;

  // removed test
  let indexToRemove = groups.findIndex((obj) => obj.id === -1);
  if (indexToRemove !== -1) {
    groups.splice(indexToRemove, 1);
  }

  useEffect(() => {
    const itemAvailable = items?.filter((item) => item.type === 0).length > 0;

    // removed test
    if (items && !itemAvailable) {
      if (tipIndex) {
        setStitchTypeGroup(useActualGroups_[tipIndex]);
      }
    }

    if (items && itemAvailable) {
      if (items.filter((item) => item.type === 1)) {
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTypeZero, useActualGroups_, items]);

  const dialogsPortal = document.getElementById("dialogs-portal");

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      //   setHeight(window.innerHeight);
    };

    //window.addEventListener('resize', handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  // Open the first group and the first step when loaded
  useEffect(() => {
    // console.log("loading in the first group",groups);

    if (!selectedGroup && useActualGroups_.length > 0) {
      selectGroup(groups[0].id);

      setActiveColorOption("plain");

      // if (groups[0].steps.length > 0) selectStep(groups[0].steps[0].id);

      if (templates.length > 0) setTemplate(templates[0].id);
    }

    if (useActualGroups_.length > 0) {
      var groupRec: {
        id: number;
        name: string;
        imageUrl: string | null | undefined;
      }[] = [];
      groups.map((group) => {
        groupRec.push({
          id: group.id,
          name: group.name,
          imageUrl: group.imageUrl,
        });
      });
      selectGroupList(groupRec);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  // Select attribute first time
  useEffect(() => {
    const colorMenuAttributeMap: { [key: string]: number } = {
      plain: 0,
      color: 0,
      metallic: 1,
      matte: 2,
      fluorescent: 3,
      knockX: 4,
      "knock-X": 4,
      "KNOCK-X": 4,
    };

    if (selectedGroup && activeColorOption in colorMenuAttributeMap) {
      const optionIndex = colorMenuAttributeMap[activeColorOption];
      const option = selectedGroup.attributes[0]?.options[optionIndex];

      if (option) {
        selectOption(option.id);
        selectStepName(option.name);
      } else {
        selectStepName("");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute, activeColorOption]);

  useEffect(() => {
    if (selectedGroup) {
      const camera = selectedGroup.cameraLocationId;
      if (camera) setCamera(camera);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  if (isSceneLoading || !groups || groups.length === 0)
    return (
      <PreviewContainer>
        <BlurOverlay>
          {/* <span>Loading scene...</span>; */}
          <ProgressBarLoadingOverlay />
        </BlurOverlay>
      </PreviewContainer>
    );

  // groups
  // -- attributes
  // -- -- options
  // -- steps
  // -- -- attributes
  // -- -- -- options

  // console.log(fitlerAttributes[0],'fitlerAttributes[0]');

  const handleScreenShotClick = async () => {
    try {
      const url = await getOnlineScreenshot(800, 800);
      // console.log(url.originalUrl);
      if (url) downloadImage(url.originalUrl);

      // setIsLoading(true);
      // setPdfIsLoading(true);
      // const url = await getPDF();
      // showDialog('pdf', <PdfDialog url={url} onCloseClick={() => closeDialog('pdf')} />);
    } catch (ex) {
      console.error(ex);
      // showError(T._('Failed PDF generation', 'Composer'));
    } finally {
      // setPdfIsLoading(false);
      // 	setIsLoading(false);
    }
  };

  const handleLeftClick = () => {
    selectStepName("");
    const newIndex =
      (currentIndex - 1 + useActualGroups_.length) % useActualGroups_.length;
    const newGroup = useActualGroups_[newIndex];
    setSelectedTrayType(updateSelectedTray(newGroup.direction));
    setActiveColorOption("plain");
    selectColorName("");
    setCurrentIndex(newIndex);
    selectGroup(newGroup.id);
    if (newGroup.steps) selectStep(newGroup.steps[0]?.id);
  };

  const handleRightClick = () => {
    selectStepName("");
    setSelectedGroupIDFromTray(null);

    const newIndex = (currentIndex + 1) % useActualGroups_.length;
    const group = useActualGroups_[newIndex];
    setSelectedGroupIDFromTray(null);
    setSelectedTrayType(updateSelectedTray(group.direction));
    setActiveColorOption("plain");
    selectColorName("");
    setCurrentIndex(newIndex);
    selectGroup(group.id);
    if (group.steps) selectStep(group.steps[0]?.id);
  };

  const toggleTray = (trayName: string) => {
    if (selectedTrayPreviewOpenButton) {
      selectTrayPreviewOpenButton(!selectedTrayPreviewOpenButton);
    }
    // trayPreviewOpenButton();
    setIsTrayOpen(!isTrayOpen);

    // set what tray type is selected e.g. colors, signature, logo
    setSelectedTrayType(trayName);

    if (trayName === null) {
      const tipIndex_ = useActualGroups_.findIndex(
        (x) => x.id === selectedGroupId
      );

      if (useActualGroups_[tipIndex_].direction == 0) {
        setSelectedTrayType("colors");
      } else if (useActualGroups_[tipIndex_].direction == 2) {
        setSelectedTrayType("signature");
      } else if (useActualGroups_[tipIndex_].direction == 3) {
        setSelectedTrayType("logos");
      }
    }
  };

  const trayPreviewOpenButton = () => {
    selectTrayPreviewOpenButton(!selectedTrayPreviewOpenButton);

    //trayPreviewOpenButton3DFunc(selectedTrayPreviewOpenButton);
    trayPreviewOpenButton3DFunc(selectedTrayPreviewOpenButton);
  };

  // After selection of the element from the tray
  const groupIdFromFunc = (data: number, type: string) => {
    setSelectedGroupIDFromTray(data);

    let filteredArray;

    useActualGroups_.filter((element) => {
      return element;
    });

    filteredArray = useActualGroups_.filter((group) => {
      if (group?.id) {
        return group.id == data;
      }
    });

    const filteredArrayId = useActualGroups_.filter((i: any, index: number) => {
      return i.id == data;
    });

    if (filteredArrayId.length >= 0) {
      const foundItem = filteredArrayId[0];
      const foundItemIndex = useActualGroups_.indexOf(foundItem);

      setCurrentIndex(foundItemIndex);
    }

    setSelectedTrayType(type);

    if (type === "colors") {
      if (filteredArray[0]?.id) {
        selectGroup(filteredArray[0].id);
        selectGroupIdFromTray(filteredArray[0].id);
      }
    } else {
      selectGroup(data);
    }
  };

  const togglePersonalize = () => {
    setSelectedPersonalize(!selectedPersonalize);
  };

  const containerStyles = {
    // overflow: "auto",
    width: "100%",
    // height: !selectedTrayPreviewOpenButton ? "13rem" : "70px",
  };

  let groupNameText = makeFirstLetterCaps(useActualGroups_[currentIndex]?.name);

  return (
    <>
      <div className="top-nav">
        <div className="body-3" id="product-info">
          {productName}
          {/* <span>LEI {price}</span> */}
        </div>

        <div className="top-right-controls">
          <div
            id="savepic"
            data-hasqtip="98"
            title=""
            aria-describedby="qtip-98"
            onClick={() => handleScreenShotClick()}
          >
            <i
              className="fa fa-camera"
              style={{ color: "rgb(54, 179, 237)" }}
            ></i>
          </div>
        </div>
      </div>

      {/* Personalize A */}
      {!isMobile && (
        <div
          className="iHdtWA group-item selected"
          style={{
            position: "absolute",
            top: "5%",
            right: "1%",
            cursor: "pointer",
            marginLeft: "20px",
            width: "270px",
          }}
        >
          {/* <div
            className="button-53"
            onClick={() => setSelectedPersonalize(!selectedPersonalize)}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "7px",
              }}
            >
              {T._("Personalizează", "Composer")}
            </span>
          </div>
          {selectedPersonalize ? (
            <Designer togglePersonalize={togglePersonalize} />
          ) : (
            ""
          )} */}
        </div>
      )}

      <div className="animate-wrapper-0">
        <div style={containerStyles}>
          {/* {groups[currentIndex].name === "MODALITATE IMPRIMARE" && (!hasTypeZero) ? null : ( */}

          {/* Closed on request of Paul */}
          {/* <MenuTriggerButton width={width} toggleTray={toggleTray} /> */}

          <div className="tray-header">
            {/* <TrayPreviewOpenButton
              width={width}
              trayPreviewOpenButton={trayPreviewOpenButton}
              selectedTrayPreviewOpenButton={selectedTrayPreviewOpenButton}
              selectTrayPreviewOpenButton={selectTrayPreviewOpenButton}
            /> */}

            <div className="guide">
              <div className="tray-header-1">
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    className="active-marketing-component-name"
                    onClick={() => toggleTray("null")}
                  >
                    <div className="selectiontype">{groupNameText}</div>

                    <div className="arrd">
                      <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 36 36"
                        //  style="enable-background:new 0 0 36 36;"
                        // xml:space="preserve"
                      >
                        <path
                          fill="#ffffff"
                          d="M16.1,26.54l-9.29-9.29c-1.05-1.05-1.05-2.75,0-3.8l0,0c1.05-1.05,2.75-1.05,3.8,0L18,20.85l7.39-7.39
											c1.05-1.05,2.75-1.05,3.8,0l0,0c1.05,1.05,1.05,2.75,0,3.8l-9.29,9.29C18.85,27.59,17.15,27.59,16.1,26.54z"
                        ></path>
                      </svg>
                    </div>

                    <div className="gimg">
                      {useActualGroups_[currentIndex]?.imageUrl && (
                        <img
                          src={useActualGroups_[currentIndex]?.imageUrl!}
                          alt="Group Image"
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />

          {(selectedTrayType === "" ||
            selectedTrayType === "null" ||
            selectedTrayType.toLowerCase() === "colors") && (
            <div className={`animate-wrapper${isTrayOpen ? "-2 show" : ""}`}>
              {isTrayOpen && !selectedTrayPreviewOpenButton && (
                <Tray
                  groupNameList={selectedGroupList}
                  filteredAreas={filteredAreas}
                  toggleFunc={toggleTray}
                  UpdateGroupId={groupIdFromFunc}
                  updCurrentIndex={updCurrentIndex}
                  selectedTray={selectedTrayType}
                  selectStepName={selectStepName}
                />
              )}

              {!isTrayOpen &&
                !selectedTrayPreviewOpenButton &&
                groupNameText.toUpperCase() !== "OVERLAY TYPE" && (
                  <ColorMenuSeleciton
                    productCode={productCode}
                    selectedGroupName={selectedGroup}
                    updateActiveColorOption={updateActiveColorOption}
                    activeColorOption={activeColorOption}
                    currentAttributes={currentAttributes}
                    fitlerAttributesName={fitlerAttributes[0]?.name}
                  />
                )}

              {fitlerAttributes[0] && !selectedTrayPreviewOpenButton && (
                <div
                  style={{
                    width: "100%",
                    background: "0% 0% / 4px 4px rgba(255, 255, 255, 0.5)",
                    borderRadius: "0px 0px 3px 3px",
                    padding: "10px 10px 5px",
                    borderTop: "none",
                    boxShadow: "rgba(0, 64, 113, 0.1) 0px 3px 6px",
                    display: isTrayOpen ? "none" : "block",
                  }}
                >
                  {(fitlerAttributes[0]?.code === "OVERLAY TYPE" ||
                    fitlerAttributes[0]?.code === "OVERLAY") && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignContent: "center",
                      }}
                    >
                      <div className="mchead">
                        {dynamicsVals?.get("Overlay Type") ?? "Overlay Type"}
                      </div>
                      <div className="infsel">
                        <div className="custom-dropdown">
                          <button
                            className="custom-dropdown-button"
                            onClick={() =>
                              setIsCustomDropDownOpen(!isCustomDropDownOpen)
                            }
                          >
                            {selectedOptionName}{" "}
                            <span className="dropdown-arrow"> ▼</span>
                          </button>
                          {isCustomDropDownOpen && (
                            <div className="custom-dropdown-list">
                              {fitlerAttributes[0]?.options.map((option) => (
                                <div
                                  key={option.id}
                                  className="custom-dropdown-option"
                                  onClick={() => {
                                    selectOption(option.id)
                                    selectOptionId(option.id);
                                    selectOptionName(option.name);
                                    setIsCustomDropDownOpen(
                                      !isCustomDropDownOpen
                                    );
                                  }}
                                >
                                  {option.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {(fitlerAttributes[0].name.toUpperCase() === "METALLIC" ||
                    fitlerAttributes[0].name.toUpperCase() === "FLUORESCENT" ||
                    fitlerAttributes[0].name.toUpperCase() === "NORMAL" ||
                    fitlerAttributes[0].name.toUpperCase() === "MATTE" ||
                    fitlerAttributes[0].name.toUpperCase() === "COLOR" ||
                    fitlerAttributes[0].name.toUpperCase() === "PLAIN") &&
                    fitlerAttributes[0]?.code != "OVERLAY TYPE" &&
                    selectedStepName !== "KNOCK-X" && (
                      <List>
                        {!selectedTrayPreviewOpenButton &&
                          // selectedAttribute &&
                          fitlerAttributes &&
                          !isTrayOpen &&
                          fitlerAttributes[0]?.options.map((option) => {
                            return (
                              <>
                                <ListItemColor
                                  key={option.id}
                                  onClick={() => {
                                    {
                                      if (
                                        option.name === "EMBROIDERED" ||
                                        option.name === "PRINTED"
                                      ) {
                                        const indexForGroupTip =
                                          groups.findIndex(
                                            (obj) => obj.name.toUpperCase() === "OVERLAY TYPE"
                                          );
                                        if (indexForGroupTip > 0) {
                                          selectGroup(
                                            groups[indexForGroupTip].id
                                          );
                                          if (
                                            groups[groups?.length - 1]
                                              .attributes[0].code.toUpperCase() ===
                                            "OVERLAY TYPE"
                                          ) {
                                            selectOption(option.id);
                                          }

                                          // selectOption(option.id);
                                          selectOptionId(option.id);
                                          //     selectOptionName(option.name);
                                        }
                                      } else {
                                        // console.log(option.id);
                                        // setSelectedAttributeId()
                                        selectOption(option.id);
                                        selectOptionId(option.id);
                                        //   selectOptionName(option.name);
                                      }
                                    }
                                  }}
                                  selected={option.selected}
                                  selectedColor={selectedColorName}
                                >
                                  {option.imageUrl && (
                                    <ListItemImageNoCarousel
                                      src={option.imageUrl}
                                      onClick={() =>
                                        selectColorName(option.name)
                                      }
                                      selected={option.selected}
                                    />
                                  )}
                                  {/* Shows the color name but we dont need it now  */}
                                  {/* <div style={{ position: "absolute", top: "120%" }}>
                              {option.id === selectedOptionId
                                ? option.name
                                : ""}
                            </div> */}
                                </ListItemColor>
                              </>
                            );
                          })}
                      </List>
                    )}

                  <div>
                    {(fitlerAttributes[0].name.toUpperCase() !== "METALLIC" &&
                      fitlerAttributes[0].name.toUpperCase() !==
                        "FLUORESCENT" &&
                      fitlerAttributes[0].name.toUpperCase() !== "NORMAL" &&
                      fitlerAttributes[0].name.toUpperCase() !== "MATTE" &&
                      fitlerAttributes[0].name.toUpperCase() !==
                        "OVERLAY TYPE" &&
                      fitlerAttributes[0].name.toUpperCase() !== "COLOR" &&
                      fitlerAttributes[0].name.toUpperCase() !== "PLAIN") ||
                    selectedStepName === "KNOCK-X" ? (
                      <div>
                        <div className="knockXlabel">
                          {dynamicsVals?.get("SELECT DESIGN THEME") ??
                            "SELECT DESIGN THEME"}
                        </div>
                        <Swiper
                          spaceBetween={1}
                          slidesPerView={2}
                          navigation={true}
                          centeredSlides={true}
                          // modules={[Navigation]}
                          //onSlideChange={() => console.log('slide change')}
                          //onSwiper={(swiper) => console.log(swiper)}
                        >
                          {/* {fitlerAttributes[0].options.map((attribute) => {
                            return (
                              <SwiperSlide>
                                <ListItemX
                                  key={attribute.id}
                                  onClick={() => selectOption(attribute.id)}
                                  selected={true}
                                  // selected={selectedAttribute === attribute}
                                >
                                  <div className="scaler">
                                   {attribute.name}
                                  </div>
                                </ListItemX>
                              </SwiperSlide>
                            );
                          })} */}

                          {selectedGroup?.attributes[1]?.options.map(
                            (attribute) => {
                              return (
                                <SwiperSlide>
                                  <ListItemX
                                    key={attribute.id}
                                    onClick={() => selectOption(attribute.id)}
                                    selected={true}
                                    // selected={selectedAttribute === attribute}
                                  >
                                    <div className="scaler">
                                      {attribute.name}
                                    </div>
                                  </ListItemX>
                                </SwiperSlide>
                              );
                            }
                          )}
                        </Swiper>

                        <br />
                        <div className="knockXlabel">
                          {dynamicsVals?.get("SELECT COLOR THEME") ??
                            "SELECT COLOR THEME"}
                        </div>
                        <ListX>
                          {fitlerAttributes[0] &&
                            fitlerAttributes[0].options.map((option) => {
                              return (
                                <ListItemX_
                                  key={option.id}
                                  onClick={() => selectOption(option.id)}
                                  selected={option.selected}
                                >
                                  {option.imageUrl && (
                                    <ListItemImageX src={option.imageUrl} />
                                  )}
                                  {/* {option.name} */}
                                </ListItemX_>
                              );
                            })}
                        </ListX>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTrayType === "signature" && (
            <DesignerSignature
              togglePersonalize={togglePersonalize}
              selectedAreaID={selectedGroupId}
            />
          )}

          {selectedTrayType === "logos" && (
            <DesignerLogo
              togglePersonalize={togglePersonalize}
              selectedAreaID={selectedGroupId}
            />
          )}
        </div>
        <div className="gbuts">
          {/* <button className="previous-customization" onClick={handleLeftClick}> */}
          <div id="gprev" className="mc-prev" onClick={handleLeftClick}>
            {dynamicsVals?.get("Back") ?? "Back"}
          </div>
          {/* </button> */}
          {/* <button className="next-customization" onClick={handleRightClick}> */}
          <div id="gnext" className="mc-next" onClick={handleRightClick}>
            {dynamicsVals?.get("Next") ?? "Next"}
          </div>
          {/* </button> */}
        </div>

        <div className="empty-space-div"></div>

        {width <= 460 && <FooterMobile />}
      </div>

      {width > 460 && <Footer />}
    </>
  );
};

export default Selector;
