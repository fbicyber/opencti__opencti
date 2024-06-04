import React from 'react';
import { Helmet } from 'react-helmet-async';

const dynamicHeader = ({ title, language }) => {
  return (
    <Helmet htmlAttributes>
      <html lang = {language} />
      <title>OpenCTI | {title}</title>
    </Helmet>
  );
};

export default dynamicHeader;