import {
  Image,
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
  components,
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

// interface EditTextItem {
//   guid: string,
//   name: string,
//   text: string,
//   fillColor: string,
//   fontFamily: string,
//   fontWeight: string,
//   fontSize: number,
//   isTextOnPath: boolean;
//   constraints: { [key: string]: any } | null,
//   placeholder: string,
//   backgroundColor: string
// }

export function DesignerHelper() {
  // const { showDialog, closeDialog } = useDialogManager();
  // const [forceUpdate, setForceUpdate] = useState(false);
  // const { setIsLoading, isMobile } = useStore();

  const {
    currentTemplate,
    items,
    isAreaVisible,
    product,
    templates,
    setTemplate,
    setCamera,
    removeItem,
    setItemImageFromFile,
    setItemImage,
    setItemText,
    setItemItalic,
    setItemBold,
    setItemColor,
    setItemFontFamily,
    setItemTextOnPath,
    addItemText,
    addItemImage,
    createImage,
    getTemplateUploadRestrictictions,
    eventMessages,
    setCopyrightMessageAccepted,
    getCopyrightMessageAccepted,
    translations,
    fonts,
    defaultColor,
  } = useZakeke();

  //   interface EditTextItem_1 {
  //     guid: string,
  //     name: string,
  //     text: string,
  //     fillColor: string,
  //     fontFamily: string,
  //     fontWeight: string,
  //     fontSize: number,
  //     isTextOnPath: boolean;
  //     constraints: { [key: string]: any } | null,
  //     placeholder: string,
  //     backgroundColor: string
  // }

  //  const [item, setItem] = useState<EditTextItem_1>({
  //     guid: '',
  //     name: '',
  //     text: "",
  //     fillColor: defaultColor,
  //     fontFamily: fonts[0].name,
  //     fontSize: 48,
  //     fontWeight: 'normal normal',
  //     isTextOnPath: false,
  //     constraints: null,
  //     placeholder: 'Input your text here',
  //     backgroundColor: 'rgb(235, 237, 242)'
  // })

  const dynamicVals = translations?.dynamics;

  // const customizerRef = useRef<any | null>(null);
  // const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);
  // console.log(product,'product');
  const filteredAreas =
    product?.areas.filter((area) => isAreaVisible(area.id)) ?? [];

  let finalVisibleAreas = [];

  // const [moveElements, setMoveElements] = useState(false);

  let translatedTemplates = templates.map((template) => {
    return { id: template.id, name: template.name, areas: template.areas };
  });

  // console.log(translatedTemplates, filteredAreas, "translatedTemplates");

  return filteredAreas;

  //   let translatedCurrentTemplate = {
  //     id: currentTemplate?.id,
  //     name: currentTemplate?.name ?? "",
  //     areas: currentTemplate?.areas,
  //   };
  //   let translatedAreas = filteredAreas.map((area) => {
  //     return { id: area.id, name: area.name };
  //   });

  //   filteredAreas.length > 0 &&
  //     filteredAreas.forEach((filteredArea) => {
  //       let currentTemplateArea = currentTemplate.areas.find(
  //         (x) => x.id === filteredArea.id
  //       );
  //       let itemsOfTheArea = items.filter(
  //         (item) => item.areaId === filteredArea.id
  //       );
  //       const areAllItemsStatic = !itemsOfTheArea.some((item) => {
  //         return (
  //           !item.constraints ||
  //           item.constraints.canMove ||
  //           item.constraints.canRotate ||
  //           item.constraints.canResize ||
  //           item.constraints.canEdit
  //         );
  //       });
  //       if (
  //         !areAllItemsStatic ||
  //         !currentTemplateArea ||
  //         currentTemplateArea?.canAddImage ||
  //         currentTemplateArea?.canAddText
  //       )
  //         finalVisibleAreas.push(filteredArea);
  //     });

  //   // const [actualAreaId, setActualAreaId] = useState(
  //   //   finalVisibleAreas && finalVisibleAreas.length > 0
  //   //     ? finalVisibleAreas[0].id
  //   //     : 0
  //   // );

  //   let actualAreaId = finalVisibleAreas[0].id;

  //   let currentTemplateArea = currentTemplate.areas.find(
  //     (x) => x.id === actualAreaId
  //   );

  //   // console.log(currentTemplateArea, 'sdffsadfdaf');

  //   // itemFiltered has the values of all the texts or images loaded to the product
  //   let itemsFiltered = items.filter((item) => item.areaId === actualAreaId);

  //  console.log(itemsFiltered, 'itemsFiltered');
  //   return items.filter((item) => item.areaId === actualAreaId);

  //    const allStaticElements = !itemsFiltered.some((item) => {
  //     return (
  //       !item.constraints ||
  //       item.constraints.canMove ||
  //       item.constraints.canRotate ||
  //       item.constraints.canResize
  //     );
  //   });

  //   const showAddTextButton =
  //     !currentTemplateArea || currentTemplateArea.canAddText;
  //   const showUploadButton =
  //     !currentTemplateArea ||
  //     (currentTemplateArea.canAddImage &&
  //       currentTemplateArea.uploadRestrictions.isUserImageAllowed);
  //   const showGalleryButton =
  //     !currentTemplateArea ||
  //     (currentTemplateArea.canAddImage &&
  //       !currentTemplateArea.disableSellerImages);

  //   const supportedFileFormats = getSupportedUploadFileFormats(
  //     currentTemplate.id,
  //     actualAreaId
  //   ).join(", ");

  // const [copyrightMandatoryCheckbox, setCopyrightMandatoryCheckbox] = useState(
  //   getCopyrightMessageAccepted()
  // );
  // const copyrightMessage =
  //   eventMessages && eventMessages.find((message) => message.eventID === 8);

  // const slidesToShow = window.innerWidth <= 1600 ? 3 : 4;

  // useEffect(() => {
  //   if (templates.length > 0 && !currentTemplate) setTemplate(templates[0].id);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [templates]);

  // useEffect(() => {
  //   const area = filteredAreas.filter((a) => a.id === actualAreaId);
  //   if (area && area.length > 0) setCamera(area[0].cameraLocationID);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [actualAreaId]);

  // useEffect(() => {
  //   if (finalVisibleAreas.length > 0 && actualAreaId === 0)
  //     setActualAreaId(finalVisibleAreas[0].id);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [finalVisibleAreas]);

  // function getSupportedUploadFileFormats(templateId, areaId) {
  //   const restrictions = getTemplateUploadRestrictictions(templateId, areaId);
  //   const fileFormats = [];

  //   if (restrictions.isJpgAllowed) fileFormats.push(".jpg", ".jpeg");

  //   if (restrictions.isPngAllowed) fileFormats.push(".png");

  //   if (restrictions.isSvgAllowed) fileFormats.push(".svg");

  //   if (restrictions.isEpsAllowed) fileFormats.push(".eps");

  //   if (restrictions.isPdfAllowed) fileFormats.push(".pdf");

  //   return fileFormats;
  // }

  // console.log(addItemText,itemsFiltered,currentTemplateArea,'aaaaaa');
  //console.log(addItemText,'ssssaaaa')

  // const isItemEditable = (item, templateArea) => {
  //   if (!item.constraints) return false;

  //   let {
  //     canEdit,
  //     canMove,
  //     canRotate,
  //     canResize,
  //     canDelete,
  //     canChangeFontColor,
  //     canChangeFontFamily,
  //     canChangeFontWeight,
  //     isPrintable,
  //   } = item.constraints;

  //   if (!isPrintable) return false;

  //   let common = canEdit || canMove || canRotate || canResize || canDelete;
  //   let text = canChangeFontColor || canChangeFontFamily || canChangeFontWeight;
  //   let image =
  //     canEdit ||
  //     (templateArea &&
  //       (templateArea.uploadRestrictions.isUserImageAllowed ||
  //         !templateArea.disableSellerImages));

  //   if (item.type === 0) return common || text;
  //   else return common || image;
  // };

  // const handleAddTextClick = () => {

  //   const itemText ={
  //     guid: '',
  //     name: '',
  //     text: "Enter your name",
  //     fillColor: defaultColor,
  //     fontFamily: fonts[0].name,
  //     fontSize: 48,
  //     fontWeight: 'normal normal',
  //     isTextOnPath: false,
  //     constraints: null,
  //     placeholder: 'Input your text here',
  //     backgroundColor: 'rgb(235, 237, 242)'
  // }

  //   console.log(itemText,actualAreaId,'add text');
  //   addItemText(itemText, actualAreaId);

  //   // showDialog(
  //   //   "add-text",
  //   //   <AddTextDialog
  //   //     onClose={() => closeDialog("add-text")}
  //   //     onConfirm={(item) => {
  //   //       // console.log(item,actualAreaId,'add text');

  //   //       addItemText(item, actualAreaId);
  //   //       closeDialog("add-text");
  //   //     }}
  //   //   />
  //   // );
  // };

  // const SelectOption = (
  //   props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>
  // ) => {
  //   return (
  //     <OptionContainer {...props}>
  //       {<span>{props.data.name}</span>}
  //     </OptionContainer>
  //   );
  // };

  // const SelectSingleValue = (
  //   props: JSX.IntrinsicAttributes &
  //     SingleValueProps<any, boolean, GroupBase<any>>
  // ) => {
  //   return (
  //     <SingleValueContainer {...props}>
  //       {<span>{props.data.name}</span>}
  //     </SingleValueContainer>
  //   );
  // };

  // console.log(isItemEditable,'isItemEditable');

  // return (
  // <>
  //   {!moveElements && (
  //     <DesignerContainer isMobile={isMobile}>
  //       {/* Templates */}
  //       {!isMobile && templates.length > 1 && (
  //         <TemplatesContainer>
  //           {templates.map((template) => (
  //             <Template
  //               key={template.id}
  //               selected={currentTemplate === template}
  //               onClick={() => {
  //                 setTemplate(template.id);
  //               }}
  //             >
  //               {template.name}
  //             </Template>
  //           ))}
  //         </TemplatesContainer>
  //       )}

  //       {/* Areas */}
  //       {!isMobile && finalVisibleAreas.length > 1 && (
  //           finalVisibleAreas.map((area:any) => (
  //             <Area
  //               key={area.id}
  //               selected={actualAreaId === area.id}
  //               onClick={() => setActualAreaId(area.id)}
  //             >
  //               {area.name}
  //             </Area>
  //           ))
  //        )}

  //       {isMobile && translatedTemplates.length > 1 && (
  //         <SelectContainer>
  //           <span>{"Templates"}</span>
  //           <Select
  //             styles={{
  //               container: (base) => ({
  //                 ...base,
  //                 minWidth: 300
  //               }),
  //             }}
  //             isSearchable={false}
  //             options={translatedTemplates}
  //             menuPosition="fixed"
  //             components={{
  //               Option: SelectOption,
  //               SingleValue: SelectSingleValue,
  //             }}
  //             value={translatedTemplates!.find(
  //               (x) => x.id === translatedCurrentTemplate.id
  //             )}
  //             onChange={(template: any) => setTemplate(template.id)}
  //           />
  //         </SelectContainer>
  //       )}
  //       {isMobile && translatedAreas.length > 1 && (
  //         <SelectContainer>
  //           <span>{dynamicVals?.get('Customizable Areas')}</span>
  //           <Select
  //             styles={{
  //               control: (base) => ({
  //                 ...base,
  //                 width: '100% !important',
  //                 display: 'flex !important',
  //                 alignItems: 'center !important',
  //                 justifyContent: 'center !important',
  //               }),
  //             }}
  //             isSearchable={false}
  //             options={translatedAreas}
  //             menuPosition="fixed"
  //             components={{
  //               Option: SelectOption,
  //               SingleValue: SelectSingleValue,
  //             }}
  //             value={[translatedAreas!.find((x) => x.id === actualAreaId)]}
  //             onChange={(area: any) => setActualAreaId(area.id)}
  //           />
  //         </SelectContainer>
  //       )}

  //       {itemsFiltered.length === 0 &&
  //         !(showAddTextButton || showUploadButton || showGalleryButton) && (
  //           <Center>{"No customizable items"}</Center>
  //         )}

  //       {itemsFiltered.map((item) => {
  //         if (item.type === 0 && isItemEditable(item, currentTemplateArea))
  //           return (
  //             <ItemText
  //               key={item.guid}
  //               handleItemPropChange={handleItemPropChange}
  //               item={item as TextItem}
  //             />
  //           );
  //         else if (
  //           item.type === 1 &&
  //           isItemEditable(item, currentTemplateArea)
  //         )
  //           return (
  //             <ItemImage
  //               uploadImgDisabled={
  //                 copyrightMessage && copyrightMessage.additionalData.enabled
  //                   ? !copyrightMandatoryCheckbox
  //                   : false
  //               }
  //               key={item.guid}
  //               handleItemPropChange={handleItemPropChange}
  //               item={item as ImageItem}
  //               currentTemplateArea={currentTemplateArea!}
  //             />
  //           );

  //         return null;
  //       })}

  //       {(showAddTextButton || showUploadButton || showGalleryButton) && (
  //         <UploadButtons>
  //           <>
  //           {showAddTextButton && (
  //             <Button isFullWidth onClick={handleAddTextClick}>
  //               <Icon>
  //                 <Add />
  //               </Icon>
  //               <span>{T._("Adaugă Text", "Composer")}</span>
  //             </Button>
  //           )}
  //           </>

  //           {showGalleryButton && (
  //             <Button isFullWidth onClick={handleAddImageFromGalleryClick}>
  //               <Icon>
  //                 <Add />
  //               </Icon>
  //               <span>{T._("Adaugă Logo", "Composer")}</span>
  //             </Button>
  //           )}

  //           {showUploadButton && (
  //             <>
  //               <Button
  //                 disabled={
  //                   copyrightMessage &&
  //                   copyrightMessage.additionalData.enabled
  //                     ? !copyrightMandatoryCheckbox
  //                     : false
  //                 }
  //                 isFullWidth
  //                 onClick={() =>
  //                   handleUploadImageClick(addItemImage, createImage)
  //                 }
  //               >
  //                 <Icon>
  //                   <Add />
  //                 </Icon>
  //                 <span>
  //                   <span>
  //                     {itemsFiltered.some(
  //                       (item) =>
  //                         item.type === 1 &&
  //                         isItemEditable(item, currentTemplateArea)
  //                     )
  //                       ? T._("Upload another image", "Composer")
  //                       : dynamicVals?.get('Upload image') // T._("Upload image", "Composer")
  //                       }{" "}
  //                   </span>
  //                 </span>
  //               </Button>
  //             </>
  //           )}
  //           <SupportedFormatsList>
  //             {T._("Supported file formats:", "Composer") +
  //               " " +
  //               supportedFileFormats}
  //           </SupportedFormatsList>

  //           {copyrightMessage && copyrightMessage.visible && (
  //             <CopyrightMessage>
  //               <div
  //                 dangerouslySetInnerHTML={{
  //                   __html: copyrightMessage.description,
  //                 }}
  //               />
  //               {copyrightMessage &&
  //                 copyrightMessage.additionalData.enabled && (
  //                   <CopyrightMandatoryMessageContainer>
  //                     <CopyrightCheckbox
  //                       type="checkbox"
  //                       defaultChecked={copyrightMandatoryCheckbox}
  //                       onClick={() => {
  //                         setCopyrightMessageAccepted(
  //                           !copyrightMandatoryCheckbox
  //                         );
  //                         setCopyrightMandatoryCheckbox(
  //                           !copyrightMandatoryCheckbox
  //                         );
  //                       }}
  //                     />
  //                     <CopyrightMandatoryMessage
  //                       dangerouslySetInnerHTML={{
  //                         __html: copyrightMessage.additionalData.message,
  //                       }}
  //                     />
  //                   </CopyrightMandatoryMessageContainer>
  //                 )}
  //             </CopyrightMessage>
  //           )}
  //         </UploadButtons>
  //       )}
  //       {itemsFiltered.length > 0 && !allStaticElements && (
  //         <MoveElementButton
  //           isFullWidth
  //           outline
  //           onClick={() => setMoveElements(true)}
  //         >
  //           <Icon>
  //             <Arrows />
  //           </Icon>
  //           <span>{T._("Move elements", "Composer")} </span>
  //         </MoveElementButton>
  //       )}
  //       {isMobile && (
  //         <CloseEditorButton onClick={onCloseClick}>
  //           {"OK"}
  //         </CloseEditorButton>
  //       )}
  //     </DesignerContainer>
  //   )}
  //   {moveElements && (
  //     <ZakekeDesignerContainer
  //       isMobile={isMobile}
  //       className="zakeke-container"
  //     >

  //       <ZakekeDesigner ref={customizerRef} areaId={actualAreaId} />

  //      <div style={{position: "relative", top: "26px"}}>
  //      <Button isFullWidth primary onClick={() => setMoveElements(false)}>
  //         <span>{"OK"} </span>
  //       </Button>
  //      </div>
  //     </ZakekeDesignerContainer>
  //   )}
  // </>
  <></>;
  // );
}

export function DesignerSignature() {
  const {
    currentTemplate,
    items,
    isAreaVisible,
    product,
    templates,
    setTemplate,
    isSceneLoading,
  } = useZakeke();
  
  if (!isSceneLoading  && product) {
    const filteredAreas =
      product?.areas.filter((area) => isAreaVisible(area.id)) ?? [];

    let filterSignatureAreas = templates[0].areas
      .filter((template) => template.canAddText === true)
      .map((template) => {
        return { id: template.id };
      });
    const signatureIdAreas = [];

    filteredAreas.forEach((x) => {
      const found = filterSignatureAreas.some((item2) => item2.id === x.id);
      // console.log(found);
      if (found) signatureIdAreas.push(x);
    });

    return signatureIdAreas;
  }

  // console.log(filterSignatureAreas, signatureIdAreas,'signature');
  // console.log(filterSignatureAreas, filteredAreas, "translatedTemplates");
}

export function DesignerLogo() {
  const {
    currentTemplate,
    items,
    isAreaVisible,
    product,
    templates,
    setTemplate,
    isSceneLoading,
  } = useZakeke();

  if (!isSceneLoading && product) {
    const filteredAreas =
      product?.areas.filter((area) => isAreaVisible(area.id)) ?? [];

    let filterSignatureAreas = templates[0].areas
      .filter((template) => template.canAddImage === true)
      .map((template) => {
        return { id: template.id };
      });

    // console.log('designer logggggg',isAreaVisible,filterSignatureAreas, filteredAreas, product?.areas);

    // let filterSignatureAreas = templates[0].areas
    //     .filter((template) => template.canAddImage === true)
    //     .map((template) => {
    //       return { id: template.id };
    //     });

    const signatureIdAreas = [];

    filteredAreas.forEach((x) => {
      const found = filterSignatureAreas.some((item2) => item2.id === x.id);
      // console.log(found);
      if (found) signatureIdAreas.push(x);
    });

    // console.log(filterSignatureAreas, signatureIdAreas,'signature');
    // console.log(filterSignatureAreas, filteredAreas, "translatedTemplates");

    return signatureIdAreas;
  }
}
