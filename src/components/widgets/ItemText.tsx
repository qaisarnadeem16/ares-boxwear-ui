import React, { FC, useCallback } from "react";
import styled from "styled-components/macro";
import { FontFamily, useZakeke } from "zakeke-configurator-react";
import { Button, Columns, Icon, TextArea, FontTextArea } from "../Atomic";
//import { T } from '../../Helpers';
import Select, {
  components,
  GroupBase,
  OptionProps,
  SingleValueProps,
} from "react-select";
import { useState } from "react";
import { debounce } from "lodash";

import type { PropChangeHandler } from "../layouts/Designer";

import { ReactComponent as CloseIcon } from "../../assets/icons/times-solid.svg";
import { FormControl } from "./FormControl";
import ColorPicker from "./colorpicker";
import { FontSelector } from "../fonts/FontSelector";

export interface EditTextItem {
  guid: string;
  name: string;
  text: string;
  fillColor: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  isTextOnPath: boolean;
  constraints: { [key: string]: any } | null;
}

const defaultColorsPalette = ["#000000", "#FFFFFF"];

enum ItemType {
  Text = 0,
  Image = 1,
}

export interface TextItem {
  type: ItemType;
  areaId: number;
  guid: string;
  name: string;
  text: string;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string | undefined;
  fontStretch: string;
  justification: string;
  isTextOnPath: boolean;
  constraints: {
    [key: string]: any;
  } | null;
}

const ItemTextContainer = styled.div``;

const TextToolsContainer = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: 10px;
  flex-wrap: wrap;
`;

const TextButtonsContainer = styled.div`
  width: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
`;

const ColorPickerContainer = styled.div`
  margin-right: 5px;
  width: calc(50% - 30px);
`;

const ColorsContainer = styled.div`
  width: 100%
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  border-bottom: 1px #ccc dotted;
`;

const SinglePaletteItem = styled.div<{ color: string; selected: boolean }>`
  width: 22px;
  height: 22px;
  background-color: ${(props) => props.color};
  border: 1px white solid;
  cursor: pointer;

  ${(props) => props.selected && `border: 1px black solid;`}

  &:hover {
    opacity: 0.6;
  }

  @media screen and (max-width: 568px) {
    width: 39px;
    height: 22px;
  }
`;

const TextColorsContainer = styled.div<{ isDefaultPalette?: boolean }>`
  display: grid;
  ${(props) =>
    !props.isDefaultPalette &&
    `
    grid-template-columns: repeat(auto-fill,minmax(20px,1fr));
    grid-gap: 7px;
    `};
  width: 220px;

  @media screen and (max-width: 568px) {
    width: 82vw;
    grid-gap: 10px 22px;
  }
`;

const OptionContainer = styled(components.Option)`
  background-color: white !important;

  &:hover {
    background-color: #ddd !important;
  }

  img {
    max-width: 100%;
    height: 22px;
    object-fit: contain;
  }
`;

const SingleValueContainer = styled(components.SingleValue)`
  img {
    max-width: 100%;
    height: 22px;
    object-fit: contain;
  }
`;

const Cusimg_embu = styled.div`
  width: 78px;
  display: block;
  position: relative;
  float: right;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  color: rgb(0, 69, 140);
  text-align: center;
  padding: 7px 3px;
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(109, 207, 246);
  border-image: initial;
`;

{
  /* <div id="emb2u" class="cusimage embu" data-embind="2">Font</div> */
}

const FontOption = (
  props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>
) => {
  return (
    <OptionContainer {...props}>
      {<img src={props.data.imageUrl} alt={props.data.name} />}
    </OptionContainer>
  );
};

const FontSingleValue = (
  props: JSX.IntrinsicAttributes &
    SingleValueProps<any, boolean, GroupBase<any>>
) => {
  return (
    <SingleValueContainer {...props}>
      {<img src={props.data.imageUrl} alt={props.data.name} />}
    </SingleValueContainer>
  );
};

const ItemText: FC<{
  item: EditTextItem;
  handleItemPropChange: PropChangeHandler;
  fonts?: FontFamily[];
  hideRemoveButton?: boolean;
}> = ({ item, handleItemPropChange, hideRemoveButton }) => {
  const { removeItem, fonts, disableTextColors, textColors, translations } =
    useZakeke();
  const dynamicsVals = translations?.dynamics;
  const constraints = item.constraints;
  const canEdit = constraints?.canEdit ?? true;
  const hasCurvedText = item.isTextOnPath;
  const isUpperCase = constraints?.toUppercase ?? false;

  // Used for performance cache
  const [fillColor, setFillColor] = useState(item.fillColor);

  const [fontSelectorVisible, setFontSelectorVisible] = useState(false);

  const togglerFontSelectorVisible = (fontSelectorVisible: any) => {
    setFontSelectorVisible(!fontSelectorVisible);
  };
  // const weightData = typeof item.fontWeight === 'number' ? ['normal', 'normal'] : item.fontWeight.split(' ');
  // const isBold = weightData.length > 1 ? weightData[1] === 'bold' : weightData[0] === 'bold';
  // const isItalic = weightData.length > 1 ? weightData[0] === 'italic' : false;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (handleItemPropChange)
      handleItemPropChange(
        item as TextItem,
        "text",
        isUpperCase
          ? e.currentTarget.value.toUpperCase()
          : e.currentTarget.value
      );
  };

  //eslint-disable-next-line
  const handleFillColorChange = useCallback(
    debounce((color: string) => {
      handleItemPropChange(item, "font-color", color);
    }, 500),
    []
  );

  if (item)
    return (
      <ItemTextContainer>
        <FormControl
          label={item.name} //|| T._("Text", "Composer")
          rightComponent={
            !hideRemoveButton &&
            item.constraints!.canDelete && (
              <Icon onClick={() => removeItem(item.guid)}>
                <CloseIcon />
              </Icon>
            )
          }
        >
          <Cusimg_embu
            onClick={() => togglerFontSelectorVisible(fontSelectorVisible)}
          >
            {dynamicsVals?.get("Font") ?? "Font"}
          </Cusimg_embu>

          <TextArea
            placeholder="Name"
            value={isUpperCase ? item.text.toUpperCase() : item.text}
            onChange={handleChange}
            maxLength={
              !item.constraints ? null : item.constraints.maxNrChars || null
            }
            disabled={!canEdit}
          />
        </FormControl>

        {/* <TextToolsContainer>
          {(!constraints || constraints.canChangeFontFamily) && (
            <FormControl label="Font">
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    minWidth: 200,
                  }),
                }}
                isSearchable={false}
                options={fonts}
                menuPosition="fixed"
                components={{
                  Option: FontOption,
                  SingleValue: FontSingleValue,
                }}
                value={[fonts!.find((x) => x.name === item.fontFamily)]}
                onChange={(font: any) =>
                  handleItemPropChange(item, "font-family", font.name)
                }
              />
            </FormControl>
          )}
          <TextButtonsContainer></TextButtonsContainer>
        </TextToolsContainer> */}

        <FontSelector
          fontSelectorVisible={fontSelectorVisible}
          togglerFontSelectorVisible={togglerFontSelectorVisible}
          item={item}
        />


        {(!disableTextColors ||
          !(disableTextColors && textColors.length === 1)) &&
          !!item.constraints?.canChangeFontColor && (
            <FormControl label="Color">
              <ColorsContainer>
                {!disableTextColors && (
                  <ColorPickerContainer>
                    <ColorPicker
                      color={fillColor}
                      onChange={(color) => {
                        // handleFillColorChange(color);
                        handleItemPropChange(item, "font-color", color);
                        setFillColor(color);
                      }}
                    />
                  </ColorPickerContainer>
                )}

                {!disableTextColors && (
                  <TextColorsContainer>
                    {defaultColorsPalette.map((hex) => (
                      <SinglePaletteItem
                        key={hex}
                        onClick={() => {
                          handleItemPropChange(item, "font-color", hex);
                          setFillColor(hex);
                        }}
                        selected={hex === fillColor}
                        color={hex}
                      />
                    ))}
                  </TextColorsContainer>
                )}

                {disableTextColors && (
                  <TextColorsContainer>
                    {textColors.map((textColor) => (
                      <SinglePaletteItem
                        key={textColor.colorCode}
                        onClick={() => {
                          handleItemPropChange(
                            item,
                            "font-color",
                            textColor.colorCode
                          );
                          setFillColor(textColor.colorCode);
                        }}
                        selected={textColor.colorCode === fillColor}
                        color={textColor.colorCode}
                      />
                    ))}
                  </TextColorsContainer>
                )}
              </ColorsContainer>
            </FormControl>
          )}
      </ItemTextContainer>
    );
  else return null;
};

export default ItemText;
