export type Jam = {
  jamId: string,
  name: string,
  participants: number,
  start: string,
  end: string,
  duration: string,
  styles: {
    [key: string]: any
  },
  bgImageUrl: string,
  logoLargeUrl: string,
  logoStackedUrl: string,
}
