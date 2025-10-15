<template>
  <section class="container py-4" style="max-width: 760px">
    <h2 class="h4 mb-3">Join Our Community</h2>

    <!-- successful notice -->
    <div v-if="success" class="alert alert-success" role="alert">
      Thanks for joining! Your request has been recorded.
    </div>

    <form @submit.prevent="onSubmit" novalidate>
      <!-- Name -->
      <div class="mb-3">
        <label for="name" class="form-label">Full name *</label>
        <input
          id="name"
          type="text"
          class="form-control"
          v-model.trim="form.name"
          @blur="touch('name')"
          :aria-invalid="!!err.name"
          :aria-describedby="err.name ? 'name-help' : null"
          placeholder="e.g. Eric Chen"
          required
        />
        <div v-if="t.name && err.name" id="name-help" class="invalid-feedback d-block">
          {{ err.name }}
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label">Email *</label>
        <input
          id="email"
          type="email"
          class="form-control"
          v-model.trim="form.email"
          @blur="touch('email')"
          :aria-invalid="!!err.email"
          :aria-describedby="err.email ? 'email-help' : null"
          placeholder="name@example.com"
          required
        />
        <div v-if="t.email && err.email" id="email-help" class="invalid-feedback d-block">
          {{ err.email }}
        </div>
      </div>

      <!-- Age -->
      <div class="mb-3">
        <label for="age" class="form-label">Age *</label>
        <input
          id="age"
          type="number"
          class="form-control"
          v-model.number="form.age"
          @blur="touch('age')"
          min="16" max="120" step="1"
          :aria-invalid="!!err.age"
          :aria-describedby="err.age ? 'age-help' : null"
          placeholder="18"
          required
        />
        <div v-if="t.age && err.age" id="age-help" class="invalid-feedback d-block">
          {{ err.age }}
        </div>
      </div>

      <!-- Interests -->
      <fieldset class="mb-3">
        <legend class="col-form-label pt-0">Areas of interest *</legend>
        <div class="d-flex flex-wrap gap-3">
          <div class="form-check" v-for="i in interestOptions" :key="i">
            <input
              class="form-check-input"
              type="checkbox"
              :id="`int-${i}`"
              :value="i"
              v-model="form.interests"
              @change="touch('interests')"
            />
            <label class="form-check-label" :for="`int-${i}`">{{ i }}</label>
          </div>
        </div>
        <div v-if="t.interests && err.interests" class="invalid-feedback d-block">
          {{ err.interests }}
        </div>
      </fieldset>

      <!-- Message -->
      <div class="mb-3">
        <label for="msg" class="form-label">Message (min 10 chars)</label>
        <textarea
          id="msg"
          class="form-control"
          rows="3"
          v-model.trim="form.message"
          @blur="touch('message')"
          :aria-invalid="!!err.message"
          :aria-describedby="err.message ? 'msg-help' : null"
          placeholder="Tell us what support or activities you’re looking for…"
        ></textarea>
        <div v-if="t.message && err.message" id="msg-help" class="invalid-feedback d-block">
          {{ err.message }}
        </div>
      </div>

      <!-- Agree -->
      <div class="form-check mb-3">
        <input
          class="form-check-input"
          type="checkbox"
          id="agree"
          v-model="form.agree"
          @change="touch('agree')"
          :aria-invalid="!!err.agree"
        />
        <label class="form-check-label" for="agree">
          I agree to the community guidelines *
        </label>
        <div v-if="t.agree && err.agree" class="invalid-feedback d-block">
          {{ err.agree }}
        </div>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="!isValid">Submit</button>
        <button type="button" class="btn btn-outline-secondary" @click="clearDraft">Clear Draft</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { saveFormDraft, loadFormDraft, clearFormDraft } from '../utils/storage.js';
import { validateName, validateEmail, validateAge, sanitizeText, sanitizeInput } from '../utils/security.js';

const interestOptions = ['mental health', 'fitness', 'nutrition', 'sleep', 'cardio'];

const form = reactive({
  name: '',
  email: '',
  age: '',
  interests: [],
  message: '',
  agree: false,
});

const t = reactive({});            // touched markers
const success = ref(false);

// Enhanced validation rules with security
const rules = {
  name: (v) => {
    const validation = validateName(v);
    if (!validation.isValid) {
      return 'Name must be 2-50 characters and contain only letters and spaces.';
    }
    return '';
  },
  email: (v) => (validateEmail(v) ? '' : 'Please enter a valid email address.'),
  age: (v) => {
    const validation = validateAge(v);
    return validation.isValid ? '' : 'Age must be between 16 and 120.';
  },
  interests: (v) => (v?.length ? '' : 'Select at least one area of interest.'),
  message: (v) => {
    if (!v) return '';
    const sanitized = sanitizeText(v);
    return sanitized.length >= 10 ? '' : 'Message must be at least 10 characters.';
  },
  agree: (v) => (v ? '' : 'Please agree to the community guidelines.'),
};

// Calculate the errors
const err = computed(() => ({
  name: rules.name(form.name),
  email: rules.email(form.email),
  age: rules.age(form.age),
  interests: rules.interests(form.interests),
  message: rules.message(form.message),
  agree: rules.agree(form.agree),
}));

const isValid = computed(() => Object.values(err.value).every((e) => e === ''));

function touch(key) {
  t[key] = true;
}

// Auto-save draft
watch(
  form,
  (v) => {
    saveFormDraft({ ...v });
  },
  { deep: true }
);

// Load draft
onMounted(() => {
  const draft = loadFormDraft();
  Object.assign(form, draft);
});

function clearDraft() {
  clearFormDraft();
}

function onSubmit() {
  // Mark all as touched to show errors
  Object.keys(form).forEach((k) => (t[k] = true));
  if (!isValid.value) return;

  // Sanitize form data before submission
  const sanitizedData = {
    name: sanitizeInput(form.name, 'name'),
    email: sanitizeInput(form.email, 'email'),
    age: form.age,
    interests: form.interests,
    message: sanitizeText(form.message),
    agree: form.agree
  };

  // Simulate successful submission with sanitized data
  success.value = true;
  clearFormDraft();
  
  // Reset form
  Object.assign(form, { name: '', email: '', age: '', interests: [], message: '', agree: false });
  Object.keys(t).forEach((k) => delete t[k]);

  // Log sanitized data (in real app, this would be sent to server)
  console.log('Form submitted with sanitized data:', sanitizedData);

  // Successful notice fades out after 4 seconds
  setTimeout(() => (success.value = false), 4000);
}
</script>
