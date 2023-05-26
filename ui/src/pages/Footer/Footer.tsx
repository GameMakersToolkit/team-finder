import discordIcon from "./icons/discord.svg";
import youtubeIcon from "./icons/youtube.svg";

const Footer: React.FC<Props> = ({}) => {


  return (
    <div id="footer" className="mt-6 w-full h-[64px] flex justify-center items-center" style={{backgroundImage: "linear-gradient(-30deg, #111827, #275a80)"}}>
      <div className="px-4 border-r-2 border-[#28eaf1] h-[32px]">
          <a className="block" style={{position: "relative", top: "50%", transform: "translateY(-50%)"}} href="https://www.youtube.com/@GMTK">
            <img className="hover:scale-125" src={youtubeIcon} alt="GMTK Channel" style={{width:"32px"}} />
          </a>
      </div>

      <div className="px-4 border-r-2 border-[#28eaf1] h-[32px]">
          <a className="block" style={{position: "relative", top: "50%", transform: "translateY(-50%)"}} href="https://itch.io/jam/gmtk-2023">
            <img className="hover:scale-125" src="../favicon.png" alt="GMTK Game Jam" style={{width:"32px"}} />
          </a>
      </div>
      <div className="px-4 h-[32px]">
          <a className="block" style={{position: "relative", top: "50%", transform: "translateY(-50%)"}} href="https://discord.gg/pd4rQKU">
            <img className="hover:scale-125" src={discordIcon} alt="GMTK Discord" style={{width:"32px"}} />
          </a>
      </div>
    </div>
  )
};

export default Footer;