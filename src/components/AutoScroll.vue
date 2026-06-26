<template>
  <div
    ref="viewportRef"
    class="auto-scroll"
    :class="{ 'auto-scroll--horizontal': isHorizontal }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="trackRef"
      class="auto-scroll__track"
      :class="[
        directionClass,
        {
          'auto-scroll__track--active': shouldAnimate,
          'auto-scroll__track--paused': isPaused,
        },
      ]"
      :style="trackStyle"
    >
      <div ref="contentRef" class="auto-scroll__content">
        <slot />
      </div>
      <div
        v-if="shouldAnimate"
        class="auto-scroll__content auto-scroll__content--copy"
        aria-hidden="true"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

defineOptions({
  name: "AutoScroll",
});

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  classOption: {
    type: Object,
    default: () => ({}),
  },
});

const viewportRef = ref(null);
const contentRef = ref(null);
const contentSize = ref(0);
const viewportSize = ref(0);
const isHovered = ref(false);
let resizeObserver;

const direction = computed(() => Number(props.classOption.direction ?? 1));
const isHorizontal = computed(() => direction.value === 2 || direction.value === 3);
const itemCount = computed(() => props.data?.length ?? 0);
const limitMoveNum = computed(() => Number(props.classOption.limitMoveNum ?? 5));
const step = computed(() => Math.max(Number(props.classOption.step ?? 0.5), 0.1));
const hoverStop = computed(() => props.classOption.hoverStop !== false);

const shouldAnimate = computed(() => {
  return (
    itemCount.value >= limitMoveNum.value &&
    contentSize.value > viewportSize.value &&
    viewportSize.value > 0
  );
});

const isPaused = computed(() => hoverStop.value && isHovered.value);

const directionClass = computed(() => {
  const map = {
    0: "auto-scroll__track--down",
    1: "auto-scroll__track--up",
    2: "auto-scroll__track--left",
    3: "auto-scroll__track--right",
  };

  return map[direction.value] || map[1];
});

const duration = computed(() => {
  const pixelsPerSecond = step.value * 60;
  return Math.max(contentSize.value / pixelsPerSecond, 6);
});

const trackStyle = computed(() => ({
  "--auto-scroll-duration": `${duration.value}s`,
}));

function refreshSize() {
  nextTick(() => {
    const viewport = viewportRef.value;
    const content = contentRef.value;

    if (!viewport || !content) {
      return;
    }

    contentSize.value = isHorizontal.value ? content.scrollWidth : content.scrollHeight;
    viewportSize.value = isHorizontal.value ? viewport.clientWidth : viewport.clientHeight;
  });
}

function handleMouseEnter() {
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
}

watch(
  () => [props.data?.length, props.classOption],
  refreshSize,
  {
    deep: true,
    flush: "post",
  },
);

watch(isHorizontal, refreshSize);

onMounted(() => {
  refreshSize();

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(refreshSize);

    if (viewportRef.value) {
      resizeObserver.observe(viewportRef.value);
    }

    if (contentRef.value) {
      resizeObserver.observe(contentRef.value);
    }
  } else {
    window.addEventListener("resize", refreshSize);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  } else {
    window.removeEventListener("resize", refreshSize);
  }
});
</script>

<style scoped>
.auto-scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.auto-scroll__track {
  display: flex;
  flex-direction: column;
  min-width: 100%;
  will-change: transform;
}

.auto-scroll--horizontal .auto-scroll__track {
  flex-direction: row;
  width: max-content;
}

.auto-scroll__track--active.auto-scroll__track--up {
  animation: auto-scroll-up var(--auto-scroll-duration) linear infinite;
}

.auto-scroll__track--active.auto-scroll__track--down {
  animation: auto-scroll-down var(--auto-scroll-duration) linear infinite;
}

.auto-scroll__track--active.auto-scroll__track--left {
  animation: auto-scroll-left var(--auto-scroll-duration) linear infinite;
}

.auto-scroll__track--active.auto-scroll__track--right {
  animation: auto-scroll-right var(--auto-scroll-duration) linear infinite;
}

.auto-scroll__track--paused {
  animation-play-state: paused;
}

.auto-scroll__content {
  flex: 0 0 auto;
}

.auto-scroll--horizontal .auto-scroll__content {
  display: flex;
}

@keyframes auto-scroll-up {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, -50%, 0);
  }
}

@keyframes auto-scroll-down {
  from {
    transform: translate3d(0, -50%, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes auto-scroll-left {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes auto-scroll-right {
  from {
    transform: translate3d(-50%, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
</style>
