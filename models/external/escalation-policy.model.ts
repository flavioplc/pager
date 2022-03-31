import EscalationPolicyLevel from "./escalation-policy-level.model";

export default class EscalationPolicy {
    serviceIdentifier: string;
    levels: Array<EscalationPolicyLevel>;

    constructor (serviceIdentifier: string, levels: Array<EscalationPolicyLevel>) {
        this.serviceIdentifier = serviceIdentifier;
        this.levels = levels;
    }
}