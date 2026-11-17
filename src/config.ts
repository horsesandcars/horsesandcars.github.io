export const SITE = {
  name: 'HorsesAndCars.com',
  title: 'HorsesAndCars.com - A Hammond family website! ',
  description: 'A Hammond Family Site!',
  logo: '/assets/Logo.png',
  favicon: '/assets/favicon.ico',
  url: 'https://www.horsesandcars.com',
  googleAnalytics: 'G-3N8KM9L0YH',
  disqus: '', // set a Disqus shortname to enable comments
  mailchimpList: '',
  templateMessage:
    '<a target="_blank" href="https://www.chrishammond.com/">Forked from Chris Hammond</a>',
  keywords: '',
  adsense: {
    enabled: false,
    client: '',
    slot: '',
  },
  postsPerPage: 6,
};

export interface Author {
  name: string;
  display_name: string;
  gravatar?: string;
  avatar?: string;
  email?: string;
  web?: string;
  twitter?: string;
  description?: string;
}

export const AUTHORS: Record<string, Author> = {
  chris: {
    name: 'Chris Hammond',
    display_name: 'Chris Hammond',
    gravatar: 'bff097b7cc348bebce39ee1c7694d125',
    email: 'hammondfamily@christoc.com',
    web: 'https://www.chrishammond.com',
    twitter: 'https://twitter.com/christoc',
    description: 'Read more at ChrisHammond.com',
  },
};
