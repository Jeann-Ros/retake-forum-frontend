<template>
  <select
    id="pais"
    class="form-input"
    :value="selectedValue"
    :disabled="loading"
    required
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option value="">
      {{ loading ? "Carregando países..." : "Selecione seu país" }}
    </option>

    <option
      v-for="country in countries"
      :key="country.value"
      :value="country.value"
    >
      {{ country.label }}
    </option>
  </select>
</template>

<script>
import apiService from "../services/apiService";

export default {
  name: "CountrySelect",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      countries: [],
      loading: false,
    };
  },
  computed: {
    selectedValue() {
      const country = this.findCountry(this.modelValue);
      return country ? country.value : this.modelValue;
    },
  },
  watch: {
    modelValue() {
      this.normalizeCountry();
    },
    countries() {
      this.normalizeCountry();
    },
  },
  async mounted() {
    await this.loadCountries();
  },
  methods: {
    async loadCountries() {
      try {
        this.loading = true;
        this.countries = await apiService.getCountries();
      } catch (error) {
        console.error("Erro ao carregar países:", error);
        this.countries = [];
      } finally {
        this.loading = false;
      }
    },
    findCountry(value) {
      if (!value) {
        return null;
      }

      return this.countries.find(
        (country) => country.value === value || country.label === value,
      );
    },
    normalizeCountry() {
      const country = this.findCountry(this.modelValue);

      if (country && country.value !== this.modelValue) {
        this.$emit("update:modelValue", country.value);
      }
    },
  },
};
</script>
