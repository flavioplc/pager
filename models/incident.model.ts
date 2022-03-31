import EscalationPolicy from './external/escalation-policy.model'
import shortid from "shortid"

export default class Incident {
    id: string;
    serviceIdentifier: string;
    message: string;
    reportedAt: Date;
    solvedAt?: Date;
    acknowledgedAt?: Date;
    escalationPolicy: EscalationPolicy;
    lastEscalationLevel: number;

    constructor (serviceIdentifier: string, message: string, escalationPolicy: EscalationPolicy) {
        this.id = shortid.generate();
        this.serviceIdentifier = serviceIdentifier;
        this.message = message;
        this.escalationPolicy = escalationPolicy;
        this.reportedAt = new Date(Date.now());
        this.lastEscalationLevel = 1;
    }
    
    acknowledge() {
        this.acknowledgedAt = new Date(Date.now());
    }
    escalate() {
        this.lastEscalationLevel +=1;
    }
    solve() {
        this.solvedAt = new Date(Date.now());
    }

}