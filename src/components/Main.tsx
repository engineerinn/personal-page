import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import '../assets/styles/Main.scss';
//import fotodiri from "../assets/images/fotodiri_bw_1.jpg";

function Main() {

  return (


    <div className="container" id="home-view">
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
            <a href="https://github.com/engineerinn" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/rinnadia/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="https://scholar.google.com/citations?user=MaAaPNAAAAAJ&hl=de" target="_blank" rel="noreferrer"><SchoolIcon/></a>
            <a href="mailto:rin.nadia.23@gmail.com" target="_blank" rel="noreferrer"><EmailIcon/></a>
            </div>

          <div className="mobile_social_icons">
            <a href="https://github.com/engineerinn" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/rinnadia/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="https://scholar.google.com/citations?user=MaAaPNAAAAAJ&hl=de" target="_blank" rel="noreferrer"><SchoolIcon/></a>
            <a href="mailto:rin.nadia.23@gmail.com" target="_blank" rel="noreferrer"><EmailIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;