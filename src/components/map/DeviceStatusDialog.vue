<template>
  <el-dialog
    title="设备状态"
    :model-value="modelValue"
    width="520px"
    custom-class="zcLine deviceStatusDialog"
    class="deviceStatusDialog"
    center
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="deviceStatusCard">
      <div class="deviceStatusCard__header">
        <span class="deviceStatusCard__dot" :class="statusClass"></span>
        <div>
          <strong>{{ device.name || "未知设备" }}</strong>
          <p>设备运行状态</p>
        </div>
        <em class="deviceStatusCard__tag" :class="statusClass">
          {{ device.stat || "--" }}
        </em>
      </div>

      <div class="deviceStatusCard__list">
        <div class="deviceStatusCard__item">
          <span><img src="../../assets/images/icon-online-name.png" alt="" /></span>
          <div>
            <label>设备名称</label>
            <p>{{ device.name || "--" }}</p>
          </div>
        </div>
        <div class="deviceStatusCard__item">
          <span><img src="../../assets/images/icon-online-address.png" alt="" /></span>
          <div>
            <label>所在位置</label>
            <p>{{ device.add || "--" }}</p>
          </div>
        </div>
        <div class="deviceStatusCard__item">
          <span><img src="../../assets/images/icon-online-phone.png" alt="" /></span>
          <div>
            <label>当前状态</label>
            <p>{{ device.stat || "--" }}</p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  device: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["update:modelValue"]);

const statusClass = computed(() => {
  if (props.device.stat === "故障") {
    return "is-error";
  }

  if (props.device.stat === "离线") {
    return "is-offline";
  }

  return "is-normal";
});
</script>

<style lang="scss">
.deviceStatusDialog.el-dialog,
.deviceStatusDialog .el-dialog {
  border: 1px solid rgba(30, 144, 255, 0.28);
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 44%);
  box-shadow: 0 16px 40px rgba(15, 44, 80, 0.28);
}

.deviceStatusDialog {
  .el-dialog__header {
    position: relative;
    margin: 0;
    padding: 18px 52px 12px;
    border-bottom: 1px solid rgba(41, 151, 255, 0.16);
  }

  .el-dialog__title {
    color: #1f5f96;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .el-dialog__headerbtn {
    top: 15px;
    right: 18px;
    width: 30px;
    height: 30px;
    border-radius: 4px;

    &:hover {
      background: rgba(43, 151, 255, 0.1);
    }
  }

  .el-dialog__body {
    padding: 18px 24px 24px;
  }
}

.deviceStatusCard {
  color: #273849;
}

.deviceStatusCard__header {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  border: 1px solid rgba(54, 161, 255, 0.18);
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(43, 151, 255, 0.1),
    rgba(1, 236, 12, 0.06)
  );

  strong {
    display: block;
    color: #183a5a;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
  }

  p {
    margin: 3px 0 0;
    color: #7a8b9a;
    font-size: 13px;
    line-height: 18px;
  }
}

.deviceStatusCard__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #03d822;
  box-shadow: 0 0 0 5px rgba(3, 216, 34, 0.12);

  &.is-error {
    background: #f04747;
    box-shadow: 0 0 0 5px rgba(240, 71, 71, 0.12);
  }

  &.is-offline {
    background: #8b98a8;
    box-shadow: 0 0 0 5px rgba(139, 152, 168, 0.14);
  }
}

.deviceStatusCard__tag {
  min-width: 58px;
  padding: 5px 12px;
  border-radius: 4px;
  color: #03a91c;
  background: rgba(3, 216, 34, 0.12);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  text-align: center;

  &.is-error {
    color: #d93636;
    background: rgba(240, 71, 71, 0.12);
  }

  &.is-offline {
    color: #6f7d8e;
    background: rgba(139, 152, 168, 0.14);
  }
}

.deviceStatusCard__list {
  margin-top: 14px;
  border: 1px solid rgba(54, 161, 255, 0.14);
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.86);
}

.deviceStatusCard__item {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 12px;
  align-items: center;
  min-height: 64px;
  padding: 11px 16px;
  border-bottom: 1px solid rgba(54, 161, 255, 0.12);

  &:last-child {
    border-bottom: 0;
  }

  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 6px;
    background: rgba(1, 236, 12, 0.1);

    > img {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }
  }

  label {
    display: block;
    color: #7b8b9b;
    font-size: 13px;
    line-height: 18px;
  }

  p {
    margin: 3px 0 0;
    color: #263747;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    word-break: break-all;
  }
}
</style>
