# Методичка drgulko.org — German A1–C1 (v1)

> Практическое руководство для создания и ведения курса A1–C1 на базе LLM. Все примеры совместимы с текущей архитектурой (Vercel AI SDK, /modes, action-json для Anki).

---

## 0) Цель и принципы

* **Цель:** быстрый прогресс студента за счёт циклов: *микро-объяснение → короткая практика → мгновенный фидбек → Anki*.
* **Принципы:** краткость, высокий охват частотных паттернов, адаптивность под уровень, измеримость (rubrics + JSON), экономия токенов.
* **Язык по умолчанию:** примеры на **DE**, пояснения/переводы на **RU** (можно EN/UK по запросу).

## 1) Режимы и формат ответа (для промптов)

* **/german:** краткое объяснение → 1–3 примера → 2–3 задания → **после разделителя** решения.
* **/editor:** только исправленный текст → разделитель → до 5 буллетов "Why".
* **/caption:** 2 варианта + ≤5 хештегов.
* **/script:** Hook → 3–5 beats → CTA (OST/VO при необходимости).
* **/exam-assessor:** оценка по **telc/Goethe** рубрике, JSON + короткий комментарий.
* **/deep-exam:** продвинутый разбор: JSON-оценка → секции фидбека → минимальная правка → план → CEFR reasoning → **Anki action-json**.
* **/anki:** CSV `term|grammar|meaning|example_de|example_ru|tags` + при необходимости `action-json`.

## 2) Каркас урока (Lesson Blueprint)

**Шаблон для темы (пример: Konjunktiv II — Höflichkeit):**

1. **Мини-объяснение (≤120 слов)**: правило + 2 частотные формулы.
2. **Примеры (3):** короткие, бытовая лексика.
3. **Упражнения (3):** cloze/transform/word order; по возрастанию сложности.
4. **Ответы** после разделителя.
5. **Anki (3–5)**: готовые карточки (action-json).

## 3) Матрица тем A1–C1 (конспект)

* **A1:** Alphabet & sounds; Grüßen; sein/haben; Präsens; der/die/das; Plural; Wo/Wohin (in, auf, an); Wortstellung HS; Alltag-Wortschatz (Einkaufen, Termine).
* **A2:** Modalverben; Perfekt/Präteritum частотные; Adjektivdeklination (N/A/D); trennbare Verben; Präpositionen с управлением; простые письма.
* **B1:** Nebensätze (weil, dass, wenn); Konjunktiv II (Höflichkeit/Irreales); Passiv (einfach); Meinung/Argumentieren; Prüfung Schreiben/Mündlich.
* **B2:** сложная Wortstellung; erweitertes Passiv; Nominalisierung; Konnektoren (zwar…aber, je…desto); Zusammenfassung/Paraphrase; Aufsatzstruktur.
* **C1:** Stil/Register; Kollokationen/Idiome; Kohärenz/Kohäsion; Akademisches Schreiben; Präsentationen.

## 4) Банки упражнений — шаблоны генерации

### 4.1 Cloze (JSON)

\`\`\`json
{"type":"cloze","items":[{"q":"Ich gehe __ die Stadt (Wohin?)","a":"in die"}]}
\`\`\`

### 4.2 Transform

\`\`\`json
{"type":"transform","items":[{"q":"Ich habe keine Zeit. (höflicher Vorschlag)","a":"Hätten Sie vielleicht später Zeit?"}]}
\`\`\`

### 4.3 Wortstellung

\`\`\`json
{"type":"wordorder","items":[{"q":["Morgen","ich","arbeite","nicht"],"a":"Morgen arbeite ich nicht."}]}
\`\`\`

### 4.4 Schreiben (микро-навыки)

* Задание: 60–120 слов, тип (Anfrage/Beschwerde/Entschuldigung), 3–4 пункта обязательного упоминания.

## 5) Оценивание по telc/Goethe

* **Критерии (ядро):** Grammatik, Lexik, Struktur/Kohärenz, Aufgabenbezug (0–3).
* **/exam-assessor:** просим строгий JSON: `{ "gesamt": int, "kriterien": {"Grammatik":0-3, ...} }` + 1–2 строки комментария.
* **/deep-exam:** добавляем секции фидбека, минимальную правку и план.
* **Согласованность:** хранить эталонные рубрики JSON в `src/lib/rubrics`.

## 6) Anki-интеграция

* **Формат карточки:** `term|grammar|meaning|example_de|example_ru|tags` (RU по умолчанию).
* **action-json** в конце ответа (если уместно):

```action-json
{"action":"anki.queue","deck":"Deutsch — DrGulko","confirm":"preview","cards":[
  {"term":"schwärmen","grammar":"Verb: schwärmt · schwärmte · hat geschwärmt","meaning":"восхищаться, восторгаться","example_de":"Viele schwärmen von Zürich im Sommer.","example_ru":"Многие восторгаются Цюрихом летом.","tags":["Kapitel_03","Verb"]}
]}
