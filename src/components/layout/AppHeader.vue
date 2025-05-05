<template>
  <div class="header-group">
    <div class="logo-section">
      <img class="logo" alt="Logo" :src="PicaaiPhotoroom1" />
      <div class="header-text">
        <h1 class="title">
          ЦИФРОВОЙ РЕГИСТР ПАЦИЕНТОВ<br />
          ЦЕНТРА ИЛИЗАРОВА
        </h1>
        <p class="institution-info">
          Федеральное государственное бюджетное учреждение<br />
          «Национальный медицинский исследовательский центр<br />
          травматологии и ортопедии имени академика Г.А. Илизарова»<br />
          Министерства здравоохранения Российской Федерации
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import PicaaiPhotoroom1 from "@/assets/2025-03-10_18-35-17-picaai-Photoroom-1.png";

export default {
  name: "AppHeader",
  data() {
    return {
      PicaaiPhotoroom1
    };
  }
};
</script>

<style scoped>
.header-group {
  width: 100%;
  display: flex;
  justify-content: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 30px;
  max-width: 900px;
  flex-wrap: wrap;
  justify-content: center;
}

.logo {
  height: 230px;
  width: auto;
  margin-left: 15px;
}

.header-text {
  text-align: center;
  max-width: 600px;
}

.title {
  color: rgba(0, 0, 0, 0.7);
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.institution-info {
  color: #000000;
  font-size: 16px;
  font-weight: 100;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .logo-section {
    flex-direction: column;
    text-align: center;
  }
  
  .logo {
    height: 180px;
    margin-bottom: 20px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .institution-info {
    font-size: 14px;
  }
}
</style> 