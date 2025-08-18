import './fontSelector.css'
import React from 'react'
import {useZakeke } from 'zakeke-configurator-react';

export const FontSelector = ({fontSelectorVisible, togglerFontSelectorVisible, item}) => {
    const { setItemFontFamily, fonts, translations} = useZakeke();
    const dynamicsVals = translations?.dynamics; 
    return(
       <div className='fselector' style={{display: fontSelectorVisible ? 'block' : 'none' }}>
        <div className="donebut fsclose" onClick={() => togglerFontSelectorVisible(fontSelectorVisible)}>{dynamicsVals?.get("Close") ?? "Close"} X</div>

        <div id='fontList'>
            <div className='chead'>
             Select
             <span style={{color: "rgb(255, 255, 255)", fontWeight: "500", paddingLeft: "8px"}}>Font</span>
            </div>
            <div style={{color: 'white' ,fontSize: '11px'}}>Please select a font</div>
            <div>
             {fonts.map(x =>
                <div key={x.fontFamilyGuid} className='fsamp'
                 onClick={() => {
                    setItemFontFamily(item.guid, x.name)}
                    }>
                    <img src={x.imageUrl}/>                    
                </div>    
             )}
            </div>
        </div>
       </div> 
    )
}