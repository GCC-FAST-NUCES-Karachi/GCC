# GCC Website — Progress and Plan

## Current progress

- The site uses Next.js App Router, React, locally hosted Inter and JetBrains Mono fonts, shared design tokens, and route-level stylesheets.
- The shared navbar and footer are implemented. The navbar has a responsive menu, Join link, GitHub link, and an inert terminal-icon button. The terminal button is visual only and does not navigate or launch a terminal.
- The landing page has the hero, core functions, highlights, a Play placeholder, three sample events, and the Join section.
- `/events`, `/learn`, and `/team` routes exist, but their copy is still placeholder content.
- The canvas galaxy rotates with scroll direction and uses a reduced particle count on narrow screens. Reduced-motion users get a static presentation.
- The GCC cat is shown without hands; its pupils start centered and follow the pointer.
- The blue constellation overlay and fast-scroll streaks, footer loop strip, glitch crack rays, and hidden glitch sequence were removed in the current implementation.
- The full terminal experience and arcade game have not been implemented. The Play section remains a placeholder.
- Page styles live beside their route; shared component styles live beside the component.
- `npm run lint` and `npm run build` pass after the latest CSS organization changes.

## Planned work

### 1. Finish page content and navigation

- Replace placeholder copy on Events, Learn, and Team with accurate, approved club information.
- Make the Events page useful for current and past events, with dates, locations, descriptions, and RSVP destinations.
- Build the Learn page around approved workshops, tutorials, and learning resources.
- Build the Team page with approved roles, names, bios, and contact links.
- Review every internal and external link, including navigation, footer, social links, Join, event cards, and RSVP destinations. Remove placeholders or mark them clearly until their destinations exist.
- Confirm all supplied club facts and calls to action with the club before release.

### 2. Complete responsive behavior

- Review the navbar, hero, galaxy placement, section layouts, cards, Join section, footer, and all route pages at narrow phones, large phones, tablets, laptops, and wide desktop sizes.
- Verify the menu stays reachable and does not overlap content, and that the logo, terminal icon, Join button, GitHub icon, and menu fit at narrow widths.
- Check for horizontal overflow, clipped text, and awkward empty space.
- Test galaxy performance on real mobile hardware and preserve the reduced-motion fallback.

### 3. Add the requested landing-page effects

- Design and implement an infinite looping strip or carousel that fits the GCC content and pauses or reduces motion when appropriate.
- Reintroduce a deliberate glitch effect with a clear visual trigger and controlled timing.
- Add a breaking-glass effect as a separate, intentional interaction, with a reset/recovery state and a reduced-motion alternative.
- Keep these effects distinct from the galaxy and ensure they do not obscure page text, controls, or accessibility focus.

### 4. Build the Terminal experience

- Keep the navbar terminal icon as an inert button until the terminal experience is ready.
- Define what the terminal should do, which commands it supports, and whether it is a modal, panel, or page feature.
- Implement keyboard operation, clear close behavior, safe command handling, and mobile-friendly sizing.
- Connect the button only after the finished terminal experience is approved and working.

### 5. Finish the Play section

- Choose the game and define its controls, goals, and audience before replacing the placeholder.
- Implement a responsive game experience with keyboard and touch controls, clear instructions, and a restart path.
- Respect reduced-motion preferences and avoid degrading the galaxy or page scrolling on mobile.

### 6. SEO, accessibility, and release quality

- Add page-specific titles and descriptions, canonical URLs, Open Graph/social preview metadata, and a site icon review.
- Add and verify `sitemap.xml` and `robots.txt` for the production domain.
- Confirm semantic headings, landmarks, descriptive link names, keyboard navigation, focus visibility, contrast, and screen-reader labels on every route.
- Check that motion effects respect reduced-motion preferences and that interactive content works without a pointer.
- Verify production links, metadata, responsive layouts, console output, and build behavior before release.

## Scope notes

- Keep the sample events and placeholder RSVP destinations until real event data and links are supplied; replace them before public launch.
- The navbar terminal control is currently an inert visual button. It does not open a terminal or navigate.
- The infinite loop, glitch effect, breaking-glass effect, full terminal, and final game are planned work and are not currently present.
