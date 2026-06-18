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
      <div>
          <h4>{currentYear}, Rin Nadia </h4>
          <a href="https://github.com/engineerinn" target="_blank" rel="noreferrer"><GitHubIcon/></a>
          <a href="https://www.linkedin.com/in/rinnadia/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          <a href="https://www.linkedin.com/in/rinnadia/" target="_blank" rel="noreferrer"><EmailIcon/></a>
      </div>
    </footer>
  );
}

export default Footer;