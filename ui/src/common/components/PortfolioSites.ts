export const portfolioSites = [
  {
    host: "itch.io",
    icon: "itchio-small",
    label: (url: URL) => url.host.replace(".itch.io", "")
  },
  {
    host: "artstation.com",
    icon: "artstation",
    label: (url: URL) => url.pathname.split("/")[1] || url.host.replace(".artstation.com", "")
  },
  {
    host: "deviantart.com",
    icon: "deviantart",
    label: (url: URL) => url.pathname.split("/")[1] || url.host.replace(".deviantart.com", "")
  },
  {
    host: "soundcloud.com",
    icon: "soundcloud",
    label: (url: URL) => url.pathname.split("/")[1] || url.host.replace(".soundcloud.com", "")
  },
  {
    host: "github.com",
    icon: "github",
    label: (url: URL) => url.pathname.split("/")[1] || url.host.replace(".github.com", "")
  },
  {
    host: "linkedin.com",
    icon: "linkedin",
    label: (url: URL) => url.pathname.split("/")[2] || url.host.replace(".linkedin.com", "")
  },
  {
    host: "store.steampowered.com",
    icon: "steam",
    label: (url: URL) => url.pathname.split("/")[3].replaceAll("_", " ") || url.host.replace("https://store.steampowered.com", "")
  },
  {
    host: "",
    icon: "other",
    label: (_: URL) => ""
  }
];

export const getPortfolioLink = (link: string) => {
  // TODO: Try/Catch
  let url: URL | undefined;
  try {
    url = new URL(link);
  } catch {
    url = new URL(`https://${link}`)
  } finally {
    if (url != undefined) {
      url.protocol = "https"
      url.search = ""
    }
  }

  for (const site of portfolioSites) {
    if (url.host.endsWith(site.host)) {
      return {
        icon: site.icon,
        url: url.toString(),
        label: site.icon === "other" ? url.host : site.label(url),
      };
    }
  }

  // fallback: just show the link
  return {
    icon: 'other',
    url: url.toString(),
    label: url.host,
  };
}
