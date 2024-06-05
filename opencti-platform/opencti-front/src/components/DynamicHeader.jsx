import React from 'react';
import { Helmet } from 'react-helmet';

const DynamicHeader = ({ title, language, description = [] }) => {
  return (
    <div>
      <Helmet>
        htmlAttributes{{ lang: { language } }}
        <title>OpenCTI | {title}</title>
        <meta name="description" content={description} data-rh="true"></meta>
      </Helmet>
    </div>
  );
};
// Usage: <dynamicHeader title="" language="" description=""/>
export default DynamicHeader;
