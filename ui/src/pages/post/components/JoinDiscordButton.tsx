export const JoinDiscordButton = () => {
    return (
        <span className="mb-6 px-6 py-2 border-theme-l-7 bg-theme-l-7 rounded-xl text-grey-900 font-bold inline-flex cursor-pointer">
            <a
                target="_blank"
                rel="noreferrer"
                href={import.meta.env.VITE_DISCORD_INVITE_URL}
                className="text-sm"
            >
                {`Join the ${import.meta.env.VITE_DISCORD_NAME} server to send messages to other jammers!`}
            </a>
        </span >
    )
}