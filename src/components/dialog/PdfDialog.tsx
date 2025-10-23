import React, { FC } from "react";
import styled from 'styled-components';
import { T } from "../../Helpers";
import { Dialog } from "./Dialogs";
import { Group } from 'zakeke-configurator-react';

const PdfDialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  color: #465664;
  font-size: 18px;
  padding: 20px;
  line-height: 1.6;
  max-height: 550px;
  overflow-y: auto;
  text-align: center;
  @media (max-width: 600px) {
    max-height: 480px;
  }
`;

const SpanContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  font-weight: 500;
  text-align: center;
  width: 100%;
`;

const SelectionsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  text-align: left;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  overflow-y: auto;         
  max-height: 450px; 
  box-sizing: border-box;

  @media (max-width: 600px) {
    max-height: 400px;
    grid-template-columns: 1fr; /* Responsive: single column on small screens */
  }
`;


const SelectionsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const GroupSection = styled.div`
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #007bff;
`;

const GroupName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
`;

const AttributeItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const AttributeName = styled.span`
  color: #666;
  font-weight: 500;
`;

const OptionName = styled.span`
  color: #333;
  font-weight: 400;
`;

interface PdfDialogProps {
  onCloseClick: () => void;
  url: string;
  groups?: Group[];
}

const PdfDialog: FC<PdfDialogProps> = ({ onCloseClick, url, groups }) => {
  // Filter and format the groups data
  const getSelectedOptions = () => {
    if (!groups || groups.length === 0) return [];

    return groups
      .filter(group => {
        // Exclude special groups (Designer, Saved Designs)
        if (group.id === -2 || group.id === -3) return false;
        // Exclude "Other" group if it's the only one
        if (groups.length === 1 && group.name.toLowerCase() === 'other') return false;
        return true;
      })
      .map(group => {
        const groupData = {
          name: T._d(group.name) || T._('Customize', 'Composer'),
          attributes: [] as Array<{ name: string; selectedOption: string }>
        };

        // Get attributes from steps
        if (group.steps && group.steps.length > 0) {
          group.steps.forEach(step => {
            step.attributes
              .filter(attr => attr.enabled)
              .forEach(attribute => {
                const selectedOption = attribute.options.find(opt => opt.selected);
                if (selectedOption) {
                  groupData.attributes.push({
                    name: T._d(attribute.name),
                    selectedOption: T._d(selectedOption.name)
                  });
                }
              });
          });
        }

        // Get attributes directly from group
        if (group.attributes && group.attributes.length > 0) {
          group.attributes
            .filter(attr => attr.enabled)
            .forEach(attribute => {
              const selectedOption = attribute.options.find(opt => opt.selected);
              if (selectedOption) {
                groupData.attributes.push({
                  name: T._d(attribute.name),
                  selectedOption: T._d(selectedOption.name)
                });
              }
            });
        }

        return groupData;
      })
      .filter(group => group.attributes.length > 0); // Only show groups with selections
  };

  const selectedOptions = getSelectedOptions();

  return (
    <Dialog
      title={T._('PDF Preview', 'Composer')}
      buttons={[
        { label: T._('Download', 'Composer'), onClick: () => window.open(url, "_blank") }
      ]}
      alignButtons="center"
      noMarginFooterButton
    >
      <PdfDialogContainer>
        <SpanContainer>
          <span>{T._('The PDF preview is ready.', 'Composer')}</span>
        </SpanContainer>
        
        {selectedOptions.length > 0 && (
          <SelectionsContainer>
            {selectedOptions.map((group, index) => (
              <GroupSection key={index}>
                <GroupName>{group.name}</GroupName>
                {group.attributes.map((attr, attrIndex) => (
                  <AttributeItem key={attrIndex}>
                    <AttributeName>{attr.name}:</AttributeName>
                    <OptionName>{attr.selectedOption}</OptionName>
                  </AttributeItem>
                ))}
              </GroupSection>
            ))}
          </SelectionsContainer>
        )}

        <SpanContainer>
          <span>
            {T._('In case the PDF is of low resolution, please go back to the editor, zoom in and try again.', 'Composer')}
          </span>
        </SpanContainer>
      </PdfDialogContainer>
    </Dialog>
  );
};

export default PdfDialog;