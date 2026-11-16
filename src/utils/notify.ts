import Swal, { type SweetAlertIcon } from 'sweetalert2';

export interface NotifyToastOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  timer?: number;
  undoAction?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export async function notifyToast({
  title,
  text,
  icon = 'success',
  timer = 3500,
  undoAction,
  actionLabel,
  onAction,
}: NotifyToastOptions): Promise<void> {
  const hasUndo = Boolean(undoAction);
  const hasSecondaryAction = Boolean(onAction && actionLabel);

  const result = await Swal.fire({
    toast: true,
    position: 'top',
    icon,
    title,
    text,
    timer,
    timerProgressBar: true,
    showCloseButton: true,
    showConfirmButton: hasUndo,
    confirmButtonText: 'Urungkan',
    showDenyButton: hasSecondaryAction,
    denyButtonText: actionLabel || 'Ubah',
    buttonsStyling: false,
    customClass: {
      container: '!z-[60] !px-4 !pt-3',
      popup:
        '!w-full !max-w-[calc(28rem-2rem)] !rounded-2xl !bg-white !text-slate-900 !shadow-xl !border !border-slate-200/90 !p-3.5',
      title: '!text-xs !font-bold !text-slate-900 !text-left !m-0 !leading-snug',
      htmlContainer: '!text-[11px] !text-slate-500 !text-left !m-0 !mt-0.5',
      actions: '!mt-2 !gap-2 !justify-end !w-full',
      confirmButton:
        '!min-h-[34px] !px-3 !py-1.5 !rounded-lg !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-xs !font-semibold !transition-colors',
      denyButton:
        '!min-h-[34px] !px-3 !py-1.5 !rounded-lg !bg-slate-100 hover:!bg-slate-200 !text-slate-800 !text-xs !font-semibold !transition-colors',
      closeButton: '!text-slate-400 hover:!text-slate-700 !text-lg',
      timerProgressBar: '!bg-emerald-500',
    },
    didOpen: (toastEl) => {
      toastEl.addEventListener('mouseenter', Swal.stopTimer);
      toastEl.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  if (result.isConfirmed && undoAction) {
    undoAction();
  } else if (result.isDenied && onAction) {
    onAction();
  }
}

export interface ConfirmDialogOptions {
  title: string;
  text: string;
  confirmText: string;
  cancelText?: string;
  icon?: SweetAlertIcon;
  danger?: boolean;
}

export async function confirmDialog({
  title,
  text,
  confirmText,
  cancelText = 'Batal',
  icon = 'warning',
  danger = false,
}: ConfirmDialogOptions): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      container: '!z-[60] !px-4',
      popup:
        '!w-full !max-w-sm !rounded-2xl !bg-white !text-slate-900 !shadow-2xl !border !border-slate-200/80 !p-5',
      title: '!text-base !font-extrabold !text-slate-900 !pt-1',
      htmlContainer: '!text-xs !text-slate-600 !leading-relaxed !mt-1.5',
      actions: '!mt-5 !grid !grid-cols-2 !gap-2.5 !w-full',
      confirmButton: danger
        ? '!min-h-[44px] !w-full !px-4 !py-2 !rounded-xl !bg-rose-600 hover:!bg-rose-700 !text-white !text-xs !font-bold !transition-colors'
        : '!min-h-[44px] !w-full !px-4 !py-2 !rounded-xl !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-xs !font-bold !transition-colors',
      cancelButton:
        '!min-h-[44px] !w-full !px-4 !py-2 !rounded-xl !bg-slate-100 hover:!bg-slate-200 !text-slate-700 !text-xs !font-semibold !transition-colors',
    },
  });

  return result.isConfirmed;
}
