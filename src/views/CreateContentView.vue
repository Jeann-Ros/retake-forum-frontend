<template>
  <div class="create-page">
    <AppHeader />

    <main class="create-container">
      <BackButton @click="goBack" />

      <div class="create-card">
        <div class="create-header">
          <div>
            <p class="page-pretitle">Criação</p>
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>

          <span class="content-badge">
            {{ contentTypeLabel }}
          </span>
        </div>

        <form @submit.prevent="handleSubmit" class="create-form">
          <div class="form-group">
            <label for="titulo" class="form-label">
              {{ tituloLabel }}
            </label>

            <input
              id="titulo"
              v-model="titulo"
              type="text"
              class="form-input"
              :placeholder="tituloPlaceholder"
              :required="isNoticia"
            />
          </div>

          <div v-if="isNoticia" class="form-group">
            <label for="evento" class="form-label">Evento</label>

            <input
              id="evento"
              v-model="evento"
              type="text"
              class="form-input"
              placeholder="Ex: Major, torneio, patch"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Conteúdo</label>

            <div class="editor-toolbar">
              <button
                type="button"
                :class="['toolbar-btn', { active: activeToolbar.bold }]"
                :aria-pressed="activeToolbar.bold"
                @click="toggleBold"
              >
                Negrito
              </button>

              <button
                type="button"
                :class="['toolbar-btn', { active: activeToolbar.italic }]"
                :aria-pressed="activeToolbar.italic"
                @click="toggleItalic"
              >
                Itálico
              </button>

              <button
                type="button"
                :class="['toolbar-btn', { active: activeToolbar.link }]"
                :aria-pressed="activeToolbar.link"
                @click="openLinkModal"
              >
                Link
              </button>

              <button type="button" class="toolbar-btn" @click="openImageModal">
                Imagem
              </button>

              <button
                type="button"
                :class="['toolbar-btn', { active: activeToolbar.alignLeft }]"
                :aria-pressed="activeToolbar.alignLeft"
                @click="setTextAlign('left')"
              >
                Esquerda
              </button>

              <button
                type="button"
                :class="['toolbar-btn', { active: activeToolbar.alignCenter }]"
                :aria-pressed="activeToolbar.alignCenter"
                @click="setTextAlign('center')"
              >
                Centro
              </button>

              <button
                type="button"
                :class="['toolbar-btn', { active: activeToolbar.alignRight }]"
                :aria-pressed="activeToolbar.alignRight"
                @click="setTextAlign('right')"
              >
                Direita
              </button>
            </div>

            <EditorContent :editor="editor" class="editor-content" />
          </div>

          <FeedbackMessage :message="errorMessage" type="error" />

          <FeedbackMessage :message="successMessage" type="success" />

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? "Enviando..." : "Publicar" }}
            </button>

            <button type="button" class="btn btn-secondary" @click="goBack">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>

    <CreateOptionsModal
      :open="isModalOpen"
      :option="modalType"
      @close="closeModal"
      @submit="handleModalSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onBeforeUnmount } from "vue";

import { useRoute, useRouter } from "vue-router";

import { useEditor, EditorContent } from "@tiptap/vue-3";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

import AppHeader from "../components/AppHeader.vue";
import BackButton from "../components/BackButton.vue";
import CreateOptionsModal from "../components/CreateOptionsModal.vue";
import FeedbackMessage from "../components/FeedbackMessage.vue";

import authService from "../services/authService";
import apiService from "../services/apiService";

const route = useRoute();
const router = useRouter();

const user = ref(authService.getUser());

const tipo = computed(() => {
  const param = String(route.params.tipo || "post");

  return param === "noticia" ? "noticia" : "post";
});

const titulo = ref("");
const evento = ref("");

const errorMessage = ref("");
const successMessage = ref("");

const loading = ref(false);

const isModalOpen = ref(false);
const modalType = ref("link");
const activeToolbar = ref({
  bold: false,
  italic: false,
  link: false,
  alignLeft: true,
  alignCenter: false,
  alignRight: false,
});

const updateToolbarState = ({ editor: currentEditor }) => {
  const alignCenter = currentEditor.isActive({ textAlign: "center" });
  const alignRight = currentEditor.isActive({ textAlign: "right" });

  activeToolbar.value = {
    bold: currentEditor.isActive("bold"),
    italic: currentEditor.isActive("italic"),
    link: currentEditor.isActive("link"),
    alignLeft:
      currentEditor.isActive({ textAlign: "left" }) ||
      (!alignCenter && !alignRight),
    alignCenter,
    alignRight,
  };
};

const editor = useEditor({
  extensions: [
    StarterKit,

    Link.configure({
      openOnClick: true,
    }),

    Image,

    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right"],
      defaultAlignment: "left",
    }),

    Placeholder.configure({
      placeholder: "Escreva seu texto aqui...",
    }),
  ],

  content: "",

  editorProps: {
    attributes: {
      class: "editor-content-inner",
    },
  },

  onCreate: updateToolbarState,
  onSelectionUpdate: updateToolbarState,
  onTransaction: updateToolbarState,
});

const isNoticia = computed(() => tipo.value === "noticia");

const contentTypeLabel = computed(() => (isNoticia.value ? "Notícia" : "Post"));

const pageTitle = computed(() =>
  isNoticia.value ? "Criar nova notícia" : "Criar novo post",
);

const tituloLabel = computed(() =>
  isNoticia.value ? "Título" : "Título do post",
);

const tituloPlaceholder = computed(() =>
  isNoticia.value ? "Digite o título da notícia" : "Digite o título do post",
);

const isAdmin = computed(() => user.value?.role === "ADMIN");

watchEffect(() => {
  if (tipo.value === "noticia" && !isAdmin.value) {
    router.replace("/");
  }
});

const toggleBold = () => {
  editor.value?.chain().focus().toggleBold().run();
};

const toggleItalic = () => {
  editor.value?.chain().focus().toggleItalic().run();
};

const setTextAlign = (alignment) => {
  editor.value?.chain().focus().setTextAlign(alignment).run();
};

const openLinkModal = () => {
  modalType.value = "link";
  isModalOpen.value = true;
};

const openImageModal = () => {
  modalType.value = "image";
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleModalSubmit = (url) => {
  if (modalType.value === "link") {
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();

    return;
  }

  editor.value
    ?.chain()
    .focus()
    .setImage({
      src: url,
      alt: "Imagem",
    })
    .run();
};

const validateContent = (html) => {
  return html && html.trim() !== "" && html.trim() !== "<p></p>";
};

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!editor.value) {
    errorMessage.value = "Editor não inicializado.";

    return;
  }

  const html = editor.value.getHTML();

  if (!validateContent(html)) {
    errorMessage.value = "O conteúdo não pode ficar vazio.";

    return;
  }

  if (isNoticia.value && !titulo.value.trim()) {
    errorMessage.value = "O título da notícia é obrigatório.";

    return;
  }

  if (!isNoticia.value && !titulo.value.trim()) {
    errorMessage.value = "O título do post é obrigatório.";

    return;
  }

  loading.value = true;

  try {
    if (!user.value) {
      router.push("/login");
      return;
    }

    if (isNoticia.value) {
      await apiService.createNoticia({
        titulo: titulo.value,
        nick: user.value.nick,
        content: html,
        evento: evento.value,
      });
    } else {
      await apiService.createPost({
        titulo: titulo.value,
        content: html,
        autorNickname: user.value.nick,
      });
    }

    successMessage.value = "Publicação realizada com sucesso.";

    setTimeout(() => {
      router.push("/");
    }, 1200);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Erro ao enviar a publicação.";

    console.error(error);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push("/");
};

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.create-page {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.create-container {
  flex: 1;
  padding: 32px 16px;
}

.create-card {
  max-width: 960px;
  margin: 0 auto;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
}

.create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
  text-align: left;
}

.page-pretitle {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: left;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.toolbar-btn {
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.toolbar-btn.active {
  border-color: #2563eb;
  background-color: #eff6ff;
  color: #1d4ed8;
  box-shadow: inset 0 0 0 1px #2563eb;
}

.editor-content {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background-color: #ffffff;
  overflow: hidden;
}

.editor-content :deep(.ProseMirror) {
  min-height: 300px;
  padding: 18px;
  outline: none;
  color: #111827;
}

.editor-content :deep(p) {
  margin: 0 0 1rem;
  line-height: 1.75;
}

.editor-content :deep(img) {
  max-width: 100%;
  max-height: 400px;
  height: auto;
  border-radius: 10px;
  display: block;
  margin: 1rem 0;
}

</style>
