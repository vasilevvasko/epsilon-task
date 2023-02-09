export class Device {
    public deviceName: string;
    constructor(name: string) {
        this.deviceName = name;
    }
}

export class Port extends Device {
    name: string;
    connectedTo: string | null;
    cable: string | null;
    action: PortAction;

    constructor(name: string, deviceName: string) {
        super(deviceName);
        this.name = name;
        this.connectedTo = null;
        this.cable = null;
        this.action = PortAction.CONNECT;
    }

    connectToPort(port: string, cable: string) {
        this.cable = cable;
        this.connectedTo = port;
        this.action = PortAction.DISCONNECT;
    }

    disconnectPort() {
        this.connectedTo = null;
        this.cable = null;
        this.action = PortAction.CONNECT;
    }

    reserve() {
        this.action = PortAction.REVERSED
    }
}

export class Job {
    type: JobType;
    from: Port;
    to: Port;
    status: JobStatus;
    action: JobAction;

    constructor(type: JobType, from: Port, to: Port) {
       this.type = type;
       this.from = from;
       this.to = to;
       this.status = JobStatus.PENDING;
       this.action = JobAction.COMPLETE;
    }

    completeConnectJob(cable: Cable, firstPort: string, secondPort: string) {
        this.to.connectToPort(firstPort, cable.name);
        this.from.connectToPort(secondPort, cable.name);
        this.action = JobAction.DONE;
        this.status = JobStatus.COMPLETED;
    }

    completeDisconnectJob() {
        this.to.disconnectPort();
        this.from.disconnectPort();
        this.action = JobAction.DONE;
        this.status = JobStatus.COMPLETED;
    }
}

export class Cable {
    name: string;
    from: Port;
    to: Port;

    constructor(name: string, from: Port, to: Port) {
        this.name = name;
        this.from = from;
        this.to = to;
    }
}

export enum PortAction { CONNECT = "Connect", DISCONNECT = "Disconnect", REVERSED = "Reversed" }
export enum JobType { CONNECT = "Connect", DISCONNECT = "Disconnect" }
export enum JobStatus { COMPLETED = "Completed", PENDING = "Pending" }
export enum JobAction { COMPLETE = "Complete", DONE = "" }

