clear;
echo "WELCOME TO T3RN AIRDROP BOT !\n
         Mod By : Mr9868\n
         Choose the network : \n
         1. Arbitrum Sepolia         5. Random Arbitrum\n
         2. Base Sepolia             6. Random Base\n
         3. Optimism Sepolia         7. Random Optimism\n
         4. Blast Sepolia            8. Random Blast\n
        ";
read -p "Please select :" answer
if [[ $answer = 1 ]] ; then
  node arb.js
elif [[ $answer = 2 ]] ; then
  node base.js
elif [[ $answer = 3 ]] ; then
  node op.js
elif [[ $answer = 4 ]] ; then
  node blast.js
elif [[ $answer = 5 ]] ; then
  # node random_arb.js
    echo -e "Stay Tune !\n"
elif [[ $answer = 6 ]] ; then
  # node random_base.js
    echo -e "Stay Tune !\n"
elif [[ $answer = 7 ]] ; then
  # node random_op.js
    echo -e "Stay Tune !\n"
elif [[ $answer = 8 ]] ; then
  # node random_blast.js
    echo -e "Stay Tune !\n"
else
  echo -e "Nothing to do !\n"
fi
