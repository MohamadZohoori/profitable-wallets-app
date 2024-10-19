'use client'

import React, { useEffect, useState } from 'react';
import valuableWallets from '../valuable_wallets_sample.json'; 

interface Wallet {
  walletAddress: string;
  netProfit: number;
}

const Table: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const walletsPerPage = 5;

  const [sortConfig, setSortConfig] = useState<{ key: keyof Wallet; direction: 'ascending' | 'descending' }>({
    key: 'netProfit',
    direction: 'descending',
  });

  useEffect(() => {
    const data = valuableWallets as Wallet[];
    setWallets(data);
  }, []);

  const indexOfLastWallet = currentPage * walletsPerPage;
  const indexOfFirstWallet = indexOfLastWallet - walletsPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const sortedWallets = [...wallets].sort((a, b) => {
    const order = sortConfig.direction === 'ascending' ? 1 : -1;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return -1 * order;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return 1 * order;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedWallets.length / walletsPerPage);
  const currentSortedWallets = sortedWallets.slice(indexOfFirstWallet, indexOfLastWallet);

  const requestSort = (key: keyof Wallet) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);

    if (start > 1) {
      pageNumbers.push(1);
      if (start > 2) pageNumbers.push(-1); // For ellipsis
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pageNumbers.push(-1); // For ellipsis
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleWalletClick = (walletAddress: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('selectedWalletAddress', walletAddress);
        window.location.href = `/charts`;
    }
  };

  return (
    <div className="sm:p-4 mt-20 lg:mx-20 max-sm:mx-8">
      <h1 className="text-2xl font-bold mb-4 text-center mx-auto">Crypto Wallets</h1>
      <div className="max-w-[750px] mx-auto overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100"> {/* Added background color to the wrapper */}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th
                className="border-b border-gray-300 px-4 py-2 cursor-pointer text-center"
                onClick={() => requestSort('walletAddress')}
              >
                Wallet Address 
                {sortConfig.key === 'walletAddress' && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
              </th>
              <th
                className="border-b border-gray-300 px-4 py-2 cursor-pointer text-left"
                onClick={() => requestSort('netProfit')}
              >
                Net Profit 
                {sortConfig.key === 'netProfit' && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSortedWallets.map((wallet, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleWalletClick(wallet.walletAddress)} // Redirect on click
              >
                <td className="border-b border-gray-300 px-4 py-2 text-center max-sm:text-sm">
                  <span className="hidden lg:inline">{wallet.walletAddress}</span>
                  <span className="inline-block max-sm:hidden lg:hidden truncate w-[250px]">{wallet.walletAddress}</span>
                  <span className="inline-block sm:hidden truncate w-[150px]">{wallet.walletAddress}</span>
                </td>
                <td className="border-b border-gray-300 px-4 py-2 text-left max-sm:text-sm">{wallet.netProfit.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`max-sm:text-xs mx-1 px-3 max-sm:px-1 py-1 border rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-900' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        {generatePageNumbers().map((number, index) => (
          <button
            key={index}
            onClick={() => number !== -1 && paginate(number)}
            className={`max-sm:text-xs mx-1 px-3 max-sm:px-1 py-1 border rounded ${number === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            disabled={number === -1} // Disable button for ellipsis
          >
            {number === -1 ? '...' : number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`max-sm:text-xs mx-1 px-3 max-sm:px-1 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-900' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
