<template>
  <div class="device-table-wrapper">
      <div class="device-table-column">
        <template v-for="(device, index) in devices">
          <DevicesTable
              v-if="index % 2 === 0"
              :title="'DEVICE ' + device[0].deviceName"
              :data="device"
              title-color="#FFFFFF"
              title-background="#8456C1"
              cell-color="#EEE8F7">
            <template #actionButton="{ value, tableIndex, tableAction }">
              <DevicesTableButton
                  :item="value"
                  :tableIndex="tableIndex"
                  :deviceIndex="index"
                  :tableAction="tableAction"
                  @openPopup="openPopup"
                  @createDisconnectJob="disconnectPortsJob"/>
              <DevicesTablePopup
                  v-if="currentOpenPopup[0] === index && currentOpenPopup[1] === tableIndex"
                  background="#EEE8F7"
                  :currentDevice="value.deviceName"
                  :currentPort="value"
                  @portSelected="connectPortsJob" />
            </template>
          </DevicesTable>
        </template>
      </div>
      <div class="device-table-column">
        <template v-for="(device, index) in devices">
          <DevicesTable
              v-if="index % 2 !== 0"
              :title="'DEVICE ' + device[0].deviceName"
              :data="device"
              title-color="#FFFFFF"
              title-background="#8456C1"
              cell-color="#EEE8F7">
            <template #actionButton="{ value, tableIndex, tableAction }">
              <DevicesTableButton
                  :item="value"
                  :tableIndex="tableIndex"
                  :deviceIndex="index"
                  :tableAction="tableAction"
                  @openPopup="openPopup"
                  @createDisconnectJob="disconnectPortsJob"/>
              <DevicesTablePopup
                  v-if="currentOpenPopup[0] === index && currentOpenPopup[1] === tableIndex"
                  background="#EEE8F7"
                  :currentDevice="value.deviceName"
                  :currentPort="value"
                  @portSelected="connectPortsJob" />
            </template>
          </DevicesTable>
        </template>
      </div>
  </div>
  <div class="jobs-and-cables-wrapper">
    <DevicesTable
        style="width: 59%;"
        title="JOBS"
        :data="jobs"
        :key="jobs"
        title-color="#000000"
        title-background="#9FEBEE"
        cell-color="#E6FBFC">
      <template #actionButton="{ value, tableIndex, tableAction, }">
        <DevicesTableButton
            :item="value"
            :tableIndex="tableIndex"
            :tableAction="tableAction"
            @completeJob="completeDeviceJob"/>
      </template>
    </DevicesTable>
    <DevicesTable
        style="width: 39%;"
        title="Connected cables"
        :data="connectedCables"
        title-color="#000000"
        title-background="#EAF4B3"
        cell-color="#FCFDEB">
      <template #actionButton="{ value, tableIndex, tableAction }">
        <DevicesTableButton
            :item="value"
            :tableIndex="tableIndex"
            :tableAction="tableAction"/>
      </template>
    </DevicesTable>
  </div>
</template>

<script>
import { Cable, Job, JobType, Port } from "@/types/Device";
import DevicesTable from "@/components/DevicesTable";
import DevicesTableButton from "@/components/DevicesTableButton";
import DevicesTablePopup from "@/components/DevicesTablePopup";
import { provide, ref } from "vue";

export default {
  name: "DeviceOverview",
  components: { DevicesTable, DevicesTableButton, DevicesTablePopup },
  setup() {
    const jobs = ref([]);
    const connectedCables = ref([]);
    const devices = ref([[new Port('P1','ABC1'), new Port('P2','ABC1')],
                     [new Port('P1','XYZ9'), new Port('P2','XYZ9'),
                      new Port('P3','XYZ9'), new Port('P4','XYZ9')],
                     [new Port('P1','MNL5'), new Port('P2','MNL5')]])

    const connectPortsJob = (port1, port2) => {
      currentOpenPopup.value = [-1, -1];
      port1.reserve();
      port2.reserve();
      const newJob = new Job(JobType.CONNECT, port1, port2);
      jobs.value.push(newJob);
    }

    const disconnectPortsJob = (cable) => {
      currentOpenPopup.value = [-1, -1];
      const connectedCable = connectedCables.value.find(temp => temp.name === cable);
      connectedCable.from.reserve();
      connectedCable.to.reserve();
      const newJob = new Job(JobType.DISCONNECT, connectedCable.from, connectedCable.to);
      jobs.value.push(newJob);
    }

    const completeDeviceJob = (job) => {
      if (job.type === JobType.CONNECT) {
        const firstPort = job.from.deviceName + '-' + job.from.name;
        const secondPort = job.to.deviceName + '-' + job.to.name;
        const cable = new Cable(firstPort + '-' + secondPort, job.from, job.to)
        job.completeConnectJob(cable, firstPort, secondPort);
        connectedCables.value.push(cable);
      } else {
        const cable = job.from.cable;
        job.completeDisconnectJob();
        const connectedCableIndex = connectedCables.value.findIndex(temp => temp.name === cable);
        connectedCables.value.splice(connectedCableIndex, 1);
      }
    }

    const currentOpenPopup = ref([-1, -1]);

    const openPopup = (index) => {
      currentOpenPopup.value = index;
    }

    provide('devices', devices);

    return {
      devices,
      jobs,
      connectedCables,
      currentOpenPopup,
      connectPortsJob,
      disconnectPortsJob,
      completeDeviceJob,
      openPopup
    }
  }
}
</script>

<style scoped>
.device-table-wrapper {
  display: grid;
  grid-template-columns: 600px 600px;
  grid-row: auto;
  grid-column-gap: 60px;
  width: fit-content;
  margin: auto;
  padding-bottom: 7rem;
  border-bottom: 2px lightgray solid;
}
.device-table-column {
  display: flex;
  flex-direction: column;
  grid-row-gap: 40px;
}
.jobs-and-cables-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  grid-column-gap: 60px;
  justify-content: space-between;
  max-width: 1260px;
  margin: 5rem auto auto auto;
}
</style>