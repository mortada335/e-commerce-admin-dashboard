import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

const PWAUpdateNotification = () => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker is controlling the page
        setShowUpdateNotification(true);
      });

      // Check if there's a waiting service worker
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setShowUpdateNotification(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          // Send message to waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDismiss = () => {
    setShowUpdateNotification(false);
  };

  if (!showUpdateNotification) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Update Available
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A new version of Jahwir is available
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="mt-4">
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Now
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PWAUpdateNotification;
