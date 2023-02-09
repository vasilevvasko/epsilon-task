<template>
  <div :style="cssStyles" class="devices-table-popup">
    <label class="devices-table-popup-label">PORT</label>
    <select :disabled="!availablePorts.length"
            class="devices-table-popup-select"
            v-model="selectedPort"
            :style="cssStyles"
            @change="portSelected(selectedPort)">
      <option v-for="availablePort in availablePorts"
              :value="availablePort.port">
        {{ availablePort.fullPortName }}
      </option>
    </select>
  </div>

</template>

<script>
import { computed, inject, ref } from "vue";
import { Port, PortAction } from "@/types/Device";

export default {
  name: "DevicesTablePopup",
  emits: ['portSelected'],
  props: {
    background: {
      type: String,
      required: false,
      default: "#0055CC"
    },
    currentDevice: {
      type: String,
      required: true
    },
    currentPort: {
      type: Port,
      required: true
    }
  },
  setup(props, {emit}) {
    const devices = inject('devices');

    const selectedPort = ref('Select port');
    const availablePorts = [];

    devices.value.filter(device => device[0].deviceName !== props.currentDevice).forEach(device => {
      device.forEach(port => {
        if (port.action === PortAction.CONNECT) {
          availablePorts.push({fullPortName: port.deviceName + "-" + port.name, port: port})
        }
      })
    });

    const portSelected = () => {
      emit('portSelected', props.currentPort, selectedPort.value);
    }

    const cssStyles = computed(() => {
      return {
        'background-color': props.background,
      }
    });

    return {
      devices,
      availablePorts,
      selectedPort,
      cssStyles,
      portSelected
    }
  }
}
</script>

<style scoped>
.devices-table-popup {
  position: absolute;
  top: 0;
  width: 100%;
  background-color: var(background-color);
  height: 30px;
  margin-top: 5px;
}
.devices-table-popup-label {
  position: absolute;
  font-weight: bold;
  top: 5px;
  right: 55px;
  color: black;
}

.devices-table-popup-select {
  padding: 0.5rem;
  border: none;
  width: 100px;
}
</style>