import React from 'react';

import './ErrorPage.css'

import questionablebear from './assets/resetpwd1.png';

const ErrorPage = () => {
  return (
    <div className="errorpage">
      <div className="content">
        <div className="imageContainer">
            <img
              className="noresults-image"
              src={questionablebear}
              alt="a bear with many questions"
            />
        </div>
        <div className="text">
          <h3>404 Error</h3>
          <p>
            We couldn't find that page!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
