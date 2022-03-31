import EscalationPolicyInterface from "../../interfaces/external/escalation-policy.interface";
import EscalationPolicyLevel from "../../models/external/escalation-policy-level.model";
import { EscalationPolicyTarget, TargetType } from "../../models/external/escalation-policy-target.model";
import EscalationPolicy from "../../models/external/escalation-policy.model";


export default class EscalationPolicyServiceMock implements EscalationPolicyInterface {
    private EPServiceMap: Map<string, EscalationPolicy>

    constructor() {
        const target1 = new EscalationPolicyTarget(TargetType.Email, 'target1@test');
        const target2 = new EscalationPolicyTarget(TargetType.SMS, '',"02020202020");
        const target3 = new EscalationPolicyTarget(TargetType.SMS, '',"03030303030");

        const ep1 = new EscalationPolicyLevel(1, [target1, target2]);
        const ep2 = new EscalationPolicyLevel(2, [target3]);
        const ep3 = new EscalationPolicyLevel(1, [target1]);


        this.EPServiceMap.set('service_1', new EscalationPolicy('service_1', [ep1, ep2]));
        this.EPServiceMap.set('service_2', new EscalationPolicy('service_1', [ep3, ep2]));

    }
    async getEscalationPolicyByService(serviceIdentifier: string):Promise<EscalationPolicy> {
        return Promise.resolve(this.EPServiceMap.get(serviceIdentifier));
    };
    async getEscalationPolicyTargets(serviceIdentifier: string, level: number):Promise<Array<EscalationPolicyTarget>> {
        const EP = this.EPServiceMap.get(serviceIdentifier);
        const [EPLevel] = EP.levels.filter((epl) => epl.level === level);

        return EPLevel.targets;
    };
}