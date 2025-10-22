import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { useZakeke, ZakekeEnvironment, ZakekeProvider, ZakekeViewer } from "zakeke-configurator-react";
import LayoutDesktop from "./desktop/LayoutDesktop";
import FooterMobile from "./layouts/FooterMobile";
import Selector from "./selector";
import useStore from "../Store";
import { debounce } from "lodash";
import { MessageDialog, useDialogManager } from "./dialog/Dialogs";
import { T } from "../Helpers";

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
    isDraftEditor,
    isEditorMode,
    setIsMobile,
    setLastSelectedItem,
    tagsOfSavedDesigns,
		setTagsOfSavedDesigns
  } = useStore();

  const [resize, setResize] = useState(false);
  const resizeRef = useRef(false);
  resizeRef.current = resize;
  const { showDialog } = useDialogManager();

  const [selectedTrayPreviewOpenButton3D, selectTrayPreviewOpenButton3D] =
    useState<boolean | null>(false);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);
  const [isProductUnpublished, setIsProductUnpublished] = useState(false);
  const [delayedLoading, setDelayedLoading] = useState(true);
  const [flagStartLoading, setFlagStartLoading] = useState(false);
  const trayPreviewOpenButton3DFunc = (selected: boolean) => {
    selectTrayPreviewOpenButton3D(selected);
  };

  // 🔥 ADD THIS: Function to handle group name changes from Selector
  const handleGroupNameChange = (groupName: string) => {
    setSelectedGroupName(groupName || "Customize");
  };

  	// Page resize
	useEffect(() => {
		const resizeFunction = () => {
			setResize(!resizeRef.current);
		};

		window.addEventListener('resize', resizeFunction);
		return () => window.removeEventListener('resize', resizeFunction);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Tags save from saved compositions
	useEffect(() => {
		if (tagsOfSavedDesigns && tagsOfSavedDesigns.length === 0 && draftCompositions && draftCompositions.length > 0) {
			let tempTags: string[] = [];

			if (draftCompositions && draftCompositions.length > 0) {
				draftCompositions.forEach((composition) => {
					if (composition.tags) {
						const actualTags = composition.tags;
						tempTags.push(...actualTags);
					}
				});
			}

			let filteredTags = Array.from(new Set(tempTags));
			setTagsOfSavedDesigns(filteredTags);
			console.log('useeffect tagssaveddesign', tagsOfSavedDesigns);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [draftCompositions]);
	useEffect(() => {
		const handleStatusChange = (event: CustomEvent) => {
			console.log("event")
			console.log('product unpublished:', event.detail.statusID);
			setIsProductUnpublished(true);
		};

		window.addEventListener('productUnpublished', handleStatusChange as EventListener);

		// Cleanup
		return () => {
			window.removeEventListener('productUnpublished', handleStatusChange as EventListener);
		};
	}, []);

	// added a flag because at the very beginning of the loading the isSceneLoading is false
	// requested this delay for the progress bar dialog
	useEffect(() => {
		if (isSceneLoading) setFlagStartLoading(true);
		if (!isSceneLoading && flagStartLoading) setTimeout(() => setDelayedLoading(false), 250);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSceneLoading]);

	// for translations
	useEffect(() => {
		if (translations) {
			T.translations = translations;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [translations]);

	useEffect(() => {
		if (isViewerReady) {
			addFocusAttributesListener((event: { groups: string | any[] }) => {
				if (event.groups.length > 0) {
					setSelectedGroupId(event.groups[0].groupId);
					const group = groups.find((group) => group.id === event.groups[0].groupId);
					if (group && group.steps) {
						const firstStep = group.steps.find((step) =>
							step.attributes.find((attr) => attr.id === event.groups[0].visibleAttributes[0])
						);
						if (firstStep) setSelectedStepId(firstStep.id);
					}
					setLastSelectedItem({ type: 'attribute', id: event.groups[0].visibleAttributes[0] });
					setSelectedAttributeId(event.groups[0].visibleAttributes[0]);
				}
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isViewerReady, selectedGroupId]);

	useEffect(() => {
		setPriceFormatter(
			new Intl.NumberFormat(culture, {
				style: 'currency',
				currency: currency
			})
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [culture, currency]);

	useEffect(() => {
		if (product && !isSceneLoading && !isDraftEditor && !isEditorMode) {
			const personalizedMessage = personalizedMessages?.find((message) => message.eventID === 3);
			const welcomeMessage = eventMessages?.find((message) => message.eventID === 3 && message.isDefault);
			if ((personalizedMessage && personalizedMessage.visible) || (welcomeMessage && welcomeMessage.visible))
				showDialog(
					'WelcomeMessage',
					<MessageDialog
						alignButtons='center'
						message={
							personalizedMessage && personalizedMessage.visible
								? personalizedMessage.description
								: welcomeMessage!.description
						}
					/>
				);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product, isSceneLoading, eventMessages]);


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
  const handleResize = () => {
    setResize(!resizeRef.current);

    // 👇 Add this condition
    if (window.innerWidth <= 1290) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  handleResize(); // run once on mount

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [setIsMobile]);


  return (
    <>
      {!isMobile && (
        <div className="desktop">
          <LayoutDesktop />
          <FooterMobile/>
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
