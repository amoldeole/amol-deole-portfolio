import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';

const UsersList = lazy(() => import('./UsersList'));

const UsersModule = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route index element={<UsersList />} />
      <Route path="create" element={<UserCreate />} />
      <Route path=":userId/edit" element={<UserEdit />} />
    </Routes>
  </Suspense>
);

export default UsersModule;