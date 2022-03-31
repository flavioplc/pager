import { EscalationPolicyTarget } from "../../models/external/escalation-policy-target.model"
import EscalationPolicy from "../../models/external/escalation-policy.model";

export default interface EscalationPolicyInterface {
    getEscalationPolicyByService: (serviceIdentifier: string) => Promise<EscalationPolicy>;
    getEscalationPolicyTargets: (serviceIdentifier: string, level: number) => Promise<Array<EscalationPolicyTarget>>;
}

