// Legal and policy pages: privacy, terms, cookies, accessibility, credits and contact.
// The wording describes how ChemLab actually works (localStorage, Supabase accounts, the AI proxy).
// Keep SITE.updated in sync when you change a policy. These pages are plain-language drafts, not legal advice.
import { SITE } from '../data/site.js';
import { getUser } from '../lib/auth.js';
import { openAuth } from '../components/authDialog.js';
import { openDeleteDialog } from '../components/deleteDialog.js';

const CONTACT = `<a href="${SITE.contact}" target="_blank" rel="noopener">${SITE.contactLabel}</a>`;

const IMAGES = [
  ['glassware.jpg', 'Laboratory Glasswares.jpg', 'Ajay Kumar Chaurasiya', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Laboratory_Glasswares.jpg'],
  ['erlenmeyer.png', 'Erlenmeyer flask.svg', 'Leevclarke', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Erlenmeyer_flask.svg'],
  ['bunsen.jpg', 'Mechero Bunsen.jpg', 'Amfeli', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Mechero_Bunsen.jpg'],
  ['fume-hood.jpg', 'Fume hood.jpg', '—', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Fume_hood.jpg'],
  ['goggles.jpg', 'Safety Goggles.jpg', 'DJSparky', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Safety_Goggles.jpg'],
  ['eyewash.jpg', 'Emergency Eyewash and Shower.jpg', 'Mbrickn', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Emergency_Eyewash_and_Shower.jpg'],
  ['shower.jpg', 'Safety Shower and Eye Wash Station.jpg', 'Mpelletier1', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Safety_Shower_and_Eye_Wash_Station.jpg'],
];

const PAGES = {
  privacy: {
    eyebrow: 'Privacy',
    title: 'Privacy policy',
    intro: `This page explains what ${SITE.name} collects, why it is collected, where it is stored and how you can delete it. It describes how the site actually works rather than a generic template.`,
    blocks: [
      ['note', `<strong>Short version:</strong> you can use ${SITE.name} without an account. We do not run advertising, analytics or tracking, and we do not sell data. An account stores only your email, a password hash and your lesson progress. ChemBot messages are sent to an AI provider to generate the answer.`],
      ['h', 'Who runs ChemLab'],
      ['p', `${SITE.name} is a free educational project operated by ${SITE.owner}. For any privacy question or request, use ${CONTACT}.`],
      ['h', 'What we collect'],
      ['table', ['Data', 'When', 'Where it is stored'], [
        ['Theme choice (light or dark)', 'When you switch theme', 'Your browser’s <code>localStorage</code>'],
        ['Lesson progress (module ids and completed item ids)', 'When you mark a lesson, simulation, calculator or quiz complete', 'Your browser’s <code>localStorage</code>; also in the Supabase <code>progress</code> table if you are signed in'],
        ['Account email address', 'When you create an account', 'Supabase authentication'],
        ['Password', 'When you create an account', 'Stored only as a one-way hash by Supabase. We never see or store the password itself.'],
        ['ChemBot chat messages', 'When you use the AI tutor', 'The current tab’s <code>sessionStorage</code>; sent through our server to the AI provider to produce an answer'],
        ['Basic request information (IP address, time, browser)', 'When you visit or use ChemBot', 'Short-lived hosting logs and an in-memory rate-limit counter on Vercel'],
      ]],
      ['h', 'What we do not collect'],
      ['list', [
        'No name, phone number, postal address, date of birth or payment details.',
        'No advertising identifiers, analytics, tracking pixels, fingerprinting or cross-site profiles.',
        'No location data and no access to your contacts, camera, microphone or files.',
        'We do not sell, rent or trade personal data.',
      ]],
      ['h', 'Why we use it'],
      ['list', [
        'To run the site and remember your theme and progress.',
        'To keep your progress across devices when you choose to create an account.',
        'To answer your ChemBot questions and keep the service from being abused.',
        'To keep the site secure and fix faults.',
      ]],
      ['h', 'ChemBot and AI providers'],
      ['p', 'ChemBot is not a person. When you send a message, the message text, up to the last eight messages in the conversation, and the module or page you are on are sent through a server function hosted on Vercel to one of our AI providers: <strong>DeepSeek</strong> or <strong>Google Gemini</strong>. Your email address and account id are not sent with the question.'],
      ['p', 'Do not type personal, sensitive or confidential information into ChemBot. AI providers may keep request data under their own policies: <a href="https://www.deepseek.com/privacy" target="_blank" rel="noopener">DeepSeek privacy policy</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google privacy policy</a>.'],
      ['h', 'Cookies and local storage'],
      ['p', 'ChemLab does not set advertising or analytics cookies. It uses browser storage for the site to work. The <a href="#/cookies">cookies and storage page</a> lists every key and explains how to clear it.'],
      ['h', 'Who we share it with'],
      ['table', ['Provider', 'What it does', 'Data involved'], [
        ['Supabase', 'Accounts and the progress database', 'Email, password hash, user id, progress rows'],
        ['Vercel', 'Hosting and the ChemBot server function', 'Request metadata and logs; chat text in transit'],
        ['DeepSeek / Google Gemini', 'Generates ChemBot answers', 'Chat text and page context'],
        ['jsDelivr', 'Serves the Supabase JavaScript library', 'Your IP address and browser request headers'],
      ]],
      ['p', 'These providers process data on our behalf or as independent services under their own terms. Some may process data outside your country.'],
      ['h', 'How long we keep it'],
      ['list', [
        'Browser progress and theme: until you clear them or use “Reset my progress”.',
        'ChemBot history: until you close the tab or start a new chat.',
        'Account and progress rows: until you delete your account or ask us to delete them.',
        'Server logs and rate-limit counters: short periods set by the hosting provider, used only for security and abuse prevention.',
      ]],
      ['h', 'Your choices and rights'],
      ['p', 'You can use ChemLab without an account, reset progress at any time from the footer, and clear browser storage from your browser settings. Depending on where you live, you may also have the right to access, correct, export, restrict or object to the processing of your data, and to complain to a data-protection authority.'],
      ['p', `Signed-in users can delete their account and all saved progress from <strong>Account → Delete account</strong>, or with the button below. For any other request, contact us via ${CONTACT}.`],
      ['h', 'Children'],
      ['p', `ChemLab is intended for people aged ${SITE.minAge} or older. If you are under ${SITE.minAge}, do not create an account. If you are between ${SITE.minAge} and 16 and your local law requires it, use an account only with permission from a parent or guardian. Contact us if you believe a child has created an account so we can delete it.`],
      ['h', 'Security'],
      ['p', 'The site is served over HTTPS. Supabase row-level security means a signed-in user can only read and write their own progress rows. The Supabase key shipped to the browser is a public “publishable” key; the secret service key is kept only in server environment variables. No system is perfectly secure, so use a unique password.'],
      ['h', 'Emails'],
      ['p', 'ChemLab sends only transactional account emails: address confirmation, password reset and account-deletion confirmation. It does not send newsletters, promotions or marketing, so there is no mailing list to unsubscribe from.'],
      ['h', 'Changes to this policy'],
      ['p', `If this policy changes, the date at the top of the page changes. Material changes will be noted on the site. Last updated: ${SITE.updated}.`],
    ],
  },

  terms: {
    eyebrow: 'Terms',
    title: 'Terms of service',
    intro: `These terms are the agreement between you and ${SITE.name}. By using the site, you accept them. If you do not accept them, please do not use the site.`,
    blocks: [
      ['h', 'What ChemLab is'],
      ['p', `${SITE.name} is a free study aid for chemistry. It provides lessons, simulations, calculators, quizzes and an AI tutor. It is a personal educational project, not a school, university, laboratory, publisher or professional advice service.`],
      ['p', 'ChemLab is not a substitute for your instructor, your course, your laboratory rules or a chemical safety data sheet (SDS). Always follow the instructions and supervision of a qualified instructor.'],
      ['h', 'Your account'],
      ['list', [
        `Accounts are optional. You must be at least ${SITE.minAge} years old to create one.`,
        'Use a valid email address that you control, and keep your password secure.',
        'You are responsible for activity under your account. Tell us promptly if you think someone else has access to it.',
        'One person per account. Do not share, sell or transfer accounts.',
      ]],
      ['h', 'Acceptable use'],
      ['list', [
        'Use ChemLab for lawful learning and teaching.',
        'Do not attempt to break, overload, scrape, reverse-engineer or bypass the security or rate limits of the site or its providers.',
        'Do not upload or send malware, unlawful content, or other people’s personal information.',
        'Do not harass other people, impersonate anyone, or use the site to cheat in a way that breaks your school’s rules.',
        'Do not resell the site or present it as your own product.',
      ]],
      ['h', 'ChemBot and AI answers'],
      ['p', 'ChemBot is an AI tutor and it can be wrong, incomplete or out of date. It can make mistakes in facts, formulas, units and calculations. Always check important answers against your textbook, your instructor or the step-by-step calculators. Do not use ChemBot as the only source for a lab safety decision.'],
      ['p', 'Do not send personal, sensitive or confidential information to ChemBot. Messages are processed by third-party AI providers as described in the <a href="#/privacy">privacy policy</a>.'],
      ['h', 'Laboratory and academic safety'],
      ['p', 'Chemistry involves hazardous substances, heat, glassware, pressure and electricity. ChemLab’s lessons and simulations are simplified teaching aids. They do not replace hands-on instruction, risk assessments, SDS sheets, local regulations or emergency procedures. You are responsible for working safely and for following your instructor’s directions.'],
      ['h', 'Content and intellectual property'],
      ['p', `The lessons, code and design of ${SITE.name} are original work unless stated otherwise. You may read, link to and print pages for personal study or classroom use. Do not republish substantial parts as your own work or use them commercially without permission.`],
      ['p', 'Photographs are used under the licences listed on the <a href="#/credits">credits page</a>. Their authors and licences must be kept with any reuse.'],
      ['p', 'You keep ownership of the questions you send to ChemBot. You give us permission to process them only to provide the service.'],
      ['h', 'Free service, no payments'],
      ['p', `${SITE.name} is free. There are no subscriptions, hidden fees, in-app purchases or paid upgrades. Because nothing is sold, there is nothing to refund. If paid features are ever added, their price and refund terms will be shown clearly before you pay.`],
      ['h', 'Availability and changes'],
      ['p', 'The site is provided as-is and may be changed, suspended or discontinued at any time. We do not promise uninterrupted availability, error-free content or that any particular module will be finished.'],
      ['h', 'Ending use'],
      ['p', 'You can stop using ChemLab at any time and delete your account from the account menu. We may suspend or remove access if these terms are broken or if the site is being abused.'],
      ['h', 'Disclaimers'],
      ['p', 'To the extent permitted by law, ChemLab is provided “as is” and “as available”, without warranties of any kind, express or implied, including fitness for a particular purpose, accuracy or non-infringement.'],
      ['h', 'Limitation of liability'],
      ['p', 'To the extent permitted by law, the operator is not liable for indirect, incidental, special or consequential loss, or for loss arising from reliance on educational content, AI answers, calculations or simulations. Nothing in these terms excludes liability that cannot lawfully be excluded.'],
      ['h', 'Consumer rights'],
      ['p', 'Nothing in these terms limits mandatory rights you have under the consumer or data-protection law that applies to you.'],
      ['h', 'Disputes and contact'],
      ['p', `If you have a problem, contact us first via ${CONTACT} so we can try to resolve it. These terms are governed by the laws that apply to the operator, without limiting any mandatory rights you have where you live.`],
      ['h', 'Changes to these terms'],
      ['p', `We may update these terms as the site changes. The date at the top of the page shows the current version. Continued use after a change means you accept the updated terms. Last updated: ${SITE.updated}.`],
    ],
  },

  cookies: {
    eyebrow: 'Cookies',
    title: 'Cookies and browser storage',
    intro: `This page lists everything ${SITE.name} stores in your browser. There are no advertising or analytics cookies, and no third-party tracking cookies.`,
    blocks: [
      ['note', '<strong>Short version:</strong> the site uses <code>localStorage</code> for your theme and progress, <code>sessionStorage</code> for the current ChemBot chat, and Supabase may store your sign-in session in <code>localStorage</code>. None of this is used for advertising.'],
      ['h', 'What is stored'],
      ['table', ['Key', 'Storage', 'Purpose', 'Lifetime'], [
        ['<code>chemlab:theme</code>', '<code>localStorage</code>', 'Remembers light or dark mode', 'Until you clear site data'],
        ['<code>chemlab:progress</code> (and its module keys)', '<code>localStorage</code>', 'Remembers completed lessons, simulations, calculators and quizzes', 'Until you reset progress or clear site data'],
        ['Supabase auth session', '<code>localStorage</code>', 'Keeps you signed in and refreshes your session', 'Until you sign out, delete your account or clear site data'],
        ['<code>chemlab:chat:v1</code>', '<code>sessionStorage</code>', 'Keeps the current ChemBot conversation while the tab is open', 'Until the tab is closed or you start a new chat'],
        ['<code>chemlab:storage-notice:v1</code>', '<code>localStorage</code>', 'Remembers that you dismissed the storage notice', 'Until you clear site data'],
      ]],
      ['h', 'Why there is no cookie consent banner'],
      ['p', 'Consent is normally required for cookies that are not strictly necessary, such as advertising or analytics cookies. ChemLab does not use those. The storage above is needed to provide the features you ask for (theme, progress, sign-in and the chat you are having), so it is treated as strictly functional. The small notice you see on your first visit explains this and lets you dismiss it.'],
      ['h', 'How to clear it'],
      ['list', [
        'Use <strong>Reset my progress</strong> in the footer to clear lesson progress.',
        'Sign out or delete your account from the account menu to remove the account session.',
        'Clear site data for this site in your browser settings to remove everything, including the theme choice.',
        'Use a private/incognito window if you do not want anything kept after you close it.',
      ]],
      ['h', 'Third parties'],
      ['p', 'ChemLab itself sets no cookies. Requests to Supabase, Vercel, jsDelivr and the AI providers are described in the <a href="#/privacy">privacy policy</a>. Those providers may receive your IP address and request headers as part of normal web traffic, but ChemLab does not embed their tracking cookies.'],
    ],
  },

  accessibility: {
    eyebrow: 'Accessibility',
    title: 'Accessibility statement',
    intro: `${SITE.name} aims to be usable by as many people as possible, including keyboard users, screen-reader users and people who prefer reduced motion.`,
    blocks: [
      ['h', 'Our target'],
      ['p', 'We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 level AA for the pages we control. This is a small student project, so the target is a goal rather than a formal certification.'],
      ['h', 'What we have done'],
      ['list', [
        'Every page has a “Skip to content” link and a logical heading order.',
        'All interactive controls are native buttons, links, inputs or dialogs, reachable and usable with a keyboard.',
        'A visible focus ring appears on every focusable element.',
        'Text and background colours are checked for contrast in both light and dark themes.',
        'Decorative icons and the hero animation are hidden from screen readers; meaningful images have alt text.',
        'Images in lessons have captions, and a failed image hides itself instead of showing a broken icon.',
        'Animations are reduced when your system asks for reduced motion (the hero atom is the one deliberate exception).',
        'Forms have visible labels, clear error messages and a live status region.',
        'The periodic table supports arrow-key movement and labels each element tile.',
        'The layout reflows on small screens and at high zoom, and it respects your theme preference.',
      ]],
      ['h', 'Known limitations'],
      ['list', [
        'The periodic table is information-dense; on very small screens it scrolls horizontally.',
        'ChemBot answers are generated by an AI provider and may be poorly structured for screen readers.',
        'Some older lesson diagrams are photographs, and a photograph cannot convey every detail that a labelled diagram would.',
        'Third-party pages linked from the legal pages are outside our control.',
      ]],
      ['h', 'Feedback'],
      ['p', `If something is hard to use or blocks you, please tell us via ${CONTACT}. Include the page, what you were trying to do and the assistive technology you use if you are comfortable sharing it. We will try to fix it.`],
      ['p', `Last reviewed: ${SITE.updated}.`],
    ],
  },

  credits: {
    eyebrow: 'Credits',
    title: 'Credits and licences',
    intro: `Images, fonts and code used by ${SITE.name}, with their licences.`,
    blocks: [
      ['h', 'Photographs'],
      ['p', 'All lesson photographs come from Wikimedia Commons and are bundled in <code>src/assets/lab/</code> so the site does not depend on an external image host. The author and licence must stay with any reuse.'],
      ['table', ['File', 'Original', 'Author', 'Licence'], IMAGES.map(([file, original, author, licence, url]) => [
        `<code>${file}</code>`,
        `<a href="${url}" target="_blank" rel="noopener">${original}</a>`,
        author,
        licence,
      ])],
      ['p', 'CC BY and CC BY-SA require attribution. If you reuse a photograph, credit the author, link the licence and indicate any changes.'],
      ['h', 'Fonts'],
      ['p', 'ChemLab uses the fonts already installed on your device (system UI and monospace fonts). It does not download or bundle any font files, so there are no font licences to distribute.'],
      ['h', 'Code and libraries'],
      ['list', [
        'The ChemLab code is original work by the project owner.',
        'The Supabase JavaScript client is loaded from jsDelivr under the MIT licence.',
        'No analytics, advertising or UI framework libraries are used.',
      ]],
      ['h', 'Course content'],
      ['p', 'Lesson text is written in original wording from the course outline and standard chemistry references. It is not a copy of the teacher’s slide deck.'],
      ['h', 'Reporting a missing credit'],
      ['p', `If you believe something is credited incorrectly or used without permission, contact us via ${CONTACT} and we will correct or remove it.`],
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Contact and site details',
    intro: `Who runs ${SITE.name}, how to reach us and how to make a data request.`,
    blocks: [
      ['h', 'Site details'],
      ['table', ['Item', 'Detail'], [
        ['Site', `${SITE.name} — interactive chemistry lessons, simulations, calculators and quizzes`],
        ['Operator', SITE.owner],
        ['Type', 'Personal educational project. Not a company and not a paid service.'],
        ['Contact', CONTACT],
        ['Source code', `<a href="${SITE.repo}" target="_blank" rel="noopener">${SITE.repo.replace('https://', '')}</a>`],
        ['Last updated', SITE.updated],
      ]],
      ['h', 'What to contact us about'],
      ['list', [
        'A privacy or data request: access, correction, export or deletion.',
        'A security problem: please describe it privately and do not exploit it.',
        'An accessibility barrier or a bug.',
        'A correction to lesson content or an image credit.',
        'A copyright or permission question.',
      ]],
      ['h', 'Data deletion'],
      ['p', `If you have an account, the fastest route is <strong>Account → Delete account</strong>. It removes the account and saved progress after you confirm by email. If you cannot sign in, contact us via ${CONTACT} and include the email address you used.`],
      ['p', 'You can also clear browser-only data at any time with <strong>Reset my progress</strong> in the footer or by clearing site data in your browser.'],
      ['h', 'Response time'],
      ['p', 'This is a volunteer student project, so replies are not guaranteed within a fixed time. We aim to answer privacy and security messages first.'],
    ],
  },
};

function block([t, a, b]) {
  switch (t) {
    case 'h': return `<h2>${a}</h2>`;
    case 'p': return `<p>${a}</p>`;
    case 'list': return `<ul>${a.map((x) => `<li>${x}</li>`).join('')}</ul>`;
    case 'note': return `<aside class="note">${a}</aside>`;
    case 'table': return `<div class="tbl"><table><thead><tr>${a.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${b.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    default: return '';
  }
}

export function renderLegal(outlet, key) {
  const page = PAGES[key];
  if (!page) return false;
  outlet.innerHTML = `
    <section class="section legal">
      <div class="container">
        <article class="rd">
          <button type="button" class="rd-back" data-back>← Back</button>
          <p class="eyebrow">${page.eyebrow}</p>
          <h1 tabindex="-1">${page.title}</h1>
          <p class="legal-meta">${SITE.name} · Last updated ${SITE.updated}</p>
          <p class="legal-intro">${page.intro}</p>
          ${page.blocks.map(block).join('')}
          ${key === 'privacy' ? `<div class="legal-actions"><button type="button" class="btn btn-danger" data-delete-account>Delete my account and data</button></div>` : ''}
          <p class="legal-foot">Questions? <a href="${SITE.contact}" target="_blank" rel="noopener">Contact ${SITE.name}</a> · <a href="#/privacy">Privacy</a> · <a href="#/terms">Terms</a> · <a href="#/cookies">Cookies</a> · <a href="#/accessibility">Accessibility</a> · <a href="#/credits">Credits</a></p>
        </article>
      </div>
    </section>`;

  const back = outlet.querySelector('[data-back]');
  if (back) back.addEventListener('click', () => { location.hash = '#/'; });

  const del = outlet.querySelector('[data-delete-account]');
  if (del) del.addEventListener('click', () => {
    if (getUser()) openDeleteDialog();
    else openAuth('signin');
  });
  return true;
}
