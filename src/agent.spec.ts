import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent
} from 'forta-agent'
import { keccak256 } from 'forta-agent/dist/sdk/utils';
import agent from './agent'
import { AGENT_DESCRIPTION, AGENT_NAME, ALERT_ID, COMPOUND_GOVERNANCE_ADDRESS, VOTE_CAST_SIGNATURE } from './constant';

describe('Compound governance agent', () => {
  let handleTransaction: HandleTransaction;

  const createTxEventWithEventSig = (eventName: string, contractAddress: string) => createTransactionEvent({
    transaction: {
      to: contractAddress
    } as any,
    receipt: {
      logs: [
        {
          address: contractAddress,
          topics: [
            keccak256(eventName),
            '0x0000000000000000000000006626593c237f530d15ae9980a95ef938ac15c35c'
          ],
          data:
            '0x0000000000000000000000000000000000000000000000000000000000000041' +
            '0000000000000000000000000000000000000000000000000000000000000002' +
            '000000000000000000000000000000000000000000001ab2f13462b57b60b679'
        }
      ]
    } as any,
    block: {} as any,
  })

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe('handleTransaction', () => {
    it('returns empty findings if tx not combine CastEvent', async () => {
      const txEvent = createTxEventWithEventSig('FakeEvent', COMPOUND_GOVERNANCE_ADDRESS);

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    })

    it('returns empty findings if tx address not equal compounod governance', async () => {
      const txEvent = createTxEventWithEventSig(VOTE_CAST_SIGNATURE, '0xabcd');

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    })

    it('returns a finding if tx combine CastEvent', async () => {
      const txEvent = createTxEventWithEventSig(VOTE_CAST_SIGNATURE, COMPOUND_GOVERNANCE_ADDRESS);

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: AGENT_NAME,
          description: AGENT_DESCRIPTION,
          alertId: ALERT_ID,
          severity: FindingSeverity.Medium,
          type: FindingType.Info,
          metadata: {
            proposalId: '65',
            support: '2',
            voter: '0x6626593c237f530d15ae9980a95ef938ac15c35c',
            votes: '1.26082429625124603868793e+23'
          }
        }),
      ])
    })
  })
})
