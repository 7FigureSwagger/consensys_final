#### DumpETH
---

This app was built for personal use, most likely to be used by a trader over a regular user. The contract is owned by the deployer, and set as the admin. Only the admin can initiate function calls. My reasoning behind this was for security reasons to 'tamper-proof' it a little bit.  

The intended purpose is to be a sort of "hot-wallet" that lives on-chain. The owner stores Eth, and ERC tokens, and will initiate a "panick-sell" or what I like to call, "Ape-ing" out of the market, at market prices using a combination of DeFi tools.


##### Setting up the project locally:
- clone repository
- cd into client directory and install dependancies

		npm install
- open a development server, for this I used Ganache-GUI
- set up network and related info in "**truffle-config.js**"
- run truffle deploy once to deploy the contracts
- cd into the "**client**" folder in your teminal, then start up the fron-ent

		npm start

Thats it!