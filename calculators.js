// calculators.js - Sports Science Calculators

// Utility function to animate number changes
function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 10);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current * 10) / 10;
    }, 10);
}

// 1. 1RM Calculator
function calculate1RM() {
    const weight = parseFloat(document.getElementById('rm-weight').value);
    const reps = parseInt(document.getElementById('rm-reps').value);
    const formula = document.getElementById('rm-formula').value;
    
    if (!weight || !reps || reps < 1) {
        alert('Будь ласка, введіть коректні дані');
        return;
    }
    
    let oneRM;
    
    switch(formula) {
        case 'brzycki':
            oneRM = weight * (36 / (37 - Math.min(reps, 36)));
            break;
        case 'epley':
            oneRM = weight * (1 + reps / 30);
            break;
        case 'lander':
            oneRM = (100 * weight) / (101.3 - 2.67123 * reps);
            break;
        case 'lombardi':
            oneRM = weight * Math.pow(reps, 0.10);
            break;
        case 'mayhew':
            oneRM = (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
            break;
        default:
            oneRM = weight * (36 / (37 - reps));
    }
    
    oneRM = Math.round(oneRM * 10) / 10;
    
    document.getElementById('rm-result').style.display = 'block';
    const rmValue = document.getElementById('rm-value');
    animateValue(rmValue, parseFloat(rmValue.textContent) || 0, oneRM, 500);
    
    // Calculate percentages
    const percentages = [95, 90, 85, 80, 75, 70, 65, 60];
    let html = '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">';
    percentages.forEach(p => {
        html += `<div style="text-align: center; padding: 5px; background: white; border-radius: 4px;">
            <div style="font-weight: 600;">${p}%</div>
            <div style="color: var(--accent);">${Math.round(oneRM * p / 100)} кг</div>
        </div>`;
    });
    html += '</div>';
    document.getElementById('rm-percentages').innerHTML = html;
}

// 2. Wilks Score Calculator
function calculateWilks() {
    const gender = document.getElementById('wilks-gender').value;
    const bodyweight = parseFloat(document.getElementById('wilks-bodyweight').value);
    const total = parseFloat(document.getElementById('wilks-total').value);
    
    if (!bodyweight || !total) {
        alert('Будь ласка, введіть всі дані');
        return;
    }
    
    // Wilks coefficients (2020)
    let a, b, c, d, e, f;
    
    if (gender === 'male') {
        a = -216.0475144;
        b = 16.2606339;
        c = -0.002388645;
        d = -0.00113732;
        e = 7.01863e-6;
        f = -1.291e-8;
    } else {
        a = 594.31747775582;
        b = -27.23842536447;
        c = 0.82112226871;
        d = -0.00930733913;
        e = 4.731582e-5;
        f = -9.054e-8;
    }
    
    const x = bodyweight;
    const coeff = 500 / (a + b*x + c*Math.pow(x,2) + d*Math.pow(x,3) + e*Math.pow(x,4) + f*Math.pow(x,5));
    const wilks = total * coeff;
    
    document.getElementById('wilks-result').style.display = 'block';
    const wilksValue = document.getElementById('wilks-value');
    animateValue(wilksValue, parseFloat(wilksValue.textContent) || 0, Math.round(wilks), 500);
    
    // Determine level
    let level, levelClass;
    if (wilks < 300) {
        level = 'Початківець';
        levelClass = 'level-beginner';
    } else if (wilks < 350) {
        level = 'Любитель';
        levelClass = 'level-novice';
    } else if (wilks < 400) {
        level = 'Середній рівень';
        levelClass = 'level-intermediate';
    } else if (wilks < 450) {
        level = 'Просунутий';
        levelClass = 'level-advanced';
    } else {
        level = 'Еліта';
        levelClass = 'level-elite';
    }
    
    const levelDiv = document.getElementById('wilks-level');
    levelDiv.className = `strength-level ${levelClass}`;
    levelDiv.textContent = `🏅 ${level}`;
}

// 3. TDEE Calculator
let currentTDEE = 0;

function calculateTDEE() {
    const gender = document.getElementById('tdee-gender').value;
    const weight = parseFloat(document.getElementById('tdee-weight').value);
    const height = parseFloat(document.getElementById('tdee-height').value);
    const age = parseInt(document.getElementById('tdee-age').value);
    const activity = parseFloat(document.getElementById('tdee-activity').value);
    
    if (!weight || !height || !age) {
        alert('Будь ласка, введіть всі дані');
        return;
    }
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    currentTDEE = Math.round(bmr * activity);
    
    document.getElementById('tdee-result').style.display = 'block';
    const tdeeValue = document.getElementById('tdee-value');
    animateValue(tdeeValue, parseFloat(tdeeValue.textContent) || 0, currentTDEE, 500);
    
    // Reset to maintain
    adjustTDEE('maintain');
}

function adjustTDEE(goal) {
    // Update active badge
    document.querySelectorAll('.adjustment-badge').forEach(badge => {
        badge.classList.remove('active');
    });
    document.querySelector(`.adjustment-badge.${goal}`).classList.add('active');
    
    let adjusted;
    switch(goal) {
        case 'cut':
            adjusted = currentTDEE - 500;
            break;
        case 'bulk':
            adjusted = currentTDEE + 300;
            break;
        default:
            adjusted = currentTDEE;
    }
    
    document.getElementById('tdee-adjusted').textContent = Math.round(adjusted);
}

// 4. Macro Timing Calculator
function calculateMacroTiming() {
    const calories = parseFloat(document.getElementById('timing-calories').value);
    const protein = parseFloat(document.getElementById('timing-protein').value);
    const fat = parseFloat(document.getElementById('timing-fat').value);
    const carbs = parseFloat(document.getElementById('timing-carbs').value);
    const meals = parseInt(document.getElementById('timing-meals').value);
    const workoutTime = document.getElementById('timing-workout').value;
    
    if (!calories || !protein || !fat || !carbs) {
        alert('Будь ласка, введіть всі макроси');
        return;
    }
    
    // Distribute macros across meals
    const proteinPerMeal = Math.round(protein / meals);
    const fatPerMeal = Math.round(fat / meals);
    
    // Carbs distribution depends on workout time
    let carbsDistribution;
    if (workoutTime === 'morning') {
        carbsDistribution = [0.30, 0.25, 0.25, 0.20];
    } else if (workoutTime === 'afternoon') {
        carbsDistribution = [0.20, 0.35, 0.25, 0.20];
    } else {
        carbsDistribution = [0.20, 0.25, 0.35, 0.20];
    }
    
    // Adjust for number of meals
    if (meals === 3) {
        carbsDistribution = [0.30, 0.35, 0.35];
    } else if (meals === 5) {
        carbsDistribution = [0.20, 0.25, 0.20, 0.20, 0.15];
    } else if (meals === 6) {
        carbsDistribution = [0.15, 0.20, 0.20, 0.20, 0.15, 0.10];
    }
    
    const mealTimes = getMealTimes(meals, workoutTime);
    let html = '';
    
    for (let i = 0; i < meals; i++) {
        const mealCarbs = Math.round(carbs * carbsDistribution[i]);
        const mealCalories = Math.round(calories / meals);
        
        html += `
            <div class="timing-meal">
                <div class="timing-time">${mealTimes[i]}</div>
                <div class="timing-macros">
                    🔥 ${mealCalories} ккал<br>
                    💪 ${proteinPerMeal}г білка<br>
                    🥑 ${fatPerMeal}г жирів<br>
                    🍚 ${mealCarbs}г вуглеводів
                </div>
            </div>
        `;
    }
    
    document.getElementById('timing-result').style.display = 'block';
    document.getElementById('timing-schedule').innerHTML = html;
}

function getMealTimes(meals, workoutTime) {
    const baseTimes = {
        morning: ['7:30', '10:00', '13:00', '16:00', '19:00', '21:00'],
        afternoon: ['8:00', '11:00', '14:00', '17:00', '20:00', '22:00'],
        evening: ['8:30', '12:00', '15:00', '18:00', '20:30', '22:30']
    };
    
    const times = baseTimes[workoutTime];
    let result = [];
    
    switch(meals) {
        case 3:
            result = [times[0], times[2], times[4]];
            break;
        case 4:
            result = [times[0], times[1], times[3], times[4]];
            break;
        case 5:
            result = [times[0], times[1], times[2], times[3], times[4]];
            break;
        case 6:
            result = times;
            break;
        default:
            result = times.slice(0, meals);
    }
    
    // Add workout marker
    const workoutIndex = workoutTime === 'morning' ? 1 : (workoutTime === 'afternoon' ? 2 : 3);
    if (workoutIndex < result.length) {
        result[workoutIndex] += ' 🏋️';
    }
    
    return result;
}

// 5. Water Intake Calculator
function calculateWaterIntake() {
    const weight = parseFloat(document.getElementById('water-weight').value);
    const workout = parseFloat(document.getElementById('water-workout').value) || 0;
    const intensity = document.getElementById('water-intensity').value;
    
    if (!weight) {
        alert('Будь ласка, введіть вагу');
        return;
    }
    
    // Base water need: 30-35 ml per kg
    const baseWater = weight * 0.033;
    
    // Additional water for workout
    let workoutWater = 0;
    if (workout > 0) {
        const intensityMultiplier = intensity === 'low' ? 0.4 : (intensity === 'moderate' ? 0.6 : 0.8);
        workoutWater = (workout / 60) * intensityMultiplier;
    }
    
    const totalWater = baseWater + workoutWater;
    
    document.getElementById('water-result').style.display = 'block';
    document.getElementById('water-amount').textContent = totalWater.toFixed(1);
    document.getElementById('water-rest').textContent = baseWater.toFixed(1);
    document.getElementById('water-training').textContent = totalWater.toFixed(1);
}

// 6. Navy Body Fat Calculator
function calculateNavyBodyFat() {
    const gender = document.getElementById('navy-gender').value;
    const height = parseFloat(document.getElementById('navy-height').value);
    const neck = parseFloat(document.getElementById('navy-neck').value);
    const waist = parseFloat(document.getElementById('navy-waist').value);
    const hips = parseFloat(document.getElementById('navy-hips')?.value) || 0;
    
    if (!height || !neck || !waist) {
        alert('Будь ласка, введіть всі необхідні виміри');
        return;
    }
    
    if (gender === 'female' && !hips) {
        alert('Для жінок необхідно вказати обхват стегон');
        return;
    }
    
    let bodyFat;
    if (gender === 'male') {
        bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
        bodyFat = 163.205 * Math.log10(waist + hips - neck) - 97.684 * Math.log10(height) - 78.387;
    }
    
    bodyFat = Math.max(3, Math.min(50, bodyFat));
    
    // Get weight from input or use default
    const weightInput = document.createElement('input');
    const weight = parseFloat(prompt('Введіть вашу вагу (кг) для розрахунку маси жиру:', '75')) || 75;
    
    const fatMass = (bodyFat / 100) * weight;
    const lbm = weight - fatMass;
    
    document.getElementById('navy-result').style.display = 'block';
    const bfValue = document.getElementById('navy-bf');
    animateValue(bfValue, parseFloat(bfValue.textContent) || 0, bodyFat, 500);
    
    document.getElementById('navy-fatmass').textContent = fatMass.toFixed(1);
    document.getElementById('navy-lbm').textContent = lbm.toFixed(1);
    
    // Category
    let category, categoryClass;
    if (gender === 'male') {
        if (bodyFat < 6) category = 'Есенціальний жир';
        else if (bodyFat < 14) category = 'Атлетичний';
        else if (bodyFat < 21) category = 'Фітнес';
        else if (bodyFat < 25) category = 'Середній';
        else category = 'Надлишковий';
    } else {
        if (bodyFat < 14) category = 'Есенціальний жир';
        else if (bodyFat < 21) category = 'Атлетичний';
        else if (bodyFat < 25) category = 'Фітнес';
        else if (bodyFat < 32) category = 'Середній';
        else category = 'Надлишковий';
    }
    
    const categoryDiv = document.getElementById('navy-category');
    categoryDiv.className = `strength-level ${getCategoryClass(category)}`;
    categoryDiv.textContent = `📊 ${category}`;
}

function getCategoryClass(category) {
    const classes = {
        'Есенціальний жир': 'level-elite',
        'Атлетичний': 'level-advanced',
        'Фітнес': 'level-intermediate',
        'Середній': 'level-novice',
        'Надлишковий': 'level-beginner'
    };
    return classes[category] || 'level-beginner';
}

// Show/hide hips field for Navy method
document.addEventListener('DOMContentLoaded', () => {
    const genderSelect = document.getElementById('navy-gender');
    const hipsGroup = document.getElementById('navy-hips-group');
    
    if (genderSelect && hipsGroup) {
        genderSelect.addEventListener('change', () => {
            hipsGroup.style.display = genderSelect.value === 'female' ? 'block' : 'none';
        });
    }
    
    // Update navigation visibility
    if (localStorage.getItem('athleteStats')) {
        const protocolLink = document.getElementById('nav-protocol');
        if (protocolLink) protocolLink.style.display = 'inline-block';
    }
});