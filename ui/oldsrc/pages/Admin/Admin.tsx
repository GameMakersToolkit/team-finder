import React, { useEffect, useState } from "react";
import {getBannedUsers, getReportedTeams} from "../../utils/TeamActions";
import {TeamData} from "../../../oldsrc/components/Team";
import {TeamView} from "./TeamView";
import {User, UserView} from "./UserView";

const subNavStyle = "text-primary font-medium leading-tight text-2xl font-light bg-black py-3 px-4 w-48 text-white text-center uppercase whitespace-pre rounded-t-lg border-t border-l border-r"

export const Admin: React.FC = () => {
  /** The UI doesn't have a definitive way to know this, but all of these calls are auth-protected for admin users */
  /** If the initial GET /teams/reports fails, we can be fairly safe the user isn't an admin or the login has expired */
  const [notLoggedInAsAdmin, setNotLoggedInAsAdmin] = useState(false);
  const [isAngryAdmin, setIsAngryAdmin] = useState(true);

  const [teams, setTeams] = useState< Record<string, unknown>[] >([]);
  const [bannedUsers, setBannedUsers] = useState< User[] >([]);

  useEffect(() => {
    let mounted = true;

    getReportedTeams()
      .then(async (res) => {

        // Set teams if the component has completed mounting (I think)
        if (mounted) {
          setTeams(await res.json())
        }
      })
      .catch(() => setNotLoggedInAsAdmin(true));

    getBannedUsers()
      .then(async (res) => {

        // Set teams if the component has completed mounting (I think)
        if (mounted) {
          setBannedUsers(await res.json())
        }
      })
      .catch(() => setNotLoggedInAsAdmin(true));

    return () => {
      mounted = false;
    }
  }, [])

  if (notLoggedInAsAdmin) {
    return (<p>The API has rejected your access to restricted content. Reauthenticate and try again.</p>)
  }


  return (
    <>

      <div className="flex flex-row justify-center items-center space-x-4 my-8 border-b border-white">
        <button onClick={() => setIsAngryAdmin(true)} className={subNavStyle}>lol<br />nope</button>
        <button onClick={() => setIsAngryAdmin(false)} className={subNavStyle}>whoops,<br />my bad</button>
      </div>

      { isAngryAdmin ? <AngryAdminView teams={teams} /> : <WhoopsAdminView users={bannedUsers} /> }

    </>
  )
}


const AngryAdminView: React.FC<{teams:Record<string, unknown>[]}> = ({teams}) => {
  return (
    <div>
      {
        teams && teams.length > 0
          ? teams.map(t => <TeamView key={t.id as string} team={new TeamData(t)} />)
          : <p>Could not load any reported teams</p>
      }
    </div>
  )
}

const WhoopsAdminView: React.FC<{users:User[]}> = ({users}) => {
  return (
    <>
      <div>
        {
          users && users.length > 0
            ? users.map(user => <UserView key={user.discordId} user={user} />)
            : <p>Could not load any banned users</p>
        }
      </div>
    </>
  )
}
