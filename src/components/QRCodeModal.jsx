import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';

const QRCodeModal = ({ isOpen, onClose, tvId }) => {
  const [remoteUrl, setRemoteUrl] = useState('');
  useEffect(() => {
    if (isOpen) {
      // Generate the remote URL with TV ID
      const hostname = '192.168.1.3';
      const port = window.location.port ? `:${window.location.port}` : '';
      const protocol = window.location.protocol;
      
      // Check if we're in development and use the remote app port
      // const remotePort = hostname === '192.168.1.3' ? ':3002' : port;
      // const localUrl = `${protocol}//${hostname}${remotePort}/remote?tvId=${tvId}`
      const url = `${import.meta.env.VITE_REMOTE_APP_URL}/remote?tvId=${tvId}`;
      setRemoteUrl(url);
    }
  }, [isOpen, tvId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Connect Remote
          </h2>
          <p className="text-gray-600 mb-6">
            Scan this QR code with your mobile device to control this TV
          </p>
          
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
            <QRCode
              size={200}
              value={remoteUrl}
              className="mx-auto"
            />
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            TV ID: <span className="font-mono font-bold">{tvId}</span>
          </div>
          
          <div className="text-xs text-gray-400 mb-6 break-all">
            {remoteUrl}
          </div>
          
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

QRCodeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tvId: PropTypes.string.isRequired,
};

export default QRCodeModal;