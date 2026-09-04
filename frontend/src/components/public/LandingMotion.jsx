import { useRef } from 'react';
import { useLandingMotion } from '../../hooks/useLandingMotion';

export function LandingMotion({ children, revision }) {
  const rootRef = useRef(null);
  useLandingMotion(rootRef, revision);

  return <div ref={rootRef}>{children}</div>;
}
