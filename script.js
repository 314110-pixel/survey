document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const startBtn = document.getElementById('start-btn');
    const headerCard = document.querySelector('.header-card');
    const surveyForm = document.getElementById('survey-form');
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.getElementById('progress-bar');
    const questionCards = document.querySelectorAll('.question-card');
    const textInputContainer = document.getElementById('q6-desc-container');
    const q6Radios = document.querySelectorAll('input[name="q6"]');
    const q6Desc = document.getElementById('q6-desc');
    const thankYouCard = document.getElementById('thank-you-card');

    let currentStep = 0;
    const totalSteps = questionCards.length;

    // Start Survey
    startBtn.addEventListener('click', () => {
        headerCard.classList.add('hidden');
        surveyForm.classList.remove('hidden');
        progressContainer.classList.remove('hidden');
        updateProgress();
        checkCurrentAnswer();
    });

    // Navigation setup for all question cards
    questionCards.forEach((card, index) => {
        const nextBtn = card.querySelector('.next-btn');
        const prevBtn = card.querySelector('.prev-btn');
        const submitBtn = card.querySelector('.btn-submit');
        const radios = card.querySelectorAll('input[type="radio"]');

        // Handle radio selection to enable Next/Submit button
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (nextBtn) nextBtn.disabled = false;
                if (submitBtn) submitBtn.disabled = false;
                
                // If the user selects an option, we can optionally auto-advance,
                // but for a better UX let them click Next. Or auto-advance after small delay.
                // UNCOMMENT below to enable auto-advance:
                /* 
                if (index < totalSteps - 1 && radio.name !== 'q6') {
                    setTimeout(() => goToNextStep(), 400);
                } 
                */
            });
        });

        // Next Button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (validateStep(index)) {
                    goToNextStep();
                }
            });
        }

        // Prev Button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToPrevStep();
            });
        }
    });

    // Q6 specific logic (Show/Hide textarea based on Yes/No)
    q6Radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === '是') {
                textInputContainer.classList.remove('hidden');
                q6Desc.required = true;
                
                // Validate if textarea has content immediately upon enabling
                const nextBtn = questionCards[5].querySelector('.next-btn');
                nextBtn.disabled = q6Desc.value.trim() === '';
            } else {
                textInputContainer.classList.add('hidden');
                q6Desc.required = false;
                q6Desc.value = '';
                
                const nextBtn = questionCards[5].querySelector('.next-btn');
                nextBtn.disabled = false;
            }
        });
    });

    // Q6 Textarea input validation
    q6Desc.addEventListener('input', (e) => {
        const nextBtn = questionCards[5].querySelector('.next-btn');
        if (document.getElementById('q6-yes').checked) {
            nextBtn.disabled = e.target.value.trim() === '';
        }
    });

    // Handle form submission
    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // Hide form and progress
            surveyForm.classList.add('hidden');
            progressContainer.classList.add('hidden');
            
            // Show thank you card
            thankYouCard.classList.remove('hidden');
            
            // Console log the results (Simulating form submission)
            const formData = new FormData(surveyForm);
            const results = {};
            for (let [key, value] of formData.entries()) {
                results[key] = value;
            }
            console.log("Survey Results:", results);
        }
    });

    // Navigation logic functions
    function goToNextStep() {
        if (currentStep < totalSteps - 1) {
            questionCards[currentStep].classList.remove('active');
            currentStep++;
            questionCards[currentStep].classList.add('active');
            updateProgress();
            checkCurrentAnswer();
        }
    }

    function goToPrevStep() {
        if (currentStep > 0) {
            questionCards[currentStep].classList.remove('active');
            currentStep--;
            questionCards[currentStep].classList.add('active');
            updateProgress();
            checkCurrentAnswer();
        }
    }

    // Progress bar update
    function updateProgress() {
        const progress = ((currentStep) / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Check if current card has an answer to enable/disable button
    function checkCurrentAnswer() {
        const currentCard = questionCards[currentStep];
        const nextBtn = currentCard.querySelector('.next-btn');
        const submitBtn = currentCard.querySelector('.btn-submit');
        const checkedRadio = currentCard.querySelector('input[type="radio"]:checked');
        
        if (currentStep === 5 && document.getElementById('q6-yes').checked) {
            // Special case for Q6 Yes
            nextBtn.disabled = q6Desc.value.trim() === '';
            return;
        }

        if (nextBtn) nextBtn.disabled = !checkedRadio;
        if (submitBtn) submitBtn.disabled = !checkedRadio;
    }

    // Validate current step
    function validateStep(index) {
        const card = questionCards[index];
        const checkedRadio = card.querySelector('input[type="radio"]:checked');
        
        if (!checkedRadio) {
            return false;
        }
        
        // Special validation for Q6 textarea
        if (index === 5 && document.getElementById('q6-yes').checked && q6Desc.value.trim() === '') {
            q6Desc.focus();
            return false;
        }
        
        return true;
    }
    
    // Allow 'Enter' key to proceed
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !surveyForm.classList.contains('hidden')) {
            e.preventDefault();
            const currentCard = questionCards[currentStep];
            const nextBtn = currentCard.querySelector('.next-btn');
            const submitBtn = currentCard.querySelector('.btn-submit');
            
            if (nextBtn && !nextBtn.disabled) {
                goToNextStep();
            } else if (submitBtn && !submitBtn.disabled) {
                // Trigger form submission
                surveyForm.dispatchEvent(new Event('submit'));
            }
        }
    });
});
