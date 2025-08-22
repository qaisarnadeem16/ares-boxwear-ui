import { useZakeke } from "zakeke-configurator-react";
import { T } from "../../Helpers";
import React, { FC } from "react";
import styled from "styled-components/macro";
// import { ReactComponent as CheckSolid } from '../../assets/icons/check-circle-solid_1.svg';
// import { Icon } from 'components/Atomic';
import logo from "../../assets/icons/logo.png";


const LoadingLabel = styled.div`
  color: #000;
  font-size: 12px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
`;

const LoaderContainer = styled.div`
  height: 8px;
  width: 600px;
  border-radius: 4px;
  background-color: #dbe2e6;

  @media screen and (max-width: 766px) {
    width: 310px;
  }
`;

const LoadingPercentageLabel = styled.span`
  display:flex;
  justify-content:center;
  align-items:center;
  text-align:center;
  color: #9b9c9dff;
  font-weight: 600;
  font-size: 18px;
  line-height: 16px;
  font-style: normal;
  font-family: "Inter";
`;

const LoadingPercentageandIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items:center;
`;

// const CheckIcon = styled(Icon)`
//   cursor: unset;
//   color: #008556;
// `;

const LoaderFill = styled.div`
  height: 100%;
  border-radius: 4px;
  margin: 7px 0px;
  width: ${({ completed }) => completed && `${completed}%`};
  background-color: #000000;
  border-radius: "inherit";
`;

const BottomText = styled.div`
  margin-top: 12px;
  font-size: 14px;
  font-family: "Inter";
  font-weight: 500;
  color: #0000;
  text-align: center;
  display:flex;
  justify-content:center;
  align-items:center;
`;

const ProgressBar = ({ bgColor, completed }) => {
  const { isSceneLoading, translations } = useZakeke();
  const dynamicVals = translations?.dynamics;
  return (
    <div>
      <LoadingLabel>
        {dynamicVals?.get("Loading...")}
        {/* {isSceneLoading ? T._('Loading your product...', 'Composer') : T._('Loading complete.', 'Composer')} */}
      </LoadingLabel>


      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <img src={logo} alt="logo" style={{ width: 200, height:'auto'}}/>
      </div>
      <LoaderContainer>
        <LoaderFill
          completed={isSceneLoading ? completed : 100}
          bgColor={bgColor}
          isCompleted={!isSceneLoading}
        />
        <LoadingPercentageandIconContainer>
          <LoadingPercentageLabel>
            {isSceneLoading ? `${completed}%` : "100%"}
            {/* {isSceneLoading ? T._('In progress | ', 'Composer') + `${completed}%` : '100%'} */}
          </LoadingPercentageLabel>
          <BottomText>
           {isSceneLoading ? "Configuration is loading..." : "Configuration ready"}
         </BottomText>
        </LoadingPercentageandIconContainer>
      </LoaderContainer>
   {/* */} 
    </div>
  );
};

export default ProgressBar;
