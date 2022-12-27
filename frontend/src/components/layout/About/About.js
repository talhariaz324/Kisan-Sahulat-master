import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/talhariaz324/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dwkg4auqj/image/upload/v1666299343/avatars/img-modified_bmtsao.png"
              alt="Founder"
            />
            <Typography>Talha Riaz</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>This is an E-Commerce Wesbite Made By @Talha Riaz.</span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.linkedin.com/in/talha-riaz-388691213"
              target="blank"
            >
              <LinkedInIcon className="linkedinSvgIcon" />
            </a>

            <a
              href="https://Wa.me/923244324155?text=Hi+there,+my+name+is"
              target="blank"
            >
              <WhatsAppIcon className="whatsappSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
