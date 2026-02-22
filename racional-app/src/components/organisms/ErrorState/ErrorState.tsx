import { ErrorIcon, Button } from '../../atoms';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-[#c6443d]/20 bg-[#c6443d]/5 px-6 py-16">
      <ErrorIcon className="mb-4 h-12 w-12 text-[#c6443d]" />
      <p className="mb-1 text-lg font-semibold text-white">
        Error al cargar datos
      </p>
      <p className="mb-6 max-w-md text-center text-sm text-gray-400">
        {message}
      </p>
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  );
}
