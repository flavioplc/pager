import { PagerService } from "../pager-service";
import DBMock from "./services-mocks/db.mock";
import EmailNotificationServiceMock from "./services-mocks/email-notification-service.mock";
import SMSNotificationServiceMock from "./services-mocks/sms-notification-service.mock";
import EscalationPolicyServiceMock from "./services-mocks/escalation-policy-service.mock";
import TimoutServiceMock from "./services-mocks/timout-service.mock";
import { expect } from "chai";

function makepagerService(): PagerService {
    const pagerService = new PagerService(
        new DBMock,
        new EscalationPolicyServiceMock,
        new TimoutServiceMock,
        new SMSNotificationServiceMock,
        new EmailNotificationServiceMock
    )

    return pagerService;
}

describe('Pager Service Test Suite', () => {
    const pagerService: PagerService = makepagerService();
    let incidentId = '';

    it('Should return incident when raised', async () => {
        const response = await pagerService.raiseServiceIncident('service_1', 'Something wrong');
        incidentId = response.id;

        expect(response.serviceIdentifier).to.equal('service_1');
    });

    it('Incident level should increase when alert timeout', async () => {
        const response = await pagerService.serviceIncidentAlertTimout(incidentId)

        expect(response.lastEscalationLevel).to.equal(2);
    });

    it('Incident Should be acknowledged ', async () => {
        const response = await pagerService.acknowledgeServiceIncident(incidentId)

        expect(response.acknowledgedAt).not.to.be.undefined;
    });

    it('Incident Should be solved ', async () => {
        const response = await pagerService.solveServiceIncident(incidentId)

        expect(response.solvedAt).not.to.be.undefined;
    });
    it('Late acknowledgement Timeout should not trigger any message', async () => {
        const response = await pagerService.raiseServiceIncident('service_2', 'Something wrong');
        const { lastEscalationLevel, id } = response;
        await pagerService.acknowledgeServiceIncident(id);
        const response2 = await pagerService.serviceIncidentAlertTimout(id)

        expect(response2.lastEscalationLevel).to.equal(lastEscalationLevel);
    });

})