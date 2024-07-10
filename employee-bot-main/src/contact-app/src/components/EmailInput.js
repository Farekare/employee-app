import React from 'react'


const EmailInput = ({value, onChange, name}) =>
{
    return(
        <div className="form-group">
          <label>Email:</label>
          <input
            name={name}
            type="email"
            className="form-control"
            value={value}
            onChange={onChange}
            required
          />
        </div>
    )
}


export default EmailInput;