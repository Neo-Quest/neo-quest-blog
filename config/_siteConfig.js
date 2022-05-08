/**
 * CMS Configuration
 * Alter 'netlify' in the import statment below to one of the following:
 * netlify
 */
import theCMS from '../cms/netlify/cms'

/**
 * General Site configurations
 */
export default {
  siteName: 'Neo Quest',
  tagline: 'Let Us Build Your App',
  featureImage: '/uploads/home-hero.jpg',
  logo: '/logo.png', // 'logo-component', // or '/logo.svg' for regular image
  googleAnalytics: {
    on: true,
    id: 'G-GJZ5LL0SJP' // process.env.GOOGLE_ANALYTICS_ID
  },
  mainMenu: [
    // {
    //   name: 'About',
    //   link: '/about'
    // },
    {
      name: 'Contact',
      link: '/contact'
    }
    // {
    //   name: 'Categories',
    //   link: '/categories'
    // },
    // {
    //   name: 'Github Repo',
    //   link: 'https://github.com/danielkellyio/awake-template',
    //   target: '_blank'
    // },
    // {
    //   name: 'Awake+ Premium',
    //   link: 'https://awake-premium-lp.netlify.com/',
    //   target: '_blank'
    // }
  ],
  hero: {
    theme: 'dark' // options: mist, light, dark
  },

  // Main Layout/Style
  layout: {
    width: 'contained', // Options: contained, full
    theme: 'one-column' // Options: one-column, sidebar-right, sidebar-left
  },

  // Card Layout
  cards: {
    imageDimensions: '2x1', // Options: 1x1, 5x4, 4x3, 3x2, 5x3, 16x9, 2x1, 3x1, 4x5, 3x4, 2x3, 3x5, 9x16
    theme: 'boxes' // Options: boxes, grid, image-grid
  },

  // Disqus
  disqus: {
    on: true,
    loadingStrategy: 'button', // Options: onload, lazy, button
    siteShortName: 'blog-danielkelly-io' // 'blog-danielkelly-io'
  },

  // Newsletter Subscribe
  newsletter: {
    on: true,
    heading: 'Subscribe to Our Newsletter',
    btnText: 'Subscribe',
    // Can be the form action on a mail chimp form, a hubspot form,
    // or any other url you want to post the form data to
    mailchimp: {
      on: true,
      formAction:
        'https://xyz.us14.list-manage.com/subscribe/post?u=fd52fca42416a5ae67a9296ee&amp;id=c0271a444e'
    },
    custom: {
      on: false,
      formAction: ''
    }
  },

  // Categories
  categories: {
    on: true,
    perPage: 6,
    imageDimensions: null, // See card.imageDimensions (can be unique for categories if set here)
    theme: null // See card.theme (can be unique for categories if set here)
  },

  // Posts
  posts: {
    on: true,
    theme: null, // See card.theme (can be unique for posts if set here)
    imageDimensions: null, // See card.imageDimensions (can be unique for posts if set here)
    displayAuthor: true,
    date: {
      display: true
    },
    perRow: 3,
    perPage: 6
  }
}

export const CMS = theCMS
