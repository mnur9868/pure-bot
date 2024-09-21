require('colors');
const { Wallet, JsonRpcProvider, ethers, parseUnits } = require('ethers');
const fs = require('fs');
const path = require('path');

const readlineSync = require('readline-sync');
const moment = require('moment');
const T3RN_ABI = require('./contracts/ABI');
const { displayHeader } = require('./utils/display');
const { transactionData, delay } = require('./chains/arbt/helper');
const { getAmount } = require('./chains/arbt/api');

const TOKEN_FILE_PATH = path.join(__dirname, 'ARBT_TX_HASH.txt');

const PRIVATE_KEYS = JSON.parse(fs.readFileSync('privateKeys.json', 'utf-8'));
const RPC_URL = T3RN_ABI.at(-1).RPC_ARBT;
// const chain_id = T3RN_ABI.at(-1).ID_ARBT;
const provider = new JsonRpcProvider(RPC_URL);
const CONTRACT_ADDRESS = T3RN_ABI.at(-1).CA_ARBT;
(async () => {
  displayHeader();
  console.log('⏳ Please wait...'.yellow);
  console.log('');

  const options = readlineSync.question(
    'Choose the network that you want to use 👇\n\n1. Arbitrum Sepolia to Base Sepolia\n2. Arbitrum Sepolia to Blast Sepolia\n3. Arbitrum Sepolia to Optimism Sepolia\n4. Exit\n\nEnter 1, 2, 3, or 4: '
  );

  if (options === '4' || !options) {
    console.log('👋 Exiting the bot. See you next time!'.cyan);
    console.log('Subscribe: https://t.me/HappyCuanAirdrop.'.green);
    process.exit(0);
  }
 const jumlah = readlineSync.questionFloat(
    "🔄 How much amount in ETH you want to bridge ? set 0 for random amount => "
  );
      const awal = 10000000000000000;
      const min = 1000; // 0.01 ETH
      const max = 1222; // 0.01222 ETH
      const acak = Math.random() * (max - min) + min;
      let randomValue = 0;
      let desimal = "";
      // convert number to a string, then extract the first digit
      let final = "";
      let saldoHex = "";
      let jumlahTx = "";
      let jumlahValue = "";
      let finalHex = "";
  
   if (jumlah <= 0) { 
        randomValue = acak.toFixed(0);
        desimal = String(randomValue / 100000);
    // convert number to a string, then extract the first digit
        final = Number(String(awal).replace("1000",randomValue));
        finalHex = final.toString(16);
        saldoHex = String(finalHex).padStart(16, '0');
   }
   else
   {
       jumlahTx = jumlah * 100000;
       jumlahValue = jumlahTx.toFixed(0);
       desimal = String(jumlahValue / 100000);
    // convert number to a string, then extract the first digit
       final = Number(String(awal).replace("1000",jumlahValue));
       finalHex = final.toString(16);
       saldoHex = String(finalHex).padStart(16, '0'); 

   }
  const numTx = readlineSync.questionInt(
    '🔄 How many times you want to swap or bridge? '
  );
  if (numTx <= 0) {
    console.log('❌ Number of transactions must be greater than 0!'.red);
    process.exit(1);
  }   
  //random delay
  function getRandomDelay() {
  // Random delay between 2 minutes (120000 ms) and 5 minutes (5000 ms)
  return Math.floor(Math.random() * (120000 - 5000 + 1)) + 5000;
}

  const tunda = readlineSync.questionInt(
    "🔄 Set delay for every transaction ? Set 0 for random delay => "
  );

  if (numTx <= 0) {
    console.log('❌ Number of transactions must be greater than 0!'.red);
    process.exit(1);
  }

  for (const PRIVATE_KEY of PRIVATE_KEYS) {
    const wallet = new Wallet(PRIVATE_KEY, provider);
    let totalSuccess = 0;

    while (totalSuccess < numTx) {
      try {
        const balance = await provider.getBalance(wallet.address);
        const balanceInEth = ethers.formatUnits(balance, 'ether');

        console.log(
          `⚙️ [ ${moment().format(
            'HH:mm:ss'
          )} ] Doing transactions for address ${wallet.address}...`.yellow
        );

        if (balanceInEth < 0.01) {
          console.log(
            `❌ [ ${moment().format(
              'HH:mm:ss'
            )} ] Your balance is too low (💰 ${balanceInEth} ETH), please claim faucet first!`
              .red
          );
          process.exit(0);
        }

        let counter = numTx - totalSuccess;

        while (counter > 0) {
          try {
            const amount = await getAmount(options);
            if (!amount) {
              console.log(
                `❌ Failed to get the amount. Skipping transaction...`.red
              );
              continue;
            }
            
            
            const request = transactionData(
              wallet.address,
              amount.hex,
              options,
              saldoHex
            );

            const gasPrice = parseUnits('0.1', 'gwei');

            const gasLimit = await provider.estimateGas({
              to: CONTRACT_ADDRESS,
              data: request,
              value: parseUnits(desimal, 'ether'),
              gasPrice,
            });
            const nonce = await wallet.getNonce();
            const transaction = {
              nonce,
              // chainId : chain_id,
              data: request,
              to: CONTRACT_ADDRESS,
              gasLimit,
              gasPrice,
              from: wallet.address,
              value: parseUnits(desimal, 'ether'), // adjustable
            };

            const result = await wallet.sendTransaction(transaction);
            console.log(`⏳ [ ${moment().format('HH:mm:ss')} ] Sending ${desimal} ETH`.yellow);
            console.log(
              `✅ [ ${moment().format(
                'HH:mm:ss'
              )} ] Transaction successful from Arbitrum Sepolia to ${
                options === '1' ? 'Base' : options === '2' ? 'Blast' : 'Optimism'
              } Sepolia!`.green
            );
            console.log(
              `🔗 [ ${moment().format(
                'HH:mm:ss'
              )} ] Transaction hash: https://sepolia-explorer.arbitrum.io/tx/${
                result.hash
              }`.green
            );
            fs.writeFileSync(
              TOKEN_FILE_PATH,
              `https://sepolia-explorer.arbitrum.io/tx/${result.hash}`
            );
            console.log(
              '✅ Transaction hash url has been saved to ARBT_TX_HASH.txt.'
                .green
            );
            console.log('');

            totalSuccess++;
            counter--;

            if (counter > 0) {
              if (tunda <= 0) {
                const randomDelay = getRandomDelay();
                console.log(`⏳ [ ${moment().format('HH:mm:ss')} ] Waiting ${randomDelay / 1000} seconds before next transaction...`.yellow);
                console.log("");
                await delay(randomDelay);
              } else {
                  let Dtunda =  tunda * 1000;
                  await delay(Dtunda);
              }
            }
          } catch (error) {
            console.log(
              `❌ [ ${moment().format(
                'HH:mm:ss'
              )} ] Error during transaction: ${error}`.red
            );
          }
        }
      } catch (error) {
        console.log(
          `❌ [ ${moment().format(
            'HH:mm:ss'
          )} ] Error in processing transactions: ${error}`.red
        );
      }
    }
  }

  console.log('');
  console.log(
    `🎉 [ ${moment().format(
      'HH:mm:ss'
    )} ] All ${numTx} transactions are complete!`.green
  );
  console.log(
    `📢 [ ${moment().format(
      'HH:mm:ss'
    )} ] Subscribe: https://t.me/HappyCuanAirdrop`.green
  );
})();
