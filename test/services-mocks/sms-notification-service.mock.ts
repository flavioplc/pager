import SMSInterface from "../../interfaces/external/sms.interface";
import { EscalationPolicyTarget } from "../../models/external/escalation-policy-target.model";
import Incident from "../../models/incident.model";
export default class SMSNotificationServiceMock implements SMSInterface {
    async sendSMS(target: EscalationPolicyTarget, incident: Incident):Promise<any> {
        return Promise.resolve({
            phoneNumber: target.phoneNumber,
            message: incident.message,
            service: incident.serviceIdentifier,
        });
    };    
}