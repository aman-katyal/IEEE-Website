import { committee } from './committee'
import { leader } from './leader'
import { cornerstone } from './cornerstone'
import { officersConfig } from './officersConfig'
import { siteSettings } from './siteSettings'
import { homePage } from './homePage'
import { aboutPage, timelineMilestone } from './aboutPage'
import { joinPage } from './joinPage'
import { partner } from './partner'
import { officeHours } from './officeHours'

// Shared Objects
import { socialLink, metric, imageStyle, meetingSlot } from './objects/common'
import { textSection, projectsSection, faqSection, gallerySection, historySection } from './objects/sections'
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
  joinPage,
  partner,
  officeHours,

  // Objects
  socialLink,
  metric,
  imageStyle,
  meetingSlot,
  textSection,
  projectsSection,
  faqSection,
  gallerySection,
  historySection,
  aboutPageSection,
  timelineMilestone,
]
