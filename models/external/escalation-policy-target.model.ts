export enum TargetType {
    SMS,
    Email,
}
export class EscalationPolicyTarget {
    targetType: TargetType;
    phoneNumber?: string;
    email?: string;

    constructor (targetType: TargetType, email?: string, phoneNumber?: string) {
        this.targetType = targetType;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}