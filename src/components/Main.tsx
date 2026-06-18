import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';
//import fotodiri from "../assets/images/fotodiri_bw_1.jpg";

function Main() {

  return (
    <div className="container">
      <div className="about-section">
        {/* Below is the image photo */}
        {/*  <div className="image-wrapper">
          <img src={fotodiri} alt="Avatar" />
        </div> */}
        <div className="content">
          <h1>Rin Nadia</h1>
          {/* <p>Software Engineer</p> */}
          <div className="social_icons">Software Engineering, Digital Infrastructure, AI Transformation</div>
          <div className="social_icons">
            <p></p>
            <a href="https://github.com/PuppeMeister" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/rinnadia/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            </div>

          <div className="mobile_social_icons">
            <a href="https://github.com/engineerinn" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/rinnadia/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;