<template>
  <section class="banner-carousel">
    <Carousel
      :items-to-show="1"
      :wrap-around="true"
      :autoplay="3500"
      :pause-autoplay-on-hover="true"
      class="carousel-container"
    >
      <Slide v-for="banner in banners" :key="banner.title">
        <div class="banner-slide">
          <img class="banner-image" :src="banner.src" :alt="banner.title" />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </section>
</template>

<script>
import { Carousel, Slide, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import furiaImage from "../assets/furia.png";
import loudImage from "../assets/loud.png";
import painImage from "../assets/pain.png";

export default {
  name: "HomeBannerCarousel",
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  data() {
    return {
      banners: [
        {
          src: furiaImage,
        },
        {
          src: loudImage,
        },
        {
          src: painImage,
        },
      ],
    };
  },
};
</script>

<style scoped>
.carousel-container {
  border-radius: 8px;
  overflow: hidden;
}

.banner-carousel {
  margin-bottom: 32px;
}

.banner-slide {
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.banner-title {
  position: absolute;
  bottom: 20px;
  left: 20px;
  margin: 0;
  color: white;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 16px;
  border-radius: 999px;
}

.banner-carousel :deep(.carousel__prev),
.banner-carousel :deep(.carousel__next) {
  color: white;
  width: 44px;
  height: 44px;
}

.banner-carousel :deep(.carousel__icon) {
  width: 32px;
  height: 32px;
}

@media (max-width: 640px) {
  .banner-slide {
    height: 180px;
  }

  .banner-title {
    font-size: 18px;
    letter-spacing: 0.12em;
    bottom: 16px;
    left: 16px;
    padding: 8px 12px;
  }
}
</style>
