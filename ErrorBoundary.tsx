
import React, { ErrorInfo, ReactNode } from 'react';
import { sovereignCore } from './lib/SovereignBackend';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  autoRepairing: boolean;
}

/**
 * Delta Stars Intelligent Shield v40.0
 * محرك استقرار سيادي يراقب المنصة ويقوم بالإصلاح الذاتي اللحظي (Auto-Self-Healing).
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      autoRepairing: false
    };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true, autoRepairing: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Silent intercept
    this.executeSovereignRepair();
  }

  private executeSovereignRepair = async () => {
    const lastRepair = sessionStorage.getItem('delta_last_repair');
    const now = Date.now();
    if (lastRepair && now - parseInt(lastRepair) < 2000) return;
    sessionStorage.setItem('delta_last_repair', now.toString());

    await sovereignCore.fullSystemReset();
    
    setTimeout(() => {
        window.location.href = window.location.origin + '/?repaired=true&v=62.0';
    }, 50);
  }

  public render() {
    const { hasError } = this.state;

    if (hasError) {
      // Completely silent: return null while the page reloads
      return null;
    }
    return this.props.children;
  }
}
