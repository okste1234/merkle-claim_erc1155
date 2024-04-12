import * as fs from 'fs';
import { utils } from "ethers";

import { ethers } from 'ethers';


function generateRandomAddress():string| null {
  try {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
  } catch (error) {
    console.error("Error generating random address:", error);
    return null; // Handle errors or return null on failure
  }
}


// Generate 500 addresses and token IDs and different balances
function generateData(): { address: string|null, tokenId: number, amount : number }[] {
    const data = [];
    for (let i = 1; i <= 500; i++) {
        let bal = 0
        if (i > 10 && i < 100) {
            bal = Math.min(Math.ceil(Math.random() * i), 2)
        }else if (i > 100 && i < 200) {
            bal = Math.min(Math.ceil(Math.random() * i), 3)
        }else if (i > 200 && i < 300) {
            bal = Math.min(Math.ceil(Math.random() * i), 4)
        }else if (i > 300 && i < 400) {
            bal = Math.min(Math.ceil(Math.random() * i), 2)
        }else if (i > 400 && i < 500) {
            bal = Math.min(Math.ceil(Math.random() * i), 3)
        }else {
             bal = Math.min(Math.ceil(Math.random() * i), 10)
        }
        //     0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
        // 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
        // 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
        data.push({ address: generateRandomAddress(), tokenId: i, amount: bal });
    }
    
    
    return data;
}

// Function to convert data to CSV format
function convertToCSV(data: { address: string|null, tokenId: number, amount : number }[]): string {
    let csv = 'address,tokenId,amount\n';
    data.forEach(item => {
        csv += `${item.address},${item.tokenId},${item.amount}\n`;
    });
    return csv;
}

// Write data to a CSV file
function writeCSV(data: string): void {
    fs.writeFile('data2.csv', data, (err) => {
        if (err) {
            console.error('Error writing to CSV:', err);
        } else {
            console.log('CSV file generated successfully.');
        }
    });
}

// Main function to generate data and write to CSV
function main() {
    const data = generateData();
    const csvData = convertToCSV(data);
    writeCSV(csvData);
}

// Run the main function
main();
