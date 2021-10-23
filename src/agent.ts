import BigNumber from 'bignumber.js'
import { 
  Finding, 
  HandleTransaction, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType,
} from 'forta-agent'
import {
  COMPOUND_GOVERNANCE_ADDRESS,
  VOTE_CAST_SIGNATURE,
  AGENT_NAME,
  ALERT_ID,
  AGENT_DESCRIPTION,
} from './constant'

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = []

  if (txEvent.to !== COMPOUND_GOVERNANCE_ADDRESS) return findings

  const compGovernanceProposalVoteCastEvents = txEvent.filterEvent(VOTE_CAST_SIGNATURE, COMPOUND_GOVERNANCE_ADDRESS)
  
  if (!compGovernanceProposalVoteCastEvents.length) return findings

  const [log] = compGovernanceProposalVoteCastEvents

  const voter = `0x${log.topics[1].slice(26, 66)}`
  const proposalId = `${parseInt(log.data.slice(2, 66), 16)}`
  const support = `${parseInt(log.data.slice(66, 130), 16)}`
  const votes = (new BigNumber(log.data.slice(130, 194), 16)).toString();

  findings.push(Finding.fromObject({
    name: AGENT_NAME,
    description: AGENT_DESCRIPTION,
    alertId: ALERT_ID,
    severity: FindingSeverity.Medium,
    type: FindingType.Info,
    metadata: {
      proposalId,
      voter,
      support,
      votes,
    }
  }))

  return findings
}

export default {
  handleTransaction,
}