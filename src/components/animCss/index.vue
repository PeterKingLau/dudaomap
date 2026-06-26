<template>
  <div class="queryLoadingCard">
    <div class="queryLoadingCard__spinner">
      <span></span>
    </div>
    <strong>{{ textLoad || "正在加载数据请稍后" }}</strong>
    <p>请稍候，正在同步查询结果</p>
  </div>
</template>
<script setup>
defineProps({
  textLoad: {
    type: String,
    default: "",
  },
});

</script>

<style lang="scss">
.queryLoadingCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 260px;
  min-height: 170px;
  margin: auto;
  padding: 24px 28px;
  border: 1px solid rgba(1, 236, 12, 0.22);
  border-radius: 8px;
  background: linear-gradient(180deg, #f8fff9 0%, #ffffff 58%);
  box-shadow: 0 16px 40px rgba(15, 80, 44, 0.24);
  box-sizing: border-box;

  strong {
    margin-top: 14px;
    color: #16492b;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    text-align: center;
  }

  p {
    margin: 6px 0 0;
    color: #78908a;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
  }
}

.queryLoadingCard__spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(1, 236, 12, 0.1);

  span {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(3, 216, 34, 0.18);
    border-top-color: #03d822;
    border-radius: 50%;
    animation: query-loading-spin 0.9s linear infinite;
  }
}

@keyframes query-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
