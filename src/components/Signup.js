import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup(props) {
  const [credentials, setCredentials] = useState({name:"", email: "", password:"", cpassword: ""})
  let navigate = useNavigate();

  const handleSubmit= async (e)=>{
    e.preventDefault();
    const {name, email, password} = credentials
      const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({name, email, password})
        });
        const json = await response.json()
        console.log(json);  
        
          // Save the auth token and redirect
          
          localStorage.setItem('token', json.authtoken);
          navigate("/");
          props.showAlert("SignUp Successfully", "success")
      }
    

      const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
      }

  return (
    <div className='container mt-3'>
      <h2>Createan account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
  <label htmlFor="name" className="form-label">Name</label>
    <input type="name" className="form-control" id="name" name="name" onChange={onChange}  aria-describedby="emailHelp"/>
    <label htmlFor="email" className="form-label">Email</label>
    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" onChange={onChange} name="password" id="password" minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" onChange={onChange} name="cpassword" id="cpassword" minLength={5} required/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup