import * as React from "react";
import { importMetaEnv } from "../../utils/importMeta";

export const loginUrl = `${importMetaEnv().VITE_API_URL}/login`

export const Login: React.FC = () => {

  return (<>
    <div className="text-center text-3xl text-primary font-light my-12">
      Log in with Discord to continue
    </div>

    <div className="text-center">
      <a className="inline-block mb-8" href={loginUrl}>
        <div className="text-center text-2xl sm:p-8 sm:px-16 p-4 px-8 border-2 border-white">
          <img
            className="mx-auto"
            width={320}
            src="/DiscordLogo.svg"
          />
          <div className="inline-block p-4 my-4 leading-none rounded-2xl" style={{background:"#5865F2"}}>Log In with Discord</div>
        </div>
      </a>
    </div>

    <p>This site uses your Discord account to track your team, and let other jammers find you easily!</p>
    <p>Please be respectful and follow the guidelines on the Register page once you&rsquo;ve logged in.</p>
  </>)
}
