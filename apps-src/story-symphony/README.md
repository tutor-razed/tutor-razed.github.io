
# Story Symphony (Phase 1)

A creative writing platform that turns stories into generative visual masterpieces.

## Features
- **Heuristic Analysis**: Real-time detection of mood, tension, rhythm, and sensory details.
- **Generative Symphony**: HTML Canvas rendering that maps text characteristics to organic paint splashes.
- **Finale Playback**: An animated review of your story's visual arc.
- **Local Persistence**: Works entirely in-browser using `localStorage` with schema versioning.
- **Poster Export**: High-res PNG export for physical printing or sharing.

## How Mood is Calculated

The "Mood" of a symphony is determined by a **Lexical Sentiment Engine** that analyzes each sentence individually. It uses a weighted keyword-matching system defined in `analysis/textHeuristics.ts`:

### 1. Keyword Scoring
The engine looks for specific words from our internal lexicons and assigns points:
- **Strong Positive (+2 pts):** Words like *ecstatic, brilliant, triumphant*.
- **Mild Positive (+1 pt):** Words like *calm, safe, pleasant*.
- **Strong Negative (-2 pts):** Words like *devastated, furious, cruel*.
- **Mild Negative (-1 pt):** Words like *annoyed, lonely, grim*.

### 2. Clamping and Normalization
- **Raw Score:** The total sum of points for a sentence is clamped between **-5 and +5**.
- **Normalization:** To drive the visual engine, this range is mapped to a **0.0 to 1.0** scale:
  - `0.0`: Intense Melancholy/Anger
  - `0.5`: Neutral/Observational
  - `1.0`: Pure Joy/Excitement

### 3. Visual Mapping
The resulting score dictates two primary visual conditions on the canvas:
- **Vertical Displacement:** Sentences with a high mood score "float" toward the top of the canvas, while negative sentences "sink" toward the bottom.
- **Palette Selection:** 
  - **High Mood + High Tension:** Electric roses and cyans.
  - **High Mood + Low Tension:** Golden ambers and warm yellows.
  - **Low Mood + High Tension:** Deep crimsons and bruised purples.
  - **Low Mood + Low Tension:** Misty indigos and rainy greys.

## Other Heuristics
1. **Rhythm**: Word count determines the radius of the paint splashes.
2. **Tension**: Punctuation (`!`, `?`, `…`) and contrast words (like *suddenly*) create kinetic "splatters" and dispersion.
3. **Dialogue**: Quotes create vertical "paint drips" that run down the canvas.
4. **Sensory**: Words related to the five senses add "shimmer" highlights and increased opacity to the splashes.

## Development
```bash
npm install
npm run dev
```

## Note
This is **Phase 1 (Visual)**. Audio synthesis and advanced NLP are planned for future phases.
