Please add me as a Agent Developer [Published] on Discord, my username is pinokara#6312
# Compound Governace Proposal Vote Cast

## Description

This agent trigger when user vote for compound governance propsal

## Supported Chains

- Ethereum

## Alerts

- COMPOUND-4
  - Fired when a transaction has event when user vote for compound governance propsal
  - Severity is "medium"
  - Type is "info"
  - Metadata: { proposalId, voter, support, votes }

## Test Data

- 0xa5a4b66cb6cb38e2d550fb8ee4421814337050dbc2f31adbdedfde455608409c
```js
{
  "name": "Compound Governance Vote",
  "description": "Vote cast",
  "alertId": "COMPOUND-4",
  "protocol": "ethereum",
  "severity": "Medium",
  "type": "Info",
  "metadata": {
    "proposalId": "65",
    "voter": "0x84e39a52d7f3f8fb63723782653d4cf71c465a95",
    "support": "1",
    "votes": "165200123853042630297"
  }
}
```

## AgentId

```
0x079aca208a03f8052235b2d04c9d66ad1fb36f63ac7101100d113b80fedea40d
```