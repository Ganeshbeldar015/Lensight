import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#ddf1f1] border border-[#168a91]/20 flex items-center justify-center text-[#168a91] mb-2 shadow-xs">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-3xl font-bold text-[#263b40] tracking-tight">404: Page Not Found</h1>
      <p className="text-sm text-[#61777c] max-w-md leading-relaxed">
        The route you requested does not exist on the Lensight monitoring network.
      </p>

      <Button
        variant="primary"
        onClick={() => navigate('/')}
        leftIcon={<Home className="w-4 h-4" />}
      >
        Return to Overview Dashboard
      </Button>
    </div>
  );
};
