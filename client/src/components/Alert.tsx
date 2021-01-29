import React from 'react'

export const Alert: React.FC<{text:string}> = ({ text }) => (
    <div className="alert alert-warning" role="alert">
        {text}
    </div>
)
