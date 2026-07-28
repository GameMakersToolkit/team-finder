import React, { useContext } from "react";
import discordIcon from "../../assets/icons/social/discord.svg";
import youtubeIcon from "../../assets/icons/social/youtube.svg";
import { JamSpecificContext } from "../../common/components/JamSpecificStyling.tsx";

const footerLinkKeys = {
    primaryLabel: "footer-primary-label",
    primaryUrl: "footer-primary-url",
    primaryIconUrl: "footer-primary-icon-url",
    secondaryLabel: "footer-secondary-label",
    secondaryUrl: "footer-secondary-url",
    secondaryIconUrl: "footer-secondary-icon-url",
    tertiaryLabel: "footer-tertiary-label",
    tertiaryUrl: "footer-tertiary-url",
    tertiaryIconUrl: "footer-tertiary-icon-url",
} as const;

const Footer: React.FC = () => {
    const theme = useContext(JamSpecificContext);

    const footerImages = [
        {
            alt: theme.styles[footerLinkKeys.primaryLabel] || `${theme.name} homepage`,
            src: theme.styles[footerLinkKeys.primaryIconUrl] || theme.logoStackedUrl,
            href: theme.styles[footerLinkKeys.primaryUrl],
        },
        {
            alt: theme.styles[footerLinkKeys.secondaryLabel] || "Community channel",
            src: theme.styles[footerLinkKeys.secondaryIconUrl] || youtubeIcon,
            href: theme.styles[footerLinkKeys.secondaryUrl],
        },
        {
            alt: theme.styles[footerLinkKeys.tertiaryLabel] || "Community discord",
            src: theme.styles[footerLinkKeys.tertiaryIconUrl] || discordIcon,
            href: theme.styles[footerLinkKeys.tertiaryUrl],
        },
    ].filter(link => Boolean(link.href));

    return (
        <footer className="c-footer" style={{}}>
            {footerImages.map(footerImage => (
                <div key={footerImage.alt} className="footer__icon">
                    <a target="_blank" rel="noreferrer" className="footer__icon--link" href={footerImage.href}>
                        <img className="hover:scale-125" src={footerImage.src} alt={footerImage.alt} style={{width:"24px"}} />
                    </a>
                </div>
            ))}
        </footer>
    )
};

export default Footer;
