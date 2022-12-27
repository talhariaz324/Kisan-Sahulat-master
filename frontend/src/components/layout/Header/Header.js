import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";

const Header = () => {
  return (
    <ReactNavbar
      burgerColorHover="#097969"
      logo={logo}
      logoWidth="20vmax"
      navColor1="white"
      logoHoverSize="10px"
      logoHoverColor="#097969"
      link1Text="Home"
      link2Text="Products"
      link3Text="Contact"
      link4Text="About"
      link1Url="/"
      link2Url="/products"
      link3Url="/contact"
      link4Url="/about"
      link1Size="1.3vmax"
      link1Color="rgba(35, 35, 35,0.8)"
      nav1justifyContent="flex-end"
      nav2justifyContent="flex-end"
      nav3justifyContent="flex-start"
      nav4justifyContent="flex-start"
      link1ColorHover="#097969"
      link1Margin="1vmax"
      profileIcon={true}
      ProfileIconElement={FaUserCircle}
      profileIconUrl="/login"
      profileIconColor="rgba(35, 35, 35,0.8)"
      profileIconColorHover="#097969"
      searchIcon={true}
      SearchIconElement={FaSearch}
      searchIconColor="rgba(35, 35, 35,0.8)"
      searchIconColorHover="#097969"
      cartIcon={true}
      CartIconElement={FiShoppingBag}
      cartIconColor="rgba(35, 35, 35,0.8)"
      cartIconColorHover="#097969"
      cartIconMargin="1vmax"
    />
  );
};

export default Header;
