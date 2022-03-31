import EmailInterface from "../../interfaces/external/email.interface";
import { EscalationPolicyTarget } from "../../models/external/escalation-policy-target.model";
import Incident from "../../models/incident.model";

export default class EmailNotificationServiceMock implements EmailInterface {
    async sendEmail(target: EscalationPolicyTarget, incident: Incident):Promise<any> {
        return Promise.resolve({
            email: target.email,
            message: incident.message,
            service: incident.serviceIdentifier,
        });
    };    
}