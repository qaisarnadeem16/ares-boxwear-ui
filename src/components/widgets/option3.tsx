// import { useUndoRegister, useUndoRedoActions, T } from "Helpers";
import React from "react";
import { FC } from "react";
import styled from "styled-components";
import { Option, useZakeke, Attribute } from 'zakeke-configurator-react';
// import Tooltip from "./tooltip";

const OptionContainer3 = styled.div<{
  optionShape: number;
  selected: boolean;
  hasDescriptionIcon: boolean;
}>`
 display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  user-select: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);

  ${(props) =>
    props.selected &&
    `
    //   background-color: #f5f6f7;

      &::after {
        content: "✓";
        position: absolute;
        top: 20px;
        right: 30px;
        width: 70px;
        height: 70px;
        color: #686868ff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        font-weight: bold;
      }
    `}

  @media screen and (max-width: 568px) {
   ${(props) =>
    props.selected &&
    `
      background-color: #f5f6f7;

      &::after {
        content: "✓";
        position: absolute;
        top: 20px;
        right: 30px;
        width: 40px;
        height: 40px;
        color: #686868ff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        font-weight: bold;
      }
    `}
    
    }
`;

const OptionIconContainerStyled = styled.div`
//    overflow: hidden;
    //   width: 80px;
`;

const OptionIconContainer3: FC<{
    children?: React.ReactNode
}> = ({ children }) => {
    return <OptionIconContainerStyled>{children}</OptionIconContainerStyled>;
}

const OptionIcon = styled.img<{ optionShape?: boolean }>`
    width: 130px;
    height: 130px;
    object-position: center;

    ${props => props.optionShape && `
        // border-radius: 100%;
        object-fit: cover;
    `};
    @media screen and (max-width: 568px) {
    height:100px;
    width:100px;
    
    }
`;

const OptionName = styled.span`
    font-size:12px;
    margin-top: 10px;
    text-align:center;
    overflow:hidden;

    @media (max-width: 1025px) {
        font-size:10px;
        margin-top: 2px;
        text-align:center;
    }

    @media (max-width: 1024px) {
        font-size:10px;
        text-align:center;
    }
`;

const OptIconContainer = styled.div`
    display: flex;
    height:130px;
    widht:130px;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 568px) {
    height:100px;
    width:100px;
    
    }
`;

const OptionItem3: FC<{ selectedAttribute: Attribute | null | undefined, option: Option, hasDescriptionIcon: boolean }> = ({ selectedAttribute, option, hasDescriptionIcon }) => {

    const selectedOptionId: number | null = selectedAttribute?.options.find(opt => opt.selected)?.id ?? null;

    const { selectOption } = useZakeke();
    // const undoRegistering = useUndoRegister();
    // const undoRedoActions = useUndoRedoActions();

    const handleOptionSelection = (option: Option) => {
        // const undo = undoRegistering.startRegistering();
        // undoRedoActions.eraseRedoStack();
        // undoRedoActions.fillUndoStack({ type: "option", id: selectedOptionId, direction: "undo" });
        // undoRedoActions.fillUndoStack({ type: "option", id: option.id, direction: "redo" });

        selectOption(option.id);
        // undoRegistering.endRegistering(undo);

        try {
            if ((window as any).algho)
                (window as any).algho.sendUserStopForm(true);
        } catch (e) { }
    }

    return <OptionContainer3
        hasDescriptionIcon={hasDescriptionIcon}
        selected={option.selected}
        optionShape={option.attribute.optionShapeType}
        onClick={() => handleOptionSelection(option)}>

        <OptionIconContainer3>
            {/* {option.description && option.description.length !== 0 &&
                <Tooltip key={"tooltip" + option.guid} optionDescription={option.description} />
            } */}
            {option.imageUrl && <OptIconContainer><OptionIcon loading="lazy"
                // fetchpriority="low" 
                src={option.imageUrl ?? ""} optionShape={option.attribute.optionShapeType === 2} /></OptIconContainer>}
        </OptionIconContainer3>

        {/* {!option.attribute.hideOptionsLabel && <OptionName >{option.name}</OptionName>} */}
    </OptionContainer3>;
}

export default OptionItem3;