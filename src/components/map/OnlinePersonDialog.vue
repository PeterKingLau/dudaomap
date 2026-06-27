<template>
  <el-dialog
    title="实时在线的人员"
    :model-value="modelValue"
    width="520px"
    custom-class="zcLine onlinePersonDialog"
    class="onlinePersonDialog"
    center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="onlinePersonCard">
      <div class="onlinePersonCard__header">
        <span class="onlinePersonCard__dot"></span>
        <div>
          <strong>{{ displayName }}</strong>
          <p>人员实时在线</p>
        </div>
        <em>在线</em>
      </div>

      <div class="onlinePersonCard__list">
        <div class="onlinePersonCard__item">
          <span>
            <img src="../../assets/images/icon-online-name.png" alt="" />
          </span>
          <div>
            <label>姓名</label>
            <p>{{ displayName }}</p>
          </div>
        </div>
        <div class="onlinePersonCard__item">
          <span>
            <img src="../../assets/images/icon-online-phone.png" alt="" />
          </span>
          <div>
            <label>电话号码</label>
            <p>{{ person.tel || "--" }}</p>
          </div>
        </div>
        <div class="onlinePersonCard__item">
          <span>
            <img src="../../assets/images/icon-online-address.png" alt="" />
          </span>
          <div>
            <label>当前位置</label>
            <p>{{ person.adress || "--" }}</p>
          </div>
        </div>
      </div>

      <button
        class="onlinePersonCard__action"
        type="button"
        @click="emit('history')"
      >
        <img src="../../assets/images/icon-online-track.png" alt="" />
        <span>查看历史轨迹线</span>
      </button>
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
  person: {
    type: Object,
    default: () => ({}),
  },
  personName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "history"]);

const displayName = computed(() => {
  if (props.personName) {
    return props.personName;
  }

  if (!props.person.name || props.person.name === "noname") {
    return "未上传姓名";
  }

  return props.person.name;
});
</script>

<style lang="scss">
.onlinePersonDialog.el-dialog,
.onlinePersonDialog .el-dialog {
  border: 1px solid rgba(1, 236, 12, 0.28);
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8fff9 0%, #ffffff 48%);
  box-shadow: 0 16px 40px rgba(15, 80, 44, 0.26);
}

.onlinePersonDialog {
  .el-dialog__header {
    position: relative;
    margin: 0;
    padding: 18px 52px 12px;
    border-bottom: 1px solid rgba(1, 236, 12, 0.16);
  }

  .el-dialog__title {
    color: #137a2b;
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
      background: rgba(1, 236, 12, 0.1);
    }
  }

  .el-dialog__body {
    padding: 18px 24px 24px;
  }
}

.onlinePersonCard {
  color: #273849;
}

.onlinePersonCard__header {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  border: 1px solid rgba(1, 236, 12, 0.2);
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(1, 236, 12, 0.12),
    rgba(43, 151, 255, 0.08)
  );

  strong {
    display: block;
    color: #16492b;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
  }

  p {
    margin: 3px 0 0;
    color: #78908a;
    font-size: 13px;
    line-height: 18px;
  }

  em {
    min-width: 58px;
    padding: 5px 12px;
    border-radius: 4px;
    color: #03a91c;
    background: rgba(3, 216, 34, 0.12);
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    text-align: center;
  }
}

.onlinePersonCard__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #03d822;
  box-shadow: 0 0 0 5px rgba(3, 216, 34, 0.12);
}

.onlinePersonCard__list {
  margin-top: 14px;
  border: 1px solid rgba(1, 236, 12, 0.14);
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
}

.onlinePersonCard__item {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 12px;
  align-items: center;
  min-height: 64px;
  padding: 11px 16px;
  border-bottom: 1px solid rgba(1, 236, 12, 0.12);

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

.onlinePersonCard__action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 42px;
  margin-top: 14px;
  border: 1px solid rgba(1, 236, 12, 0.32);
  border-radius: 6px;
  color: #03a91c;
  background: rgba(1, 236, 12, 0.08);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  img {
    width: 22px;
    height: 22px;
  }

  &:hover {
    background: rgba(1, 236, 12, 0.16);
    box-shadow: 0 8px 18px rgba(1, 180, 35, 0.14);
    transform: translateY(-1px);
  }
}
</style>
