# Product Guidelines

## Content & Voice
- **Tone:** Approachable & Informative. The website should feel welcoming to new students while providing the technical detail that engineering students expect.
- **Language:** Use clear, professional English. Avoid overly dense jargon where possible, or provide context for technical terms related to committee work.
- **Clarity:** Ensure that the value proposition of each committee is immediately obvious to prospective members.

## UI/UX Principles
- **Brand-Consistent Design:** Adhere to the official Purdue IEEE branding and color scheme. Ensure consistency in typography and visual elements across all pages.
- **Motion-Driven Interactivity:** Use animations to enhance the user experience, providing visual feedback and smooth transitions between states and pages.
- **Performance-First Implementation:** Prioritize runtime smoothness and fast perceived load times through techniques like lazy loading, data prefetching, and hardware acceleration.
- **Consistency:** Maintain a unified look and feel by using standardized components and utility classes.

## Component Standards
- **Accessible Primitives:** Build all UI components using Radix UI primitives to ensure high accessibility and consistent behavior across browsers.
- **Utility-First CSS:** Use Tailwind CSS utility classes for styling to promote rapid development and maintainable CSS.
- **Declarative Animations:** Utilize Framer Motion (`motion/react`) for all animations, ensuring they are performant and declaratively defined within React components.
- **Responsive Design:** Every component must be mobile-friendly and work seamlessly across different screen sizes.

## Maintenance & Scalability
- **Data-Driven UI:** Decouple content from UI components by managing committee and leadership data centrally (e.g., via Sanity CMS or centralized data files).
- **TypeScript First:** Maintain strict typing for all components and data structures to ensure code quality and easier refactoring.
