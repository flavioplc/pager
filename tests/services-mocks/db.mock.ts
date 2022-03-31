import DBInterface from "../../interfaces/external/db.interface"
import Incident from "../../models/incident.model";

export default class Database implements DBInterface {
    private incidentList: Map<string, Incident>

    constructor() {
        this.incidentList = new Map<string, Incident>() ;
    }

    async createIncident(incident: Incident):Promise<Incident>{
        this.incidentList.set(incident.id, incident);
        
        return Promise.resolve(incident);
    };
    async editIncident(incidentId: string, incident: Incident):Promise<Incident> {
        this.incidentList.delete(incidentId);
        this.incidentList.set(incidentId, incident);

        return Promise.resolve(incident);
    }
    async getIncident(incidentId: string):Promise<Incident> {
        return this.incidentList.get(incidentId);
    };
    async serviceHasOpenIncident(serviceIdentifier: string):Promise<boolean> {
        for (const [id, incident] of this.incidentList) {
            if (incident.serviceIdentifier === serviceIdentifier && !incident.acknowledgedAt) {
                return true
            }
        }
        return false;
    };
}