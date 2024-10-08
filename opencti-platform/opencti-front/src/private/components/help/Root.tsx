import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from '../../../components/Loader';

const Help = lazy(() => import('./Help'));

const Root = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route
        path="/"
        element={<Help />}
      />
    </Routes>
  </Suspense>
);

export default Root;
