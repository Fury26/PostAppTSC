import React from 'react'
import { IconContext } from "react-icons";

type IconProps = {
    icon: any,
    className?: string,
    styles?: any
    divStyles?: any
}

//styles can overwrite color and size
export const Icon: React.FC<IconProps> = ({icon, className , styles, divStyles}) => {
    return (
        <IconContext.Provider value={{...styles}}>
            <div className={className} style={divStyles}>
                {icon()}
            </div>
        </IconContext.Provider>
    )
}