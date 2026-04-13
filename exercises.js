// exercises.js - Comprehensive Exercise Library (Fixed Version)

class ExerciseLibrary {
    constructor() {
        this.exercises = this.initializeExerciseDatabase();
        this.favorites = this.loadFavorites();
        this.filters = {
            muscles: new Set(),
            equipment: new Set(),
            difficulty: null,
            search: '',
            favoritesOnly: false
        };
        this.initializeEventListeners();
        this.renderExercises();
    }

    initializeExerciseDatabase() {
        return [
            // CHEST EXERCISES
            {
                id: 'bench-press',
                name: 'Жим штанги лежачи',
                nameEn: 'Bench Press',
                primaryMuscle: 'chest',
                secondaryMuscles: ['triceps', 'shoulders'],
                equipment: 'barbell',
                difficulty: 'intermediate',
                icon: '🏋️',
                instructions: [
                    'Ляжте на лаву, ступні щільно притиснуті до підлоги',
                    'Візьміться за штангу хватом трохи ширше плечей',
                    'Зніміть штангу зі стійок, тримайте її над грудьми',
                    'Опускайте штангу до середини грудей, лікті під кутом 45°',
                    'Потужно витисніть штангу вгору до повного випрямлення рук'
                ],
                tips: [
                    'Тримайте лопатки зведеними протягом всього руху',
                    'Створіть невеликий прогин у попереку',
                    'Не відбивайте штангу від грудей',
                    'Видихайте на зусиллі'
                ],
                commonMistakes: [
                    'Відрив тазу від лави',
                    'Розведення ліктів в сторони',
                    'Нерівномірне опускання штанги'
                ]
            },
            {
                id: 'incline-dumbbell-press',
                name: 'Жим гантелей на похилій лаві',
                nameEn: 'Incline Dumbbell Press',
                primaryMuscle: 'chest',
                secondaryMuscles: ['triceps', 'shoulders'],
                equipment: 'dumbbell',
                difficulty: 'intermediate',
                icon: '🏋️',
                instructions: [
                    'Встановіть лаву під кутом 30-45 градусів',
                    'Візьміть гантелі, ляжте на лаву',
                    'Підніміть гантелі над грудьми, долоні вперед',
                    'Опускайте гантелі до рівня грудей, лікті трохи зігнуті',
                    'Потужним рухом поверніть гантелі вгору'
                ],
                tips: [
                    'Контролюйте негативну фазу руху',
                    'У верхній точці не зводьте гантелі разом',
                    'Відчувайте розтягнення грудних м\'язів'
                ],
                commonMistakes: [
                    'Занадто великий кут нахилу лави',
                    'Прогин у попереку'
                ]
            },
            {
                id: 'dips',
                name: 'Віджимання на брусах',
                nameEn: 'Dips',
                primaryMuscle: 'chest',
                secondaryMuscles: ['triceps', 'shoulders'],
                equipment: 'bodyweight',
                difficulty: 'intermediate',
                icon: '💪',
                instructions: [
                    'Візьміться за бруси, вистрибніть на прямі руки',
                    'Трохи нахиліть корпус вперед для акценту на грудні',
                    'Опускайтесь до кута 90 градусів у ліктях',
                    'Потужним рухом витисніть себе вгору'
                ],
                tips: [
                    'Не опускайтесь занадто низько для захисту плечей',
                    'Тримайте корпус стабільним',
                    'Для обтяження використовуйте пояс з вагою'
                ],
                commonMistakes: [
                    'Занадто глибоке опускання',
                    'Розгойдування корпусу'
                ]
            },
            {
                id: 'pushups',
                name: 'Віджимання від підлоги',
                nameEn: 'Push-ups',
                primaryMuscle: 'chest',
                secondaryMuscles: ['triceps', 'shoulders', 'core'],
                equipment: 'bodyweight',
                difficulty: 'beginner',
                icon: '💪',
                instructions: [
                    'Прийміть упор лежачи, руки на ширині плечей',
                    'Тіло утворює пряму лінію',
                    'Опускайтесь до кута 90 градусів у ліктях',
                    'Потужно витисніть себе вгору'
                ],
                tips: [
                    'Тримайте прес напруженим',
                    'Не прогинайте поперек',
                    'Лікті тримайте під кутом 45°'
                ],
                commonMistakes: [
                    'Провисання тазу',
                    'Неповна амплітуда'
                ]
            },

            // BACK EXERCISES
            {
                id: 'pull-ups',
                name: 'Підтягування',
                nameEn: 'Pull-ups',
                primaryMuscle: 'back',
                secondaryMuscles: ['biceps', 'shoulders'],
                equipment: 'bodyweight',
                difficulty: 'intermediate',
                icon: '🦅',
                instructions: [
                    'Візьміться за перекладину хватом трохи ширше плечей',
                    'Повисніть на прямих руках',
                    'Зводячи лопатки, підтягніться до перекладини',
                    'Підборіддя має піднятися вище перекладини',
                    'Контрольовано опустіться вниз'
                ],
                tips: [
                    'Починайте рух зі зведення лопаток',
                    'Уникайте розгойдування',
                    'У верхній точці напружте м\'язи спини'
                ],
                commonMistakes: [
                    'Використання інерції',
                    'Неповна амплітуда',
                    'Розслаблені лопатки'
                ]
            },
            {
                id: 'barbell-row',
                name: 'Тяга штанги в нахилі',
                nameEn: 'Barbell Row',
                primaryMuscle: 'back',
                secondaryMuscles: ['biceps', 'shoulders'],
                equipment: 'barbell',
                difficulty: 'intermediate',
                icon: '🏋️',
                instructions: [
                    'Нахиліться вперед, спина пряма під кутом 45°',
                    'Візьміть штангу хватом трохи ширше плечей',
                    'Тягніть штангу до нижньої частини живота',
                    'Зводьте лопатки у верхній точці',
                    'Плавно опустіть штангу вниз'
                ],
                tips: [
                    'Тримайте спину прямою протягом всього руху',
                    'Використовуйте м\'язи спини, а не рук',
                    'Не використовуйте інерцію'
                ],
                commonMistakes: [
                    'Округлення спини',
                    'Ривки штанги',
                    'Занадто велика вага'
                ]
            },
            {
                id: 'lat-pulldown',
                name: 'Тяга верхнього блоку',
                nameEn: 'Lat Pulldown',
                primaryMuscle: 'back',
                secondaryMuscles: ['biceps', 'shoulders'],
                equipment: 'cable',
                difficulty: 'beginner',
                icon: '🎯',
                instructions: [
                    'Сядьте за тренажер, зафіксуйте стегна',
                    'Візьміться за рукоятку широким хватом',
                    'Тягніть рукоятку до верхньої частини грудей',
                    'Зводьте лопатки, злегка прогинайте спину',
                    'Контрольовано поверніться у вихідне положення'
                ],
                tips: [
                    'Не відхиляйтесь назад більше ніж на 10-15 градусів',
                    'Відчувайте роботу найширших м\'язів',
                    'Уникайте ривків'
                ],
                commonMistakes: [
                    'Занадто сильний нахил назад',
                    'Використання інерції'
                ]
            },

            // LEGS EXERCISES
            {
                id: 'squat',
                name: 'Присідання зі штангою',
                nameEn: 'Barbell Squat',
                primaryMuscle: 'legs',
                secondaryMuscles: ['core', 'back'],
                equipment: 'barbell',
                difficulty: 'intermediate',
                icon: '🦵',
                instructions: [
                    'Розмістіть штангу на верхній частині спини',
                    'Поставте ноги на ширині плечей, носки трохи назовні',
                    'Опускайтесь, відводячи таз назад, тримайте спину прямою',
                    'Присідайте до паралелі стегон з підлогою або нижче',
                    'Потужним рухом поверніться у вихідне положення'
                ],
                tips: [
                    'Тримайте груди розправленими',
                    'Коліна повинні рухатися в напрямку носків',
                    'Не відривайте п\'яти від підлоги',
                    'Вдихайте при опусканні, видихайте на підйомі'
                ],
                commonMistakes: [
                    'Відрив п\'ят',
                    'Коліна зводяться всередину',
                    'Округлення спини'
                ]
            },
            {
                id: 'deadlift',
                name: 'Станова тяга',
                nameEn: 'Deadlift',
                primaryMuscle: 'legs',
                secondaryMuscles: ['back', 'core'],
                equipment: 'barbell',
                difficulty: 'advanced',
                icon: '🏋️',
                instructions: [
                    'Поставте ноги на ширині тазу, штанга над серединою стопи',
                    'Нахиліться, тримаючи спину прямою, візьміться за штангу',
                    'Напружте м\'язи кора, розправте груди',
                    'Потягніть штангу вгору, тримаючи її близько до ніг',
                    'Повністю випряміться, напружте сідниці у верхній точці'
                ],
                tips: [
                    'Штанга повинна рухатися вертикально',
                    'Не округлюйте спину',
                    'Дивіться вперед, а не вниз',
                    'Починайте рух з ніг, а не зі спини'
                ],
                commonMistakes: [
                    'Округлення спини',
                    'Штанга далеко від ніг',
                    'Початок руху зі спини'
                ]
            },
            {
                id: 'lunges',
                name: 'Випади з гантелями',
                nameEn: 'Dumbbell Lunges',
                primaryMuscle: 'legs',
                secondaryMuscles: ['core'],
                equipment: 'dumbbell',
                difficulty: 'beginner',
                icon: '🚶',
                instructions: [
                    'Візьміть гантелі в обидві руки',
                    'Зробіть широкий крок вперед',
                    'Опустіться до кута 90 градусів в обох колінах',
                    'Заднє коліно майже торкається підлоги',
                    'Відштовхніться передньою ногою, поверніться у вихідне положення'
                ],
                tips: [
                    'Тримайте корпус вертикально',
                    'Переднє коліно не повинно виходити за носок',
                    'Чергуйте ноги'
                ],
                commonMistakes: [
                    'Нахил корпусу вперед',
                    'Коліно виходить за носок',
                    'Втрата рівноваги'
                ]
            },
            {
                id: 'leg-press',
                name: 'Жим ногами',
                nameEn: 'Leg Press',
                primaryMuscle: 'legs',
                secondaryMuscles: [],
                equipment: 'machine',
                difficulty: 'beginner',
                icon: '🦵',
                instructions: [
                    'Сядьте в тренажер, поставте ноги на платформу',
                    'Опустіть платформу до кута 90° в колінах',
                    'Потужно витисніть платформу, не блокуючи коліна',
                    'Контролюйте рух в обидві сторони'
                ],
                tips: [
                    'Не відривайте таз від сидіння',
                    'Не блокуюйте коліна у верхній точці',
                    'Тримайте стопи повністю на платформі'
                ],
                commonMistakes: [
                    'Блокування колін',
                    'Відрив тазу',
                    'Занадто глибоке опускання'
                ]
            },

            // SHOULDERS EXERCISES
            {
                id: 'overhead-press',
                name: 'Жим штанги стоячи',
                nameEn: 'Overhead Press',
                primaryMuscle: 'shoulders',
                secondaryMuscles: ['triceps', 'core'],
                equipment: 'barbell',
                difficulty: 'intermediate',
                icon: '🏋️',
                instructions: [
                    'Візьміть штангу на груди, хват трохи ширше плечей',
                    'Напружте м\'язи кора, злегка прогніться',
                    'Потужним рухом витисніть штангу над головою',
                    'У верхній точці голова проходить між руками',
                    'Контрольовано опустіть штангу на груди'
                ],
                tips: [
                    'Не використовуйте ноги для поштовху',
                    'Тримайте лікті під штангою',
                    'Не перерозгинайте поперек'
                ],
                commonMistakes: [
                    'Використання ніг',
                    'Прогин у попереку',
                    'Неповна амплітуда'
                ]
            },
            {
                id: 'lateral-raises',
                name: 'Розведення гантелей в сторони',
                nameEn: 'Lateral Raises',
                primaryMuscle: 'shoulders',
                secondaryMuscles: [],
                equipment: 'dumbbell',
                difficulty: 'beginner',
                icon: '🕊️',
                instructions: [
                    'Візьміть гантелі, станьте прямо',
                    'Злегка зігніть лікті, тримайте їх фіксованими',
                    'Піднімайте гантелі в сторони до рівня плечей',
                    'У верхній точці мізинці трохи вище великих пальців',
                    'Плавно опустіть гантелі вниз'
                ],
                tips: [
                    'Не розгойдуйте корпус',
                    'Використовуйте помірну вагу для контролю',
                    'Уникайте підйому вище рівня плечей'
                ],
                commonMistakes: [
                    'Розгойдування корпусу',
                    'Занадто велика вага',
                    'Підйом вище плечей'
                ]
            },

            // ARMS EXERCISES
            {
                id: 'bicep-curls',
                name: 'Згинання рук з гантелями',
                nameEn: 'Dumbbell Bicep Curls',
                primaryMuscle: 'arms',
                secondaryMuscles: [],
                equipment: 'dumbbell',
                difficulty: 'beginner',
                icon: '💪',
                instructions: [
                    'Візьміть гантелі, долоні вперед',
                    'Лікті притиснуті до корпусу',
                    'Згинайте руки, піднімаючи гантелі до плечей',
                    'У верхній точці напружте біцепси',
                    'Повільно опустіть гантелі вниз'
                ],
                tips: [
                    'Не розгойдуйте корпус',
                    'Тримайте лікті фіксованими',
                    'Повністю розгинайте руки внизу'
                ],
                commonMistakes: [
                    'Розгойдування',
                    'Неповна амплітуда',
                    'Рух ліктів'
                ]
            },
            {
                id: 'tricep-extensions',
                name: 'Французький жим',
                nameEn: 'Tricep Extensions',
                primaryMuscle: 'arms',
                secondaryMuscles: [],
                equipment: 'dumbbell',
                difficulty: 'intermediate',
                icon: '💪',
                instructions: [
                    'Ляжте на лаву, візьміть гантель або EZ-гриф',
                    'Підніміть вагу над грудьми, руки прямі',
                    'Згинайте руки в ліктях, опускаючи вагу до лоба',
                    'Лікті залишаються нерухомими',
                    'Потужним рухом випряміть руки'
                ],
                tips: [
                    'Тримайте лікті спрямованими вгору',
                    'Не розводьте лікті в сторони',
                    'Контролюйте рух в обидві сторони'
                ],
                commonMistakes: [
                    'Розведення ліктів',
                    'Занадто велика вага',
                    'Неповне розгинання'
                ]
            },

            // CORE EXERCISES
            {
                id: 'plank',
                name: 'Планка',
                nameEn: 'Plank',
                primaryMuscle: 'core',
                secondaryMuscles: ['shoulders'],
                equipment: 'bodyweight',
                difficulty: 'beginner',
                icon: '🎯',
                instructions: [
                    'Прийміть упор лежачи на передпліччях',
                    'Тіло утворює пряму лінію від голови до п\'ят',
                    'Напружте м\'язи пресу та сідниць',
                    'Утримуйте положення, не прогинаючи поперек'
                ],
                tips: [
                    'Дивіться в підлогу',
                    'Не затримуйте дихання',
                    'Починайте з 30 секунд, поступово збільшуйте час'
                ],
                commonMistakes: [
                    'Провисання тазу',
                    'Підняття тазу вгору',
                    'Затримка дихання'
                ]
            },
            {
                id: 'russian-twists',
                name: 'Російські скручування',
                nameEn: 'Russian Twists',
                primaryMuscle: 'core',
                secondaryMuscles: [],
                equipment: 'bodyweight',
                difficulty: 'intermediate',
                icon: '🌀',
                instructions: [
                    'Сядьте на підлогу, трохи відхиліться назад',
                    'Підніміть ноги, утворюючи V-подібну форму',
                    'Повертайте корпус вліво і вправо',
                    'Руки тримайте перед собою або з обтяженням'
                ],
                tips: [
                    'Рухайтесь контрольовано',
                    'Тримайте спину прямою',
                    'Дихайте рівномірно'
                ],
                commonMistakes: [
                    'Округлення спини',
                    'Занадто швидкий темп',
                    'Опускання ніг'
                ]
            },
            {
                id: 'leg-raises',
                name: 'Підйоми ніг лежачи',
                nameEn: 'Leg Raises',
                primaryMuscle: 'core',
                secondaryMuscles: [],
                equipment: 'bodyweight',
                difficulty: 'beginner',
                icon: '🦵',
                instructions: [
                    'Ляжте на спину, руки вздовж тіла',
                    'Підніміть прямі ноги до кута 90°',
                    'Повільно опустіть ноги, не торкаючись підлоги',
                    'Повторіть рух'
                ],
                tips: [
                    'Притискайте поперек до підлоги',
                    'Не використовуйте інерцію',
                    'Дихайте рівномірно'
                ],
                commonMistakes: [
                    'Відрив попереку',
                    'Згинання колін',
                    'Занадто швидке опускання'
                ]
            },

            // CARDIO EXERCISES
            {
                id: 'burpees',
                name: 'Берпі',
                nameEn: 'Burpees',
                primaryMuscle: 'cardio',
                secondaryMuscles: ['legs', 'chest', 'core'],
                equipment: 'bodyweight',
                difficulty: 'advanced',
                icon: '🏃',
                instructions: [
                    'Почніть з положення стоячи',
                    'Опустіться в присід, поставте руки на підлогу',
                    'Стрибком перейдіть в положення планки',
                    'Виконайте віджимання',
                    'Стрибком поверніться в присід',
                    'Вистрибніть вгору з плесканням над головою'
                ],
                tips: [
                    'Тримайте темп',
                    'Приземляйтесь м\'яко',
                    'Дихайте ритмічно'
                ],
                commonMistakes: [
                    'Провисання в планці',
                    'Жорстке приземлення',
                    'Пропуск віджимання'
                ]
            },
            {
                id: 'mountain-climbers',
                name: 'Скелелаз',
                nameEn: 'Mountain Climbers',
                primaryMuscle: 'cardio',
                secondaryMuscles: ['core', 'legs'],
                equipment: 'bodyweight',
                difficulty: 'intermediate',
                icon: '⛰️',
                instructions: [
                    'Прийміть положення планки на прямих руках',
                    'Почергово підтягуйте коліна до грудей',
                    'Тримайте темп, як при бігу',
                    'Таз залишається на одному рівні'
                ],
                tips: [
                    'Не піднімайте таз вгору',
                    'Тримайте прес напруженим',
                    'Рухайтесь швидко, але контрольовано'
                ],
                commonMistakes: [
                    'Підняття тазу',
                    'Повільний темп',
                    'Неповне підтягування колін'
                ]
            },
            {
                id: 'jumping-jacks',
                name: 'Стрибки з розведенням',
                nameEn: 'Jumping Jacks',
                primaryMuscle: 'cardio',
                secondaryMuscles: ['legs', 'shoulders'],
                equipment: 'bodyweight',
                difficulty: 'beginner',
                icon: '⭐',
                instructions: [
                    'Станьте прямо, ноги разом, руки вздовж тіла',
                    'Стрибком розведіть ноги в сторони',
                    'Одночасно підніміть руки через сторони вгору',
                    'Стрибком поверніться у вихідне положення'
                ],
                tips: [
                    'Приземляйтесь на носки',
                    'Тримайте ритм',
                    'Дихайте рівномірно'
                ],
                commonMistakes: [
                    'Жорстке приземлення',
                    'Неповна амплітуда рук',
                    'Втрата ритму'
                ]
            }
        ];
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem('favoriteExercises');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (e) {
            console.error('Error loading favorites:', e);
            return new Set();
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('favoriteExercises', JSON.stringify([...this.favorites]));
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }

    toggleFavorite(exerciseId) {
        if (this.favorites.has(exerciseId)) {
            this.favorites.delete(exerciseId);
        } else {
            this.favorites.add(exerciseId);
        }
        this.saveFavorites();
        this.renderExercises();
    }

    initializeEventListeners() {
        // Search
        const searchInput = document.getElementById('exercise-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.renderExercises();
            });
        }

        // Muscle filters
        document.querySelectorAll('#muscle-filters input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.filters.muscles.add(e.target.value);
                } else {
                    this.filters.muscles.delete(e.target.value);
                }
                this.renderExercises();
            });
        });

        // Equipment filters
        document.querySelectorAll('.equipment-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const equipment = tag.dataset.equipment;
                if (this.filters.equipment.has(equipment)) {
                    this.filters.equipment.delete(equipment);
                    tag.classList.remove('active');
                } else {
                    this.filters.equipment.add(equipment);
                    tag.classList.add('active');
                }
                this.renderExercises();
            });
        });

        // Difficulty filters
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                
                // Remove active class from all difficulty buttons
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                
                if (this.filters.difficulty === difficulty) {
                    this.filters.difficulty = null;
                } else {
                    this.filters.difficulty = difficulty;
                    btn.classList.add('active');
                }
                this.renderExercises();
            });
        });

        // Show favorites button
        const showFavoritesBtn = document.getElementById('show-favorites');
        if (showFavoritesBtn) {
            showFavoritesBtn.addEventListener('click', () => {
                this.filters.favoritesOnly = !this.filters.favoritesOnly;
                showFavoritesBtn.textContent = this.filters.favoritesOnly ? '📋 Показати всі' : '⭐ Показати обрані';
                this.renderExercises();
            });
        }

        // Reset filters button
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    resetFilters() {
        this.filters = {
            muscles: new Set(),
            equipment: new Set(),
            difficulty: null,
            search: '',
            favoritesOnly: false
        };
        
        // Reset UI
        const searchInput = document.getElementById('exercise-search');
        if (searchInput) searchInput.value = '';
        
        document.querySelectorAll('#muscle-filters input').forEach(cb => cb.checked = false);
        document.querySelectorAll('.equipment-tag').forEach(tag => tag.classList.remove('active'));
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
        
        const showFavoritesBtn = document.getElementById('show-favorites');
        if (showFavoritesBtn) showFavoritesBtn.textContent = '⭐ Показати обрані';
        
        this.renderExercises();
    }

    filterExercises() {
        return this.exercises.filter(exercise => {
            // Search filter
            if (this.filters.search && 
                !exercise.name.toLowerCase().includes(this.filters.search) &&
                !exercise.nameEn.toLowerCase().includes(this.filters.search)) {
                return false;
            }

            // Favorites filter
            if (this.filters.favoritesOnly && !this.favorites.has(exercise.id)) {
                return false;
            }

            // Muscle filter
            if (this.filters.muscles.size > 0) {
                const exerciseMuscles = [exercise.primaryMuscle, ...(exercise.secondaryMuscles || [])];
                if (![...this.filters.muscles].some(m => exerciseMuscles.includes(m))) {
                    return false;
                }
            }

            // Equipment filter
            if (this.filters.equipment.size > 0 && !this.filters.equipment.has(exercise.equipment)) {
                return false;
            }

            // Difficulty filter
            if (this.filters.difficulty && exercise.difficulty !== this.filters.difficulty) {
                return false;
            }

            return true;
        });
    }

    renderExercises() {
        const filtered = this.filterExercises();
        const grid = document.getElementById('exercises-grid');
        const resultsCount = document.getElementById('results-count');
        
        if (!grid || !resultsCount) {
            console.error('Required elements not found');
            return;
        }
        
        resultsCount.textContent = `Показано ${filtered.length} вправ`;
        
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <h3>🔍 Вправи не знайдено</h3>
                    <p>Спробуйте змінити параметри пошуку</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(exercise => `
            <div class="exercise-card" data-exercise-id="${exercise.id}">
                <div class="exercise-image" data-muscle="${exercise.primaryMuscle}">
                    <span style="font-size: 4rem;">${exercise.icon}</span>
                    <span class="exercise-difficulty">${this.getDifficultyText(exercise.difficulty)}</span>
                </div>
                <div class="exercise-content">
                    <h3 class="exercise-title">${exercise.name}</h3>
                    <div class="exercise-muscles">
                        <span class="muscle-tag">${this.getMuscleName(exercise.primaryMuscle)}</span>
                        ${exercise.secondaryMuscles.map(m => 
                            `<span class="muscle-tag">${this.getMuscleName(m)}</span>`
                        ).join('')}
                    </div>
                    <div class="exercise-equipment">
                        ${this.getEquipmentText(exercise.equipment)}
                    </div>
                    <button class="favorite-btn ${this.favorites.has(exercise.id) ? 'favorited' : ''}">
                        ${this.favorites.has(exercise.id) ? '★ В обраному' : '☆ Додати в обране'}
                    </button>
                </div>
            </div>
        `).join('');

        // Add click listeners to cards
        grid.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the favorite button
                if (!e.target.closest('.favorite-btn')) {
                    const exerciseId = card.dataset.exerciseId;
                    this.openModal(exerciseId);
                }
            });
        });

        // Add click listeners to favorite buttons
        grid.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.exercise-card');
                const exerciseId = card.dataset.exerciseId;
                this.toggleFavorite(exerciseId);
            });
        });
    }

    openModal(exerciseId) {
        const exercise = this.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;

        const modal = document.getElementById('exercise-modal');
        if (!modal) return;

        document.getElementById('modal-title').textContent = exercise.name;
        
        document.getElementById('modal-muscles').innerHTML = `
            <span class="muscle-tag">${this.getMuscleName(exercise.primaryMuscle)}</span>
            ${exercise.secondaryMuscles.map(m => 
                `<span class="muscle-tag">${this.getMuscleName(m)}</span>`
            ).join('')}
        `;

        document.getElementById('modal-body').innerHTML = `
            <div style="margin-bottom: 30px;">
                <h4 style="color: var(--accent); margin-bottom: 15px;">📋 Інструкція</h4>
                <div class="instruction-steps">
                    ${exercise.instructions.map((step, i) => `
                        <div class="step">
                            <div class="step-number">${i + 1}</div>
                            <div>${step}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="tips-section">
                <h4>💡 Ключові поради</h4>
                <ul class="tips-list">
                    ${exercise.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>

            ${exercise.commonMistakes ? `
                <div class="tips-section" style="margin-top: 20px; background: #FFF3CD;">
                    <h4 style="color: #856404;">⚠️ Типові помилки</h4>
                    <ul class="tips-list">
                        ${exercise.commonMistakes.map(mistake => `<li>${mistake}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div style="margin-top: 30px; padding: 20px; background: #F2F3F0; border-radius: 12px;">
                <strong>🏋️ Обладнання:</strong> ${this.getEquipmentText(exercise.equipment)}<br>
                <strong>📊 Складність:</strong> ${this.getDifficultyText(exercise.difficulty)}
            </div>
        `;

        modal.classList.add('active');
    }

    getMuscleName(muscle) {
        const names = {
            chest: 'Грудні',
            back: 'Спина',
            legs: 'Ноги',
            shoulders: 'Плечі',
            arms: 'Руки',
            core: 'Кор',
            cardio: 'Кардіо',
            triceps: 'Трицепс',
            biceps: 'Біцепс'
        };
        return names[muscle] || muscle;
    }

    getEquipmentText(equipment) {
        const texts = {
            barbell: '🏋️ Штанга',
            dumbbell: '💪 Гантелі',
            bodyweight: '🧍 Власна вага',
            machine: '🏗️ Тренажер',
            cable: '🔌 Кросовер',
            kettlebell: '🔔 Гиря'
        };
        return texts[equipment] || equipment;
    }

    getDifficultyText(difficulty) {
        const texts = {
            beginner: '🌱 Початківець',
            intermediate: '📈 Середній',
            advanced: '🔥 Просунутий'
        };
        return texts[difficulty] || difficulty;
    }
}

// Global functions
function closeModal() {
    const modal = document.getElementById('exercise-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize library when DOM is ready
let exerciseLibrary;
document.addEventListener('DOMContentLoaded', () => {
    exerciseLibrary = new ExerciseLibrary();
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Close modal on outside click
    const modal = document.getElementById('exercise-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Add close button listener
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
});