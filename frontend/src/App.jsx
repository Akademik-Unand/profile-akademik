import { useAccessibilityDocument } from './hooks/useAccessibilityDocument';
import { AppRoutes } from './routes';

export default function App() {
  useAccessibilityDocument();
  return <AppRoutes />;
}
