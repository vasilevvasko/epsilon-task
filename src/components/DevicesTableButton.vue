<template>
  <button v-if="!isDone"
      class="device-table-button"
      :class="{
               'active-button-background': isPositiveButton,
               'negative-button-background': !isPositiveButton,
               'reserved-button': isReserved}"
      @click="buttonClick"
  >{{ tableAction }}</button>
</template>

<script>
import { computed } from "vue";
import { PortAction, JobAction } from "@/types/Device";


export default {
  name: "DevicesTableButton",
  emits: ['openPopup', 'completeJob', 'createDisconnectJob'],
  props: {
    tableAction: {
      type: String,
      required: false,
      default: null
    },
    tableIndex: {
      type: Number,
      required: true
    },
    deviceIndex: {
      type: Number,
      required: false,
      default: 0
    },
    item: {
      type: Object,
      required: false,
      default: null
    }
  },
  setup(props, { emit }) {

    const isPositiveButton = computed(() => props.tableAction === PortAction.CONNECT || props.tableAction === JobAction.COMPLETE)
    const isReserved = computed(() => props.tableAction === PortAction.REVERSED)
    const isDone = computed(() => props.tableAction === '')

    const buttonClick = computed(() => {
      switch(props.tableAction) {
        case PortAction.CONNECT:
          return () => emit('openPopup', [props.deviceIndex, props.tableIndex]);
        case PortAction.DISCONNECT:
          return () => emit("createDisconnectJob", props.item.cable);
        case JobAction.COMPLETE:
          return () => emit('completeJob', props.item);
        default:
          return () => {};
      }
    });

    return {
      isPositiveButton,
      isReserved,
      isDone,
      buttonClick
    }
  }
}
</script>

<style scoped>
.device-table-button {
  height: 25px;
  border: none;
  color: white;
  cursor: pointer;

}
.no-background {
  background-color: inherit;
}
.active-button-background {
  background-color: #8fd14c;
}
.negative-button-background {
  background-color: #f24626;
}
.reserved-button {
  background-color: inherit;
  font-style: italic;
  color: #000000;
  cursor: unset;
}
</style>