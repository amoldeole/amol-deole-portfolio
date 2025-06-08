import { Suspense } from 'react';
import { Loading } from './Loading';
export const LazyComponent = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading />}>
    {children}
  </Suspense>
);

export default LazyComponent;