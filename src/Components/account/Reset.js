import './reset.css';
import axiosAPI from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const axios = axiosAPI.create({
  baseURL: 'https://quotekeeper.herokuapp.com'
})

const TEMP_REGEX = /([a-zA-Z0-9]){14}/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const RESET = '/passwordreset/reset';

export default function Reset({ setDisplayReset, setDisplay }) {

  const userInputRef = useRef();
  const errorRef = useRef();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const [temp, setTemp] = useState('');
  const [validTemp, setValidTemp] = useState(false);
  const [tempFocus, setTempFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    userInputRef.current.focus();
  }, []);

  useEffect(() => {
    setDisplayReset(true)
    setDisplay(false)
  }, [])

  useEffect(() => {
    const result = TEMP_REGEX.test(temp);
    setValidTemp(result);

  }, [temp]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword
    setValidMatch(match);

  }, [password, matchPassword]);

  useEffect(() => {
    setErrorMessage('');
  }, [temp, password, matchPassword]);

  const handleHome = () => {
    setDisplay(true)
    setDisplayReset(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // additional validation 
    const test1 = TEMP_REGEX.test(temp);
    const test2 = PASSWORD_REGEX.test(password);
    if (!test1 || !test2) {
      setErrorMessage('Invalid entry');
      return;
    }
    try {
      const response = await axios.post(RESET,
        JSON.stringify({ email, resetString: temp, password }),
        {
          headers: { 'Content-Type': 'application/json' }
        })

      setDisplayReset(false)
      setDisplay(true)
      navigate('/')
    }

    catch (err) {
      if (err.response.status === 409) {
        setErrorMessage(err.response.data)
        console.log(err)
        errorRef.current.focus()
      } else {
        setErrorMessage('reset failed')
      }

    }
  }
  return (
    <>
      <section className="reset-request">
        <p ref={errorRef} className={errorMessage ? "error-message" : "offscreen"} aria-live="assertive">{errorMessage}</p>
        <h2 className="reset-heading">Reset Password</h2>
        <h4>If the password reset fails, you will have to request a new temporary password.</h4>
        <form onSubmit={handleSubmit}>

           {/* Email */}
  <div className="email-reset">
           <label htmlFor="email">
            Email:
          </label>

          <input
            type="text"
            id="email"
            ref={userInputRef}
            onChange={e => setEmail(e.target.value)}
            required
            aria-invalid={validEmail ? 'false' : 'true'}
            aria-describedby='emailnote'
          />
</div>
          {/* Temp */}
<div className="temp-reset">
          <label htmlFor="temp">
            Temporary Password:

          </label>
     

          <input
            type="password"
            id="temp"
            ref={userInputRef}
            autoComplete="off"
            onChange={e => setTemp(e.target.value)}
            required
            aria-invalid={validTemp ? 'false' : 'true'}
            aria-describedby='tempnote'
            onFocus={() => setTempFocus(true)}
            onBlur={() => setTempFocus(false)}
          />
  
          <p id="tempnote" className={temp && !validTemp ? 'instructions' : 'offscreen'}>
            <FontAwesomeIcon icon={faInfoCircle} className='icon' />
            The temporary password is letters and numbers only. <br />
          </p>
          </div>

          {/* Password */}
          <div className="password-reset">
          <label htmlFor="password">
            Password:

          </label>


          <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            required
            aria-invalid={validPassword ? 'false' : 'true'}
            aria-describedby='passwordnote'
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />


          <p id="passwordnote" className={password && !validPassword ? 'instructions' : 'offscreen'}>
            <FontAwesomeIcon icon={faInfoCircle} className='icon' />
            8 to 24 characters. 
            Must have a number, upper case letter, a lower case letter, and a special character. 
            Allowed special characters: <span aria-label='exclamation mark'>!</span> <span aria-label='at symbol'>@</span> <span aria-label='dollar sign'>$</span> <span aria-label="hashtag">#</span> <span aria-label='percent'>%</span>
          </p>
          </div>
          {/* Match Password */}
<div className="password-match">
          <label htmlFor="matchPassword">
            Confirm Password:

          </label>


          <input
            type="password"
            id="matchPassword"
            onChange={e => setMatchPassword(e.target.value)}
            required
            aria-invalid={validMatch ? 'false' : 'true'}
            aria-describedby='confirmnote'
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />


          <p id="confirmnote" className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
            <FontAwesomeIcon icon={faInfoCircle} className='icon' />
            Must match the first password input field. <br />
          </p>
          </div>
          <button  className="request-button" disabled={!validTemp || !validPassword || !validMatch ? true : false}>Reset Password</button>

        

        </form>
        <div className='back-parent'  onClick={handleHome}><Link  className="back-to-quotes" to='/'>Back to Quotes</Link></div>
      </section>
    </>
  )
}
