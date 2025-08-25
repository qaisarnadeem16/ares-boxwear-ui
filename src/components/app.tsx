import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useZakeke, ZakekeEnvironment, ZakekeProvider, ZakekeViewer } from "zakeke-configurator-react";
import LayoutDesktop from "./desktop/LayoutDesktop";
import FooterMobile from "./layouts/FooterMobile";
import Selector from "./selector";
import useStore from "../Store";

const zakekeEnvironment = new ZakekeEnvironment();

// STEP 2: Update your App component to handle group name changes

const AppContent: FunctionComponent = () => {
  const {
    eventMessages,
    personalizedMessages,
    product,
    isSceneLoading,
    isAssetsLoading,
    culture,
    currency,
    groups,
    addFocusAttributesListener,
    isViewerReady,
    translations,
    items,
    setItemText,
    visibleEventMessages,
    draftCompositions
  } = useZakeke();

  const {
    isLoading,
    setPriceFormatter,
    setSelectedAttributeId,
    setSelectedGroupId,
    setSelectedStepId,
    isMobile,
    selectedGroupId,
    setIsMobile,
    setLastSelectedItem
  } = useStore();

  const [resize, setResize] = useState(false);
  const resizeRef = useRef(false);
  resizeRef.current = resize;

  const [selectedTrayPreviewOpenButton3D, selectTrayPreviewOpenButton3D] =
    useState<boolean | null>(false);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);

  const trayPreviewOpenButton3DFunc = (selected: boolean) => {
    selectTrayPreviewOpenButton3D(selected);
  };

  // 🔥 ADD THIS: Function to handle group name changes from Selector
  const handleGroupNameChange = (groupName: string) => {
    setSelectedGroupName(groupName || "Customize");
  };

  useEffect(() => {
    // 👉 on initial load, set first group name
    if (groups && groups.length > 0 && !selectedGroupName) {
        const firstGroupName = groups[0].name || "Customize"; // 🔥 Fallback to "Customize"
      setSelectedGroupName(firstGroupName);
      setSelectedGroupId(groups[0].id);

      if (groups[0].steps && groups[0].steps.length > 0) {
        setSelectedStepId(groups[0].steps[0].id);
      }
    }
  }, [groups, selectedGroupName, setSelectedGroupId, setSelectedStepId]);

  useEffect(() => {
    if (isViewerReady) {
      addFocusAttributesListener((event: { groups: any[] }) => {
        if (event.groups.length > 0) {
          setSelectedGroupId(event.groups[0].groupId);

          const group = groups.find((g) => g.id === event.groups[0].groupId);
          if (group) {
            setSelectedGroupName(group.name || "Customize");
            if (group.steps) {
              const firstStep = group.steps.find((step) =>
                step.attributes.find(
                  (attr) => attr.id === event.groups[0].visibleAttributes[0]
                )
              );
              if (firstStep) setSelectedStepId(firstStep.id);
            }
          }

          setLastSelectedItem({
            type: "attribute",
            id: event.groups[0].visibleAttributes[0],
          });
          setSelectedAttributeId(event.groups[0].visibleAttributes[0]);
        }
      });
    }
  }, [isViewerReady, groups, setSelectedGroupId, setSelectedStepId, setLastSelectedItem, setSelectedAttributeId]);

  useEffect(() => {
    const resizeFunction = () => {
      setResize(!resizeRef.current);
    };

    window.addEventListener("resize", resizeFunction);
    return () => window.removeEventListener("resize", resizeFunction);
  }, []);

  return (
    <>
      {!isMobile && (
        <div className="desktop">
          <LayoutDesktop />
        </div>
      )}

      {isMobile && (
        <div style={{ width: "100%", height: "100%", border: "0px solid" }}>
          <div className="mobileThreeDRenderer">
            <ZakekeViewer
              bgColor="linear-gradient(to top, rgb(244, 247, 249) 20%, rgb(213, 225, 231) 40%, rgb(223, 232, 237))"
            />
          </div>
          <FooterMobile />
          <div className="mobileSelector">
            <Selector 
              trayPreviewOpenButton3DFunc={trayPreviewOpenButton3DFunc}  
              selectedGroupName={selectedGroupName || "Customize"}
              onGroupNameChange={handleGroupNameChange} 
            />
          </div>
        </div>
      )}
    </>
  );
};

const App: FunctionComponent = () => (
  <ZakekeProvider environment={zakekeEnvironment}>
    <AppContent />
  </ZakekeProvider>
);

export default App;
