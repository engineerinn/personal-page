import React from "react";
//import GitHubIcon from '@mui/icons-material/GitHub';
//import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Footer.scss'
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
    <footer>
      <div id="upper-footer">
          <h4>{currentYear} Rin Nadia &nbsp;
          <a href="https://github.com/engineerinn" target="_blank" rel="noreferrer"><GitHubIcon/></a>
          <a href="https://www.linkedin.com/in/rinnadia/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          <a href="mailto:rin.nadia.23@gmail.com" target="_blank" rel="noreferrer"><EmailIcon/></a>
          </h4>
      </div>
      <div id="lower-footer"><h5> <a href="https://github.com/yujisatojr/react-portfolio-template" target="_blank" rel="noreferrer">Template by Yuji Sato</a></h5></div>
    </footer>
  );
}

export default Footer;