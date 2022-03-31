import { EscalationPolicyTarget } from "../../models/external/escalation-policy-target.model";
import Incident from "../../models/incident.model";

export default interface EmailInterface {
    sendEmail: (target: EscalationPolicyTarget, incident: Incident) => Promise<any>;
}