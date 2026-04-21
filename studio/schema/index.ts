import { committee } from './committee'
import { leader } from './leader'
import { cornerstone } from './cornerstone'
import { officersConfig } from './officersConfig'
import { siteSettings } from './siteSettings'
import { homePage } from './homePage'
import { aboutPage } from './aboutPage'
import { partner } from './partner'

// Shared Objects
import { socialLink, metric, imageStyle } from './objects/common'
import { textSection, projectsSection, faqSection, gallerySection } from './objects/sections'
import { aboutPageSection } from './objects/aboutPageSection'

export const schemaTypes = [
  // Documents
  committee,
  leader,
  cornerstone,
  officersConfig,
  siteSettings,
  homePage,
  aboutPage,
  partner,

  // Objects
  socialLink,
  metric,
  imageStyle,
  textSection,
  projectsSection,
  faqSection,
  gallerySection,
  aboutPageSection,
]
