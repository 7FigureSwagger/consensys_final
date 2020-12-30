#### Security features
___
- Using uint256 variables to hold balances, virtually impossible to overflow
- Modifier protecting from underflow on withdrawal
- Internal state changes happen before external calls
- Revert if there is any exception, deposit/withdrawals must succeed before proceding