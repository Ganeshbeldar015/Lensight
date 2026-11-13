import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(250,93,25,0.1)] border border-[#fa5d19]/30 flex items-center justify-center text-[#fa5d19] mb-2 shadow-heat-glow">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-3xl font-extrabold text-white tracking-tight">404: Node Not Found</h1>
      <p className="text-sm text-[#888] max-w-md leading-relaxed">
        The telemetry endpoint or route you requested does not exist on the Lensight monitoring network.
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
