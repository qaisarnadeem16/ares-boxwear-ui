import styled from "styled-components";

export const List = styled.ul`
    position: relative;
    margin: 0;
    padding: 0;
    display: flex;
    margin-bottom: 17px; 
    border-radius: 50px;
    white-space: nowrap;
    justify-content: end;
    flex-wrap: wrap;
    align-items: flex-start;
}

    @media screen and (max-width: 568px) {
        margin-bottom: 12px; 
        transform-origin: 50% 50% 0px;
        // transform: translate3d(-186.507px, 0px, 0px) scale(1, 1);
        position: relative;
        // left: 50vw;
        }
`;

export const ListX = styled.ul`
    position: relative;
    margin: 0;
    padding-top: 10px;
    padding-left: 0px;
    display: flex;
    white-space: nowrap;
    justify-content: end;
    background-color: #fff;
    flex-wrap: wrap;
    align-items: flex-start;
}

    @media screen and (max-width: 568px) {
        margin-bottom: 12px; 
        transform-origin: 50% 50% 0px;
        // transform: translate3d(-186.507px, 0px, 0px) scale(1, 1);
        position: relative;
        // left: 50vw;
        }
`;

export const ListItem = styled.li<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  font: 300 1.1rem/1.5 "Inter";
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 0px 10px;
  cursor: pointer;
  margin: 0 10px;
  width: 92px;
  height: 16px;
  border-color: ${(props) => (props.selected ? "black" : "#DDD")};
  white-space: nowrap;

  border: 1px solid #297ca3;
  border-radius: 4px;
  background-color: ${(props) => (props.selected ? "#297ca3" : "white")};
  color: ${(props) => (props.selected ? "white" : "#297ca3")};

  &:hover {
    background-color: #ffd966;
  }
  @media screen and (max-width: 568px) {
    font: 500 0.8rem/1.8 "Inter";
    margin: 0 7px;
    padding: 0px 7px;
    width: 132px;
    height: 33px;
  }
`;

export const ListItemColorWithCarousel = styled.li<{
  selected?: boolean;
  selectedColor?: any;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 0px 5px;
  cursor: pointer;
  margin: 0 3px;
  border-radius: 100%;
  width: 5.5em;
  height: 5.1em;
  white-space: nowrap;
  font-size: 12px;
  border-color: ${(props) => (props.selected ? "black" : "#DDD")};

  &:before {
    content: "";
    position: absolute;
    bottom: 20%;
    /* Additional styling for the :before pseudo-element can be added here */
  }

  &:after {
    // content: "${(props) => {
      return props.selected ? props.selectedColor : "";
    }}";
    position: absolute;
    top: 110%;
    border-bottom: 1px solid #000;
    font-family: "Roboto", sans-serif;
    font-size: 13px;
  }

  @media screen and (max-width: 568px) {
    width: 39px !important;
    height: 22px !important;
    
    &:after {
      top: 73% !important;
      width: 39px !important;
      height: 22px !important;
    }
  }
`;

export const ListItemColor = styled.li<{
  selected?: boolean;
  selectedColor?: any;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 0px 10px;
  cursor: pointer;
  margin: 2px;
  width: 24px;
  height: 24px;
  white-space: nowrap;
  font-size: 12px;
  border-color: ${(props) => (props.selected ? "black" : "#DDD")};

  &:hover {
    background-color: #d8d8d8;
  }

  &:before {
    content: "";
    position: absolute;
    bottom: 20%;
  }

  &:after {
    position: absolute;
    bottom: 7%;
  }

  @media screen and (max-width: 500px) {    
    width: 39px !important;
    height: 22px !important;
    object-fit: fill !important;
  }
`;

export const ListItemImage = styled.img<{ selected?: any }>`
  width: 4.7em;
  height: 80px;
  object-fit: contain;
  margin: 0px 11px;
  border-radius: 100%;
  border: 1px solid rgb(229, 229, 229);

  @media screen and (max-width: 568px) {
    width: 39px !important;
    height: 22px !important;
    object-fit: fill;
    // margin: 0px 8px;
  }
`;

export const ListItemImageNoCarousel = styled.img<{ selected?: any }>`
  position: relative;
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin: 2px;
  border: 1px solid #fff;

  &:after {
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: block;
    // content: " ";
    top: 0px;
    left: 0px;
    content: "yes";
    color: #fff;
    // background-image: url(./img/colselected3.svg);
    background-repeat: no-repeat;
    background-position: right bottom;
  }

  @media screen and (max-width: 568px) {
    width: 39px;
    height: 22px;
    border: 1px solid rgb(201 197 197);
    object-fit: fill;
  }
`;

export const ListItemX = styled.li<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  font: 300 1.1rem/1.5 "Inter";
  align-items: center;
  text-align: flex-end;
  justify-content: end;
  // padding: 10px 10px;
  cursor: pointer;
  margin: 0 10px;
  width: 45px;
  height: 45px;
  white-space: nowrap;
  //color: white;
  font-style: normal;
  font-size: 9px;
//   background: rgba(0, 30, 60, 0.5);
  border: 1px solid #98acd97d;
  &:hover {
    background-color: #ffd966;
  }

  @media screen and (max-width: 568px) {
    // margin: 0 7px;
    width: 39px !important;
    height: 37px !important;
    
  }
`;

export const ListItemX_ = styled.li<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  font: 300 1.1rem/1.5 "Inter";
  align-items: center;
  text-align: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 34px;
  height: 34px;
  white-space: nowrap;
  font-style: normal;
  font-size: 1px;

  &:hover {
    background-color: #ffd966;
  }

  @media screen and (max-width: 568px) {
    // font: 500 0.8rem/1.8 "Inter";
    // margin: 0 7px;
    // padding: 0px 7px;
    //  width: 12.5%;
    // height: 33px;
    width: 39px !important;
    height: 23px !important;

  }
`;

export const ListItemImageX = styled.img<{ selected?: any }>`
  width: 39px;
  height: 22px;
  // object-fit: contain;
  margin: 0px 11px;

  @media screen and (max-width: 568px) {

  }
`;