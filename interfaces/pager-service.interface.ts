import Incident from "../models/incident.model"

export default interface pagerServiceInterface {
    solveServiceIncident: (incidentId: string) => Promise<Incident>;
    raiseServiceIncident: (serviceIdentifier: string, message: string) => Promise<Incident>;
    acknowledgeServiceIncident: (incidentId: string) => Promise<Incident>;
    serviceIncidentAlertTimout: (incidentId: string) => Promise<Incident>;
}