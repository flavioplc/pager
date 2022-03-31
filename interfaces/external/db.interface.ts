import Incident from "../../models/incident.model";

export default interface DBInterface {
    createIncident: (incident: Incident) => Promise<Incident>;
    editIncident: (incidentId: string, incident: Incident) => Promise<Incident>;
    getIncident: (incidentId: string) => Promise<Incident | undefined>;
    serviceHasOpenIncident: (serviceIdentifier: string) => Promise<boolean>;
}