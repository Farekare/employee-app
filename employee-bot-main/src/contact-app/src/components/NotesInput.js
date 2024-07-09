import React from "react";


const NotesInput = ({value, name, onChange}) =>
{
    return (
        <div className="form-group">
            <label>Notes:</label>
            <textarea className="form-control" value={value} name={name} onChange={(e) => onChange(e.target.value)}>
            </textarea>
        </div>
    )
}

export default NotesInput;