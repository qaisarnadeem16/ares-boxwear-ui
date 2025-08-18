import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  ZakekeEnvironment,
  ZakekeViewer,
  ZakekeProvider,
  useZakeke
} from "zakeke-configurator-react";
import Selector from "./selector";
import { DialogsRenderer } from "./dialog/Dialogs";
import useStore from "../Store";
import LayoutMobile from './LayoutMobile';
import FooterMobile from "./layouts/FooterMobile";

// const Layout = styled.div`
//     display: grid;
//     grid-template-columns: auto;
//     grid-gap: 40px;
//     height: 100%;
//     padding: 0px;
//     font-family: "Helvetica Now Text",Helvetica,Arial,sans-serif;
// `

const Layout = styled.div`
  // display: flex; 
  // flex  
  // height: 50%;
  // width: 50%
  // padding: 40px;
  // flex-direction: column;

  position: relative;
  display: grid;
  grid-template-rows: 0fr auto auto;
  height: 100%;
  width: 100%;
  overflow: hidden;

  @media screen and (max-width: 568px) {
  grid-template-rows: 75% auto auto !important;
  overflow: auto;
  }
`;

const MobileContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr auto auto;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const zakekeEnvironment = new ZakekeEnvironment();

const App: FunctionComponent<{}> = () => {

  const {
    isLoading,
    setPriceFormatter,
    setSelectedAttributeId,
    setSelectedGroupId,
    setSelectedStepId,
    isMobile,
    selectedGroupId,
    setIsMobile
  } = useStore();

  const [resize, setResize] = useState(false);
  const resizeRef = useRef(false);
  resizeRef.current = resize;

  // Update tray preview open button, to update width height for ThreeDRendered
  const [selectedTrayPreviewOpenButton3D, selectTrayPreviewOpenButton3D] =
    useState<boolean | null>(false);

  const trayPreviewOpenButton3DFunc = (
    selectedTrayPreviewOpenButton3D: any
  ) => {
    selectTrayPreviewOpenButton3D(selectedTrayPreviewOpenButton3D);
  };

  // Page resize
  useEffect(() => {
    const resizeFunction = () => {
      setResize(!resizeRef.current);
    };

    window.addEventListener("resize", resizeFunction);
    return () => window.removeEventListener("resize", resizeFunction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ZakekeProvider environment={zakekeEnvironment}>
      <div id="modal-container" className="css-1q5ttm8">

          {/* Zakeke mobile app  */}
          {/* {isMobile && <LayoutMobile />}  */}
          {isMobile && (
            <Layout>
              <div style={{ 
                // background: "linear-gradient(to top, rgb(244, 247, 249) 20%, rgb(213, 225, 231) 40%, rgb(223, 232, 237))" , 
                width: "100%", border: "0px solid", height: "100%"}}>
                <div
                  className="ThreeDRenderer"
                  style={
                    selectedTrayPreviewOpenButton3D
                      ? { width: "20vw", height: "20vh" }
                      : { 
                         aspectRatio: "1 / 1",
                        width: "100%",  
                        height: "100%",
                        position: "absolute", 
                        top: "0em", 
                        bottom: "0", 

                        // left: "3%",
                        // background: "linear-gradient(to top, rgb(244, 247, 249) 20%, rgb(213, 225, 231) 40%, rgb(223, 232, 237))" 
                      }}
                >
                 <ZakekeViewer />
                </div>
              </div>
              <Selector trayPreviewOpenButton3DFunc={trayPreviewOpenButton3DFunc} />              
            </Layout>            
          )}
      
          {!isMobile && (
            <Layout>
              <div
                id='threec'
                style={{
                  display: "grid",
                  alignItems: "center",
                  justifyContent: "center",
                  // gridArea: "1 / 2 / 12 / 1",
                  // background: "linear-gradient(to top, rgb(244, 247, 249) 20%, rgb(213, 225, 231) 40%, rgb(223, 232, 237))",
                }}
              >
                <div
                  className="ThreeDRenderer"
                  style={
                    selectedTrayPreviewOpenButton3D
                      ? { width: "63vw", height: "67vh" }
                      : { width: "85vw", height: "94vh", marginTop: "26px" }
                  }
                >
                  <ZakekeViewer />
                </div>
              </div>
              <Selector
                trayPreviewOpenButton3DFunc={trayPreviewOpenButton3DFunc}
              />
            </Layout>
          )}

          {/* {(isLoading || isSceneLoading || isAssetsLoading) && <LoadingOverlay />} */}
          <DialogsRenderer />
        </div>
      {/* </div> */}
    </ZakekeProvider>
  );
};

export default App;