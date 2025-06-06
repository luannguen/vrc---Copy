import React from 'react';
import { Helmet } from 'react-helmet-async';
import MultilingualTestSuite from '../components/Testing/MultilingualTestSuite';

/**
 * Test page for multilingual features
 * This page can be accessed via /test route to verify all i18n functionality
 */
const TestPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>VRC Multilingual Test Suite</title>
        <meta name="description" content="Testing all multilingual features including SEO, performance, and content fallback" />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <MultilingualTestSuite 
        showAdmin={true}
        testContent={{
          title: 'VRC Multilingual Test Suite',
          description: 'Comprehensive testing of all Phase 2 multilingual features'
        }}
      />
    </>
  );
};

export default TestPage;
