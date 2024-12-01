import React from "react";
import discordIcon from "../../assets/icons/social/discord.svg";
import footerIcon from "../../assets/icons/social/footer.png"

const Footer: React.FC = () => {
    const footerImages = [
        // {alt: "GMTK Youtube Channel", src: youtubeIcon, href: "https://www.youtube.com/@GMTK"},
        {alt: "Boss Rush Jam page on itch.io", src: footerIcon, href: "https://itch.io/jam/boss-rush-jam-2025"},
        {alt: "Boss Rush Jam Discord server", src: discordIcon, href: "https://discord.gg/uzKPF4NjfJ"},
    ]

    return (
        <footer className="c-footer" style={{}}>
            {footerImages.map((footerImage, index) => (
                <div key={footerImage.alt} className={`footer__icon`}>
                    <a target="_blank" className="footer__icon--link" href={footerImage.href}>
                        <img className="hover:scale-125" src={footerImage.src} alt={footerImage.alt} style={{width: index == 0 ? "42px" : "24px"}} />
                    </a>
                </div>
            ))}
        </footer>
    )
};

export default Footer;