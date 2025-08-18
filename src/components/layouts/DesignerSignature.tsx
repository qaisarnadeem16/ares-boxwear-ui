import {
  ZakekeImage as Image,
  ImageItem,
  Item,
  ProductArea,
  TemplateArea,
  TextItem,
  ZakekeDesigner,
  useZakeke,
} from "zakeke-configurator-react";
import useStore from "../../Store";
import React, { FC, useEffect, useRef, useState } from "react";
import Select, {
  GroupBase,
  OptionProps,
  SingleValueProps,
  components
} from "react-select";
import styled from "styled-components/macro";
import { T } from "../../Helpers";
import { ReactComponent as ArrowLeftIcon } from "../../assets/icons/arrow-left-solid.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/icons/arrow-right-solid.svg";
import { ReactComponent as Arrows } from "../../assets/icons/arrows-alt-solid.svg";
import { ReactComponent as Add } from "../../assets/icons/plus-circle-solid.svg";
import { ReactComponent as SearchMinusSolid } from "../../assets/icons/search-minus-solid.svg";
import { ReactComponent as SearchPlusSolid } from "../../assets/icons/search-plus-solid.svg";
import {
  ArrowLeft,
  ArrowLeftIconStyled,
  ArrowRight,
  ArrowRightIconStyled,
  Button,
  Button_N,
  CarouselContainer,
  CloseEditorButton,
  Icon,
} from "../Atomic";
import AddTextDialog from "../dialog/AddTextDialog";
import { useDialogManager } from "../dialog/Dialogs";
import ErrorDialog from "../dialog/ErrorDialog";
import ImagesGalleryDialog from "../dialog/ImagesGalleryDialog";
import ItemImage, { EditImageItem } from "../widgets/ItemImage";
import ItemText, { EditTextItem } from "../widgets/ItemText";
import {
  Center,
  IconsAndDesignerContainer,
  SelectContainer,
  SupportedFormatsList,
  Template,
  TemplatesContainer,
  ZakekeDesignerContainer,
  ZakekeDesignerContainer_button,
  ZoomInIcon,
  ZoomOutIcon,
} from "./LayoutStyled";

export type PropChangeHandler = (
  item: EditTextItem | EditImageItem,
  prop: string,
  value: string | boolean | File
) => void;

export interface TranslatedTemplate {
  id: number;
  name: string;
}

const ZoomIconIn = styled(ZoomInIcon)`
  left: 0px;
`;
const ZoomIconOut = styled(ZoomOutIcon)`
  left: 0px;
`;

const MoveElementButton = styled(Button_N)`
  /* position: absolute;
	bottom: 0; */
`;

const DesignerContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  flex-flow: column;
  // flex-wrap: wrap;
  user-select: none;
  width: 100%;
  // padding: 15px 15px 30px;
  padding: 10px 10px;
  height: 23em;
  overflow-y: auto;
  font-family: Inter, sans-serif;
  border-radius: 23px;
  overflow-x: hidden;

  ${(props) =>
    props.isMobile &&
    `
    height: 15em;
    overflow-y: auto;
        // position:fixed;
        // top:0;
        // left:0;
        // width:100%;
        // height:100%;
        // z-index:11;
        // background-color:#ffffff;
        // overflow-y:scroll;
    `}
`;

const DesignerContainerHeader = styled.div<{}>`
    display: flex;
    flex-flow: row;
`;

const UploadButtons = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 5px;
  margin: 7px 0px;
`;

const Area = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: center;
  justify-content: space-around;
  align-items: left;
  height: 60px;
  min-width: 34px;
  width: 34%;
  cursor: pointer;
  padding: 1px 34x;
  text-align: center;
  margin: 0;
  margin-bottom: 18px;
  color: black;

  word-break: break-all;
  overflow-wrap: break-word;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0px;
  word-spacing: 1px;

  border: 1px solid #297CA3;
  font-size: 10px;
  border-radius: 4px;
  background-color: white;
  color: #297CA3;


  &:hover {
    border: 3px solid #297CA3;
  }

  ${(props) =>
    props.selected &&
    `
	border: 4px solid #297CA3;
    `}
`;

const OptionContainer = styled(components.Option)`
  // width: 100%;
  // padding: 31px;
  border: 1px solid #297ca3;
  background-color: white !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  span {
    color: #297ca3;
  }
  &:hover {
    background-color: #ddd !important;
  }
`;

const SingleValueContainer = styled(components.SingleValue)`
  // width: 100%;
  border: 1px solid none;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: #297ca3;
  }
`;

const DesignerSignature: FC<{
  onCloseClick?: () => void;
  togglePersonalize?: () => void;
  selectedAreaID?: any;
}> = ({ onCloseClick, togglePersonalize, selectedAreaID}) => {
  const { showDialog, closeDialog } = useDialogManager();
  const [forceUpdate, setForceUpdate] = useState(false);
  const { setIsLoading, isMobile } = useStore();

  const {
    currentTemplate,
    items,
    isAreaVisible,
    product,
    templates,
    setTemplate,
    setCamera,
    removeItem,
    setItemText,
    setItemItalic,
    setItemBold,
    setItemColor,
    setItemFontFamily,
    setItemTextOnPath,
    addItemText,
    translations,
    fonts,
    defaultColor 
  } = useZakeke();

  interface EditTextItem_1 {
    guid: string,
    name: string,
    text: string,
    fillColor: string,
    fontFamily: string,
    fontWeight: string,
    fontSize: number,
    isTextOnPath: boolean;
    constraints: { [key: string]: any } | null,
    placeholder: string,
    backgroundColor: string
}

   const [item, setItem] = useState<EditTextItem_1>({
      guid: '',
      name: '',
      text: "",
      fillColor: defaultColor,
      fontFamily: fonts[0].name,
      fontSize: 48,
      fontWeight: 'normal normal',
      isTextOnPath: false,
      constraints: null,  
      placeholder: 'Input your text here',
      backgroundColor: 'rgb(235, 237, 242)'
  })

  const dynamicVals = translations?.dynamics;
  const staticsVals = translations?.statics; 
  
  const customizerRef = useRef<any | null>(null);
  const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);

  const filteredAreas =
    product?.areas.filter((area) => isAreaVisible(area.id)) ?? [];
    
  let finalVisibleAreas: ProductArea[] = [];

  const [moveElements, setMoveElements] = useState(false);

  let translatedTemplates = templates.map((template) => {
    return { id: template.id, name: template.name, areas: template.areas };
  });

  // console.log(translatedTemplates,'translatedTemplates');

  let translatedCurrentTemplate = {
    id: currentTemplate?.id,
    name: currentTemplate?.name ?? "",
    areas: currentTemplate?.areas,
  };

  
  let translatedAreas = filteredAreas.map((area) => {
    return { id: area.id, name: area.name };
  });

  filteredAreas.length > 0 &&
    filteredAreas.forEach((filteredArea) => {
      
      let currentTemplateArea = currentTemplate!.areas.find(
        (x) => x.id === filteredArea.id
        );
    
      let itemsOfTheArea = items.filter(
        (item) => item.areaId === filteredArea.id
      );
      const areAllItemsStatic = !itemsOfTheArea.some((item) => {
        return (
          !item.constraints ||
          item.constraints.canMove ||
          item.constraints.canRotate ||
          item.constraints.canResize ||
          item.constraints.canEdit
        );
      });
      if (
        !areAllItemsStatic ||
        !currentTemplateArea ||
        // currentTemplateArea?.canAddImage ||
        currentTemplateArea?.canAddText
      )
        finalVisibleAreas.push(filteredArea);
    });    

    // console.log(finalVisibleAreas,'total visible area');
    

  const [actualAreaId, setActualAreaId] = useState<number>(
    finalVisibleAreas && finalVisibleAreas.length > 0
      ? finalVisibleAreas[0].id
      : 0
  );

  let currentTemplateArea = currentTemplate!.areas.find(
    (x) => x.id === actualAreaId
  );


  let itemsFiltered = items.filter((item) => item.areaId === actualAreaId);
  
  const allStaticElements = !itemsFiltered.some((item) => {
    return (
      !item.constraints ||
      item.constraints.canMove ||
      item.constraints.canRotate ||
      item.constraints.canResize
    );
  });
  const showAddTextButton =
    !currentTemplateArea || currentTemplateArea.canAddText;
  const showUploadButton =
    !currentTemplateArea ||
    (currentTemplateArea.canAddImage &&
      currentTemplateArea.uploadRestrictions.isUserImageAllowed);

  const slidesToShow = window.innerWidth <= 1600 ? 3 : 4;

  useEffect(() => {
    if (templates.length > 0 && !currentTemplate) setTemplate(templates[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  useEffect(() => {
    const area = filteredAreas.filter((a) => a.id === actualAreaId);
    if (area && area.length > 0) setCamera(area[0].cameraLocationID as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualAreaId]);

  useEffect(() => {
    // if (finalVisibleAreas.length > 0 && actualAreaId === 0){
    //   setActualAreaId(finalVisibleAreas[0].id);
    //   // console.log(finalVisibleAreas[0],'finalVisibleAreas');    
    // }

    if(selectedAreaID) setActualAreaId(selectedAreaID);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalVisibleAreas]);

  
  const isItemEditable = (item: Item, templateArea?: TemplateArea) => {
    if (!item.constraints) return false;

    let {
      canEdit,
      canMove,
      canRotate,
      canResize,
      canDelete,
      canChangeFontColor,
      canChangeFontFamily,
      canChangeFontWeight,
      isPrintable,
    } = item.constraints;

    if (!isPrintable) return false;

    let common = canEdit || canMove || canRotate || canResize || canDelete;
    let text = canChangeFontColor || canChangeFontFamily || canChangeFontWeight;
    let image =
      canEdit ||
      (templateArea &&
        (templateArea.uploadRestrictions.isUserImageAllowed ||
          !templateArea.disableSellerImages));

    if (item.type === 0) return common || text;
    else return common || image;
  };

  const handleAddTextClick = () => {

    const itemText ={
      guid: '',
      name: '',
      text: `${dynamicVals?.get("Enter Your Name") ?? "Enter Your Name"}`,
      fillColor: defaultColor,
      fontFamily: fonts[0].name,
      fontSize: 48,
      fontWeight: 'normal normal',
      isTextOnPath: false,
      constraints: null,  
      placeholder: 'Input your text here',
      backgroundColor: 'rgb(235, 237, 242)'
  }
    addItemText(itemText, actualAreaId);
  };


  const handleItemRemoved = (guid: string) => {
    removeItem(guid);
  };

 
  const handleItemPropChange = (
    item: EditTextItem | EditImageItem,
    prop: string,
    value: string | boolean | File
  ) => {
    switch (prop) {
      case "remove":
        handleItemRemoved(item.guid);
        break;
      case "text":
        setItemText(item.guid, value as string);
        break;
      case "font-italic":
        setItemItalic(item.guid, value as boolean);
        break;
      case "font-bold":
        setItemBold(item.guid, value as boolean);
        break;
      case "font-color":
        setItemColor(item.guid, value as string);
        break;
      case "font-family":
        setItemFontFamily(item.guid, value as string);
        break;
      case "text-path":
        setItemTextOnPath(item.guid, actualAreaId, value as boolean);
        setTimeout(() => setForceUpdate(!forceUpdate), 100);
        break;
    }
  };

  const SelectOption = (
    props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>
  ) => {
    return (
      <OptionContainer {...props}>
        {<span>{props.data.name}</span>}
      </OptionContainer>
    );
  };

  const SelectSingleValue = (
    props: JSX.IntrinsicAttributes &
      SingleValueProps<any, boolean, GroupBase<any>>
  ) => {
    return (
      <SingleValueContainer {...props}>
        {<span>{props.data.name}</span>}
      </SingleValueContainer>
    );
  };
  
  return (
    <>
      {!moveElements && (
        <DesignerContainer isMobile={isMobile}>
          {/* Templates */}
          {/* {!isMobile && templates.length > 1 && (
            <TemplatesContainer>
              {templates.map((template) => (
                <Template
                  key={template.id}
                  selected={currentTemplate === template}
                  onClick={() => {
                    setTemplate(template.id);
                  }}
                >
                  {template.name}
                </Template>
              ))}
            </TemplatesContainer>
          )} */}

          {/* Areas */}
          {/* Closed because now its done on next button */}
          {/* <DesignerContainerHeader>
          {!isMobile && finalVisibleAreas.length > 1 && (
              finalVisibleAreas.map((area:any) => (              
                <Area
                  key={area.id}
                  selected={actualAreaId === area.id}
                  onClick={() => setActualAreaId(area.id)}
                >
                  {area.name}
                </Area>
              ))
           )}
          </DesignerContainerHeader> */}
          

          {isMobile && translatedTemplates.length > 1 && (
            <SelectContainer>
              <span>{"Templates"}</span>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    minWidth: 300
                  }),
                }}
                isSearchable={false}
                options={translatedTemplates}
                menuPosition="fixed"
                components={{
                  Option: SelectOption,
                  SingleValue: SelectSingleValue,
                }}
                value={translatedTemplates!.find(
                  (x) => x.id === translatedCurrentTemplate.id
                )}
                onChange={(template: any) => {
                  setTemplate(template.id)
                }}
              />
            </SelectContainer>
          )}
          {isMobile && translatedAreas.length > 1 && (
            // <SelectContainer>
            //   {/* <span>{T._("Customizable Areas", "Composer")}</span> */}
            //   <span>{dynamicVals?.get('Customizable Areas')}</span>              
            //   <Select
            //     styles={{
            //       control: (base) => ({
            //         ...base,
            //         width: '100% !important',
            //         display: 'flex !important',
            //         alignItems: 'center !important',
            //         justifyContent: 'center !important',
            //       }),
            //     }}
            //     isSearchable={false}
            //     options={translatedAreas}
            //     menuPosition="fixed"
            //     components={{
            //       Option: SelectOption,
            //       SingleValue: SelectSingleValue,
            //     }}
            //     value={[translatedAreas!.find((x) => x.id === actualAreaId)]}
            //     onChange={(area: any) => setActualAreaId(area.id)}
            //   />
            // </SelectContainer>
            <></>
          )}

          {itemsFiltered.length === 0 &&
            !(showAddTextButton || showUploadButton) && (
              <Center>{"No customizable items"}</Center>
            )}


          {itemsFiltered.map((item) => {
            if (item.type === 0 && isItemEditable(item, currentTemplateArea))
              return (
                <ItemText
                  key={item.guid}
                  handleItemPropChange={handleItemPropChange}
                  item={item as TextItem}
                />
              );            
            return null;
          })}

          {(showAddTextButton || showUploadButton) && (
            <UploadButtons>
              <>  
              {showAddTextButton && (
                <Button_N isFullWidth onClick={handleAddTextClick}>
                  <Icon>
                    <Add />
                  </Icon>
                  <span>{staticsVals?.get('Text') ?? 'Text'}   </span>
                </Button_N>
              )}
              </>              
            </UploadButtons>
          )}
          {itemsFiltered.length > 0 && !allStaticElements && (
            <MoveElementButton
              isFullWidth
              isMoveElementButton
              outline
              onClick={() => setMoveElements(true)}
            >
              <Icon>
                <Arrows />
              </Icon>
              <span>{T._("Move elements", "Composer")} </span>
            </MoveElementButton>
          )}
          {/* {isMobile && (
            <CloseEditorButton onClick={onCloseClick}>
              {"OK"}
            </CloseEditorButton>
          )} */}
        </DesignerContainer>
      )}
      {moveElements && (
        <ZakekeDesignerContainer
          isMobile={isMobile}
          className="zakeke-container"
        >         
          {/* <ZakekeDesigner ref={customizerRef} areaId={actualAreaId} />                    */}

          <div className="wrapper" style={{height: "100%"}}>
          <ZakekeDesigner ref={customizerRef} areaId={actualAreaId} />
         </div>

         <ZakekeDesignerContainer_button isMobile={isMobile}>
          <Button  isFullWidth primary onClick={() => setMoveElements(false)}>
            Close X
          </Button>         
         </ZakekeDesignerContainer_button>
        </ZakekeDesignerContainer>
      )}
    </>
  );
};

export default DesignerSignature;
