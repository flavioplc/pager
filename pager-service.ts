import Incident from "./models/incident.model";
import { EscalationPolicyTarget, TargetType } from "./models/external/escalation-policy-target.model";

import PagerServiceInterface from "./interfaces/pager-service.interface";
import DBInterface from "./interfaces/external/db.interface"
import EscalationPolicyInterface from "./interfaces/external/escalation-policy.interface";
import SMSInterface from "./interfaces/external/sms.interface";
import EmailInterface from "./interfaces/external/email.interface";
import EscalationTimoutInterface from "./interfaces/external/timeout.interface";

const alertEscalationTimoutDuration = 60 * 15;

export class PagerService implements PagerServiceInterface {
    persistanceDB: DBInterface;
    escalationPolicyService: EscalationPolicyInterface;
    smsNotificationService: SMSInterface;
    emailNotificationService: EmailInterface;
    timoutService: EscalationTimoutInterface;

    constructor (
     persistanceDB: DBInterface,
     escalationPolicyService: EscalationPolicyInterface,
     timoutService: EscalationTimoutInterface,
    ){
        this.persistanceDB = persistanceDB;
        this.escalationPolicyService = escalationPolicyService;
        this.timoutService = timoutService;
    }
    async solveServiceIncident(incidentId: string):Promise<Incident> {
        const incident = await this.persistanceDB.getIncident(incidentId);

        if (!incident || incident.solvedAt) {
            throw new Error(`No active incident on service ${incident.serviceIdentifier}`);
        }

        incident.solve();
        await Promise.all([
            this.persistanceDB.editIncident(incidentId, incident),
            this.timoutService.resetAlertTimout(incidentId)
        ]);

        return incident;
    };
    async acknowledgeServiceIncident(incidentId: string):Promise<Incident> {
        const incident = await this.persistanceDB.getIncident(incidentId);

        if (!incident || incident.solvedAt) {
            throw new Error(`No active incident on service ${incident.serviceIdentifier}`);
        }

        incident.acknowledge();

        await Promise.all([
            this.persistanceDB.editIncident(incidentId, incident),
            this.timoutService.resetAlertTimout(incidentId)
        ]);

        return incident;
    };
    async serviceIncidentAlertTimout(incidentId: string):Promise<Incident> {
        const incident = await this.persistanceDB.getIncident(incidentId);

        if (!incident || incident.solvedAt) {
            this.timoutService.resetAlertTimout(incidentId);

            return incident;
        }

        incident.escalate();

        const targets = await this.escalationPolicyService.getEscalationPolicyTargets(incident.serviceIdentifier, incident.lastEscalationLevel);

        await Promise.all(targets.map((target) => this.sendAlert(incident, target)));
        await this.timoutService.setAlertTimout(alertEscalationTimoutDuration, incident.id);
    };
        
    async raiseServiceIncident(serviceIdentifier: string, message: string): Promise<Incident> {

        const alreadyRaisedIncident = await this.persistanceDB.serviceHasOpenIncident(serviceIdentifier);

        if (alreadyRaisedIncident) {
            throw new Error(`Incident on service ${serviceIdentifier} as already been declared`);
        }

        const escalationPolicy = await this.escalationPolicyService.getEscalationPolicyByService(serviceIdentifier);

        if (!escalationPolicy) {
            throw new Error(`Missing escalation policy for service ${serviceIdentifier}`);
        }

        const incident = new Incident(serviceIdentifier, message, escalationPolicy);

        try {
            await this.persistanceDB.createIncident(incident);
        } catch (err) {
            console.error(`Error while saving  for service ${serviceIdentifier}`);
        }

        const targets = await this.escalationPolicyService.getEscalationPolicyTargets(serviceIdentifier, incident.lastEscalationLevel);

        await Promise.all(targets.map((target) => this.sendAlert(incident, target)));
        await this.timoutService.setAlertTimout(alertEscalationTimoutDuration, incident.id);

        return incident;
    }

    private async sendAlert(incident: Incident, target: EscalationPolicyTarget): Promise<void> {
        const interfaceTypeMapper = {
            [TargetType.SMS]: this.smsNotificationService.sendSMS,
            [TargetType.Email]: this.emailNotificationService.sendEmail,
        };

        await interfaceTypeMapper[target.targetType](target, incident);
    }
}
