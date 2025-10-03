// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

// function UploadExcelModal({ isOpen, onClose, onUpload }) {
//   const [file, setFile] = useState(null);
//   const [status, setStatus] = useState('idle'); // idle, uploading, success, error
//   const [error, setError] = useState(null);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       setFile(selectedFile);
//       setError(null);
//     } else {
//       setFile(null);
//       setError('Please select a valid Excel file (.xlsx)');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     setStatus('uploading');
//     try {
//       await onUpload(file);
//       setStatus('success');
//       setTimeout(() => {
//         onClose();
//         setFile(null);
//         setStatus('idle');
//       }, 2000);
//     } catch (err) {
//       setStatus('error');
//       setError(err.message);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />
          
//           <motion.div
//             className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50"
//             initial={{ x: '100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '100%' }}
//             transition={{ type: 'tween', duration: 0.3 }}
//           >
//             <div className="flex flex-col h-full">
//               <div className="flex items-center justify-between p-6 border-b">
//                 <h2 className="text-xl font-display font-semibold">Upload Menu Items</h2>
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                   disabled={status === 'uploading'}
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="flex-1 p-6">
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div
//                     className={`border-2 border-dashed rounded-lg p-6 text-center ${
//                       file ? 'border-oa-primary bg-oa-accent' : 'border-gray-300'
//                     }`}
//                   >
//                     <input
//                       type="file"
//                       accept=".xlsx"
//                       onChange={handleFileChange}
//                       className="hidden"
//                       id="excel-upload"
//                       disabled={status === 'uploading'}
//                     />
                    
//                     <label
//                       htmlFor="excel-upload"
//                       className="cursor-pointer block"
//                     >
//                       {file ? (
//                         <div className="flex items-center justify-center space-x-2">
//                           <FileSpreadsheet size={24} className="text-oa-primary" />
//                           <span className="font-medium text-oa-primary">{file.name}</span>
//                         </div>
//                       ) : (
//                         <div>
//                           <Upload size={24} className="mx-auto mb-2 text-gray-400" />
//                           <p className="text-sm text-gray-500">
//                             Click to upload or drag and drop
//                           </p>
//                           <p className="text-xs text-gray-400">
//                             Excel files only (.xlsx)
//                           </p>
//                         </div>
//                       )}
//                     </label>
//                   </div>

//                   {error && (
//                     <div className="flex items-center space-x-2 text-red-600 text-sm">
//                       <AlertCircle size={16} />
//                       <span>{error}</span>
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     disabled={!file || status === 'uploading'}
//                     className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
//                       status === 'success'
//                         ? 'bg-green-500 text-white'
//                         : status === 'uploading'
//                         ? 'bg-gray-200 text-gray-500'
//                         : 'bg-oa-primary text-white hover:bg-oa-primary-dark'
//                     }`}
//                   >
//                     {status === 'uploading' ? (
//                       <div className="flex items-center justify-center space-x-2">
//                         <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
//                         <span>Uploading...</span>
//                       </div>
//                     ) : status === 'success' ? (
//                       <div className="flex items-center justify-center space-x-2">
//                         <Check size={16} />
//                         <span>Upload Complete!</span>
//                       </div>
//                     ) : (
//                       'Upload Excel File'
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }

// export default UploadExcelModal;
// src/roles/orgadmin/components/UploadExcelModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadExcelModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid Excel file (.xlsx)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      await onUpload(file);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold">Upload Excel File</h2>
                <button onClick={onClose}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select File</label>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#008080] text-white py-2 px-4 rounded-md hover:bg-[#006666]"
                >
                  Upload
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}