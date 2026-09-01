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
    id: 'about-this-policy',
    title: '1. About This Policy',
    blocks: [
      {
        kind: 'p',
        text: `This Privacy Policy explains what personal information ${PLATFORM_NAME} collects, why we collect it, how it is used, how long it is kept, who it may be shared with, and the rights you have over it.`,
      },
      {
        kind: 'node',
        node: (
          <>
            This Policy should be read alongside our <LegalLink to={ROUTES.TERMS}>Terms of Service</LegalLink> and{' '}
            <LegalLink to={ROUTES.COOKIES}>Cookie Policy</LegalLink>. It does not replace those documents.
          </>
        ),
      },
    ],
  },
  {
    id: 'controller',
    title: '2. Who We Are',
    blocks: [
      { kind: 'p', text: `The data controller responsible for your personal information is [LEGAL BUSINESS NAME].` },
      { kind: 'p', text: 'Registered address: [REGISTERED ADDRESS]' },
      { kind: 'p', text: 'Contact for privacy questions: [CONTACT EMAIL]' },
    ],
  },
  {
    id: 'information-we-collect',
    title: '3. Information We Collect',
    blocks: [
      {
        kind: 'p',
        text: 'When you create an account, we collect the information you provide during registration and account management:',
      },
      {
        kind: 'ul',
        items: [
          'Full name',
          'Date of birth',
          'Email address',
          'Mobile number',
          'Password (processed as a cryptographic hash — see Section 8, Security)',
          'Notification and email subscription preferences',
        ],
      },
      {
        kind: 'p',
        text: 'If you post a comment, we associate it with your account and display your name alongside the comment text and the time it was posted.',
      },
      {
        kind: 'p',
        text: 'If you subscribe to email updates as a guest, we collect only the email address and subscription preferences you provide — we do not require a full name, date of birth, mobile number, or password for a guest subscription.',
      },
      {
        kind: 'p',
        text: 'If you save an article to your reading list, we store a minimal snapshot of that article (its title, link, image, source, category, and publication date) together with your account and the date you saved it — we do not store the full third-party article content.',
      },
      {
        kind: 'p',
        text: 'We also automatically process limited technical information needed to operate the Service, such as your session cookie (see our Cookie Policy) and standard web request information (such as IP address) for security and rate-limiting purposes.',
      },
    ],
  },
  {
    id: 'how-we-use-information',
    title: '4. How We Use Your Information',
    blocks: [
      { kind: 'p', text: 'We use your personal information to:' },
      {
        kind: 'ul',
        items: [
          'Create and manage your account, and keep you signed in between visits',
          'Show your display name and comments to other visitors',
          'Send transactional account emails, such as email verification, password reset, password-changed, email-changed, and account-deletion confirmation',
          'Send optional email updates you have subscribed to, such as the daily digest, weekly digest, Breaking News alerts, and category alerts',
          'Maintain your saved articles list',
          'Protect the Service against abuse, fraud, and unauthorized access, including rate-limiting and moderation',
          'Comply with legal obligations where applicable',
        ],
      },
    ],
  },
  {
    id: 'legal-basis',
    title: '5. Legal Basis for Processing',
    blocks: [
      {
        kind: 'p',
        text: 'Where UK/EU data protection law applies, we rely on the following legal bases: performance of a contract (operating your account and the features you use), consent (optional email subscriptions and Breaking News alerts, which you can withdraw at any time), and legitimate interests (securing the Service, preventing abuse, and improving reliability).',
      },
      {
        kind: 'p',
        text: 'This section should be reviewed by qualified legal counsel to confirm it accurately reflects the applicable legal basis for each processing activity described in this Policy.',
      },
    ],
  },
  {
    id: 'comments-visibility',
    title: '6. Comments Are Public',
    blocks: [
      {
        kind: 'p',
        text: 'Comments you post are visible to anyone who views the relevant article, including visitors who are not signed in. Only your display name, avatar (if set), comment text, and timestamp are shown — we do not display your email address, date of birth, mobile number, or any other private account information alongside your comments.',
      },
    ],
  },
  {
    id: 'sharing',
    title: '7. Who We Share Information With',
    blocks: [
      { kind: 'p', text: 'We do not sell your personal information. We share limited information with the following categories of service provider, solely to operate the Service:' },
      {
        kind: 'ul',
        items: [
          'Resend — processes the recipient email address and message content necessary to deliver transactional and optional emails on our behalf',
          'Hosting and database infrastructure providers necessary to run the Service',
        ],
      },
      {
        kind: 'p',
        text: 'We may also disclose information where required by law, to protect the rights and safety of our users or the public, or in connection with a legitimate legal process.',
      },
      {
        kind: 'p',
        text: 'We do not share your personal information with NewsAPI.org, OpenWeather, or API-Football / API-Sports — those providers supply content and data to us; your account information is not sent to them.',
      },
    ],
  },
  {
    id: 'retention',
    title: '8. How Long We Keep Information',
    blocks: [
      {
        kind: 'p',
        text: 'We keep your account information for as long as your account remains active. If you delete your account, your saved articles are permanently deleted, your profile data is deleted or anonymized, and your comments are retained in anonymized form with the author shown as "Deleted User" — they are not linked back to your account or personal information.',
      },
      {
        kind: 'p',
        text: 'We may retain limited records for a longer period where necessary to comply with a legal obligation, resolve disputes, or enforce our agreements. Backup copies of the database are retained on a rolling cycle and are not immediately purged on request.',
      },
    ],
  },
  {
    id: 'security',
    title: '9. Security',
    blocks: [
      {
        kind: 'p',
        text: 'We use reasonable technical and organizational measures to protect your personal information, including password hashing, session-based authentication, and rate limiting on sensitive endpoints. No online system can be guaranteed to be completely secure.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: '10. Your Rights',
    blocks: [
      {
        kind: 'p',
        text: 'Depending on the law that applies to you, you may have the right to access, correct, delete, or export your personal information, to object to or restrict certain processing, and to withdraw consent for optional email subscriptions at any time.',
      },
      {
        kind: 'p',
        text: 'You can update your profile information, change your password or email, manage your notification and subscription preferences, and delete your account directly from Settings. To exercise any other right, contact us at [CONTACT EMAIL].',
      },
    ],
  },
  {
    id: 'children',
    title: '11. Children',
    blocks: [
      {
        kind: 'p',
        text: 'The Service is not directed at children. Any minimum account age is set out in our Terms of Service. This section must be confirmed against the platform’s actual eligibility requirements.',
      },
    ],
  },
  {
    id: 'international-transfers',
    title: '12. International Transfers',
    blocks: [
      {
        kind: 'p',
        text: 'Some of our service providers may process information outside your country of residence. Where this occurs, we expect appropriate safeguards to be in place. This section should be confirmed against the actual hosting and provider locations before publication: [PROVIDER LOCATIONS — TO BE CONFIRMED].',
      },
    ],
  },
  {
    id: 'changes',
    title: '13. Changes to This Policy',
    blocks: [
      {
        kind: 'p',
        text: 'We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page reflects when it was last changed. Material changes will be communicated appropriately.',
      },
    ],
  },
  {
    id: 'contact',
    title: '14. Contact Us',
    blocks: [
      { kind: 'p', text: '[LEGAL BUSINESS NAME]' },
      { kind: 'p', text: 'Email: [CONTACT EMAIL]' },
      { kind: 'p', text: 'Address: [REGISTERED OR CONTACT ADDRESS]' },
    ],
  },
];

const TOC_ENTRIES = SECTIONS.map((section) => ({ id: section.id, title: section.title }));

function PrivacyPolicyPage() {
  useDocumentTitle(
    `Privacy Policy | ${PLATFORM_NAME}`,
    `How ${PLATFORM_NAME} collects, uses, and protects your personal information.`,
  );

  return (
    <Container maxWidth="md">
      <Box component="main">
        <Box sx={{ mb: 3, p: 2, bgcolor: 'surfaceAlt.main', border: '1px dashed', borderColor: 'primary.main', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            This is a draft Privacy Policy prepared for internal review. It contains bracketed placeholders that must
            be completed, and should be reviewed by qualified legal counsel before publication.
          </Typography>
        </Box>

        <LegalPageHeader
          title="Privacy Policy"
          intro={
            <>
              This Privacy Policy explains how {PLATFORM_NAME} collects, uses, and protects your personal
              information when you use our website, create an account, post comments, or subscribe to email updates.
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

export default PrivacyPolicyPage;
