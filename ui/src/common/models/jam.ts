export type Jam = {
  jamId: string,
  name: string,
  status: string,
  start: string,
  end: string,
  duration: string,
  styles: {
    [key: string]: any
  },
  bgImageUrl: string,
  logoLargeUrl: string,
  logoStackedUrl: string,
  faviconUrl: string,
  adminInfo?: {[key: string]: {discordId: string, username: string}},
  guildInviteLink?: string,
}
