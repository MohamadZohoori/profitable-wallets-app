'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Assuming you're using Chart.js
import 'chart.js/auto'; // Import Chart.js automatically
import valuableWallets from '../valuable_wallets_sample.json'; // Import JSON data

// Define the correct structure for Wallet and HotTokenHolder
interface HotTokenHolder {
  'Buy Times': any;
  'Sell Times': any;
}

interface Wallet {
  walletAddress: string;
  netProfit: number;
  HotTokenHolders: HotTokenHolder[]; // Array of HotTokenHolders within each Wallet
}

const Chart: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Retrieve wallet address from local storage
    const storedWalletAddress = localStorage.getItem('selectedWalletAddress');
    
    if (storedWalletAddress) {
      const wallet = valuableWallets.find((w: Wallet) => w.walletAddress === storedWalletAddress);
      if (wallet) {
        setSelectedWallet(wallet);
      } else {
        console.error(`Wallet with address ${storedWalletAddress} not found`);
      }
    } else {
      console.error('No wallet address found in local storage');
    }
  }, []);

  useEffect(() => {
    if (selectedWallet) {
      const hotTokenHolders  = selectedWallet.HotTokenHolders;
      // Access 'Buy Times' and 'Sell Times' from hotTokenHolders
      const buyTimes = hotTokenHolders.flatMap(holder => holder['Buy Times']);
      const sellTimes = hotTokenHolders.flatMap(holder => holder['Sell Times']);
      
      const { groupedBuyData, groupedSellData } = groupByMonth(buyTimes, sellTimes);
      generateChartData(groupedBuyData, groupedSellData);
    }
  }, [selectedWallet]);

  // Group buy and sell events by month
  const groupByMonth = (buyTimes: any, sellTimes: any) => {
    const groupedBuyData: any = {};
    const groupedSellData: any = {};

    buyTimes.forEach((buyTime: any) => {
      const month = formatDateToMonth(buyTime.time.split('T')[0]);
      groupedBuyData[month] = (groupedBuyData[month] || 0) + 1;
    });

    sellTimes.forEach((sellTime: any) => {
      const month = formatDateToMonth(sellTime.time.split('T')[0]);
      groupedSellData[month] = (groupedSellData[month] || 0) + 1;
    });

    return { groupedBuyData, groupedSellData };
  };

  // Format date string to "YYYY-MM" for grouping by month
  const formatDateToMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month
    return `${year}-${month}`;
  };

  // Generate the chart data for rendering
  const generateChartData = (buyData: { [month: string]: number }, sellData: { [month: string]: number }) => {
    const months = Array.from(new Set([...Object.keys(buyData), ...Object.keys(sellData)])).sort();

    const buyCounts = months.map((month) => buyData[month] || 0);
    const sellCounts = months.map((month) => sellData[month] || 0);

    setChartData({
        labels: months,
        datasets: [
          {
            label: 'Buy Times',
            data: buyCounts,
            borderColor: 'rgba(255, 206, 86, 1)', // Yellow border
            backgroundColor: 'rgba(255, 206, 86, 0.2)', // Yellow background
            fill: true,
          },
          {
            label: 'Sell Times',
            data: sellCounts,
            borderColor: 'rgba(54, 162, 235, 1)', // Blue border
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue background
            fill: true,
          },
        ],
      });
  };

  return (
    <div className='place-items-center md:p-4 mt-20 max-sm:mx-4 max-md:w-5/6 max-lg:w-full lg:w-2/3'>
      <h2>Buy/Sell Times Chart</h2>
      <div className='w-full min-h-[400px]'> 
        {chartData ? (
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default Chart;
