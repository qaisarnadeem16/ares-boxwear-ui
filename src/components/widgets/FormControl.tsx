import React, { FC } from "react";
import styled from "styled-components";

const FormControlLabel = styled.div`
  padding: 0px 0px;
  display: flex;
  justify-content: space-between;
  margin-top: 3px;
`;

const FormControlContainer = styled.div<{ rightComponent?: any }>`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: flex-start;
  grid-gap: 5px;
  margin-bottom: 10px;
`;

export const FormControl: FC<{
  label: string;
  rightComponent?: any;
  children?: React.ReactNode;
}> = ({ label, rightComponent, children }) => {
  return (
    <FormControlContainer>
      <FormControlLabel>
        <span>{label}</span>
        {rightComponent}
      </FormControlLabel>
      {children}
    </FormControlContainer>
  );
};
