export type Jam = {
  jamId: string,
  name: string,
  status: string,
  participants: number,
  start: string,
  end: string,
  duration: string,
  styles: {
    [key: string]: any
  },
  imageUrls: { [key: string]: string },
  adminInfo?: {[key: string]: {discordId: string, username: string}}
}
