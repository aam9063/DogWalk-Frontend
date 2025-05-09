import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Toast = ({ message, isVisible, onClose, actionText, onAction }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50, x: 50 }}
          className="fixed top-4 right-4 z-50 flex items-center min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex-1 flex items-center p-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-dog-green text-white">
              <FaCheck size={14} />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{message}</p>
              {actionText && (
                <button
                  onClick={onAction}
                  className="mt-1 text-sm font-medium text-dog-green hover:text-dog-light-green"
                >
                  {actionText}
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 