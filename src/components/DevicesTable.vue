<template>
  <div>
    <h1 :style="cssStyles" class="table-title" :key="data[0]" >{{ title }}</h1>
    <table class="device-table">
      <tr>
        <th :style="cssStyles"
            class="table-header-cell table-cell"
            v-for="(value, name, index) in data[0]">
          <template v-if="name !== 'deviceName'">
            {{ camelCaseToTitle(name) }}
          </template>
        </th>
      </tr>
      <tr v-for="(value, index) in data">
        <td :style="cssStyles" class="table-cell" v-for="(_value, _name) in value">
          <!--PORT CELLS-->
          <div v-if="_name === 'to' || _name === 'from'">
            {{ _value.deviceName + '-' + _value.name }}
          </div>
          <!--REGULAR CELLS-->
          <div v-else-if="_name !== 'action' && _name !== 'deviceName'"
               :class="{
               'pending-cell-background': _value === 'Pending',
               'completed-cell-background': _value === 'Completed' }">
            {{ _value }}
          </div>
          <slot v-else-if="_name === 'action'"
                name="actionButton"
                :value="value"
                :tableIndex="index"
                :tableAction="_value"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { camelCaseToTitle } from "@/utils/utils";
import { computed } from "vue";
import DevicesTableButton from "@/components/DevicesTableButton";
import DevicesTablePopup from "@/components/DevicesTablePopup";

export default {
  name: "DevicesTable",
  components: { DevicesTablePopup, DevicesTableButton },
  props: {
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    titleColor: {
      type: String,
      required: false,
      default: "#000000"
    },
    titleBackground: {
      type: String,
      required: false,
      default: "#0055CC"
    },
    cellColor: {
      type: String,
      required: false,
      default: "#0099CC"
    }
  },
  setup(props) {

    const cssStyles = computed(() => {
      return {
        '--title-color': props.titleColor,
        '--title-background': props.titleBackground,
        '--cell-color': props.cellColor,
      }
    });

    return {
      cssStyles,
      camelCaseToTitle
    }
  }
}
</script>

<style scoped>
.device-table {
  width: 100%;
}
.table-title {
  font-size: 18px;
  background-color: var(--title-background);
  color: var(--title-color)
}
.table-cell {
  height: 45px;
  background-color: var(--cell-color);
  position: relative;
}
.table-header-cell {
  height: 25px;
}
.pending-cell-background {
  background-color: #FDE287;
  line-height: 45px;
}
.completed-cell-background {
  background-color: #C8E8A7;
  line-height: 45px;
}
</style>