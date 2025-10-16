import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Footer.css";
import discord from "../Assets/discord.png";
import youtube from "../Assets/youtube.png";
import instagram from "../Assets/instagram.png";
import facebook from "../Assets/facebook.png";
import footerLeftImg from "../Assets/footerLeft.png";

const Footer = () => {
  return (
    <footer className="site-footer">
        <div className="footer-content">
            <div className="footer-left">
                <img src={footerLeftImg} className="footer-logo" />
            </div>
            <div className="footer-middle">
            </div>
            <div className="footer-right">
                <p>Socials</p>
                <div className="footer-right-links">
                <a href="https://discord.com/invite/clashroyale" rel="noreferrer" target="_blank"><img src={discord} alt="Discord" className="footer-right-icons" /></a>
                <a href="https://youtube.com/@clashroyale?si=w8JGCRxv0em_-Muv" rel="noreferrer" target="_blank"><img src={youtube} alt="YouTube" className="footer-right-icons" /></a>
                <a href="https://www.instagram.com/clashroyale/" rel="noreferrer" target="_blank"><img src={instagram} alt="Instagram" className="footer-right-icons" /></a>
                <a href="https://www.facebook.com/ClashRoyale/" rel="noreferrer" target="_blank"><img src={facebook} alt="Facebook" className="footer-right-icons" /></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p className="copyright">&copy; {new Date().getFullYear()} MetaCrown. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;