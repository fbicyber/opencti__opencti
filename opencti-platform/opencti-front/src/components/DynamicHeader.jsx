import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import useAuth from '../utils/hooks/useAuth';

// Usage: <DynamicHeader title={t_i18n('Page Title Here')}></DynamicHeader>
const DynamicHeader = ({ title = 'OpenCTI - Cyber Threat Intelligence Platform' }) => {
  const { me: currentMe } = useAuth();
  // current Browser Language is:
  const defaultBrowserLang = navigator.language || navigator.userLanguage;
  let pageLanguage = currentMe.language;
  if (pageLanguage === 'auto' || pageLanguage === 'au') {
    pageLanguage = defaultBrowserLang;
  }
  pageLanguage = (pageLanguage).substring(0, 2); // Make it two chars for HTML 'lang' tag compliance, ISO 639-1 Language Codes

  const helmetContext = {};
  return (
    <HelmetProvider context={helmetContext}>
      <Helmet>
        <html lang={pageLanguage} />
        <title>{title}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default DynamicHeader;
