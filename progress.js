// progress.js - Progress Tracker for Digital Athlete

class ProgressTracker {
    constructor() {
        this.data = this.loadData();
        this.charts = {};
        this.initializeDate();
        this.initializeEventListeners();
        this.renderAll();
        this.initializeCharts();
        this.updateNavigation();
    }

    initializeDate() {
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(input => {
            if (!input.value) input.value = today;
        });
    }

    loadData() {
        const saved = localStorage.getItem('progressData');
        return saved ? JSON.parse(saved) : {
            weight: [],
            bodyfat: [],
            measurements: [],
            strength: {},
            goals: {}
        };
    }

    saveData() {
        localStorage.setItem('progressData', JSON.stringify(this.data));
    }

    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Measurement type switching
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchMeasurementType(btn.dataset.type));
        });

        // Save buttons
        document.getElementById('save-measurement').addEventListener('click', () => this.saveMeasurement());
        document.getElementById('save-strength').addEventListener('click', () => this.saveStrengthRecord());
        document.getElementById('save-goals').addEventListener('click', () => this.saveGoals());

        // Export/Import
        document.getElementById('export-data').addEventListener('click', () => this.exportData());
        document.getElementById('import-data').addEventListener('click', () => this.importData());
        document.getElementById('clear-all-data').addEventListener('click', () => this.clearAllData());

        // File import handler
        document.getElementById('file-import').addEventListener('change', (e) => this.handleFileImport(e));
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
        document.getElementById(`tab-${tabId}`).style.display = 'block';
    }

    switchMeasurementType(type) {
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        document.getElementById('weight-inputs').style.display = type === 'weight' ? 'block' : 'none';
        document.getElementById('bodyfat-inputs').style.display = type === 'bodyfat' ? 'block' : 'none';
        document.getElementById('measurements-inputs').style.display = type === 'measurements' ? 'block' : 'none';
    }

    saveMeasurement() {
        const activeType = document.querySelector('.type-btn.active').dataset.type;
        const date = this.getActiveDate(activeType);
        
        if (!date) {
            alert('Будь ласка, введіть дату');
            return;
        }

        if (activeType === 'weight') {
            const weight = parseFloat(document.getElementById('weight-input').value);
            if (!weight) {
                alert('Введіть вагу');
                return;
            }
            this.data.weight.push({ date, value: weight });
            this.data.weight.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (activeType === 'bodyfat') {
            const bodyfat = parseFloat(document.getElementById('bodyfat-input').value);
            if (!bodyfat) {
                alert('Введіть відсоток жиру');
                return;
            }
            this.data.bodyfat.push({ date, value: bodyfat });
            this.data.bodyfat.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (activeType === 'measurements') {
            const measurements = {
                chest: parseFloat(document.getElementById('chest-input').value),
                waist: parseFloat(document.getElementById('waist-input').value),
                biceps: parseFloat(document.getElementById('biceps-input').value),
                thigh: parseFloat(document.getElementById('thigh-input').value)
            };
            
            if (Object.values(measurements).some(v => !v)) {
                alert('Введіть всі об\'єми');
                return;
            }
            
            this.data.measurements.push({ date, ...measurements });
            this.data.measurements.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        this.saveData();
        this.renderAll();
        this.updateCharts();
        this.clearInputs(activeType);
    }

    getActiveDate(type) {
        if (type === 'weight') return document.getElementById('measurement-date').value;
        if (type === 'bodyfat') return document.getElementById('bf-date').value;
        return document.getElementById('circ-date').value;
    }

    clearInputs(type) {
        if (type === 'weight') {
            document.getElementById('weight-input').value = '';
        } else if (type === 'bodyfat') {
            document.getElementById('bodyfat-input').value = '';
        } else {
            ['chest', 'waist', 'biceps', 'thigh'].forEach(field => {
                document.getElementById(`${field}-input`).value = '';
            });
        }
    }

    saveStrengthRecord() {
        const exercise = document.getElementById('exercise-select').value;
        const date = document.getElementById('strength-date').value;
        const weight = parseFloat(document.getElementById('strength-weight').value);
        const reps = parseInt(document.getElementById('strength-reps').value);

        if (!date || !weight || !reps) {
            alert('Заповніть всі поля');
            return;
        }

        if (!this.data.strength[exercise]) {
            this.data.strength[exercise] = [];
        }

        // Calculate 1RM using Brzycki formula
        const oneRM = weight * (36 / (37 - Math.min(reps, 36)));
        
        this.data.strength[exercise].push({
            date,
            weight,
            reps,
            oneRM: Math.round(oneRM)
        });

        this.data.strength[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        this.saveData();
        this.updateEstimated1RM(exercise);
        this.updateCharts();
        
        // Clear inputs
        document.getElementById('strength-weight').value = '';
        document.getElementById('strength-reps').value = '';
    }

    updateEstimated1RM(exercise) {
        const records = this.data.strength[exercise];
        if (records && records.length > 0) {
            const latest = records[records.length - 1];
            document.getElementById('estimated-1rm').textContent = `${latest.oneRM} кг`;
        }
    }

    saveGoals() {
        const weight = parseFloat(document.getElementById('goal-weight').value);
        const bodyfat = parseFloat(document.getElementById('goal-bodyfat').value);
        const deadline = document.getElementById('goal-deadline').value;

        if (weight) this.data.goals.weight = weight;
        if (bodyfat) this.data.goals.bodyfat = bodyfat;
        if (deadline) this.data.goals.deadline = deadline;

        this.saveData();
        this.updateGoalProgress();
    }

    updateGoalProgress() {
        const currentWeight = this.data.weight.length > 0 ? 
            this.data.weight[this.data.weight.length - 1].value : 0;
        const currentBF = this.data.bodyfat.length > 0 ? 
            this.data.bodyfat[this.data.bodyfat.length - 1].value : 0;

        if (this.data.goals.weight) {
            const progress = (currentWeight / this.data.goals.weight) * 100;
            document.getElementById('weight-goal-bar').style.width = `${Math.min(progress, 100)}%`;
            document.getElementById('weight-progress-text').textContent = 
                `${currentWeight.toFixed(1)}/${this.data.goals.weight} кг`;
        }

        if (this.data.goals.bodyfat) {
            const progress = (currentBF / this.data.goals.bodyfat) * 100;
            document.getElementById('bf-goal-bar').style.width = `${Math.min(progress, 100)}%`;
            document.getElementById('bf-progress-text').textContent = 
                `${currentBF.toFixed(1)}/${this.data.goals.bodyfat}%`;
        }
    }

    renderAll() {
        this.renderHistory();
        this.updateStats();
        this.updateGoalProgress();
        this.updateExerciseSelect();
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');
        const allEntries = [
            ...this.data.weight.map(w => ({ ...w, type: 'Вага', unit: 'кг' })),
            ...this.data.bodyfat.map(bf => ({ ...bf, type: '% Жиру', unit: '%' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        historyList.innerHTML = allEntries.slice(0, 10).map(entry => `
            <div class="history-item">
                <div>
                    <div>${entry.type}: ${entry.value}${entry.unit}</div>
                    <div class="history-date">${this.formatDate(entry.date)}</div>
                </div>
                <span class="delete-entry" onclick="progressTracker.deleteEntry('${entry.type}', '${entry.date}')">🗑️</span>
            </div>
        `).join('');
    }

    deleteEntry(type, date) {
        if (type === 'Вага') {
            this.data.weight = this.data.weight.filter(w => w.date !== date);
        } else {
            this.data.bodyfat = this.data.bodyfat.filter(bf => bf.date !== date);
        }
        this.saveData();
        this.renderAll();
        this.updateCharts();
    }

    updateStats() {
        if (this.data.weight.length > 0) {
            const current = this.data.weight[this.data.weight.length - 1].value;
            document.getElementById('current-weight').textContent = `${current.toFixed(1)} кг`;
            
            // Calculate monthly change
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            const oldEntry = this.data.weight.find(w => new Date(w.date) >= monthAgo);
            
            if (oldEntry) {
                const change = current - oldEntry.value;
                const trend = change > 0 ? 'trend-up' : change < 0 ? 'trend-down' : 'trend-stable';
                const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
                document.getElementById('weight-change').innerHTML = 
                    `${change > 0 ? '+' : ''}${change.toFixed(1)} кг <span class="${trend}">${arrow}</span>`;
            }
        }
    }

    updateExerciseSelect() {
        const select = document.getElementById('exercise-select');
        select.addEventListener('change', () => {
            this.updateEstimated1RM(select.value);
        });
        
        // Trigger initial update
        if (select.value) {
            this.updateEstimated1RM(select.value);
        }
    }

    initializeCharts() {
        // Weight Chart
        const weightCtx = document.getElementById('weight-chart').getContext('2d');
        this.charts.weight = new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: this.data.weight.map(w => this.formatDate(w.date)),
                datasets: [{
                    label: 'Вага (кг)',
                    data: this.data.weight.map(w => w.value),
                    borderColor: '#4A6B48',
                    backgroundColor: 'rgba(74, 107, 72, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Bodyfat Chart
        const bfCtx = document.getElementById('bodyfat-chart').getContext('2d');
        this.charts.bodyfat = new Chart(bfCtx, {
            type: 'line',
            data: {
                labels: this.data.bodyfat.map(bf => this.formatDate(bf.date)),
                datasets: [{
                    label: '% Жиру',
                    data: this.data.bodyfat.map(bf => bf.value),
                    borderColor: '#c0392b',
                    backgroundColor: 'rgba(192, 57, 43, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Strength Chart
        const strengthCtx = document.getElementById('strength-chart').getContext('2d');
        this.charts.strength = new Chart(strengthCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
        
        this.updateStrengthChart();
    }

    updateStrengthChart() {
        const exercises = ['bench', 'squat', 'deadlift'];
        const colors = ['#4A6B48', '#c0392b', '#2980b9'];
        
        const datasets = exercises.filter(ex => this.data.strength[ex]?.length > 0).map((ex, i) => ({
            label: this.getExerciseName(ex),
            data: this.data.strength[ex].map(r => r.oneRM),
            borderColor: colors[i],
            tension: 0.3
        }));

        // Get all dates for labels (use the exercise with most data)
        const allDates = exercises.flatMap(ex => 
            this.data.strength[ex]?.map(r => this.formatDate(r.date)) || []
        );
        const uniqueDates = [...new Set(allDates)].sort();

        this.charts.strength.data.labels = uniqueDates;
        this.charts.strength.data.datasets = datasets;
        this.charts.strength.update();
    }

    getExerciseName(ex) {
        const names = {
            bench: 'Жим лежачи',
            squat: 'Присідання',
            deadlift: 'Станова тяга',
            ohp: 'Жим стоячи',
            pullup: 'Підтягування'
        };
        return names[ex] || ex;
    }

    updateCharts() {
        // Update weight chart
        this.charts.weight.data.labels = this.data.weight.map(w => this.formatDate(w.date));
        this.charts.weight.data.datasets[0].data = this.data.weight.map(w => w.value);
        this.charts.weight.update();

        // Update bodyfat chart
        this.charts.bodyfat.data.labels = this.data.bodyfat.map(bf => this.formatDate(bf.date));
        this.charts.bodyfat.data.datasets[0].data = this.data.bodyfat.map(bf => bf.value);
        this.charts.bodyfat.update();

        // Update strength chart
        this.updateStrengthChart();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getDate()}.${date.getMonth() + 1}`;
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData() {
        document.getElementById('file-import').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                this.data = imported;
                this.saveData();
                this.renderAll();
                this.updateCharts();
                alert('Дані успішно імпортовано!');
            } catch (error) {
                alert('Помилка імпорту: некоректний формат файлу');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    }

    clearAllData() {
        if (confirm('Ви впевнені? Всі дані прогресу будуть видалені без можливості відновлення.')) {
            this.data = {
                weight: [],
                bodyfat: [],
                measurements: [],
                strength: {},
                goals: {}
            };
            this.saveData();
            this.renderAll();
            this.updateCharts();
        }
    }

    updateNavigation() {
        const protocolLink = document.getElementById('nav-protocol');
        if (protocolLink && localStorage.getItem('athleteStats')) {
            protocolLink.style.display = 'inline-block';
        }
    }
}

// Initialize tracker when DOM is ready
let progressTracker;
document.addEventListener('DOMContentLoaded', () => {
    progressTracker = new ProgressTracker();
});