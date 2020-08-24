import React, { useState } from 'react';
import Dropdown from './Dropdown.js';
import error from './assets/error.svg';
import { connect } from 'react-redux';
import { register, isCallinkEmail } from '../actions/auth';
import { tagOptions } from '../data/tagOptions';
import signup from './assets/signup.png'

const MultiStepForm = ({ register }) => {
  var appOptions = [
    { value: true, label: 'Application required' },
    { value: false, label: 'No application required' },
  ];

  var recruitOptions = [
    { value: true, label: 'Accepting members' },
    { value: false, label: 'Not accepting members' },
  ];

  const [currStep, setStep] = useState(1);
  /* user inputs */
  const [clubName, setClubName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPassword] = useState('');
  const [con, setConfirm] = useState('');
  const [tags, setTags] = useState([]);
  const [appReq, setAppReq] = useState(true);
  const [recruiting, setRecruit] = useState(true);
  /* error indicators */
  const [emailUnverified, setEmailUnverified] = useState('noError');
  const [pwdConMismatch, setPwdConMismatch] = useState('noError');
  const [tagOverflow, setTagOverflow] = useState('tagOverflowNone');
  const [emptyName, setEmptyName] = useState('noError');
  const [emptyEmail, setEmptyEmail] = useState('noError');
  const [emptyPwd, setEmptyPwd] = useState('noError');
  const [emptyTags, setEmptyTags] = useState('noError');
  const [emptyAppReq, setEmptyAppReq] = useState('unset');
  const [emptyRecruit, setEmptyRecruit] = useState('unset');

  const submitValue = () => {
    const tagsList = [];
    for (var i = 0; i < tags.length; i++) {
      tagsList.push(tags[i].value);
    }
    register(clubName, email, pwd, tagsList, !!appReq.value, !!recruiting.value);
  };

  const _prev = () => {
    setStep(currStep - 1);
  };

  const _next = () => {
    let haveError = false;
    /* step 1 errors */
    if (currStep === 1) {      
      if (clubName === '') {
        setEmptyName('emptyName');
        haveError = true;
      }
      if (email === '') {
        setEmptyEmail('emptyEmail')
        haveError = true;
      } else {        // check if email is verified
        let isVerified = false;
        isCallinkEmail(email).then((response) => {
          isVerified = response;
        })
        if (!isVerified) {
          setEmailUnverified('emailUnverified');
          haveError = true;
        }
      }
      if (pwd === '' && con === '') {
        setEmptyPwd('emptyPwd');
        haveError = true;
      } else if (pwd !== con) {
        setPwdConMismatch('pwdConMismatch');
        haveError = true;        
      }
    }
    /* step 2 errors */
    else if (currStep === 2) {
      if (tags === null || tags.length === 0) {
        setEmptyTags('emptyTags');
        haveError = true;
      }
      if (emptyAppReq === 'unset') {
        setEmptyAppReq('emptyAppReq');
        haveError = true;
      }
      if (emptyRecruit === 'unset') {
        setEmptyRecruit('emptyRecruit');
        haveError = true;
      }
    }
    /* if no errors, go to next step / submit */
    if (!haveError) {
      setStep(currStep + 1);
      if (currStep === 3) {
        submitValue();
      }
    }
  };

  const nameOnChange = (event) => {
    setClubName(event);
    if (emptyName === 'emptyName') { setEmptyName('noError'); }
  };
  const emailOnChange = (event) => {
    setEmail(event);
    if (emptyEmail === 'emptyEmail') { setEmptyEmail('noError'); }
    if (emailUnverified === 'emailUnverified') { setEmailUnverified('noError'); }
  };
  const pwdOnChange = (event) => {
    setPassword(event);
    if (emptyPwd === 'emptyPwd') { setEmptyPwd('noError'); }
    if (pwdConMismatch === 'pwdConMismatch') { setPwdConMismatch('noError'); }
  };
  const conOnChange = (event) => {
    setConfirm(event);
    if (emptyPwd === 'emptyPwd') { setEmptyPwd('noError'); }
    if (pwdConMismatch === 'pwdConMismatch') { setPwdConMismatch('noError'); }
  };

  const tagsOnChange = (event) => {
    setTags(event);
    if (emptyTags === 'emptyTags') { setEmptyTags('noError'); }
  };
  const appReqOnChange = (event) => {
    setAppReq(event);
    if (emptyAppReq !== 'noError') { setEmptyAppReq('noError'); }
  };
  const recruitOnChange = (event) => {
    setRecruit(event);
    if (emptyRecruit !== 'noError') { setEmptyRecruit('noError'); }
  };

  return (
    <>
      <StepOne
        currStep={currStep}
        clubName={clubName}
        pwd={pwd}
        email={email}
        con={con}
        setStep={setStep}
        setClubName={nameOnChange}
        setEmail={emailOnChange}
        setPassword={pwdOnChange}
        setConfirm={conOnChange}
        _prev={_prev}
        _next={_next}
        emptyName={emptyName}
        emptyEmail={emptyEmail}
        emptyPwd={emptyPwd}
        emailError={emailUnverified}
        conError={pwdConMismatch}
      />
      <StepTwo
        currStep={currStep}
        tags={tags}
        appReq={appReq}
        recruiting={recruiting}
        tagOptions={tagOptions}
        appOptions={appOptions}
        recruitOptions={recruitOptions}
        setStep={setStep}
        setTags={tagsOnChange}
        setAppReq={appReqOnChange}
        setRecruit={recruitOnChange}
        _prev={_prev}
        _next={_next}
        emptyTags={emptyTags}
        emptyAppReq={emptyAppReq}
        emptyRecruit={emptyRecruit}
        tagError={tagOverflow}
        setTagError={setTagOverflow}
      />
      <StepThree currStep={currStep} />
    </>
  );
};

const StepOne = (props) => {
  if (props.currStep !== 1) {
    return null;
  }
  return (
    <div className="formGroup">
      <div className="errorWrapper">
        <div className={`error ${props.emptyName}`}>
          <img src={error} className="errorIcon" />
          <p>this field is required</p>
        </div>
        <div className={`error ${props.emptyEmail}`}>
          <img src={error} className="errorIcon" />
          <p>this field is required</p>
        </div>
        <div className={`error ${props.emptyPwd}`}>
          <img src={error} className="errorIcon" />
          <p>this field is required</p>
        </div>
        <div className={`error ${props.emailError}`}>
          <img src={error} className="errorIcon" />
          <p>email address is not RSO registered</p>
        </div>
        <div className={`error ${props.conError}`}>
          <img alt="error" src={error} className="errorIcon" />
          <p>passwords do not match</p>
        </div>
      </div>
      <div className="formHeader">
        <div className="imageContainer">
          <img src={signup} alt="register" />
        </div>
        <h2>Register your club</h2>
      </div>
      <input
        className={`${(props.emptyName==='emptyName') ? 'inputInvalid' : 'userInput'}`}
        type="text"
        placeholder="Club name"
        value={props.clubName}
        onChange={(e) => props.setClubName(e.target.value)}
      />
      <input
        className={`${((props.emptyEmail==='emptyEmail')||(props.emailError==='emailUnverified')) ? 'inputInvalid' : 'userInput'}`}
        type="email"
        placeholder="Email address - use your organization's email"
        value={props.email}
        onChange={(e) => props.setEmail(e.target.value)}
      />
      <input
        className={`${((props.emptyPwd==='emptyPwd')||(props.conError==='pwdConMismatch')) ? 'inputInvalid' : 'userInput'}`}
        type="password"
        placeholder="Password"
        value={props.pwd}
        onChange={(e) => props.setPassword(e.target.value)}
      />
      <input
        className={`${((props.emptyPwd==='emptyPwd')||(props.conError==='pwdConMismatch')) ? 'inputInvalid' : 'userInput'}`}
        type="password"
        placeholder="Confirm password"
        value={props.con}
        onChange={(e) => props.setConfirm(e.target.value)}
      />
      <div className="buttonWrapper">
        <div className="help">
          <p>Invalid email?</p>
          <a href="/">Click here</a>
        </div>
        <button onClick={props._next} className="nextButton">
          Next →
        </button>
      </div>
    </div>
  );
};

const StepTwo = (props) => {
  if (props.currStep !== 2) {
    return null;
  }

  let haveError = props.emptyRecruit=='emptyRecruit';

  // console.log("haveError3=" + haveError3);
  return (
    <div className="formGroup">
      <div className="errorWrapper">
        <div className={`error ${props.emptyTags}`}>
          <img alt="error" src={error} className="errorIcon" />
          <p>this field is required</p>
        </div>
        <div className={`error ${props.emptyAppReq}`}>
          <img alt="error" src={error} className="errorIcon" />
          <p>this field is required</p>
        </div>
        <div className={`error ${props.emptyRecruit}`}>
          <img alt="error" src={error} className="errorIcon" />
          <p>this field is required</p>
        </div>
        <div className={`error ${props.tagError}`}>
          <img alt="error" src={error} className="errorIcon" />
          <p>reached max tag number</p>
        </div>
      </div>
      <div className="formHeader">
        <div className="imageContainer">
          <img src={signup} alt="" />
        </div>
        <h2>Register your club</h2>
      </div>
      <div className="drops">
        <Dropdown
          options={props.recruitOptions}
          multi={false}
          search={false}
          placeholder="Select recruitment status"
          set={props.setRecruit}
          error={haveError}
        />
        <Dropdown
          options={props.appOptions}
          multi={false}
          search={false}
          placeholder="Select application requirement"
          set={props.setAppReq}
          // error={haveError}
        />
        <Dropdown
          options={tagOptions}
          multi={true}
          search={false}
          placeholder="Add up to 3 tags"
          set={props.setTags}
          errorPopup={props.setTagError}
          // error={haveError}
        />
      </div>

      <div className="buttonWrapper">
        <button className="prevButton" onClick={props._prev}>
          ← Back
        </button>
        <button className="submitButton" onClick={props._next}>
          Sign up
        </button>
      </div>
    </div>
  );
};

const StepThree = (props) => {
  if (props.currStep !== 3) {
    return null;
  }
  return (
    <div className="formGroup">
      <div className="complete">
        <div className="imageContainer">
          <img src={signup} alt="" />
        </div>
        <h3>You're all set!</h3>
        <h3>Please check your organization's email for a confirmation link.</h3>
        <h2>Didn't receive an email?</h2>
        <a href="/signup">Click here</a>
      </div>
    </div>
  );
};

export default connect(null, { register })(MultiStepForm);
