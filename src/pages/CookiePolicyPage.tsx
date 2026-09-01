import { Box, Divider, Stack, Typography } from '@mui/material';
import Container from '@/components/common/Container';
import LegalPageHeader from '@/components/legal/LegalPageHeader';
import { LegalSectionBody, LegalLink, type LegalSection } from '@/components/legal/legalContent';
import { APP_CONFIG } from '@/config/appConfig';
import { ROUTES } from '@/config/routes';
import { useDocumentTitle } from '@/utils/useDocumentTitle';

const PLATFORM_NAME = APP_CONFIG.siteName;

const SECTIONS: LegalSection[] = [
  {
    id: 'what-are-cookies',
    title: '1. What Are Cookies',
    blocks: [
      {
        kind: 'p',
        text: 'Cookies are small text files placed on your device when you visit a website. Websites also commonly use similar browser storage technologies, such as local storage and session storage, for related purposes. This Policy covers both.',
      },
    ],
  },
  {
    id: 'cookies-we-use',
    title: '2. Cookies and Storage We Use',
    blocks: [
      {
        kind: 'p',
        text: `${PLATFORM_NAME} currently uses only essential cookies and browser storage necessary to operate the Service. We do not currently use analytics, advertising, or tracking cookies.`,
      },
      { kind: 'p', text: 'Essential / authentication cookie:' },
      {
        kind: 'ul',
        items: [
          'Session cookie — keeps you signed in between page loads once you log in. This cookie is required for account features (comments, saved articles, notification preferences) to work, and cannot be disabled without signing out.',
        ],
      },
      { kind: 'p', text: 'Preference-related browser storage (not a cookie sent to our server):' },
      {
        kind: 'ul',
        items: [
          'Recently viewed articles — stored in your browser so article pages can be reopened without an extra network request, since our news data provider does not offer a lookup-by-id endpoint',
          'Dismissed Breaking News alerts — stored in your browser for the current session, so an alert you have already seen is not shown to you again',
        ],
      },
      {
        kind: 'p',
        text: 'This browser storage stays on your device and is not accessible to other websites. If we introduce analytics or advertising cookies in the future, this Policy will be updated in advance and, where required by law, your consent will be requested before those cookies are set.',
      },
    ],
  },
  {
    id: 'managing-cookies',
    title: '3. Managing Cookies',
    blocks: [
      {
        kind: 'p',
        text: 'Most browsers let you view, delete, and block cookies through their settings. Blocking the session cookie will sign you out and prevent you from using account features such as comments, saved articles, and notification preferences, but you will still be able to read articles and view existing comments.',
      },
      {
        kind: 'p',
        text: 'You can clear the browser storage described above at any time by clearing your browser’s site data for this website.',
      },
    ],
  },
  {
    id: 'changes',
    title: '4. Changes to This Policy',
    blocks: [
      {
        kind: 'p',
        text: 'We may update this Cookie Policy if the cookies and storage technologies we use change. The "Last updated" date at the top of this page reflects when it was last changed.',
      },
    ],
  },
  {
    id: 'more-information',
    title: '5. More Information',
    blocks: [
      {
        kind: 'node',
        node: (
          <>
            For more information about how we handle personal information generally, see our{' '}
            <LegalLink to={ROUTES.PRIVACY}>Privacy Policy</LegalLink>. For questions about this Cookie Policy, contact
            us at [CONTACT EMAIL].
          </>
        ),
      },
    ],
  },
];

function CookiePolicyPage() {
  useDocumentTitle(
    `Cookie Policy | ${PLATFORM_NAME}`,
    `The cookies and browser storage technologies used by ${PLATFORM_NAME}, and how to manage them.`,
  );

  return (
    <Container maxWidth="md">
      <Box component="main">
        <Box sx={{ mb: 3, p: 2, bgcolor: 'surfaceAlt.main', border: '1px dashed', borderColor: 'primary.main', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            This is a draft Cookie Policy prepared for internal review. It reflects the cookies and browser storage
            actually used by the Service today and must be kept in sync if that changes, and should be reviewed by
            qualified legal counsel before publication.
          </Typography>
        </Box>

        <LegalPageHeader
          title="Cookie Policy"
          intro={
            <>
              This Cookie Policy explains the cookies and similar browser storage technologies {PLATFORM_NAME} uses,
              and how you can manage them.
            </>
          }
        />

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

export default CookiePolicyPage;
