import React, { useEffect, useState } from 'react';
import { orgadminApi } from '../api/orgadminApi';
import { motion } from 'framer-motion';
import {
  TableCellsIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  QrCodeIcon,
} from "@heroicons/react/24/solid";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [newTables, setNewTables] = useState(['']);
  const [bulkCount, setBulkCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await orgadminApi.getTables();
      setTables(data.tables || data);
    } catch (err) {
      console.error('Error fetching tables:', err.message);
      setError('Failed to load tables.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTables = async () => {
    try {
      const validTables = newTables.filter((t) => t.trim() !== '');
      if (validTables.length === 0) return alert('Enter at least one table name.');
      const payload =
        validTables.length === 1
          ? { number: validTables[0].trim() }
          : validTables.map((number) => number.trim());
      await orgadminApi.addTables(payload);
      setNewTables(['']);
      await fetchTables();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await orgadminApi.deleteTables([id]);
      await fetchTables();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkCreate = async () => {
    try {
      if (bulkCount < 1) return alert('Enter a valid count.');
      await orgadminApi.bulkCreateTables(bulkCount);
      await fetchTables();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Improved function to download QR codes as PDF
  const handleDownloadQR = async () => {
    if (tables.length === 0) {
      return alert('No tables available to download.');
    }
    const pdf = new jsPDF('p', 'mm', 'a4');
    const qrWidth = 120; // Increased QR code size (passport size)
    const qrHeight = 120;
    const marginX = 10; // Reduced margins to accommodate larger QR codes
    const marginY = 10;
    const gapX = 15; // Adjusted gaps
    const gapY = 15;
    const cols = 3; // 3 columns
    const rows = 3; // 3 rows
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      if (!table.qr_code_url) continue;
      const pagePosition = i % (cols * rows);
      const col = pagePosition % cols;
      const row = Math.floor(pagePosition / cols);
      // Create a temporary container without the <p> for table number
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.innerHTML = `
        <div style="
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          background: white; 
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border: 2px solid #e5e7eb;
          width: ${qrWidth + 30}px;
          height: ${qrHeight + 50}px;
        ">
          <div style="
            width: ${qrWidth}px;
            height: ${qrHeight}px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid #d1d5db;
            padding: 10px;
            margin-bottom: 10px;
          ">
            <img 
              src="${table.qr_code_url}" 
              alt="QR Code" 
              style="width: 100%; height: 100%; object-fit: contain;" 
            />
          </div>
        </div>
      `;
      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv, { 
        scale: 4, // Higher scale for better quality
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      // Calculate position (convert px to mm)
      const x = marginX + col * ((qrWidth + 30) / 2.835 + gapX);
      const y = marginY + row * ((qrHeight + 80) / 2.835 + gapY);
      // Add the image to the PDF
      pdf.addImage(
        imgData, 
        'PNG', 
        x, 
        y, 
        (qrWidth + 30) / 2.835, 
        (qrHeight + 80) / 2.835
      );
      // Draw table number below the QR code
      const textX = x + ((qrWidth + 30) / 2.835) / 2;
      const textY = y + ((qrHeight + 80) / 2.835) - 5; // Adjust as needed
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${table.number}`, textX, textY, { align: 'center' });
      document.body.removeChild(tempDiv);
      // Add new page if needed
      if ((i + 1) % (cols * rows) === 0 && i !== tables.length - 1) {
        pdf.addPage();
      }
    }
    pdf.save('QR_Codes.pdf');
  };

  return (
    <div className="min-h-screen bg-blue-900 text-blue-50 p-4 md:p-8">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          layout
          className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-4xl font-bold flex items-center gap-2">
            <TableCellsIcon className="h-8 w-8 text-blue-600" />
            Tables Management
          </h2>
          <p className="text-sm text-blue-900 mt-2">Manage your restaurant's tables here.</p>
        </motion.div>

        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-10">
            <motion.div
              className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 mx-auto mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
            <p className="text-gray-600">Fetching tables...</p>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            {/* Current Tables Section */}
            <motion.div
              layout
              className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg mb-8"
            >
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <TableCellsIcon className="h-6 w-6 text-indigo-600" />
                Current Tables
              </h3>
              {tables.length === 0 ? (
                <p className="text-gray-500 text-center">No tables found.</p>
              ) : (
                <motion.ul
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {tables.map((table) => (
                    <motion.li
                      key={table.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-100 text-blue-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300 relative overflow-hidden"
                    >
                      <div>
                        <h4 className="text-xl font-semibold flex items-center gap-2">
                          <TableCellsIcon className="h-6 w-6 text-indigo-600" />
                          {table.number}
                        </h4>
                        {table.qr_code_url && (
                          <div className="mt-4 bg-white rounded-lg shadow-sm p-2">
                            <img
                              src={table.qr_code_url}
                              alt={`QR for ${table.number}`}
                              className="w-full h-48 object-contain rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition duration-300 flex items-center gap-1"
                        onClick={() => handleDelete(table.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                        Delete
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>

            {/* Add Tables Manually Section */}
            <motion.div
              layout
              className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg mb-8"
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <PlusIcon className="h-6 w-6 text-green-600" />
                Add Tables Manually
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {newTables.map((value, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Table ${idx + 1}`}
                    className="input-field bg-gray-50 text-blue-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    value={value}
                    onChange={(e) => {
                      const updated = [...newTables];
                      updated[idx] = e.target.value;
                      setNewTables(updated);
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
                  onClick={() => setNewTables([...newTables, ''])}
                >
                  Add More
                </button>
                <button
                  className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
                  onClick={handleAddTables}
                >
                  Add Tables
                </button>
              </div>
            </motion.div>

            {/* Bulk Create Tables Section */}
            <motion.div
              layout
              className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg mb-8"
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <ArrowUpIcon className="h-6 w-6 text-purple-600" />
                Bulk Create Tables
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  className="bg-gray-50 text-blue-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-24"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(Number(e.target.value))}
                />
                <button
                  className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
                  onClick={handleBulkCreate}
                >
                  Bulk Create
                </button>
              </div>
            </motion.div>

            {/* Download QR Codes as PDF Section */}
            <motion.div
              layout
              className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <QrCodeIcon className="h-6 w-6 text-indigo-600" />
                Download QR Codes
              </h3>
              <button
                className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
                onClick={handleDownloadQR}
              >
                Download QR Codes as PDF
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Tables;