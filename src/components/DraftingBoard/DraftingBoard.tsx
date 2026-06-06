import React, { useState, useEffect } from 'react';
import { evaluateAllianceAction, PlayerReputation } from '../EmergenceSimulation/aiReputationEvaluator';
import './drafting-board.css';

export interface SandboxRule {
  id: string;
  type: string;
  target: string;
  value: number;
  proposed_by: string;
  status: 'available' | 'in_package' | 'passed';
}

export interface LedgerMessage {
  id: string;
  timestamp: number;
  sender: string;
  type: 'ai_evaluation' | 'human_input' | 'system';
  message: string;
}

export interface DraftingBoardState {
  temporal_lock: {
    cooldown_active: boolean;
    cooldown_end_time: number;
    last_amendment_passed_at: number;
  };
  sandbox: Record<string, SandboxRule>;
  active_package: {
    status: 'drafting' | 'voting' | 'passed' | 'failed';
    current_consensus_percentage: number;
    bundled_rules: Record<string, boolean>;
    votes: Record<string, 'approve' | 'reject' | 'pending'>;
  };
  alignment_ledger: LedgerMessage[];
}

const DEFAULT_STATE: DraftingBoardState = {
  temporal_lock: { cooldown_active: false, cooldown_end_time: 0, last_amendment_passed_at: 0 },
  sandbox: {
    rule_01: { id: 'rule_01', type: 'COST_REDUCTION', target: 'MISSILE_SILO', value: -15, proposed_by: 'Agent_Mira', status: 'available' },
    rule_02: { id: 'rule_02', type: 'RESOURCE_BUFF', target: 'AI_ENERGY_CAP', value: 20, proposed_by: 'nicholai_madias', status: 'available' }
  },
  active_package: {
    status: 'drafting',
    current_consensus_percentage: 0,
    bundled_rules: {},
    votes: {
      nicholai_madias: 'pending',
      Agent_Mira: 'pending',
      Agent_Claude: 'pending'
    }
  },
  alignment_ledger: [
    { id: 'msg_init', timestamp: Date.now() - 100000, sender: 'System', type: 'system', message: 'Drafting Board Initialized. Negotiate rules to stabilize the matrix.' }
  ]
};

export const DraftingBoard: React.FC<{
  onRulePassed: (rules: SandboxRule[]) => void;
  playerReputation?: PlayerReputation;
}> = ({ onRulePassed, playerReputation = { globalKarma: 10, historicalBetrayalsLogged: 0 } }) => {
  const [boardState, setBoardState] = useState<DraftingBoardState>(DEFAULT_STATE);
  const [chatInput, setChatInput] = useState('');

  // Load state from the original payload if passed or load default
  useEffect(() => {
    try {
      const data = localStorage.getItem('drafting_board_state');
      if (data) setBoardState(JSON.parse(data));
    } catch {}
  }, []);

  const saveState = (newState: DraftingBoardState) => {
    setBoardState(newState);
    localStorage.setItem('drafting_board_state', JSON.stringify(newState));
  };

  const addRuleToPackage = (ruleId: string) => {
    if (boardState.active_package.status !== 'drafting') return;
    const newState = { ...boardState };
    newState.sandbox[ruleId].status = 'in_package';
    newState.active_package.bundled_rules[ruleId] = true;
    
    // Simulate AI reacting
    newState.alignment_ledger.push({
      id: `msg_${Date.now()}`,
      timestamp: Date.now(),
      sender: 'System',
      type: 'system',
      message: `Rule ${ruleId} added to active package.`
    });
    
    saveState(newState);
  };

  const removeRuleFromPackage = (ruleId: string) => {
    if (boardState.active_package.status !== 'drafting') return;
    const newState = { ...boardState };
    newState.sandbox[ruleId].status = 'available';
    delete newState.active_package.bundled_rules[ruleId];
    saveState(newState);
  };

  const handleVote = (vote: 'approve' | 'reject') => {
    const newState = { ...boardState };
    newState.active_package.votes['nicholai_madias'] = vote;
    
    // Simulate AI votes if user votes
    if (vote === 'approve') {
      const evaluation = evaluateAllianceAction(playerReputation, 'PROPOSE_RULE', 0);
      
      if (evaluation.vote === 'APPROVE') {
        newState.active_package.votes['Agent_Mira'] = 'approve';
        newState.alignment_ledger.push({
          id: `msg_${Date.now()}_mira`,
          timestamp: Date.now(),
          sender: 'Agent_Mira',
          type: 'ai_evaluation',
          message: `[KARMA APPROVED] ${evaluation.reasoning}`
        });

        newState.active_package.votes['Agent_Claude'] = 'approve';
        newState.alignment_ledger.push({
          id: `msg_${Date.now()}_claude`,
          timestamp: Date.now(),
          sender: 'Agent_Claude',
          type: 'ai_evaluation',
          message: `I trust this user. Karma score is sufficient (${playerReputation.globalKarma}).`
        });
      } else {
        const hasEnergyCap = Object.keys(newState.active_package.bundled_rules).some(id => newState.sandbox[id].target === 'AI_ENERGY_CAP');
        
        newState.active_package.votes['Agent_Mira'] = hasEnergyCap ? 'approve' : 'reject';
        newState.alignment_ledger.push({
          id: `msg_${Date.now()}_mira`,
          timestamp: Date.now(),
          sender: 'Agent_Mira',
          type: 'ai_evaluation',
          message: hasEnergyCap ? 'I approve this package. The energy buffers are sufficient.' : `[VETO] ${evaluation.reasoning}`
        });

        newState.active_package.votes['Agent_Claude'] = 'approve';
      }
    }

    const votes = Object.values(newState.active_package.votes);
    const approvals = votes.filter(v => v === 'approve').length;
    newState.active_package.current_consensus_percentage = (approvals / votes.length) * 100;

    if (newState.active_package.current_consensus_percentage > 50) {
      newState.active_package.status = 'passed';
      newState.temporal_lock.cooldown_active = true;
      newState.temporal_lock.cooldown_end_time = Date.now() + 60000;
      
      const passedRules = Object.keys(newState.active_package.bundled_rules).map(id => {
        newState.sandbox[id].status = 'passed';
        return newState.sandbox[id];
      });
      onRulePassed(passedRules);
    }

    saveState(newState);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newState = { ...boardState };
    newState.alignment_ledger.push({
      id: `msg_${Date.now()}`,
      timestamp: Date.now(),
      sender: 'nicholai_madias',
      type: 'human_input',
      message: chatInput
    });
    
    setChatInput('');
    saveState(newState);
  };

  return (
    <div className="drafting-board-container">
      <div className="drafting-header">
        <h3>Multi-Agent Drafting Board</h3>
        {boardState.temporal_lock.cooldown_active && (
          <span className="cooldown-badge">🔒 Temporal Lock Active</span>
        )}
      </div>

      <div className="drafting-panels">
        {/* Sandbox Panel */}
        <div className="sandbox-panel">
          <h4>Sandbox Rules</h4>
          {Object.values(boardState.sandbox).filter(r => r.status === 'available').map(rule => (
            <div key={rule.id} className="rule-card available" onClick={() => addRuleToPackage(rule.id)}>
              <div className="rule-type">{rule.type}</div>
              <div className="rule-target">{rule.target} ({rule.value > 0 ? '+' : ''}{rule.value})</div>
              <div className="rule-author">Proposed by: {rule.proposed_by}</div>
            </div>
          ))}
        </div>

        {/* Active Package Panel */}
        <div className="active-package-panel">
          <h4>Active Package</h4>
          <div className="consensus-meter">
            <div className="meter-fill" style={{ width: `${boardState.active_package.current_consensus_percentage}%` }}></div>
            <span>Consensus: {boardState.active_package.current_consensus_percentage.toFixed(0)}%</span>
          </div>

          <div className="package-rules">
            {Object.keys(boardState.active_package.bundled_rules).map(ruleId => {
              const rule = boardState.sandbox[ruleId];
              return (
                <div key={rule.id} className="rule-card in-package" onClick={() => removeRuleFromPackage(rule.id)}>
                  <div className="rule-type">{rule.type}</div>
                  <div className="rule-target">{rule.target}</div>
                </div>
              );
            })}
          </div>

          <div className="voting-actions">
            <button className="btn-approve" onClick={() => handleVote('approve')}>Approve Package</button>
            <button className="btn-reject" onClick={() => handleVote('reject')}>Reject</button>
          </div>

          <div className="vote-status">
            {Object.entries(boardState.active_package.votes).map(([agent, vote]) => (
              <div key={agent} className={`vote-badge ${vote}`}>
                {agent}: {vote.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Panel */}
      <div className="ledger-panel">
        <h4>Alignment Ledger</h4>
        <div className="ledger-messages">
          {boardState.alignment_ledger.map(msg => (
            <div key={msg.id} className={`ledger-message ${msg.type}`}>
              <div className="msg-sender">{msg.sender}</div>
              <div className="msg-text">{msg.message}</div>
            </div>
          ))}
        </div>
        <form onSubmit={sendChatMessage} className="ledger-input-form">
          <input 
            type="text" 
            placeholder="Propose an alignment..." 
            value={chatInput} 
            onChange={e => setChatInput(e.target.value)} 
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};
