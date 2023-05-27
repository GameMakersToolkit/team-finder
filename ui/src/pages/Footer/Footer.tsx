import discordIcon from "./icons/discord.svg";
import gmtkIcon from "./icons/gmtk-letter-logo.png";
import youtubeIcon from "./icons/youtube.svg";

const Footer: React.FC<Props> = ({}) => {


  return (
    <div id="footer" className="mt-6 w-full h-[64px] flex justify-center items-center" style={{backgroundImage: "linear-gradient(0deg, #042e62, #000000)"}}>
      <div className="px-4 border-r-2 border-[#28eaf1] h-[24px]">
          <a target="_blank" className="block" style={{position: "relative", top: "50%", transform: "translateY(-50%)"}} href="https://www.youtube.com/@GMTK">
            <img className="hover:scale-125" src={youtubeIcon} alt="GMTK Channel" style={{width:"24px"}} />
          </a>
      </div>

      <div className="px-4 border-r-2 border-[#28eaf1] h-[24px]">
          <a target="_blank" className="block" style={{position: "relative", top: "50%", transform: "translateY(-50%)"}} href="https://itch.io/jam/gmtk-2023">
            <img className="hover:scale-125" src={gmtkIcon} alt="GMTK Game Jam" style={{width:"24px"}} />
          </a>
      </div>
      <div className="px-4 h-[24px]">
          <a target="_blank" className="block" style={{position: "relative", top: "50%", transform: "translateY(-50%)"}} href="https://discord.gg/pd4rQKU">
            <img className="hover:scale-125" src={discordIcon} alt="GMTK Discord" style={{width:"24px"}} />
          </a>
      </div>
    </div>
  )
};

export default Footer;