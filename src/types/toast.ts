export enum ToastSeverity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success',
}

export interface ToastAnchor {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface ToastProps {
  open: boolean;
  message: string;
  severity?: ToastSeverity;
  duration?: number;
  /** Padrão embaixo ao centro. No topo quando há modal aberto, senão fica atrás dele. */
  anchorOrigin?: ToastAnchor;
  onClose: () => void;
}
