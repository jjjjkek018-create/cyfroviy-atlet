// plan.js – Цифровий Атлет
// Повна версія з робочими PDF-кнопками та базою тренувань

document.addEventListener('DOMContentLoaded', () => {
    // ---------- 1. ПЕРЕВІРКА ЗБЕРЕЖЕНИХ ДАНИХ ----------
    const savedData = localStorage.getItem('athleteStats');
    if (!savedData) {
        document.body.innerHTML = `
            <div style="text-align:center; padding:100px; font-family:sans-serif;">
                <h2>❌ Дані не знайдені</h2>
                <p>Поверніться на сторінку <a href="science.html">Біохімії</a> та заповніть форму.</p>
            </div>
        `;
        return;
    }

    const stats = JSON.parse(savedData);
    
    // ---------- 2. РОЗРАХУНОК МАКРОСІВ ----------
    let targetCals = stats.tdee;
    if (stats.goal === 'cut') targetCals -= 400;
    if (stats.goal === 'bulk') targetCals += 300;

    const proteinGrams = Math.round(stats.lbm * 2.2);
    const fatGrams = Math.round((targetCals * 0.25) / 9);
    const carbGrams = Math.round((targetCals - (proteinGrams * 4) - (fatGrams * 9)) / 4);

    document.getElementById('target-cals').innerText = Math.round(targetCals) + ' kcal';
    document.getElementById('macro-p').innerText = proteinGrams + 'г';
    document.getElementById('macro-f').innerText = fatGrams + 'г';
    document.getElementById('macro-c').innerText = carbGrams + 'г';

    // ---------- 3. БАЗА РЕЦЕПТІВ ----------
    const mealDatabase = {
        breakfast: [
            { title: "Омлет з авокадо та шпинатом", slug: "omlet-z-avokado-ta-shpinatom", desc: "3 яйця, 50г авокадо, жменя шпинату.", calories: 420, protein: 28, fat: 30, carbs: 8, ingredients: ["3 яйця", "½ авокадо (50г)", "жменя шпинату", "1 ч.л. оливкової олії", "сіль, перець"], instructions: "Збийте яйця. Розігрійте сковороду з олією. Вилийте яйця, додайте шпинат. Готуйте 2-3 хв. Подавайте з авокадо." },
            { title: "Вівсянка з сироватковим протеїном", slug: "vivsyanka-z-sirovatkovim-proteyinim", desc: "60г вівса, 30г протеїну, ягоди.", calories: 380, protein: 32, fat: 8, carbs: 48, ingredients: ["60г вівсяних пластівців", "30г сироваткового протеїну", "250мл молока/води", "50г ягід", "10г мигдалю"], instructions: "Зваріть вівсянку на молоці/воді. Остудіть 1-2 хв. Додайте протеїн, перемішайте. Додайте ягоди та мигдаль." },
            { title: "Яєчня з беконом та помідорами", slug: "yayechnya-z-bekonom-ta-pomidorami", desc: "3 яйця, 2 скибки бекону, помідори чері.", calories: 460, protein: 26, fat: 36, carbs: 6, ingredients: ["3 яйця", "40г бекону", "80г помідорів чері", "1 ч.л. олії", "зелень"], instructions: "Обсмажте бекон до хрусткості. Додайте помідори на 1 хв. Вбийте яйця, готуйте 3-4 хв. Посипте зеленню." },
            { title: "Сирники зі сметаною", slug: "sirniki-zi-smetanoyu", desc: "200г сиру, 1 яйце, 30г борошна, сметана.", calories: 420, protein: 32, fat: 18, carbs: 30, ingredients: ["200г кисломолочного сиру 5%", "1 яйце", "30г борошна", "1 ст.л. цукру", "50г сметани"], instructions: "Змішайте сир, яйце, борошно, цукор. Сформуйте сирники. Смажте до золотавості. Подавайте зі сметаною." },
            { title: "Тости з лососем та крем-сиром", slug: "tosti-z-lososem-ta-krem-sirom", desc: "Цільнозерновий хліб, слабосолений лосось, сир.", calories: 410, protein: 22, fat: 20, carbs: 32, ingredients: ["2 скибки цільнозернового хліба", "60г лосося", "30г крем-сиру", "¼ авокадо", "кріп"], instructions: "Підсушіть хліб. Намажте крем-сир. Викладіть лосось та авокадо. Посипте кропом." },
            { title: "Протеїновий смузі-боул", slug: "proteyinoviy-smoothie-bowl", desc: "Банан, ягоди, протеїн, насіння чіа.", calories: 390, protein: 35, fat: 14, carbs: 30, ingredients: ["1 заморожений банан (100г)", "80г заморожених ягід", "30г сироваткового протеїну", "120мл мигдального молока", "1 ст.л. насіння чіа", "10г мигдальних пластівців"], instructions: "У блендері збийте банан, ягоди, протеїн та молоко до кремової текстури. Викладіть у тарілку, посипте насінням чіа та мигдалем." },
            { title: "Грецький йогурт з горіхами та ягодами", slug: "gretskiy-yogurt-z-gorihami-ta-yagodami", desc: "150г грецького йогурту, ягоди, волоські горіхи.", calories: 280, protein: 20, fat: 14, carbs: 18, ingredients: ["150г грецького йогурту 2-5%", "50г свіжих ягід", "15г волоських горіхів", "1 ч.л. насіння льону", "½ ч.л. меду (опціонально)"], instructions: "Викладіть йогурт у піалу. Додайте ягоди, подрібнені горіхи та насіння льону. За бажанням полийте медом." },
            { title: "Омлет з сиром та зеленню", slug: "omlet-z-syrom-ta-zelennyu", desc: "3 яйця, моцарела, свіжа зелень.", calories: 380, protein: 30, fat: 26, carbs: 4, ingredients: ["3 яйця", "2 ст.л. молока", "30г моцарели", "жменя зелені (кріп, петрушка)", "5г вершкового масла"], instructions: "Збийте яйця з молоком. Розігрійте масло, вилийте яєчну суміш. Посипте тертим сиром та зеленню, накрийте кришкою на 2 хв." },
            { title: "Смузі з гарбуза та протеїном", slug: "smuzi-z-garbuza-ta-proteinom", desc: "Гарбузове пюре, банан, протеїн, спеції.", calories: 320, protein: 28, fat: 6, carbs: 40, ingredients: ["100г гарбузового пюре", "½ банана", "30г ванільного протеїну", "150мл мигдального молока", "кориця, імбир"], instructions: "Збийте всі інгредієнти у блендері до однорідності. Подавайте охолодженим." },
            { title: "Запечені яблука з сиром", slug: "zapech-yabluka-z-syrom", desc: "Яблука, фаршировані кисломолочним сиром.", calories: 250, protein: 18, fat: 5, carbs: 32, ingredients: ["2 великих яблука", "150г кисломолочного сиру 5%", "1 жовток", "1 ч.л. меду", "кориця"], instructions: "Видаліть серцевину яблук. Змішайте сир, жовток, мед, корицю. Наповніть яблука, запікайте при 180°C 25-30 хв." }
        ],
        lunch: [
            { title: "Філе індички з кіноа", slug: "file-indichki-z-kinoa", desc: "150г індички, 80г кіноа, овочі гриль.", calories: 520, protein: 45, fat: 16, carbs: 48, ingredients: ["150г філе індички", "80г кіноа", "100г кабачка", "80г перцю", "2 ст.л. оливкової олії"], instructions: "Замаринуйте індичку. Зваріть кіноа. Обсмажте індичку та овочі на грилі. Подавайте разом." },
            { title: "Лосось з бататом на грилі", slug: "losos-z-batatom-na-grili", desc: "150г лосося, 150г батату, спаржа.", calories: 560, protein: 38, fat: 26, carbs: 42, ingredients: ["150г лосося", "150г батату", "100г спаржі", "2 ст.л. оливкової олії", "лимон"], instructions: "Наріжте батат кружальцями. Замаринуйте лосось. Обсмажте на грилі 4-5 хв з кожного боку." },
            { title: "Куряча грудка з булгуром", slug: "kuryacha-grudka-z-bulgurom", desc: "150г курки, 80г булгуру, тушковані овочі.", calories: 490, protein: 44, fat: 12, carbs: 50, ingredients: ["150г курячої грудки", "80г булгуру", "1 морква", "½ цибулі", "1 помідор"], instructions: "Обсмажте курку. Додайте овочі та булгур. Залийте водою та тушкуйте 15 хв." },
            { title: "Яловичий стейк з картопляним пюре", slug: "yalovichiy-steyk-z-kartoplyanim-pyure", desc: "120г яловичини, 150г картоплі, горошок.", calories: 580, protein: 40, fat: 24, carbs: 50, ingredients: ["120г яловичого стейка", "200г картоплі", "50мл молока", "10г вершкового масла", "80г горошку"], instructions: "Підсмажте стейк по 2-3 хв з кожного боку. Зваріть картоплю, зробіть пюре. Подавайте з горошком." },
            { title: "Тунець з пастою", slug: "tunets-z-pastoyu", desc: "Банка тунця, 80г пасти, песто.", calories: 510, protein: 38, fat: 14, carbs: 58, ingredients: ["1 банка тунця (140г)", "80г пасти", "100г помідорів чері", "2 зубчики часнику", "1 ст.л. песто"], instructions: "Зваріть пасту al dente. Обсмажте часник, додайте тунець та помідори. Змішайте з пастою та песто." },
            { title: "Сочевичний суп", slug: "sochevichniy-sup", desc: "150г сочевиці, овочі, спеції.", calories: 380, protein: 24, fat: 8, carbs: 54, ingredients: ["150г сочевиці", "1 морква", "1 цибуля", "200г помідорів", "1 ст.л. оливкової олії", "спеції"], instructions: "Пасеруйте овочі. Додайте сочевицю, помідори, воду. Варіть 20 хв до готовності." },
            { title: "Гречка з грибами та куркою", slug: "grechka-z-gribami-ta-kurkoyu", desc: "80г гречки, 150г курки, печериці.", calories: 530, protein: 42, fat: 14, carbs: 58, ingredients: ["80г гречаної крупи", "150г курячого філе", "100г печериць", "½ цибулі", "½ моркви"], instructions: "Відваріть гречку. Обсмажте курку та гриби з цибулею та морквою. З'єднайте з гречкою." },
            { title: "Тефтелі з індички з овочами", slug: "turechchini-tefteli-z-ovochami", desc: "200г фаршу з індички, тушковані в томатному соусі.", calories: 340, protein: 38, fat: 14, carbs: 16, ingredients: ["200г фаршу з індички", "1 яйце", "2 ст.л. меленого вівса", "1 перець", "1 кабачок", "1 ст.л. томатної пасти"], instructions: "Сформуйте тефтелі, обсмажте. Тушкуйте з овочами та томатною пастою 20 хв." },
            { title: "Салат з кіноа та креветками", slug: "salat-z-kinoa-ta-krevetkami", desc: "70г кіноа, 100г креветок, овочі.", calories: 410, protein: 32, fat: 14, carbs: 38, ingredients: ["70г кіноа", "100г очищених креветок", "1 огірок", "100г помідорів чері", "½ авокадо", "рукола"], instructions: "Відваріть кіноа та креветки. Наріжте овочі. Змішайте, заправте оливковою олією та лимонним соком." },
            { title: "Запечене філе лосося з овочами", slug: "zapechne-filet-lososya-z-ovochami", desc: "150г лосося, цукіні, перець, чері.", calories: 480, protein: 36, fat: 28, carbs: 20, ingredients: ["150г лосося", "1 малий цукіні", "½ червоного перця", "100г помідорів чері", "1.5 ст.л. оливкової олії"], instructions: "Запікайте овочі 10 хв при 200°C, потім додайте лосось і запікайте ще 12-15 хв." },
            { title: "Тушкована яловичина з овочами", slug: "tushkovana-yalovichina-z-ovochami", desc: "150г яловичини, картопля, морква.", calories: 450, protein: 38, fat: 18, carbs: 32, ingredients: ["150г яловичини", "150г картоплі", "1 морква", "1 цибуля", "1 ст.л. томатної пасти"], instructions: "Обсмажте яловичину, додайте овочі та томатну пасту. Тушкуйте 1.5-2 год, потім додайте картоплю ще на 25 хв." },
            { title: "Печені батати з фаршем", slug: "pecheni-batati-z-farshem", desc: "Батат, фарширований курячим фаршем та сиром.", calories: 550, protein: 35, fat: 22, carbs: 52, ingredients: ["1 великий батат (250г)", "120г курячого фаршу", "½ цибулі", "20г твердого сиру", "1 ст.л. сметани"], instructions: "Запікайте батат навпіл 30 хв. Вийміть м'якоть, змішайте з обсмаженим фаршем та цибулею. Наповніть човники, посипте сиром, запікайте ще 10 хв." },
            { title: "Запечене куряче філе з овочами", slug: "zapech-kurin-file-z-ovochami", desc: "180г курки, броколі, морква, перець.", calories: 360, protein: 40, fat: 10, carbs: 24, ingredients: ["180г курячого філе", "150г броколі", "1 морква", "½ перцю", "1 ст.л. соєвого соусу", "1 ст.л. оливкової олії"], instructions: "Замаринуйте курку. Викладіть все на деко, запікайте при 190°C 20-25 хв." },
            { title: "Вареники з сиром на пару", slug: "varenyky-z-syrom-na-paru", desc: "Домашні вареники з кисломолочним сиром.", calories: 380, protein: 24, fat: 10, carbs: 48, ingredients: ["200г сиру 5%", "150г борошна", "1 яйце", "50мл води", "50г сметани"], instructions: "Замісіть тісто. Розкачайте, виріжте кружальця, покладіть начинку з сиру. Варіть на пару 10-12 хв. Подавайте зі сметаною." },
            { title: "Салат з тунцем та яйцем", slug: "salat-z-tuncem-ta-yaycem", desc: "Банка тунця, 2 яйця, овочі.", calories: 310, protein: 36, fat: 14, carbs: 8, ingredients: ["1 банка тунця у власному соку", "2 варених яйця", "1 огірок", "1 помідор", "салатний мікс", "1 ст.л. оливкової олії"], instructions: "Наріжте яйця та овочі. Змішайте з тунцем, заправте олією та лимонним соком." }
        ],
        dinner: [
            { title: "Біла риба з броколі", slug: "bila-riba-z-brokoli", desc: "150г тріски/хеку, 150г броколі на пару.", calories: 290, protein: 42, fat: 6, carbs: 16, ingredients: ["150г білої риби", "200г броколі", "½ лимона", "1 ст.л. оливкової олії", "часник"], instructions: "Рибу посоліть, поперчіть. Приготуйте на пару 8-10 хв разом з броколі. Полийте лимонним соком." },
            { title: "Кисломолочний сир з мигдалем", slug: "kislomolochniy-sir-z-migdalem", desc: "200г кисломолочного сиру 5%, 20г мигдалю, кориця.", calories: 310, protein: 32, fat: 16, carbs: 10, ingredients: ["200г кисломолочного сиру", "20г мигдалю", "½ ч.л. кориці", "краплі ванілі", "30г ягід"], instructions: "Розімніть сир виделкою. Додайте корицю, ваніль. Перемішайте з подрібненим мигдалем. Прикрасьте ягодами." },
            { title: "Омлет з овочами", slug: "omlet-z-ovochami", desc: "3 яйця, болгарський перець, помідори.", calories: 340, protein: 24, fat: 22, carbs: 12, ingredients: ["3 яйця", "60г перцю", "80г помідора", "¼ цибулі", "2 ст.л. молока"], instructions: "Збийте яйця з молоком. Обсмажте овочі, залийте яйцями. Готуйте під кришкою 5-7 хв." },
            { title: "Курячі котлети на пару з цвітною капустою", slug: "kuryachi-kotleti-na-paru-z-cvitnoyu-kapustoyu", desc: "120г фаршу, 150г цвітної капусти.", calories: 320, protein: 42, fat: 10, carbs: 16, ingredients: ["200г курячого філе", "200г цвітної капусти", "½ цибулі", "1 яйце", "1 ст.л. вівсяних пластівців"], instructions: "Зробіть фарш з курки та цибулі. Додайте яйце та пластівці. Сформуйте котлети. Готуйте на пару 20-25 хв разом з капустою." },
            { title: "Крем-суп з броколі та шпинату", slug: "krem-sup-z-brokolі-ta-shpinatu", desc: "Легкий суп-пюре з броколі та шпинату.", calories: 210, protein: 12, fat: 10, carbs: 18, ingredients: ["300г броколі", "100г шпинату", "1 цибуля", "1 зубчик часнику", "500мл овочевого бульйону"], instructions: "Обсмажте цибулю та часник. Додайте броколі та бульйон, варіть 10 хв. Додайте шпинат, проваріть 2 хв. Збийте блендером." }
        ]
    };

    // ---------- 4. БАЗА ТРЕНУВАНЬ ----------
    const workoutDatabase = {
        // Базові вправи
        exercises: {
            strength: {
                upper: [
                    { name: "Жим штанги лежачи", sets: 4, reps: "5-8", note: "Повна амплітуда, пауза на грудях" },
                    { name: "Підтягування з обтяженням", sets: 4, reps: "6-8", note: "Вибухове піднімання, контрольоване опускання" },
                    { name: "Жим гантелей сидячи", sets: 3, reps: "8-10", note: "Без допомоги ніг" },
                    { name: "Тяга штанги в нахилі", sets: 4, reps: "6-8", note: "Спина пряма" },
                    { name: "Армійський жим", sets: 3, reps: "5-8", note: "Повна амплітуда" },
                    { name: "Віджимання на брусах з вагою", sets: 3, reps: "8-10", note: "Лікті вздовж корпусу" }
                ],
                lower: [
                    { name: "Присідання зі штангою", sets: 4, reps: "5-8", note: "Глибина до паралелі" },
                    { name: "Станова тяга", sets: 3, reps: "5", note: "Спина пряма, штанга близько до гомілок" },
                    { name: "Жим ногами", sets: 3, reps: "8-10", note: "Повна амплітуда" },
                    { name: "Румунська тяга", sets: 3, reps: "8-10", note: "Відчути розтягнення біцепса стегна" },
                    { name: "Випади з гантелями", sets: 3, reps: "10 (кожна нога)", note: "Коліно не виходить за носок" },
                    { name: "Підйоми на носки стоячи", sets: 4, reps: "12-15", note: "Повна амплітуда" }
                ]
            },
            hypertrophy: {
                upper: [
                    { name: "Жим гантелей на похилій лаві", sets: 4, reps: "10-12", note: "Розтягувати грудні" },
                    { name: "Тяга верхнього блоку широким хватом", sets: 4, reps: "10-12", note: "Зводити лопатки" },
                    { name: "Розведення гантелей лежачи", sets: 3, reps: "12-15", note: "Лікті трохи зігнуті" },
                    { name: "Тяга гантелі в нахилі однією рукою", sets: 3, reps: "10-12", note: "Відчути широчезні" },
                    { name: "Підйом гантелей на біцепс", sets: 3, reps: "12-15", note: "Без чітингу" },
                    { name: "Французький жим", sets: 3, reps: "12-15", note: "Лікті фіксовані" }
                ],
                lower: [
                    { name: "Присідання з гантелями (гоблет)", sets: 4, reps: "10-12", note: "Спина пряма" },
                    { name: "Жим ногами", sets: 4, reps: "12-15", note: "Не блокувати коліна" },
                    { name: "Згинання ніг лежачи", sets: 3, reps: "12-15", note: "Плавно" },
                    { name: "Розгинання ніг сидячи", sets: 3, reps: "15-20", note: "Затримка у верхній точці" },
                    { name: "Болгарські спліт-присідання", sets: 3, reps: "10-12", note: "Задня нога на лаві" },
                    { name: "Підйоми на носки в тренажері", sets: 4, reps: "15-20", note: "Пікове скорочення" }
                ]
            },
            endurance: {
                fullbody: [
                    { name: "Берпі", sets: 4, reps: "15", note: "Без пауз" },
                    { name: "Стрибки на тумбу", sets: 3, reps: "12", note: "М'яке приземлення" },
                    { name: "Махи гирею", sets: 3, reps: "20", note: "Вибуховий рух стегнами" },
                    { name: "Випади зі стрибком", sets: 3, reps: "12 (кожна нога)", note: "Чергувати ноги" },
                    { name: "Планка", sets: 3, reps: "60 сек", note: "Таз не провалювати" },
                    { name: "Скакалка", sets: 3, reps: "100 стрибків", note: "На носках" }
                ]
            },
            athletic: {
                fullbody: [
                    { name: "Ривок гирі", sets: 4, reps: "8 (кожна рука)", note: "Техніка понад усе" },
                    { name: "Трастери з гантелями", sets: 4, reps: "10", note: "Присід + жим вгору" },
                    { name: "Підтягування", sets: 4, reps: "макс", note: "Чисті повторення" },
                    { name: "Болгарські спліт-присідання зі стрибком", sets: 3, reps: "10", note: "Вибух вгору" },
                    { name: "Віджимання з плесканням", sets: 3, reps: "8-10", note: "Вибухове зусилля" },
                    { name: "Турецький підйом", sets: 2, reps: "5 (кожна рука)", note: "Контроль на кожному етапі" }
                ]
            }
        },
        // Поради залежно від рівня
        tips: {
            beginner: "Початківцям: зосередьтеся на техніці. Виконуйте розминку 10 хв (кардіо + динамічний стретчинг). Між підходами відпочивайте 90-120 секунд.",
            intermediate: "Середній рівень: прогресивне навантаження щотижня. Розминка 10-15 хв. Відпочинок 60-90 сек між підходами.",
            advanced: "Просунутий рівень: періодизація. Використовуйте RPE шкалу. Відпочинок 45-75 сек (гіпертрофія) або 2-3 хв (сила)."
        }
    };

    // ---------- 5. СТАН ТА UI ----------
    let currentLevel = 'intermediate';
    let currentStyle = 'strength';
    let currentDays = '4';
    let currentMeals = { breakfast: null, lunch: null, dinner: null };
    let currentWorkoutData = null; // зберігає поточну програму для PDF

    function getRandomMeal(category) {
        const meals = mealDatabase[category];
        return meals[Math.floor(Math.random() * meals.length)];
    }

    function renderMeals() {
        currentMeals = {
            breakfast: getRandomMeal('breakfast'),
            lunch: getRandomMeal('lunch'),
            dinner: getRandomMeal('dinner')
        };

        const container = document.getElementById('menu-container');
        container.innerHTML = `
            <div class="meal-item">
                <span class="meal-phase">Сніданок</span>
                <h4>${currentMeals.breakfast.title}</h4>
                <p style="font-size:0.9rem; color:#666;">${currentMeals.breakfast.desc}</p>
                <div style="display:flex; gap:10px; margin-top:10px; font-size:0.8rem; color:var(--accent);">
                    <span>🔥 ${currentMeals.breakfast.calories} ккал</span>
                    <span>💪 ${currentMeals.breakfast.protein}г білка</span>
                </div>
                <button class="recipe-nav-btn" data-recipe="${currentMeals.breakfast.slug}.html">
                    Перейти до рецепту →
                </button>
            </div>

            <div class="meal-item">
                <span class="meal-phase">Обід</span>
                <h4>${currentMeals.lunch.title}</h4>
                <p style="font-size:0.9rem; color:#666;">${currentMeals.lunch.desc}</p>
                <div style="display:flex; gap:10px; margin-top:10px; font-size:0.8rem; color:var(--accent);">
                    <span>🔥 ${currentMeals.lunch.calories} ккал</span>
                    <span>💪 ${currentMeals.lunch.protein}г білка</span>
                </div>
                <button class="recipe-nav-btn" data-recipe="${currentMeals.lunch.slug}.html">
                    Перейти до рецепту →
                </button>
            </div>

            <div class="meal-item">
                <span class="meal-phase">Вечеря</span>
                <h4>${currentMeals.dinner.title}</h4>
                <p style="font-size:0.9rem; color:#666;">${currentMeals.dinner.desc}</p>
                <div style="display:flex; gap:10px; margin-top:10px; font-size:0.8rem; color:var(--accent);">
                    <span>🔥 ${currentMeals.dinner.calories} ккал</span>
                    <span>💪 ${currentMeals.dinner.protein}г білка</span>
                </div>
                <button class="recipe-nav-btn" data-recipe="${currentMeals.dinner.slug}.html">
                    Перейти до рецепту →
                </button>
            </div>
        `;
    }

    // ---------- 6. ГЕНЕРАЦІЯ ТРЕНУВАЛЬНОЇ ПРОГРАМИ ----------
    function getWorkoutProgram() {
        const days = parseInt(currentDays);
        const isFullBodyStyle = (currentStyle === 'endurance' || currentStyle === 'athletic');
        let program = { days: [], tips: workoutDatabase.tips[currentLevel] || "Слухайте своє тіло." };

        if (isFullBodyStyle) {
            // Для витривалості та атлетизму – full-body кожного дня з варіаціями
            const exercisesSet = workoutDatabase.exercises[currentStyle]?.fullbody || workoutDatabase.exercises.strength.upper;
            for (let i = 1; i <= days; i++) {
                let dayExercises = [...exercisesSet];
                // трохи перемішаємо для різноманіття
                dayExercises = dayExercises.sort(() => Math.random() - 0.5).slice(0, 5 + Math.floor(Math.random() * 2));
                program.days.push({
                    name: `День ${i} (Full Body)`,
                    exercises: dayExercises
                });
            }
        } else {
            // Спліт: верх/низ для strength/hypertrophy
            const upperEx = workoutDatabase.exercises[currentStyle]?.upper || workoutDatabase.exercises.strength.upper;
            const lowerEx = workoutDatabase.exercises[currentStyle]?.lower || workoutDatabase.exercises.strength.lower;
            
            if (days <= 3) {
                // Full body або чергування
                for (let i = 1; i <= days; i++) {
                    const mix = (i % 2 === 1) ? 
                        [...upperEx.slice(0,3), ...lowerEx.slice(0,2)] : 
                        [...lowerEx.slice(0,3), ...upperEx.slice(0,2)];
                    program.days.push({
                        name: `День ${i} (Full Body)`,
                        exercises: mix
                    });
                }
            } else {
                // 4-6 днів: спліт верх/низ
                for (let i = 1; i <= days; i++) {
                    if (i % 2 === 1) {
                        program.days.push({
                            name: `День ${i} (Верх тіла)`,
                            exercises: upperEx.slice(0, 5)
                        });
                    } else {
                        program.days.push({
                            name: `День ${i} (Низ тіла)`,
                            exercises: lowerEx.slice(0, 5)
                        });
                    }
                }
            }
        }

        return program;
    }

    function renderWorkout() {
        const program = getWorkoutProgram();
        currentWorkoutData = program; // зберігаємо для PDF

        const container = document.getElementById('workout-container');
        let html = `<div class="workout-tag">${currentStyle} · ${currentLevel} · ${currentDays} дні(в)</div>`;

        program.days.forEach(day => {
            html += `
                <div class="workout-details">
                    <h4 style="margin-top:0; font-family:'Lora',serif;">${day.name}</h4>
                    <ul class="exercise-list">
            `;
            day.exercises.forEach(ex => {
                html += `
                    <li>
                        <span class="exercise-name">${ex.name}</span>
                        <span class="exercise-sets">${ex.sets} × ${ex.reps}</span>
                    </li>
                `;
            });
            html += `</ul></div>`;
        });

        if (program.tips) {
            html += `<p style="margin-top:20px; font-size:0.9rem; color:#666;"><strong>💡 Порада:</strong> ${program.tips}</p>`;
        }

        container.innerHTML = html;
    }

    // ---------- 7. PDF ГЕНЕРАЦІЯ ----------
    async function downloadMealPlanPDF() {
        const element = document.querySelector('.plan-card:first-child');
        if (!element) return;
        await downloadElementAsPDF(element, 'Цифровий_Атлет_Меню.pdf', 'download-meal-pdf');
    }

    async function downloadWorkoutPlanPDF() {
        const element = document.querySelector('#workout-container').closest('.plan-card');
        if (!element) return;
        await downloadElementAsPDF(element, 'Цифровий_Атлет_Програма.pdf', 'download-workout-pdf');
    }

    async function downloadFullRecipesPDF() {
        if (!currentMeals.breakfast || !currentMeals.lunch || !currentMeals.dinner) {
            alert('Спочатку згенеруйте меню.');
            return;
        }

        const btn = document.getElementById('download-full-recipes-pdf');
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Генерація PDF...';
        btn.disabled = true;

        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.padding = '40px';
        container.style.backgroundColor = 'white';
        container.style.fontFamily = "'Work Sans', sans-serif";
        container.style.color = '#1E1E1E';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        const meals = [
            { name: 'Сніданок', data: currentMeals.breakfast },
            { name: 'Обід', data: currentMeals.lunch },
            { name: 'Вечеря', data: currentMeals.dinner }
        ];

        let html = `
            <h1 style="font-family:'Lora',serif; font-size:28px; margin-bottom:20px; color:#2C3E50;">🧾 Ваші рецепти на день</h1>
            <p style="color:#666; margin-bottom:30px;">Цифровий Атлет · ${new Date().toLocaleDateString('uk-UA')}</p>
        `;

        meals.forEach(meal => {
            const m = meal.data;
            html += `
                <div style="margin-bottom:40px; page-break-inside:avoid;">
                    <h2 style="font-family:'Lora',serif; color:#4A6B48; border-bottom:2px solid #4A6B48; padding-bottom:6px;">${meal.name}: ${m.title}</h2>
                    <p style="font-size:15px; color:#444; margin:10px 0;">${m.desc}</p>
                    <div style="display:flex; gap:20px; margin:15px 0;">
                        <span style="background:#E8F0E6; padding:5px 12px; border-radius:20px;">🔥 ${m.calories} ккал</span>
                        <span style="background:#E8F0E6; padding:5px 12px; border-radius:20px;">💪 ${m.protein} г білка</span>
                    </div>
                    <h3 style="margin-top:20px; font-size:18px;">Інгредієнти</h3>
                    <ul style="list-style-type:disc; padding-left:20px;">
                        ${m.ingredients.map(ing => `<li style="margin-bottom:6px;">${ing}</li>`).join('')}
                    </ul>
                    <h3 style="margin-top:25px; font-size:18px;">Приготування</h3>
                    <ol style="padding-left:20px;">
                        ${m.instructions.split('.').filter(step => step.trim()).map(step => `<li style="margin-bottom:10px;">${step.trim()}.</li>`).join('')}
                    </ol>
                </div>
            `;
        });

        container.innerHTML = html;

        try {
            await renderContainerToPDF(container, 'Цифровий_Атлет_Повні_Рецепти.pdf');
        } catch (error) {
            console.error('PDF error:', error);
            alert('Не вдалося створити PDF.');
        } finally {
            document.body.removeChild(container);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async function downloadFullWorkoutPDF() {
        if (!currentWorkoutData || !currentWorkoutData.days) {
            alert('Спочатку згенеруйте програму тренувань.');
            return;
        }

        const btn = document.getElementById('download-full-workout-pdf');
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Генерація PDF...';
        btn.disabled = true;

        const container = document.createElement('div');
        container.style.width = '800px';
        container.style.padding = '40px';
        container.style.backgroundColor = 'white';
        container.style.fontFamily = "'Work Sans', sans-serif";
        container.style.color = '#1E1E1E';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        let html = `
            <h1 style="font-family:'Lora',serif; font-size:28px; margin-bottom:10px; color:#2C3E50;">🏋️ Детальна тренувальна програма</h1>
            <p style="color:#666; margin-bottom:20px;">Рівень: ${currentLevel} · Стиль: ${currentStyle} · Днів: ${currentDays}</p>
        `;

        currentWorkoutData.days.forEach((day) => {
            html += `
                <div style="margin-bottom:30px; page-break-inside:avoid;">
                    <h2 style="font-family:'Lora',serif; color:#4A6B48; border-bottom:2px solid #4A6B48; padding-bottom:6px;">${day.name}</h2>
                    <table style="width:100%; border-collapse:collapse; margin-top:15px;">
                        <thead>
                            <tr style="background:#F2F3F0;">
                                <th style="padding:10px; text-align:left;">Вправа</th>
                                <th style="padding:10px; text-align:center;">Підходи</th>
                                <th style="padding:10px; text-align:center;">Повторення</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            day.exercises.forEach(ex => {
                html += `
                    <tr style="border-bottom:1px solid #ddd;">
                        <td style="padding:10px;">
                            <strong>${ex.name}</strong>
                            ${ex.note ? `<br><span style="font-size:13px; color:#666;">${ex.note}</span>` : ''}
                        </td>
                        <td style="padding:10px; text-align:center;">${ex.sets}</td>
                        <td style="padding:10px; text-align:center;">${ex.reps}</td>
                    </tr>
                `;
            });
            html += `</tbody></table></div>`;
        });

        if (currentWorkoutData.tips) {
            html += `
                <div style="margin-top:30px; padding:20px; background:#F8F9F6; border-radius:8px;">
                    <h3 style="margin-top:0;">💡 Рекомендації</h3>
                    <p>${currentWorkoutData.tips}</p>
                </div>
            `;
        }

        container.innerHTML = html;

        try {
            await renderContainerToPDF(container, 'Цифровий_Атлет_Детальна_Програма.pdf');
        } catch (error) {
            console.error('PDF error:', error);
            alert('Не вдалося створити PDF.');
        } finally {
            document.body.removeChild(container);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    // Допоміжні функції для PDF
    async function downloadElementAsPDF(element, filename, buttonId) {
        const btn = document.getElementById(buttonId);
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Генерація PDF...';
        btn.disabled = true;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(filename);
        } catch (error) {
            console.error('PDF error:', error);
            alert('Не вдалося створити PDF.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async function renderContainerToPDF(container, filename) {
        const canvas = await html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(filename);
    }

    // ---------- 8. ДЕЛЕГУВАННЯ ПОДІЙ ДЛЯ КНОПОК РЕЦЕПТІВ ----------
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.recipe-nav-btn');
        if (!btn) return;
        const recipeFile = btn.getAttribute('data-recipe');
        if (recipeFile) {
            e.preventDefault();
            window.location.href = 'recipes/' + recipeFile;
        }
    });

    // ---------- 9. ОБРОБНИКИ ПОДІЙ ДЛЯ ПЕРЕМИКАЧІВ ----------
    document.querySelectorAll('#level-selector .pref-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('#level-selector .pref-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentLevel = this.dataset.level;
            renderWorkout();
        });
    });

    document.querySelectorAll('#style-selector .pref-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('#style-selector .pref-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentStyle = this.dataset.style;
            renderWorkout();
        });
    });

    document.querySelectorAll('#frequency-selector .pref-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('#frequency-selector .pref-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentDays = this.dataset.days;
            renderWorkout();
        });
    });

    // ---------- 10. ПРИВ'ЯЗКА КНОПОК ----------
    document.getElementById('reroll-meals-btn').addEventListener('click', renderMeals);
    document.getElementById('reroll-workout-btn').addEventListener('click', renderWorkout);
    document.getElementById('download-meal-pdf').addEventListener('click', downloadMealPlanPDF);
    document.getElementById('download-workout-pdf').addEventListener('click', downloadWorkoutPlanPDF);
    document.getElementById('download-full-recipes-pdf').addEventListener('click', downloadFullRecipesPDF);
    document.getElementById('download-full-workout-pdf').addEventListener('click', downloadFullWorkoutPDF);

    // ---------- 11. ІНІЦІАЛІЗАЦІЯ ----------
    renderMeals();
    renderWorkout();
});