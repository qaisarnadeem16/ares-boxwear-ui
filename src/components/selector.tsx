import "./selector.css";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { ThemeTemplateGroup, useZakeke } from "zakeke-configurator-react";

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

import { MenuIcon } from "./widgets/svg";
import { ItemAccordion, ItemAccordionContainer, ItemAccordionDescription, ItemAccordionName, Options, OptionsContainer, OptionsWrapper, OptionsWrappers, StepItem, Steps } from "./Atomic";
import OptionItem from "./widgets/options";
import { BlurOverlay, PreviewContainer } from "./previewContainer";
import OptionItem2 from "./widgets/options2";
import Designer from "./layouts/Designer";


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
    price,
    items,
    getOnlineScreenshot,
    productCode,
    translations,
  } = useZakeke();

  const staticsVals = translations?.statics;
  const dynamicsVals = translations?.dynamics;
  const { setIsLoading, isMobile, setSelectedStepId, selectedStepId, setSelectedAttributeId,
    setLastSelectedItem, setSelectedTemplateGroupId ,selectedGroupId,setSelectedGroupId } = useStore();
  const [lastSelectedSteps, setLastSelectedSteps] = useState(new Map<number, number>());
  const [lastSelectedItemsFromSteps, setLastSelectedItemFromSteps] = useState(new Map<number, [number, string]>());
  const [lastSelectedItemsFromGroups, setLastSelectedItemsFromGroups] = useState(new Map<number, [number, string]>());
  const [isTrayOpen, setIsTrayOpen] = useState<any | null>(false);
  const [selectedTrayType, setSelectedTrayType] = useState<any | null>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const useActualGroups_ = useActualGroups();
  const [attributesOpened, setAttributesOpened] = useState<Map<number, boolean>>(new Map());

  // Keep saved the ID and not the refereces, they will change on each update
  // const [selectedGroupId, selectGroup] = useState<number | null>(null);
  // const [selectedStepId, selectStep] = useState<number | null>(null);
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
  const [showDesigner, setShowDesigner] = useState(false);

  // Get a list of all group names so we can populate on the tray
  const [selectedGroupList, selectGroupList] = useState<any | null>(null);

  // Open tray for menu

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
  // console.log(selectedGroup,selectedGroupId,useActualGroups_,'actualGroups 2');

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
    if (x.name === x.name?.toUpperCase() && x.name != "Select Color") {
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

  // useEffect(() => {
  //   if (selectedGroupIDFromTray) {
  //     // const foundItem = filteredArrayId[0];
  //     const tipIndex_ = useActualGroups_.findIndex(
  //       (x) => x.id === selectedGroupIDFromTray
  //     );
  //     setCurrentIndex(tipIndex_);
  //   }

  //   const tipIndex_ = useActualGroups_.findIndex(
  //     (x) => x.id === selectedGroupId
  //   );
  //   setCurrentIndex(tipIndex_);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedGroupIDFromTray, useActualGroups_]);

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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

    useEffect(() => {
  if (!selectedGroup && useActualGroups_.length > 0) {
    const firstGroup = useActualGroups_[0];
    setSelectedGroupId(firstGroup.id);
    setActiveColorOption("plain");

    if (templates.length > 0) setTemplate(templates[0].id);

    if (firstGroup.steps && firstGroup.steps.length > 0) {
      setSelectedStepId(firstGroup.steps[0].id);
    }

    const firstItems = [
      ...firstGroup.attributes,
      ...firstGroup.templateGroups,
    ].sort((a, b) => a.displayOrder - b.displayOrder);

    if (firstItems.length > 0) {
      const newAttributesOpened = new Map(attributesOpened);
      if (!(firstItems[0] instanceof ThemeTemplateGroup)) {
        handleAttributeSelection(firstItems[0].id);
        newAttributesOpened.set(firstItems[0].id, true);
      } else {
        handleTemplateGroupSelection(firstItems[0].templateGroupID);
        newAttributesOpened.set(firstItems[0].templateGroupID, true);
      }
      setAttributesOpened(newAttributesOpened);
    }
  }

  if (useActualGroups_.length > 0) {
    const groupRec = groups.map((group) => ({
      id: group.id,
      name: group.name,
      imageUrl: group.imageUrl,
    }));
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


  const handleAttributeSelection = (attributeId: number, isAttributesVertical?: boolean) => {
    // setIsStartRegistering(undoRegistering.startRegistering());

    // if (attributeId && selectedAttributeId !== attributeId && !isUndo && !isRedo) {
    //   undoRedoActions.eraseRedoStack();
    //   undoRedoActions.fillUndoStack({
    //     type: 'attribute',
    //     id: selectedAttributeId,
    //     direction: 'undo'
    //   });
    //   undoRedoActions.fillUndoStack({
    //     type: 'attribute',
    //     id: attributeId,
    //     direction: 'redo'
    //   });
    // }

    setSelectedAttributeId(attributeId);

    if (isAttributesVertical && !selectedGroup?.attributesAlwaysOpened) {
      setAttributesOpened(attributesOpened.set(attributeId, !attributesOpened.get(attributeId)));
    }

    if (selectedStep && selectedStep.attributes.find((attr) => attr.id === attributeId)) {
      const newLastAttributeSelected = lastSelectedItemsFromSteps.set(selectedStepId!, [
        attributeId,
        'attribute'
      ]);
      setLastSelectedItemFromSteps(newLastAttributeSelected);
    } else {
      const newLastAttributeSelected = lastSelectedItemsFromGroups.set(selectedGroupId!, [
        attributeId,
        'attribute'
      ]);
      setLastSelectedItemsFromGroups(newLastAttributeSelected);
    }
    setLastSelectedItem({ type: 'attribute', id: attributeId });
  };

  const handleTemplateGroupSelection = (templateGroupId: number, isTemplateVertical?: boolean) => {
    setSelectedTemplateGroupId(templateGroupId);
    setLastSelectedItem({ type: 'template-group', id: templateGroupId });
    if (isTemplateVertical && !selectedGroup?.attributesAlwaysOpened) {
      setAttributesOpened(attributesOpened.set(templateGroupId, !attributesOpened.get(templateGroupId)));
    }
    if (
      selectedStep &&
      selectedStep.templateGroups.find((templGr) => templGr.templateGroupID === templateGroupId)
    ) {
      const newLastTemplateGroupSelected = lastSelectedItemsFromSteps.set(selectedStepId!, [
        templateGroupId,
        'template group'
      ]);
      setLastSelectedItemFromSteps(newLastTemplateGroupSelected);
    } else {
      const newLastItemSelected = lastSelectedItemsFromGroups.set(selectedGroupId!, [
        templateGroupId,
        'template group'
      ]);
      setLastSelectedItemsFromGroups(newLastItemSelected);
    }
  };

  const handleLeftClick = () => {
    const newIndex = (currentIndex - 1 + useActualGroups_.length) % useActualGroups_.length;
    const newGroup = useActualGroups_[newIndex];
    setSelectedGroupId(newGroup.id);
    setSelectedTrayType(updateSelectedTray(newGroup.direction));
    setSelectedGroupIDFromTray(null);
    setCurrentIndex(newIndex);
    setSelectedAttributeId(null);
    if (newGroup.steps.length > 0) {
      setSelectedStepId(newGroup.steps[0].id);
    } else {
      setSelectedStepId(null);
    }
  };

  const handleRightClick = () => {
    const newIndex = (currentIndex + 1) % useActualGroups_.length;
    const newGroup = useActualGroups_[newIndex];
    setSelectedGroupId(newGroup.id);
    setSelectedTrayType(updateSelectedTray(newGroup.direction));
    setSelectedGroupIDFromTray(null);
    setCurrentIndex(newIndex);
    setSelectedAttributeId(null);
    
    if (newGroup.steps.length > 0) {
      setSelectedStepId(newGroup.steps[0].id);
    } else {
      setSelectedStepId(null);
    }
  };


   

  // useEffect(() => {
  //   if (!isSceneLoading && actualGroups.length > 0 && !selectedGroupId) {
  //     handleGroupSelection(actualGroups[0].id);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSceneLoading, actualGroups]);
useEffect(() => {
    if (selectedStep && currentItems.length > 0) {
      const newAttributesOpened = new Map(attributesOpened);
      
      if (lastSelectedItemsFromSteps && selectedStepId && lastSelectedItemsFromSteps.get(selectedStepId)) {
        const selectedItem = lastSelectedItemsFromSteps.get(selectedStepId);
        if (selectedItem && selectedItem[1] === 'attribute') {
          if (selectedStep.attributes.some((attr) => attr.id === selectedItem[0])) {
            handleAttributeSelection(selectedItem[0]);
            newAttributesOpened.set(selectedItem[0], true);
          } else {
            handleAttributeSelection(selectedStep.attributes[0].id);
            newAttributesOpened.set(selectedStep.attributes[0].id, true);
          }
        }
        if (selectedItem && selectedItem[1] === 'template group') {
          if (selectedStep.templateGroups.some((templGr) => templGr.templateGroupID === selectedItem[0])) {
            handleTemplateGroupSelection(selectedItem[0]);
            newAttributesOpened.set(selectedItem[0], true);
          } else {
            handleTemplateGroupSelection(selectedStep.templateGroups[0].templateGroupID);
            newAttributesOpened.set(selectedStep.templateGroups[0].templateGroupID, true);
          }
        }
      } else {
        if (!(currentItems[0] instanceof ThemeTemplateGroup)) {
          handleAttributeSelection(currentItems[0].id);
          newAttributesOpened.set(currentItems[0].id, true);
        } else {
          handleTemplateGroupSelection(currentItems[0].templateGroupID);
          newAttributesOpened.set(currentItems[0].templateGroupID, true);
        }
      }
      
      setAttributesOpened(newAttributesOpened);
    } else if (selectedGroup && currentItems.length > 0) {
      const newAttributesOpened = new Map(attributesOpened);
      
      if (lastSelectedItemsFromGroups && selectedGroupId && lastSelectedItemsFromGroups.get(selectedGroupId)) {
        const selectedItem = lastSelectedItemsFromGroups.get(selectedGroupId);
        if (selectedItem && selectedItem[1] === 'attribute') {
          const attributeToBeAutoSelected = selectedGroup.attributes.find(
            (attr) => attr.id === selectedItem[0]
          );
          if (attributeToBeAutoSelected && attributeToBeAutoSelected.enabled) {
            handleAttributeSelection(selectedItem[0]);
            newAttributesOpened.set(selectedItem[0], true);
          } else if (selectedGroup && selectedGroup.attributes.length > 0) {
            handleAttributeSelection(selectedGroup.attributes[0].id);
            newAttributesOpened.set(selectedGroup.attributes[0].id, true);
          }
        }
        if (selectedItem && selectedItem[1] === 'template group') {
          if (selectedGroup.templateGroups.some((templGr) => templGr.templateGroupID === selectedItem[0])) {
            handleTemplateGroupSelection(selectedItem[0]);
            newAttributesOpened.set(selectedItem[0], true);
          }
        }
      } else {
        if (!(currentItems[0] instanceof ThemeTemplateGroup)) {
          handleAttributeSelection(selectedGroup.attributes[0].id);
          newAttributesOpened.set(selectedGroup.attributes[0].id, true);
        } else {
          handleTemplateGroupSelection(currentItems[0].templateGroupID);
          newAttributesOpened.set(currentItems[0].templateGroupID, true);
        }
      }
      
      setAttributesOpened(newAttributesOpened);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStepId, selectedGroupId]);


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

   const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        setSelectedGroupId(filteredArray[0].id);
        selectGroupIdFromTray(filteredArray[0].id);
      }
    } else {
      setSelectedGroupId(data);
    }
  };

  const togglePersonalize = () => {
    setSelectedPersonalize(!selectedPersonalize);
  };


  const handleGroupSelectionFromSidebar = (groupId: number) => {
    const groupIndex = useActualGroups_.findIndex(group => group.id === groupId);
    if (groupIndex !== -1) {
      setSelectedGroupId(groupId);
      setCurrentIndex(groupIndex);
      setSelectedAttributeId(null);
      
      const newGroup = useActualGroups_[groupIndex];
      setSelectedTrayType(updateSelectedTray(newGroup.direction));
      setSelectedGroupIDFromTray(null);
      
      if (newGroup.steps.length > 0) {
        setSelectedStepId(newGroup.steps[0].id);
      } else {
        setSelectedStepId(null);
      }
    }
    setIsSidebarOpen(false); // Close sidebar after selection
  };
  const containerStyles = {
    // overflow: "auto",
    width: "100%",
    padding:'10px',
    // height: !selectedTrayPreviewOpenButton ? "13rem" : "70px",
  };
  
  console.log('first',groups)
  const handleStepSelection = (stepId: number | null) => {
    // setIsStartRegistering(undoRegistering.startRegistering());

    // if (selectedStepId !== stepId && !isUndo && !isRedo) {
    //   undoRedoActions.eraseRedoStack();
    //   undoRedoActions.fillUndoStack({
    //     type: 'step',
    //     id: selectedStepId,
    //     direction: 'undo'
    //   });
    //   undoRedoActions.fillUndoStack({
    //     type: 'step',
    //     id: stepId ?? null,
    //     direction: 'redo'
    //   });
    // }

    setSelectedStepId(stepId);

    const newStepSelected = lastSelectedSteps.set(selectedGroupId!, stepId!);
    setLastSelectedSteps(newStepSelected);
  };

  let groupNameText = makeFirstLetterCaps(useActualGroups_[currentIndex]?.name);
  // console.log("SelectedGroup", selectedGroup)
  // console.log("groups", groups)
  // console.log("SelectedGroup", useActualGroups_)

return (
  <>
{/* Sidebar Overlay */}
    {isSidebarOpen && (
      <div 
        className="sidebar-overlay"
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
      />
    )}
    {/* Sidebar */}
    <div 
      className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: isSidebarOpen ? 0 : '-300px',
        width: '300px',
        height: '100vh',
        backgroundColor: '#fff',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        transition: 'left 0.3s ease',
        zIndex: 1001,
        overflowY: 'auto',
        padding: '15px',
      }}
    >
        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end', marginBottom: '20px' }} className="">
          <button 
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px',
          }}
        >
          ×
        </button>
        </div>
  
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Selected Area</h3>
      </div>
      
      <div 
className="groups-container" 
style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr", // 2 columns
  gap: "10px", // spacing between items
}}
>
{useActualGroups_.map((group, index) => (
  <div
    key={group.id}
    className={`group-item ${selectedGroupId === group.id ? 'selected' : ''}`}
    onClick={() => handleGroupSelectionFromSidebar(group.id)}
    style={{
  display: "flex",
  flexDirection:'column',
  gap:'5px',
  alignItems: "center",
  padding: "4px 0px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  width:'90px',
  backgroundColor: selectedGroupId === group.id ? "#e9e7e7ff" : "#fff",
  borderRadius: "8px",
}}
    onMouseEnter={(e) => {
      if (selectedGroupId !== group.id) {
        e.currentTarget.style.backgroundColor = "#f5f5f5";
      }
    }}
    onMouseLeave={(e) => {
      if (selectedGroupId !== group.id) {
        e.currentTarget.style.backgroundColor = "#fff";
      }
    }}
  >
    {group.imageUrl && (
      <img
        src={group.imageUrl}
        alt={group.name}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "8px",
          padding:'3px',
          backgroundColor: selectedGroupId === group.id ? "#f8f9fa" : "#fff",            
        }}
      />
    )}
    <div>
      <div style={{ fontWeight: "500", fontSize: "12px", textAlign:'center' }}>
        {makeFirstLetterCaps(group.name)}
      </div>
      {/* {group.steps && group.steps.length > 0 && (
        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px",textAlign:'center' }}>
          {group.steps.length} step{group.steps.length > 1 ? "s" : ""}
        </div>
      )} */}
    </div>
  </div>
))}
</div>

    </div>

    <div className="animate-wrapper-0">

      <div style={containerStyles}>

        <div className="tray-header">
          <div className="Flex Flex-Justify">
            <div className="Flex">
              <div className="gimg">
                {useActualGroups_[currentIndex]?.imageUrl && (
                  <img
                    src={useActualGroups_[currentIndex]?.imageUrl!}
                    alt="Group Image"
                    style={{ maxWidth: "100%", height: "auto",borderRadius: '4px', }}
                  />
                )}
              </div>
              <button className="btn-rounded" onClick={toggleSidebar}>
                <MenuIcon />
              </button>
            </div>

            <div className="Heading">{groupNameText}</div>
            <div className=""></div>

          </div>

        </div>
        <br />
        <br />


        <Steps>
          {selectedGroup && selectedGroup.steps.map((step) => (
            <StepItem
              key={step.id}
              className={step.id === selectedStepId ? "selected" : ""}
              onClick={() => handleStepSelection(step.id)}
            >
              {T._d(step.name)}
            </StepItem>
          ))}
        </Steps>
        


        {/* {selectedGroup?.direction === 1 && ( */}
         <>
{currentItems &&
currentItems.map((item) => {
  
  const isSizeAndPaddingType = selectedGroup?.name?.toLowerCase() === "size" || 
                              selectedGroup?.name?.toLowerCase() === "padding type";

  
  if (!(item instanceof ThemeTemplateGroup))
                return (
                  <ItemAccordionContainer key={'container' + item.code}>
                    {/* <ItemAccordion
                      key={item.guid}
                      opened={attributesOpened.get(item.id)}
                      onClick={
                        selectedGroup && selectedGroup.attributesAlwaysOpened
                          ? () => null
                          : () => handleAttributeSelection(item.id, true)
                      }
                    > */}
                      {/* <ItemAccordionName>{T._d(item.name)}</ItemAccordionName> */}

                      {/* {!selectedGroup.attributesAlwaysOpened && (
                        <ArrowIcon
                          key={'accordion-icon'}
                          src={
                            attributesOpened.get(item.id) ? arrowUp : arrowDown
                          }
                        />
                      )} */}
                    {/* </ItemAccordion> */}
                    {/* {item.description !== '' && (
                      <ItemAccordionDescription>
                        {T._d(item.description)}
                      </ItemAccordionDescription>
                    )} */}

                    {/* Use OptionItem for normal groups */}
                    {!isSizeAndPaddingType && attributesOpened.get(item.id) && (
        <OptionsContainer>
          <OptionsWrapper>
            {item.options
              .filter((x) => x.enabled)
              .map((option) => (
                <OptionItem
                  key={option.guid}
                  selectedAttribute={selectedAttribute}
                  option={option}
                  hasDescriptionIcon={item.options.some(
                    (x) => x.description
                  )}
                />
              ))}
          </OptionsWrapper>
        </OptionsContainer>
      )}



                 {/* Use OptionItem2 for Size and Padding Type groups */}
                 {isSizeAndPaddingType && attributesOpened.get(item.id) && (
        <OptionsContainer>
          <OptionsWrappers>
            {item.options
              .filter((x) => x.enabled)
              .map((option) => (
                <OptionItem2
                  key={option.guid}
                  selectedAttribute={selectedAttribute}
                  option={option}
                  hasDescriptionIcon={item.options.some(
                    (x) => x.description
                  )}
                />
              ))}
          </OptionsWrappers>
        </OptionsContainer>    
      )}
                  </ItemAccordionContainer>
                );
              else
                return (
                  <>
                    <ItemAccordionContainer key={'container' + item.templateGroupID}>
                      <ItemAccordion
                        key={item.templateGroupID + 'accordion'}
                        opened={attributesOpened.get(item.templateGroupID)}
                        onClick={() =>
                          handleTemplateGroupSelection(item.templateGroupID, true)
                        }
                      >
                        <ItemAccordionName>{T._d(item.name)}</ItemAccordionName>

                        {/* {!selectedGroup.attributesAlwaysOpened && (
                          <ArrowIcon
                            key={'accordion-icon'}
                            src={
                              attributesOpened.get(item.templateGroupID)
                                ? arrowUp
                                : arrowDown
                            }
                          />
                        )} */}
                      </ItemAccordion>

                      {/* {attributesOpened.get(item.templateGroupID) && (
                        <TemplateGroup
                          key={selectedTemplateGroupId + 'vertical'}
                          templateGroup={selectedTemplateGroup!}
                        />
                      )} */}
                    </ItemAccordionContainer>
                  </>
                );
            })}
        </>
          
        {/* )} */}
        
        {(selectedTrayType === "" ||
          selectedTrayType === "null" ) && (
            <div className={`animate-wrapper${isTrayOpen ? "-2 show" : ""}`}>
              {/* {isTrayOpen && !selectedTrayPreviewOpenButton && (
                <Tray
                  groupNameList={selectedGroupList}
                  filteredAreas={filteredAreas}
                  toggleFunc={toggleTray}
                  UpdateGroupId={groupIdFromFunc}
                  updCurrentIndex={updCurrentIndex}
                  selectedTray={selectedTrayType}
                  selectStepName={selectStepName}
                />
              )} */}

              {/* {!isTrayOpen && (
                  <ColorMenuSeleciton
                    productCode={productCode}
                    selectedGroupName={selectedGroup}
                    updateActiveColorOption={updateActiveColorOption}
                    activeColorOption={activeColorOption}
                    currentAttributes={currentAttributes}
                    fitlerAttributesName={fitlerAttributes[0]?.name}
                  />
                )} */}

             
            </div>
          )}
          <div>
      {/* Show Add + Switch only if last group with id === -2 */}
      {selectedGroup?.id === -2 && (
        <div
          style={{ padding: "6px 12px", display: "flex", justifyContent: "space-between" }}
        >
          <p style={{ fontSize: "14px", fontWeight:'600',fontFamily:'sans-serif' }}>Add Text </p>

          {/* Switch Button */}
          <label className="switch">
            <input
              type="checkbox"
              checked={showDesigner}
              onChange={() => setShowDesigner(!showDesigner)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}

      {/* Render Designer only if switch is ON and id === -2 */}
      {showDesigner && selectedGroup?.id === -2 && <Designer />}
    </div>
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
          {dynamicsVals?.get("Back") ?? "Prev"}
        </div>
        {/* </button> */}
        {/* <button className="next-customization" onClick={handleRightClick}> */}
        <div id="gnext" className="mc-next" onClick={handleRightClick}>
          {dynamicsVals?.get("Next") ?? "Next"}
        </div>
        {/* </button> */}
      </div>

      {/* <div className="empty-space-div"></div> */}

      {/* {width <= 460 && <FooterMobile />} */}
    </div>

    {/* {width > 460 && <Footer />} */}
  </>
);
};

export default Selector;
