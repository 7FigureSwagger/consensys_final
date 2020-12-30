
#### Design patterns:
- Circuit breaker pattern
	- Using a bool toggle to block access to contract except for an emergency withdrawal
	- Access to deposit/withdraw/sell functions restricted to the owner of the address that deployed