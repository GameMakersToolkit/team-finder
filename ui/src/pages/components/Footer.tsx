import React from "react";
import discordIcon from "../../assets/icons/social/discord.svg";
import gmtkIcon from "../../assets/icons/social/gmtk-letter-logo.png";
import youtubeIcon from "../../assets/icons/social/youtube.svg";

const jamUrl = import.meta.env.VITE_JAM_URL;

const Footer: React.FC = () => {
    const footerImages = [
        {alt: "GMTK Youtube Channel", src: youtubeIcon, href: "https://www.youtube.com/@GMTK"},
        {alt: "GMTK Game Jam page on itch.io", src: gmtkIcon, href: jamUrl},
        {alt: "GMTK Discord server", src: discordIcon, href: "https://discord.gg/pd4rQKU"},
    ]

    return (
        <footer className="c-footer" style={{}}>
            {footerImages.map(footerImage => (
                <div key={footerImage.alt} className="footer__icon">
                    <a target="_blank" className="footer__icon--link" href={footerImage.href}>
                        <img className="hover:scale-125" src={footerImage.src} alt={footerImage.alt} style={{width:"24px"}} />
                    </a>
                </div>
            ))}
        </footer>
    )
};

export default Footer;