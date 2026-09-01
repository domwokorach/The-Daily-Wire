import { Box, Divider, Stack, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import LegalPageHeader from '@/components/legal/LegalPageHeader';
import TableOfContents from '@/components/legal/TableOfContents';
import { LegalSectionBody, LegalLink, type LegalSection } from '@/components/legal/legalContent';
import { APP_CONFIG } from '@/config/appConfig';
import { ROUTES } from '@/config/routes';
import { useDocumentTitle } from '@/utils/useDocumentTitle';

const PLATFORM_NAME = APP_CONFIG.siteName;

const SECTIONS: LegalSection[] = [
  {
    id: 'about-these-terms',
    title: '1. About These Terms',
    blocks: [
      {
        kind: 'p',
        text: `These Terms of Service ("Terms") govern your access to and use of ${PLATFORM_NAME}, including our website, user accounts, comments, newsletter subscriptions, Breaking News alerts, and related services (together, the "Service"). By accessing or using the Service, you agree to these Terms.`,
      },
      {
        kind: 'p',
        text: 'Separate documents may also apply to your use of the Service where they exist, including our Privacy Policy, Cookie Policy, and any published Community Guidelines. Where those documents exist, they form part of the overall terms governing your use of the Service alongside these Terms.',
      },
    ],
  },
  {
    id: 'about-us',
    title: '2. About Us',
    blocks: [
      {
        kind: 'p',
        text: `${PLATFORM_NAME} is operated by [LEGAL BUSINESS NAME].`,
      },
      { kind: 'p', text: 'Registered address: [REGISTERED ADDRESS]' },
      { kind: 'p', text: 'Company number: [COMPANY NUMBER]' },
      { kind: 'p', text: 'Contact: [CONTACT EMAIL]' },
      {
        kind: 'p',
        text: 'These details must be completed and verified against the actual operating business before this document is published.',
      },
    ],
  },
  {
    id: 'eligibility',
    title: '3. Eligibility',
    blocks: [
      {
        kind: 'p',
        text: 'You must be legally capable of agreeing to these Terms to create an account. If the Service establishes a minimum account age, that requirement will be stated here and enforced at registration: [MINIMUM ACCOUNT AGE — TO BE CONFIRMED].',
      },
      {
        kind: 'p',
        text: 'Where registration requires a date of birth, you must provide accurate information. Providing false information about your identity or age may result in suspension or termination of your account.',
      },
    ],
  },
  {
    id: 'acceptance',
    title: '4. Acceptance of These Terms',
    blocks: [
      {
        kind: 'p',
        text: 'By creating an account, subscribing to email updates, posting a comment, or otherwise using the Service, you agree to be bound by these Terms, any applicable policies referenced in them, and all applicable laws and regulations.',
      },
      { kind: 'p', text: 'If you do not agree to these Terms, please discontinue use of the Service.' },
    ],
  },
  {
    id: 'using-the-service',
    title: '5. Using the Service',
    blocks: [
      {
        kind: 'p',
        text: 'You may use the Service for lawful, personal, non-commercial purposes, including reading news articles and using the Politics, World, Business, Health, Technology, Sport, Weather, and Search sections. You must not use the Service to:',
      },
      {
        kind: 'ul',
        items: [
          'Violate any applicable law or regulation',
          'Interfere with or disrupt the Service or its infrastructure',
          "Infringe the intellectual property, privacy, or other rights of others",
          'Attempt to gain unauthorized access to accounts, systems, or data',
          'Scrape, crawl, or harvest content from the Service other than as permitted by robots.txt or a written agreement',
          'Circumvent rate limits, authentication, or other security controls',
          'Abuse public or authenticated APIs, including through excessive automated requests',
          'Upload or distribute malware, malicious links, or harmful code',
          'Harass, threaten, or abuse other users',
          'Use bots or automated systems to create accounts, post comments, or otherwise interact with the Service in an abusive manner',
        ],
      },
    ],
  },
  {
    id: 'user-accounts',
    title: '6. User Accounts',
    blocks: [
      {
        kind: 'p',
        text: 'Some functionality requires a registered account, including posting comments, managing your profile, setting notification and email subscription preferences, saving articles to your personal reading list, and configuring Breaking News alerts.',
      },
      {
        kind: 'p',
        text: 'You are responsible for ensuring that the information you provide when creating and maintaining your account is accurate and kept up to date.',
      },
    ],
  },
  {
    id: 'account-information',
    title: '7. Account Information',
    blocks: [
      {
        kind: 'p',
        text: 'Depending on the features you use, your account information may include your full name, date of birth, email address, mobile number, password credentials, and notification and subscription preferences.',
      },
      {
        kind: 'p',
        text: 'Your password is not stored in a readable form; it is processed using industry-standard cryptographic hashing so that it cannot be read back by us or by any third party. Account information is collected, used, and retained in accordance with our Privacy Policy.',
      },
    ],
  },
  {
    id: 'account-security',
    title: '8. Account Security',
    blocks: [
      { kind: 'p', text: 'You are responsible for maintaining the security of your account. You agree to:' },
      {
        kind: 'ul',
        items: [
          'Keep your login credentials confidential',
          'Use reasonable care when choosing and storing your password',
          'Notify us promptly at [CONTACT EMAIL] if you suspect unauthorized access to your account',
          'Avoid sharing your account with others where doing so is prohibited by these Terms',
        ],
      },
      {
        kind: 'p',
        text: 'While we use reasonable technical measures to protect your account (see Section 40, Security), we cannot guarantee that unauthorized access will never occur.',
      },
    ],
  },
  {
    id: 'comments',
    title: '9. Comments and User Content',
    blocks: [
      {
        kind: 'p',
        text: 'Logged-in users may post comments on articles, edit their own comments, and delete their own comments. Comments and any other material you submit to the Service are referred to in these Terms as "User Content".',
      },
      { kind: 'p', text: 'You remain solely responsible for the User Content you publish on the Service.' },
    ],
  },
  {
    id: 'prohibited-content',
    title: '10. Prohibited Comment Content',
    blocks: [
      { kind: 'p', text: 'You must not publish User Content that is:' },
      {
        kind: 'ul',
        items: [
          'Illegal, threatening, abusive, or harassing',
          'Defamatory or knowingly false',
          'Fraudulent or deliberately deceptive',
          'Spam or unsolicited advertising',
          'Malicious, or contains malware or harmful links',
          'Infringing of another person’s intellectual property rights',
          'Privacy-invasive, including publishing another person’s private email address, mobile number, home address, passwords, or other confidential information without lawful justification',
          'Impersonating another person or organization',
        ],
      },
    ],
  },
  {
    id: 'moderation',
    title: '11. Moderation',
    blocks: [
      {
        kind: 'p',
        text: 'We reserve the right to review, hide, remove, or otherwise restrict or moderate User Content where we reasonably consider it necessary, including where content appears to violate these Terms, constitutes spam or abuse, raises safety or legal concerns, is the subject of an intellectual property complaint, or otherwise affects the integrity of the Service.',
      },
      {
        kind: 'p',
        text: 'We do not promise to review every comment before or after publication. Comment status in our systems may be visible, pending, hidden, or removed, depending on moderation outcomes.',
      },
    ],
  },
  {
    id: 'content-ownership',
    title: '12. User Content Ownership',
    blocks: [
      {
        kind: 'p',
        text: 'You retain ownership of the User Content you create. We do not claim ownership of your comments or other User Content.',
      },
    ],
  },
  {
    id: 'content-licence',
    title: '13. User Content Licence',
    blocks: [
      {
        kind: 'p',
        text: 'By submitting User Content, you grant us a non-exclusive, worldwide, royalty-free licence to host, store, display, reproduce, format, and distribute that content within the Service, solely as required to operate, display, and maintain the Service (for example, showing your comment beneath the relevant article).',
      },
      { kind: 'p', text: 'This licence is limited to legitimate operation of the Service and does not grant us any broader rights over your User Content.' },
    ],
  },
  {
    id: 'editorial-content',
    title: '14. News and Editorial Content',
    blocks: [
      {
        kind: 'p',
        text: 'News content on the Service may include original platform material, headlines, summaries, and metadata, together with content supplied by external news providers, including headlines, images, and article links owned by third-party publishers.',
      },
      {
        kind: 'p',
        text: 'Third-party publishers retain all applicable rights in their journalism. Nothing in these Terms implies that we own or control third-party news content beyond the limited rights necessary to display it on the Service.',
      },
    ],
  },
  {
    id: 'newsapi',
    title: '15. NewsAPI.org',
    blocks: [
      {
        kind: 'p',
        text: 'Some news data displayed on the Service, including headlines, article metadata, publisher information, images, article links, and publication dates, is obtained through NewsAPI.org, a third-party news data provider.',
      },
      {
        kind: 'p',
        text: 'The original publisher of each article retains ownership of the underlying article and its associated intellectual property. We do not claim ownership of third-party articles surfaced through this integration.',
      },
    ],
  },
  {
    id: 'third-party-content',
    title: '16. Third-Party Content',
    blocks: [
      {
        kind: 'p',
        text: 'Third-party content is provided on the Service for informational and discovery purposes. We cannot guarantee the completeness, accuracy, availability, permanent availability, or timeliness of all third-party material.',
      },
      { kind: 'p', text: 'Third-party content may be modified, corrected, or removed by its original provider at any time, which may affect its availability on the Service.' },
    ],
  },
  {
    id: 'sport-data',
    title: '17. Sport Data',
    blocks: [
      {
        kind: 'p',
        text: 'Football and other sport data displayed on the Service, including league tables, live match data, recent results, fixtures, top scorers, team badges, player information, and match statistics, may be supplied by API-Football / API-Sports.',
      },
      { kind: 'p', text: 'Live sport data can be delayed, corrected, or temporarily unavailable. We do not guarantee second-by-second accuracy of live scores or statistics.' },
    ],
  },
  {
    id: 'no-betting-advice',
    title: '18. No Betting Advice',
    blocks: [
      {
        kind: 'p',
        text: 'Sport information on the Service, including scores, statistics, fixtures, tables, and any predictions, is provided for general informational purposes only and must not be interpreted as betting or gambling advice.',
      },
      { kind: 'p', text: 'We do not guarantee the accuracy or completeness of sport data for the purposes of wagering decisions, and you should not rely on it for that purpose.' },
    ],
  },
  {
    id: 'weather-data',
    title: '19. Weather Data',
    blocks: [
      {
        kind: 'p',
        text: 'Weather information on the Service, including current conditions, forecasts, temperature, rain probability, wind, and weather alerts, may be provided by OpenWeather.',
      },
      {
        kind: 'p',
        text: 'Forecasts are estimates and may change. For safety-critical decisions, you should consult official emergency services or meteorological authorities rather than relying solely on the Service.',
      },
    ],
  },
  {
    id: 'business-financial',
    title: '20. Business and Financial Content',
    blocks: [
      {
        kind: 'p',
        text: 'Business and market-related news on the Service is provided for general informational purposes only. Nothing on the Service constitutes investment, financial, tax, or trading advice.',
      },
      { kind: 'p', text: 'You should make financial decisions based on appropriate professional advice and your own independent research.' },
    ],
  },
  {
    id: 'health-content',
    title: '21. Health Content',
    blocks: [
      {
        kind: 'p',
        text: 'Health news and medical reporting on the Service is informational only. Nothing on the Service constitutes medical diagnosis or professional medical advice.',
      },
      { kind: 'p', text: 'You should consult a qualified healthcare professional for individual medical questions or concerns.' },
    ],
  },
  {
    id: 'external-links',
    title: '22. External Links',
    blocks: [
      {
        kind: 'p',
        text: 'The Service may link to publisher websites, external websites, and third-party services. Those websites are controlled independently of us.',
      },
      {
        kind: 'p',
        text: 'We are not responsible for external content, external privacy practices, external availability, or external security. You should review the terms and privacy policies of any third-party website you visit.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    title: '23. Intellectual Property',
    blocks: [
      {
        kind: 'p',
        text: `Our brand, logo, interface, original written material, custom graphics, software, and design system are owned by ${PLATFORM_NAME} or its licensors, where applicable.`,
      },
      {
        kind: 'p',
        text: 'Third-party articles, images, team badges, league logos, player photos, weather data, and other provider data displayed on the Service remain subject to the intellectual property rights and licence terms of their respective owners and providers.',
      },
    ],
  },
  {
    id: 'subscriptions',
    title: '24. Newsletter Subscriptions',
    blocks: [
      {
        kind: 'p',
        text: 'You may subscribe to optional email updates as a guest or as a registered user. Available subscription categories may include Daily News, a Weekly Digest, Breaking News, Politics, World, Business, Health, Technology, and Sport.',
      },
      { kind: 'p', text: 'You will only receive the optional subscription categories you have selected, or otherwise lawfully consented to receive.' },
    ],
  },
  {
    id: 'subscription-confirmation',
    title: '25. Subscription Confirmation',
    blocks: [
      {
        kind: 'p',
        text: 'Where double opt-in is used, a subscription becomes active only after you confirm it: you enter your email address, receive a confirmation email, and click the confirmation link to activate the subscription.',
      },
      {
        kind: 'p',
        text: 'We may decline or suspend a subscription where necessary to prevent fraud, abuse, invalid email addresses, spam complaints, or other security issues.',
      },
    ],
  },
  {
    id: 'breaking-news',
    title: '26. Breaking News Alerts',
    blocks: [
      {
        kind: 'p',
        text: 'You may optionally enable Breaking News alerts, which may be delivered as in-app alerts, browser notifications, or email notifications, depending on the preferences and permissions you have enabled.',
      },
      {
        kind: 'p',
        text: 'Breaking News alerts are optional, and delivery timing cannot be guaranteed. We do not guarantee that every breaking story will trigger an alert, that every notification will arrive immediately, or that every notification will be delivered. Network, browser, email, and third-party provider conditions may affect delivery.',
      },
    ],
  },
  {
    id: 'email-communications',
    title: '27. Email Communications',
    blocks: [
      {
        kind: 'p',
        text: 'We send transactional emails related to your account, including email verification, password reset, password changed, email address changed, security notifications, and account deletion confirmation. These transactional emails are necessary to operate your account and are not optional subscription content.',
      },
      { kind: 'p', text: 'Optional emails may include Breaking News alerts, the daily digest, the weekly digest, and category-specific alerts, which you control through your subscription preferences.' },
    ],
  },
  {
    id: 'resend',
    title: '28. Email Delivery Provider',
    blocks: [
      {
        kind: 'p',
        text: 'We use a third-party email delivery provider, Resend, to send transactional and optional emails on our behalf.',
      },
      {
        kind: 'node',
        node: (
          <>
            Details of what information is processed for email delivery, and the legal basis for that processing,
            are set out in our <LegalLink to={ROUTES.PRIVACY}>Privacy Policy</LegalLink>, which you should refer to
            for more information.
          </>
        ),
      },
    ],
  },
  {
    id: 'notification-preferences',
    title: '29. Notification Preferences',
    blocks: [
      {
        kind: 'p',
        text: 'Registered users may manage notification and email subscription preferences at any time in Settings → Notifications / Email Subscriptions.',
      },
      {
        kind: 'p',
        text: 'Guest subscribers are given an accessible method to manage their preferences and unsubscribe, using a secure link sent by email, without being required to create an account.',
      },
    ],
  },
  {
    id: 'unsubscribe',
    title: '30. Unsubscribe',
    blocks: [
      {
        kind: 'p',
        text: 'Every optional email communication, including the newsletter and Breaking News alerts, includes an unsubscribe mechanism.',
      },
      {
        kind: 'p',
        text: 'Unsubscribing from optional communications does not disable transactional account emails that are necessary to operate your account, such as password reset, email verification, and security notifications.',
      },
    ],
  },
  {
    id: 'service-availability',
    title: '31. Service Availability',
    blocks: [
      {
        kind: 'p',
        text: 'We do not guarantee that the Service will be available uninterrupted. The Service may occasionally be unavailable due to maintenance, provider outages, network issues, third-party API limits, security events, software updates, or events outside our reasonable control.',
      },
      { kind: 'p', text: 'We may change, suspend, or discontinue features of the Service where we reasonably consider it necessary.' },
    ],
  },
  {
    id: 'api-availability',
    title: '32. Third-Party API Availability',
    blocks: [
      {
        kind: 'p',
        text: 'The Service relies on external providers, including NewsAPI.org, OpenWeather, API-Football / API-Sports, and Resend. The quotas, pricing, availability, coverage, terms, and APIs of these providers may change at any time.',
      },
      { kind: 'p', text: 'We cannot guarantee the permanent availability of any third-party integration used by the Service.' },
    ],
  },
  {
    id: 'accuracy',
    title: '33. Accuracy and Corrections',
    blocks: [
      {
        kind: 'p',
        text: 'News and data displayed on the Service can change rapidly. We aim to provide accurate and current information, but we do not guarantee that all information on the Service is error-free, complete, current, or unchanged.',
      },
      { kind: 'p', text: 'Corrections may be made to content on the Service without prior notice.' },
    ],
  },
  {
    id: 'account-suspension',
    title: '34. Account Suspension',
    blocks: [
      {
        kind: 'p',
        text: 'We may restrict or suspend your account where we reasonably consider it necessary because of a violation of these Terms, abuse, fraud, security risks, spam, legal obligations, or harm to the Service or other users.',
      },
      { kind: 'p', text: 'Where appropriate and subject to any legal or security limitations, we will aim to provide you with information about the action taken.' },
    ],
  },
  {
    id: 'account-termination',
    title: '35. Account Termination',
    blocks: [
      { kind: 'p', text: 'You may stop using the Service at any time.' },
      {
        kind: 'p',
        text: 'We may terminate your access to the Service in the circumstances described in these Terms. We will not exercise this right in an unnecessarily broad or arbitrary manner.',
      },
    ],
  },
  {
    id: 'account-deletion',
    title: '36. Deleting Your Account',
    blocks: [
      {
        kind: 'p',
        text: 'You may request deletion of your account at any time in Settings → Delete Account.',
      },
      {
        kind: 'p',
        text: 'When your account is deleted: your login access is removed; your saved articles are permanently deleted; your profile data is deleted or anonymized in accordance with our published policy; and your comments are anonymized rather than deleted, as described in Section 37 below.',
      },
      {
        kind: 'p',
        text: 'Certain records may need to be retained for a limited period where we are legally required to do so. We do not promise the immediate destruction of every backup copy of your data, as backups are retained on a rolling cycle for service continuity and disaster recovery purposes.',
      },
    ],
  },
  {
    id: 'deleted-account-comments',
    title: '37. Comments After Account Deletion',
    blocks: [
      {
        kind: 'p',
        text: 'When an account is deleted, the comments associated with it are not removed from the Service. Instead, they are retained in anonymized form, with the author displayed as "Deleted User" and no continuing link to your account or personal information.',
      },
    ],
  },
  {
    id: 'privacy',
    title: '38. Privacy and Personal Data',
    blocks: [
      {
        kind: 'node',
        node: (
          <>
            Our <LegalLink to={ROUTES.PRIVACY}>Privacy Policy</LegalLink> explains what personal information we
            collect, the purposes for which we use it, the legal basis for that use where applicable, how long we
            retain it, who we share it with, your rights, our security practices, and how to contact us about your
            data.
          </>
        ),
      },
      { kind: 'p', text: 'These Terms do not replace or duplicate our Privacy Policy, and you should read both documents.' },
    ],
  },
  {
    id: 'cookies',
    title: '39. Cookies',
    blocks: [
      {
        kind: 'node',
        node: (
          <>
            Our <LegalLink to={ROUTES.COOKIES}>Cookie Policy</LegalLink> explains the cookies and similar browser
            storage technologies used by the Service, which depending on your use of the Service may include
            essential cookies and authentication/session cookies, and preference-related browser storage.
          </>
        ),
      },
      { kind: 'p', text: 'We do not use non-essential cookies, such as analytics or advertising cookies, unless the Cookie Policy states otherwise and appropriate consent has been obtained.' },
    ],
  },
  {
    id: 'security',
    title: '40. Security',
    blocks: [
      {
        kind: 'p',
        text: 'We use reasonable technical and organizational measures designed to protect the Service and the personal information we hold.',
      },
      { kind: 'p', text: 'No online system can be guaranteed to be completely secure, and we do not claim that the Service is 100% secure or impossible to compromise.' },
    ],
  },
  {
    id: 'passwords',
    title: '41. Passwords',
    blocks: [
      {
        kind: 'p',
        text: 'You are responsible for keeping your password confidential. We use secure password handling internally, and our staff cannot retrieve your password.',
      },
    ],
  },
  {
    id: 'disclaimers',
    title: '42. Disclaimers',
    blocks: [
      {
        kind: 'p',
        text: 'To the fullest extent permitted by law, the Service, including news, weather, sport, business, and health content, third-party content, live data, and external websites, is provided "as is" and "as available", without warranties of any kind, whether express or implied.',
      },
      { kind: 'p', text: 'Nothing in this section is intended to exclude or limit any right that cannot lawfully be excluded or limited under applicable law.' },
    ],
  },
  {
    id: 'liability',
    title: '43. Limitation of Liability',
    blocks: [
      {
        kind: 'p',
        text: 'To the fullest extent permitted by law, [LEGAL BUSINESS NAME] will not be liable for any indirect, incidental, or consequential loss arising from your use of the Service, or from third-party content, third-party data providers, or external websites linked from the Service.',
      },
      {
        kind: 'p',
        text: 'Any monetary cap on liability, if applicable, will be set out here following legal and business review: [LIABILITY CAP — TO BE CONFIRMED BY LEGAL COUNSEL].',
      },
      {
        kind: 'p',
        text: 'Nothing in these Terms excludes or limits our liability where it would be unlawful to do so, including liability for death or personal injury caused by negligence, or for fraud. This clause must be reviewed by qualified legal counsel before publication.',
      },
    ],
  },
  {
    id: 'indemnity',
    title: '44. Indemnity',
    blocks: [
      {
        kind: 'p',
        text: 'You agree to indemnify us against reasonable losses arising from serious misuse of the Service by you, including publishing unlawful User Content, infringing the intellectual property rights of others, using the Service fraudulently, or intentionally abusing the Service.',
      },
      { kind: 'p', text: 'This clause is intended to be reasonable and proportionate, and should be reviewed by qualified legal counsel before publication.' },
    ],
  },
  {
    id: 'changes-to-service',
    title: '45. Changes to the Service',
    blocks: [
      {
        kind: 'p',
        text: 'We may improve, add, or remove features, change third-party data providers, update layouts, and change API integrations where we reasonably consider it necessary.',
      },
      { kind: 'p', text: 'Where a change materially affects your use of the Service, we will aim to communicate it appropriately.' },
    ],
  },
  {
    id: 'changes-to-terms',
    title: '46. Changes to These Terms',
    blocks: [
      {
        kind: 'p',
        text: 'We may update these Terms from time to time. The "Last updated" date at the top of this page reflects when the Terms were last changed.',
      },
      { kind: 'p', text: 'Where a change is material, we will aim to provide reasonable notice. Continuing to use the Service after a change takes effect constitutes acceptance of the updated Terms, provided appropriate notice has been given.' },
    ],
  },
  {
    id: 'governing-law',
    title: '47. Governing Law',
    blocks: [
      {
        kind: 'p',
        text: 'These Terms are governed by the laws of [APPLICABLE JURISDICTION]. This placeholder must be completed by qualified legal counsel based on the business’s registration, the location of its customers, applicable consumer protection law, and the jurisdiction in which the Service actually operates.',
      },
    ],
  },
  {
    id: 'disputes',
    title: '48. Disputes',
    blocks: [
      {
        kind: 'p',
        text: 'If you have a concern about the Service, please contact us first at [CONTACT EMAIL] so that we can attempt to resolve it informally. If a dispute cannot be resolved informally, either party may pursue the applicable legal process.',
      },
      { kind: 'p', text: 'Nothing in this section removes any statutory right you have as a consumer.' },
    ],
  },
  {
    id: 'severability',
    title: '49. Severability',
    blocks: [
      {
        kind: 'p',
        text: 'If any provision of these Terms is found to be invalid or unenforceable, that provision will be limited or removed to the minimum extent necessary, and the remaining provisions will continue in full force and effect where legally permitted.',
      },
    ],
  },
  {
    id: 'entire-agreement',
    title: '50. Entire Agreement',
    blocks: [
      {
        kind: 'p',
        text: 'These Terms, together with our Privacy Policy, Cookie Policy, and any applicable supplemental policies, form the entire agreement between you and us concerning your use of the Service, except that nothing in this section overrides any legal right that cannot be contractually excluded.',
      },
    ],
  },
  {
    id: 'contact',
    title: '51. Contact Us',
    blocks: [
      { kind: 'p', text: '[LEGAL BUSINESS NAME]' },
      { kind: 'p', text: 'Email: [CONTACT EMAIL]' },
      { kind: 'p', text: 'Address: [REGISTERED OR CONTACT ADDRESS]' },
    ],
  },
];

const TOC_ENTRIES = SECTIONS.map((section) => ({ id: section.id, title: section.title }));

function TermsPage() {
  useDocumentTitle(
    `Terms of Service | ${PLATFORM_NAME}`,
    `Terms governing the use of ${PLATFORM_NAME}, including accounts, comments, subscriptions, and news services.`,
  );

  return (
    <Container maxWidth="md">
      <Box component="main">
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'surfaceAlt.main',
            border: '1px dashed',
            borderColor: 'primary.main',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            This is a draft Terms of Service prepared for internal review. It contains bracketed placeholders (for
            example, [LEGAL BUSINESS NAME]) that must be completed, and clauses that must be reviewed and approved by
            qualified legal counsel, before this page is published or relied upon.
          </Typography>
        </Box>

        <LegalPageHeader
          title="Terms of Service"
          intro={
            <>
              These Terms of Service govern your access to and use of {PLATFORM_NAME}, including our website, user
              accounts, comments, subscriptions, alerts, and related services. Please read them carefully before
              using the Service.
            </>
          }
        />

        <TableOfContents entries={TOC_ENTRIES} />

        <Box component="article">
          <Stack divider={<Divider sx={{ my: 4 }} />} spacing={0}>
            {SECTIONS.map((section) => (
              <LegalSectionBody key={section.id} section={section} />
            ))}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}

export default TermsPage;
