import { EscalationPolicyTarget } from "./escalation-policy-target.model"

export default class EscalationPolicyLevel {
    level: number;
    targets: Array<EscalationPolicyTarget>;
    constructor(level: number, targets: Array<EscalationPolicyTarget>) {
        this.level = level;
        this.targets = targets;
    }
}