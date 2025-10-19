<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
      <h5 class="card-title d-flex justify-content-between">
        {{ item.title }}
        <button
          class="btn btn-sm"
          @click="$emit('toggle', item.id)"
          :aria-label="isFav ? 'Unfavourite' : 'Favourite'"
        >
          <span v-if="isFav">★</span>
          <span v-else>☆</span>
        </button>
      </h5>
      <p class="card-text text-muted mb-2">{{ item.summary }}</p>
      
      <!-- Rating Section -->
      <div class="mb-2">
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="small text-muted">Rating:</span>
          <div class="rating-stars" role="radiogroup" :aria-label="`Rate ${item.title}`">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="btn btn-sm p-0 rating-star"
              :class="{ 'text-warning': star <= userRating, 'text-muted': star > userRating }"
              @click="rateResource(star)"
              @keydown.enter="rateResource(star)"
              @keydown.space.prevent="rateResource(star)"
              :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
              :aria-pressed="star === userRating"
              role="radio"
              :tabindex="0"
            >
              ★
            </button>
          </div>
          <span class="small text-muted">({{ userRating || 0 }}/5)</span>
        </div>
        
        <!-- Rating Stats -->
        <div class="small text-muted">
          <span v-if="stats.count > 0">
            Average: {{ stats.average.toFixed(1) }} ({{ stats.count }} vote{{ stats.count > 1 ? 's' : '' }})
          </span>
          <span v-else>No ratings yet</span>
        </div>
      </div>
      
      <div class="d-flex flex-wrap gap-1 mb-3">
        <span class="badge bg-secondary">{{ item.tag }}</span>
        <span class="badge bg-warning text-dark">★ {{ item.rating.toFixed(1) }}</span>
      </div>

      <!-- View Details Button -->
      <button 
        class="btn btn-primary btn-sm w-100"
        @click="showDetails = true"
        :aria-label="`View detailed information for ${item.title}`"
      >
        <i class="fas fa-info-circle me-2"></i>
        View Details
      </button>
    </div>
  </div>

  <!-- Details Modal - Using Teleport to avoid hover conflicts -->
  <Teleport to="body">
    <div v-if="showDetails" class="modal show d-block" tabindex="-1" role="dialog" @click.self="showDetails = false">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h4 class="modal-title fw-bold">{{ item.title }}</h4>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              @click="showDetails = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="item.content">
              <!-- Overview -->
              <div class="strategy-card">
                <h6 class="text-primary">📋 Overview</h6>
                <p>{{ item.content.overview }}</p>
              </div>

              <!-- Key Strategies/Metrics -->
              <div v-if="item.content.keyStrategies" class="strategy-card">
                <h6 class="text-primary">🎯 Key Strategies</h6>
                <div v-for="strategy in item.content.keyStrategies" :key="strategy.title" class="mb-3">
                  <h6 class="text-dark">{{ strategy.title }}</h6>
                  <p class="text-muted">{{ strategy.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="step in strategy.actionSteps" :key="step" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ step }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Key Metrics (for Heart Health) -->
              <div v-if="item.content.keyMetrics" class="strategy-card">
                <h6 class="text-primary">💓 Key Health Metrics</h6>
                <div v-for="metric in item.content.keyMetrics" :key="metric.title" class="mb-3">
                  <h6 class="text-dark">{{ metric.title }}</h6>
                  <p class="text-muted">{{ metric.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="step in metric.actionSteps" :key="step" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ step }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Workout Routine (for Fitness) -->
              <div v-if="item.content.warmUp" class="strategy-card">
                <h6 class="text-primary">💪 Workout Routine</h6>
                
                <!-- Warm-up -->
                <div class="mb-3">
                  <h6 class="text-dark">{{ item.content.warmUp.title }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="exercise in item.content.warmUp.exercises" :key="exercise" class="mb-1">
                      <i class="fas fa-play-circle text-info me-2"></i>
                      {{ exercise }}
                    </li>
                  </ul>
                </div>

                <!-- Main Workout -->
                <div class="mb-3">
                  <h6 class="text-dark">{{ item.content.mainWorkout.title }}</h6>
                  <div v-for="exercise in item.content.mainWorkout.exercises" :key="exercise.name" class="mb-3 p-3 border rounded">
                    <h6 class="text-dark mb-1">{{ exercise.name }}</h6>
                    <p class="text-muted mb-1"><strong>Sets:</strong> {{ exercise.sets }}</p>
                    <p class="text-muted mb-1"><strong>Form:</strong> {{ exercise.form }}</p>
                    <p class="text-muted"><strong>Progression:</strong> {{ exercise.progression }}</p>
                  </div>
                </div>

                <!-- Cool-down -->
                <div class="mb-3">
                  <h6 class="text-dark">{{ item.content.coolDown.title }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="exercise in item.content.coolDown.exercises" :key="exercise" class="mb-1">
                      <i class="fas fa-play-circle text-info me-2"></i>
                      {{ exercise }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Sleep Environment (for Sleep) -->
              <div v-if="item.content.sleepEnvironment" class="mb-4">
                <h6 class="text-primary mb-3">Sleep Environment</h6>
                <div v-for="element in item.content.sleepEnvironment.elements" :key="element.factor" class="mb-3">
                  <h6 class="text-dark">{{ element.factor }}</h6>
                  <p class="text-muted">{{ element.description }}</p>
                </div>
              </div>

              <!-- Food Categories (for Nutrition) -->
              <div v-if="item.content.lowGIFoods" class="mb-4">
                <h6 class="text-primary mb-3">Low Glycemic Index Foods</h6>
                <div v-for="category in item.content.lowGIFoods.categories" :key="category.category" class="mb-3">
                  <h6 class="text-dark">{{ category.category }}</h6>
                  <p class="text-muted"><strong>Serving Size:</strong> {{ category.servingSize }}</p>
                  <ul class="list-unstyled">
                    <li v-for="food in category.foods" :key="food" class="mb-1">
                      <i class="fas fa-leaf text-success me-2"></i>
                      {{ food }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Food Swaps (for Nutrition) -->
              <div v-if="item.content.foodSwaps" class="mb-4">
                <h6 class="text-primary mb-3">Smart Food Swaps</h6>
                <div v-for="swap in item.content.foodSwaps.swaps" :key="swap.insteadOf" class="mb-2 p-2 border rounded">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ swap.insteadOf }}</strong> → <strong>{{ swap.choose }}</strong>
                    </div>
                  </div>
                  <small class="text-muted">{{ swap.benefit }}</small>
                </div>
              </div>

              <!-- Boundary Setting (for Work-Life Balance) -->
              <div v-if="item.content.boundarySetting" class="mb-4">
                <h6 class="text-primary mb-3">Setting Healthy Boundaries</h6>
                <div v-for="strategy in item.content.boundarySetting.strategies" :key="strategy.boundary" class="mb-3">
                  <h6 class="text-dark">{{ strategy.boundary }}</h6>
                  <p class="text-muted">{{ strategy.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="action in strategy.actions" :key="action" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ action }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Warning Signs -->
              <div v-if="item.content.warningSigns" class="warning-signs">
                <h6 class="text-warning">⚠️ Warning Signs</h6>
                <ul class="list-unstyled">
                  <li v-for="sign in item.content.warningSigns" :key="sign" class="mb-1">
                    <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                    {{ sign }}
                  </li>
                </ul>
              </div>

              <!-- Emergency Signs -->
              <div v-if="item.content.emergencySigns" class="emergency-signs">
                <h6 class="text-danger">🚨 Emergency Signs</h6>
                <ul class="list-unstyled">
                  <li v-for="sign in item.content.emergencySigns" :key="sign" class="mb-1">
                    <i class="fas fa-exclamation-triangle text-danger me-2"></i>
                    {{ sign }}
                  </li>
                </ul>
              </div>

              <!-- Mental Health First Aid - Recognition Skills -->
              <div v-if="item.content.recognitionSkills" class="strategy-card">
                <h6 class="text-primary">🔍 {{ item.content.recognitionSkills.title }}</h6>
                <div v-for="sign in item.content.recognitionSkills.signs" :key="sign.category" class="mb-3">
                  <h6 class="text-dark">{{ sign.category }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="indicator in sign.indicators" :key="indicator" class="mb-1">
                      <i class="fas fa-exclamation-circle text-warning me-2"></i>
                      {{ indicator }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Mental Health First Aid - Response Strategies -->
              <div v-if="item.content.responseStrategies" class="strategy-card">
                <h6 class="text-primary">🤝 {{ item.content.responseStrategies.title }}</h6>
                <div v-for="step in item.content.responseStrategies.steps" :key="step.step" class="mb-3">
                  <h6 class="text-dark">{{ step.step }}</h6>
                  <ul v-if="step.actions" class="list-unstyled">
                    <li v-for="action in step.actions" :key="action" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ action }}
                    </li>
                  </ul>
                  <ul v-if="step.questions" class="list-unstyled">
                    <li v-for="question in step.questions" :key="question" class="mb-1">
                      <i class="fas fa-question-circle text-info me-2"></i>
                      {{ question }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Mental Health First Aid - Crisis Intervention -->
              <div v-if="item.content.crisisIntervention" class="strategy-card">
                <h6 class="text-primary">🚨 {{ item.content.crisisIntervention.title }}</h6>
                <div v-for="scenario in item.content.crisisIntervention.scenarios" :key="scenario.situation" class="mb-3">
                  <h6 class="text-dark">{{ scenario.situation }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="response in scenario.response" :key="response" class="mb-1">
                      <i class="fas fa-arrow-right text-danger me-2"></i>
                      {{ response }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Mental Health First Aid - Resources -->
              <div v-if="item.content.resources" class="strategy-card">
                <h6 class="text-primary">📞 {{ item.content.resources.title }}</h6>
                <div v-for="contact in item.content.resources.contacts" :key="contact.service" class="mb-2 p-2 border rounded">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ contact.service }}</strong>
                      <br>
                      <small class="text-muted">{{ contact.description }}</small>
                    </div>
                    <div class="text-end">
                      <span class="badge bg-primary fs-6">{{ contact.number }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mental Health First Aid - Self Care -->
              <div v-if="item.content.selfCare" class="strategy-card">
                <h6 class="text-primary">💚 {{ item.content.selfCare.title }}</h6>
                <ul class="list-unstyled">
                  <li v-for="practice in item.content.selfCare.practices" :key="practice" class="mb-1">
                    <i class="fas fa-heart text-success me-2"></i>
                    {{ practice }}
                  </li>
                </ul>
              </div>

              <!-- Prostate Health - Basics -->
              <div v-if="item.content.prostateBasics" class="strategy-card">
                <h6 class="text-primary">🔬 {{ item.content.prostateBasics.title }}</h6>
                <div v-for="info in item.content.prostateBasics.information" :key="info.fact" class="mb-3">
                  <h6 class="text-dark">{{ info.fact }}</h6>
                  <p class="text-muted">{{ info.description }}</p>
                </div>
              </div>

              <!-- Prostate Health - Risk Factors -->
              <div v-if="item.content.riskFactors" class="strategy-card">
                <h6 class="text-primary">⚠️ {{ item.content.riskFactors.title }}</h6>
                <div v-for="factor in item.content.riskFactors.factors" :key="factor.category" class="mb-3">
                  <h6 class="text-dark">{{ factor.category }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="risk in factor.factors" :key="risk" class="mb-1">
                      <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                      {{ risk }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Prostate Health - Symptoms -->
              <div v-if="item.content.symptoms" class="strategy-card">
                <h6 class="text-primary">🩺 {{ item.content.symptoms.title }}</h6>
                <div v-for="symptom in item.content.symptoms.symptoms" :key="symptom.category" class="mb-3">
                  <h6 class="text-dark">{{ symptom.category }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="sign in symptom.signs" :key="sign" class="mb-1">
                      <i class="fas fa-arrow-right text-info me-2"></i>
                      {{ sign }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Prostate Health - Screening -->
              <div v-if="item.content.screening" class="strategy-card">
                <h6 class="text-primary">🔍 {{ item.content.screening.title }}</h6>
                <div v-for="test in item.content.screening.tests" :key="test.test" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ test.test }}</h6>
                  <p class="text-muted mb-1">{{ test.description }}</p>
                  <small class="text-info"><strong>Frequency:</strong> {{ test.frequency }}</small>
                </div>
              </div>

              <!-- Prostate Health - Prevention -->
              <div v-if="item.content.prevention" class="strategy-card">
                <h6 class="text-primary">🛡️ {{ item.content.prevention.title }}</h6>
                <div v-for="strategy in item.content.prevention.strategies" :key="strategy.category" class="mb-3">
                  <h6 class="text-dark">{{ strategy.category }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="recommendation in strategy.recommendations" :key="recommendation" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ recommendation }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Prostate Health - Treatment Options -->
              <div v-if="item.content.treatmentOptions" class="strategy-card">
                <h6 class="text-primary">💊 {{ item.content.treatmentOptions.title }}</h6>
                <div v-for="treatment in item.content.treatmentOptions.treatments" :key="treatment.condition" class="mb-3">
                  <h6 class="text-dark">{{ treatment.condition }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="option in treatment.options" :key="option" class="mb-1">
                      <i class="fas fa-arrow-right text-primary me-2"></i>
                      {{ option }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Testosterone - Basics -->
              <div v-if="item.content.testosteroneBasics" class="strategy-card">
                <h6 class="text-primary">🧬 {{ item.content.testosteroneBasics.title }}</h6>
                <div v-for="info in item.content.testosteroneBasics.information" :key="info.fact" class="mb-3">
                  <h6 class="text-dark">{{ info.fact }}</h6>
                  <p class="text-muted">{{ info.description }}</p>
                </div>
              </div>

              <!-- Testosterone - Symptoms -->
              <div v-if="item.content.symptoms" class="strategy-card">
                <h6 class="text-primary">📊 {{ item.content.symptoms.title }}</h6>
                <div v-for="symptom in item.content.symptoms.symptoms" :key="symptom.category" class="mb-3">
                  <h6 class="text-dark">{{ symptom.category }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="sign in symptom.signs" :key="sign" class="mb-1">
                      <i class="fas fa-arrow-right text-info me-2"></i>
                      {{ sign }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Testosterone - Testing -->
              <div v-if="item.content.testing" class="strategy-card">
                <h6 class="text-primary">🧪 {{ item.content.testing.title }}</h6>
                <div v-for="test in item.content.testing.information" :key="test.test" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ test.test }}</h6>
                  <p class="text-muted mb-1">{{ test.description }}</p>
                  <small class="text-info" v-if="test.timing"><strong>Timing:</strong> {{ test.timing }}</small>
                  <small class="text-info" v-if="test.note"><br><strong>Note:</strong> {{ test.note }}</small>
                </div>
              </div>

              <!-- Testosterone - Natural Boosting -->
              <div v-if="item.content.naturalBoosting" class="strategy-card">
                <h6 class="text-primary">🌱 {{ item.content.naturalBoosting.title }}</h6>
                <div v-for="strategy in item.content.naturalBoosting.strategies" :key="strategy.category" class="mb-3">
                  <h6 class="text-dark">{{ strategy.category }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="method in strategy.methods" :key="method" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ method }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Testosterone - Medical Treatment -->
              <div v-if="item.content.medicalTreatment" class="strategy-card">
                <h6 class="text-primary">💉 {{ item.content.medicalTreatment.title }}</h6>
                <div v-for="treatment in item.content.medicalTreatment.treatments" :key="treatment.treatment" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ treatment.treatment }}</h6>
                  <p class="text-muted mb-1">{{ treatment.description }}</p>
                  <div v-if="treatment.forms">
                    <strong>Forms:</strong>
                    <ul class="list-unstyled mt-1">
                      <li v-for="form in treatment.forms" :key="form" class="mb-1">
                        <i class="fas fa-arrow-right text-primary me-2"></i>
                        {{ form }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="treatment.benefits">
                    <strong>Benefits:</strong> {{ treatment.benefits }}
                  </div>
                </div>
              </div>

              <!-- Testosterone - Risks and Benefits -->
              <div v-if="item.content.risksAndBenefits" class="strategy-card">
                <h6 class="text-primary">⚖️ {{ item.content.risksAndBenefits.title }}</h6>
                <div v-for="info in item.content.risksAndBenefits.information" :key="info.category" class="mb-3">
                  <h6 class="text-dark">{{ info.category }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="item in info.items" :key="item" class="mb-1">
                      <i class="fas fa-arrow-right text-primary me-2"></i>
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Nutrition - Macronutrients -->
              <div v-if="item.content.macronutrients" class="strategy-card">
                <h6 class="text-primary">🥗 {{ item.content.macronutrients.title }}</h6>
                <div v-for="nutrient in item.content.macronutrients.nutrients" :key="nutrient.nutrient" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ nutrient.nutrient }}</h6>
                  <p class="text-muted mb-1"><strong>Function:</strong> {{ nutrient.function }}</p>
                  <p class="text-muted mb-1"><strong>Recommendation:</strong> {{ nutrient.recommendation }}</p>
                  <div>
                    <strong>Sources:</strong>
                    <ul class="list-unstyled mt-1">
                      <li v-for="source in nutrient.sources" :key="source" class="mb-1">
                        <i class="fas fa-arrow-right text-success me-2"></i>
                        {{ source }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Nutrition - Meal Timing -->
              <div v-if="item.content.mealTiming" class="strategy-card">
                <h6 class="text-primary">⏰ {{ item.content.mealTiming.title }}</h6>
                <div v-for="strategy in item.content.mealTiming.strategies" :key="strategy.timing" class="mb-3">
                  <h6 class="text-dark">{{ strategy.timing }}</h6>
                  <ul v-if="strategy.foods" class="list-unstyled">
                    <li v-for="food in strategy.foods" :key="food" class="mb-1">
                      <i class="fas fa-utensils text-success me-2"></i>
                      {{ food }}
                    </li>
                  </ul>
                  <ul v-if="strategy.guidelines" class="list-unstyled">
                    <li v-for="guideline in strategy.guidelines" :key="guideline" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ guideline }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Nutrition - Hydration -->
              <div v-if="item.content.hydration" class="strategy-card">
                <h6 class="text-primary">💧 {{ item.content.hydration.title }}</h6>
                <div v-for="guideline in item.content.hydration.guidelines" :key="guideline.timing" class="mb-3">
                  <h6 class="text-dark">{{ guideline.timing }}</h6>
                  <ul class="list-unstyled">
                    <li v-for="recommendation in guideline.recommendations" :key="recommendation" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ recommendation }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Nutrition - Supplements -->
              <div v-if="item.content.supplements" class="strategy-card">
                <h6 class="text-primary">💊 {{ item.content.supplements.title }}</h6>
                <div v-for="supplement in item.content.supplements.supplements" :key="supplement.supplement" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ supplement.supplement }}</h6>
                  <p class="text-muted mb-1"><strong>Benefits:</strong> {{ supplement.benefits }}</p>
                  <p class="text-muted mb-1"><strong>Timing:</strong> {{ supplement.timing }}</p>
                  <p class="text-muted mb-1"><strong>Dosage:</strong> {{ supplement.dosage }}</p>
                  <small class="text-info" v-if="supplement.loading"><strong>Loading:</strong> {{ supplement.loading }}</small>
                </div>
              </div>

              <!-- Nutrition - Meal Planning -->
              <div v-if="item.content.mealPlanning" class="strategy-card">
                <h6 class="text-primary">📅 {{ item.content.mealPlanning.title }}</h6>
                <div v-for="strategy in item.content.mealPlanning.strategies" :key="strategy.strategy" class="mb-3">
                  <h6 class="text-dark">{{ strategy.strategy }}</h6>
                  <p class="text-muted mb-1">{{ strategy.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="example in strategy.examples" :key="example" class="mb-1">
                      <i class="fas fa-arrow-right text-success me-2"></i>
                      {{ example }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Nutrition - Common Mistakes -->
              <div v-if="item.content.commonMistakes" class="strategy-card">
                <h6 class="text-primary">❌ {{ item.content.commonMistakes.title }}</h6>
                <div v-for="mistake in item.content.commonMistakes.mistakes" :key="mistake.mistake" class="mb-2 p-2 border rounded">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <strong class="text-danger">{{ mistake.mistake }}</strong>
                    </div>
                  </div>
                  <small class="text-muted">{{ mistake.solution }}</small>
                </div>
              </div>

              <!-- Financial Wellness - Budgeting -->
              <div v-if="item.content.budgeting" class="strategy-card">
                <h6 class="text-primary">💰 {{ item.content.budgeting.title }}</h6>
                <div v-for="strategy in item.content.budgeting.strategies" :key="strategy.method" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ strategy.method }}</h6>
                  <p class="text-muted mb-1">{{ strategy.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="step in strategy.implementation" :key="step" class="mb-1">
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ step }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Financial Wellness - Debt Management -->
              <div v-if="item.content.debtManagement" class="strategy-card">
                <h6 class="text-primary">💳 {{ item.content.debtManagement.title }}</h6>
                <div v-for="method in item.content.debtManagement.methods" :key="method.method" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ method.method }}</h6>
                  <p class="text-muted mb-1">{{ method.description }}</p>
                  <ul class="list-unstyled">
                    <li v-for="step in method.steps" :key="step" class="mb-1">
                      <i class="fas fa-arrow-right text-primary me-2"></i>
                      {{ step }}
                    </li>
                  </ul>
                  <div v-if="method.considerations">
                    <strong>Considerations:</strong>
                    <ul class="list-unstyled mt-1">
                      <li v-for="consideration in method.considerations" :key="consideration" class="mb-1">
                        <i class="fas fa-exclamation-circle text-warning me-2"></i>
                        {{ consideration }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Financial Wellness - Saving Strategies -->
              <div v-if="item.content.savingStrategies" class="strategy-card">
                <h6 class="text-primary">🏦 {{ item.content.savingStrategies.title }}</h6>
                <div v-for="strategy in item.content.savingStrategies.strategies" :key="strategy.goal" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ strategy.goal }}</h6>
                  <p class="text-muted mb-1"><strong>Amount:</strong> {{ strategy.amount }}</p>
                  <ul class="list-unstyled">
                    <li v-for="tip in strategy.tips" :key="tip" class="mb-1">
                      <i class="fas fa-lightbulb text-warning me-2"></i>
                      {{ tip }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Financial Wellness - Investing -->
              <div v-if="item.content.investing" class="strategy-card">
                <h6 class="text-primary">📈 {{ item.content.investing.title }}</h6>
                <div v-for="concept in item.content.investing.concepts" :key="concept.concept" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ concept.concept }}</h6>
                  <p class="text-muted mb-1">{{ concept.description }}</p>
                  <div v-if="concept.guidelines">
                    <strong>Guidelines:</strong>
                    <ul class="list-unstyled mt-1">
                      <li v-for="guideline in concept.guidelines" :key="guideline" class="mb-1">
                        <i class="fas fa-arrow-right text-success me-2"></i>
                        {{ guideline }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="concept.benefits">
                    <strong>Benefits:</strong>
                    <ul class="list-unstyled mt-1">
                      <li v-for="benefit in concept.benefits" :key="benefit" class="mb-1">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        {{ benefit }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="concept.options">
                    <strong>Options:</strong>
                    <ul class="list-unstyled mt-1">
                      <li v-for="option in concept.options" :key="option" class="mb-1">
                        <i class="fas fa-arrow-right text-primary me-2"></i>
                        {{ option }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Financial Wellness - Insurance -->
              <div v-if="item.content.insurance" class="strategy-card">
                <h6 class="text-primary">🛡️ {{ item.content.insurance.title }}</h6>
                <div v-for="type in item.content.insurance.types" :key="type.type" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ type.type }}</h6>
                  <p class="text-muted mb-1"><strong>Purpose:</strong> {{ type.purpose }}</p>
                  <ul class="list-unstyled">
                    <li v-for="consideration in type.considerations" :key="consideration" class="mb-1">
                      <i class="fas fa-exclamation-circle text-info me-2"></i>
                      {{ consideration }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Financial Wellness - Estate Planning -->
              <div v-if="item.content.estatePlanning" class="strategy-card">
                <h6 class="text-primary">📋 {{ item.content.estatePlanning.title }}</h6>
                <div v-for="document in item.content.estatePlanning.documents" :key="document.document" class="mb-3 p-3 border rounded">
                  <h6 class="text-dark">{{ document.document }}</h6>
                  <p class="text-muted mb-1"><strong>Purpose:</strong> {{ document.purpose }}</p>
                  <div v-if="document.considerations">
                    <strong>Considerations:</strong>
                    <ul class="list-unstyled mt-1">
                      <li v-for="consideration in document.considerations" :key="consideration" class="mb-1">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        {{ consideration }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="document.types">
                    <strong>Types:</strong>
                    <ul class="list-unstyled mt-1">
                      <li v-for="type in document.types" :key="type" class="mb-1">
                        <i class="fas fa-arrow-right text-primary me-2"></i>
                        {{ type }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Financial Wellness - Common Mistakes -->
              <div v-if="item.content.commonMistakes" class="strategy-card">
                <h6 class="text-primary">❌ {{ item.content.commonMistakes.title }}</h6>
                <div v-for="mistake in item.content.commonMistakes.mistakes" :key="mistake.mistake" class="mb-2 p-2 border rounded">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <strong class="text-danger">{{ mistake.mistake }}</strong>
                    </div>
                  </div>
                  <small class="text-muted">{{ mistake.solution }}</small>
                </div>
              </div>

              <!-- When to Seek Help -->
              <div v-if="item.content.whenToSeekHelp" class="seek-help">
                <h6 class="text-info">🆘 When to Seek Help</h6>
                <p class="mb-0">{{ item.content.whenToSeekHelp }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDetails = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { getCurrentUser } from '../utils/auth.js';
import { getUserRating, setUserRating, getResourceStats } from '../utils/ratings.js';

const props = defineProps({
  item: { type: Object, required: true },
  isFav: { type: Boolean, default: false }
});
defineEmits(['toggle']);

const currentUser = ref(null);
const userRating = ref(null);
const stats = ref({ average: 0, count: 0 });
const showDetails = ref(false);

onMounted(() => {
  currentUser.value = getCurrentUser();
  if (currentUser.value) {
    userRating.value = getUserRating(props.item.id, currentUser.value.id);
  }
  stats.value = getResourceStats(props.item.id);
  
  // Add keyboard event listener for ESC key
  document.addEventListener('keydown', handleKeydown);
});

function handleKeydown(event) {
  if (event.key === 'Escape' && showDetails.value) {
    showDetails.value = false;
  }
}

onBeforeUnmount(() => {
  // Remove keyboard event listener
  document.removeEventListener('keydown', handleKeydown);
});

function rateResource(rating) {
  if (!currentUser.value) {
    alert('Please login to rate resources.');
    return;
  }
  
  userRating.value = rating;
  setUserRating(props.item.id, currentUser.value.id, rating);
  stats.value = getResourceStats(props.item.id);
}
</script>

<style scoped>
.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-star {
  font-size: 1.2rem;
  line-height: 1;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.2s;
}

.rating-star:hover {
  color: #ffc107 !important;
}

.rating-star:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

/* Modal styles */
.modal {
  z-index: 1055;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  z-index: 1050;
}

.modal-dialog {
  max-width: 95vw;
  width: 95vw;
  height: 90vh;
  margin: 5vh auto;
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.modal-header {
  flex-shrink: 0;
  padding: 1.5rem 2rem;
}

/* Content styling for better readability */
.modal-body h6 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.modal-body p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-body ul, .modal-body ol {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-body li {
  margin-bottom: 0.5rem;
}

/* Strategy cards styling */
.strategy-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.strategy-card h6 {
  color: #0d6efd;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 2px solid #0d6efd;
  padding-bottom: 0.5rem;
}

/* Action steps styling */
.action-steps {
  background: #e7f3ff;
  border-left: 4px solid #0d6efd;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 8px 8px 0;
}

.action-steps h6 {
  color: #0d6efd;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.action-steps ul {
  margin-bottom: 0;
}

.action-steps li {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

/* Warning signs styling */
.warning-signs {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.warning-signs h6 {
  color: #856404;
  font-weight: 600;
  margin-bottom: 1rem;
}

.warning-signs ul {
  margin-bottom: 0;
}

.warning-signs li {
  margin-bottom: 0.5rem;
  color: #856404;
}

/* Emergency signs styling */
.emergency-signs {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.emergency-signs h6 {
  color: #721c24;
  font-weight: 600;
  margin-bottom: 1rem;
}

.emergency-signs ul {
  margin-bottom: 0;
}

.emergency-signs li {
  margin-bottom: 0.5rem;
  color: #721c24;
}

/* When to seek help styling */
.seek-help {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.seek-help h6 {
  color: #0c5460;
  font-weight: 600;
  margin-bottom: 1rem;
}

.seek-help p {
  margin-bottom: 0;
  color: #0c5460;
}

/* Prevent hover conflicts */
.card {
  position: relative;
}

.modal {
  pointer-events: auto;
}

.modal-dialog {
  pointer-events: auto;
}

/* Ensure modal content doesn't interfere with card hover */
.modal-content {
  pointer-events: auto;
}
</style>
