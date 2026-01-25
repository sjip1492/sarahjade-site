---
layout: portfolio_item
tags: [portfolio]
title: "Crowdsound"
subtitle: "Real-Time Crowd Sound Generation from Chatroom Messages"
date: 2025-03-01
category: "Interaction Design"

preview_image: /portfolio/images/crowdsound_valence.png
preview_alt: Screenshot of chat messages mapped into valence–arousal space with clustered affect states.

short_description: "Live stream chat moves fast—too fast for streamers (and viewers) to reliably understand *how the crowd feels* in the moment. This project explores a different modality: **making chatroom emotion audible like a live audience**."

# tools:
# - Python
# - HuggingFace Transformers
# - BERT
# - Twitch API
# - scikit-learn
# - sounddevice
# - soundfile
skills: 
- Affective computing
- NLP
- Real-time systems
- Data visualization
- Audio interaction design
- Prototyping

gallery:
  - src: /portfolio/images/crowdsound_valence.png
    alt: "System overview diagram"
    caption: ""
  - src: /portfolio/images/crowdsound_poster.png
    alt: "Participant using the system"
    caption: ""
  - src: /portfolio/images/clustering.png
    alt: ""
    caption: ""

---

We built a real-time pipeline that:
1) pulls live chat messages,  
2) estimates affect as **valence–arousal (V–A)** pairs using a fine-tuned language model,  
3) aggregates crowd affect via clustering, and  
4) generates an evolving “crowd soundscape” by mapping affect states to emotionally ranked audio clips.

**Outcome:** a working prototype that turns dense chat into a lightweight, always-on emotional layer—something you can *hear* while watching.

---

## Problem
Text chat is a rich emotional signal, but in practice:
- messages scroll too quickly to read at scale,
- affective shifts are easy to miss,
- streamers have limited attention while performing.

We asked: **What if crowd emotion could be sensed peripherally through sound—like hearing the room?**

---

## Solution
A **text → affect → sound** system that sonifies collective emotion as ambient audio.

- **Input:** live chat messages (e.g., Twitch)
- **Affective representation:** continuous **valence** (positive/negative) and **arousal** (calm/excited)
- **Aggregation:** K-means clustering over short time windows to capture dominant “mood states”
- **Audio output:** layered playback of affect-matched audio clips, scaled by cluster intensity

---

## Pipeline (3 Stages)

### 1) Text-to-Affect Regression (V–A)
We fine-tuned **BERT** to predict a **(valence, arousal)** pair for each message.  
To create continuous labels, we:
- used **GoEmotions** emotion categories,
- mapped each category into V–A space using the **NRC VAD lexicon**.

**Training setup (high level):**
- BERT-base regression head
- MSE loss on valence + arousal
- trained with Hugging Face Transformers (single GPU)

---

### 2) Affect Aggregation (Crowd State)
Every fixed interval (e.g., **30 seconds**), we:
- collect predicted V–A points,
- filter near-neutral messages to reduce noise,
- run **K-means (k=3)** to find dominant affective states.

Each cluster produces an affect control signal:
- **centroid:** (valence, arousal)
- **intensity:** proportion of messages in the cluster

---

### 3) Affect-to-Audio Mapping (Sonification)
We used **Emo-Soundscapes** (audio clips annotated with perceived V–A) as a retrieval base.

For each cluster signal (V, A, intensity), the system:
- finds the closest matching clips in V–A space,
- optionally injects controlled randomness for variety,
- mixes clips in real time,
- scales loudness + layering based on intensity (bigger cluster = louder/denser sound).

---

## What I Built (My Contribution)
I focused on the **affect-to-audio mapping + real-time audio system**, including:

- Implemented the **V–A → audio retrieval** logic using Emo-Soundscapes rankings  
- Built the **real-time mixing engine** in Python (non-blocking playback, layering, volume scaling)
- Designed the **intensity-to-audio rules** (how crowd “energy” changes loudness + texture)
- Collaborated on brainstorming + iteration, and contributed to writing/editing

**Role:** Audio interaction + realtime synthesis prototype

---

## Results
### Model performance (proxy evaluation)
We evaluated affect prediction using nearest-emotion matching in V–A space:
- **Top-1 accuracy:** ~39.75%
- **Top-5 accuracy:** ~64.47%  
(28-way baseline Top-1 ≈ 3.57%)

This supported our goal of **approximate affective correctness**, which is often sufficient for ambient sonification.

### Qualitative behavior
In informal listening, the soundscape:
- noticeably shifts during spikes of excitement/celebration,
- quiets during neutral chat periods,
- conveys “crowd energy” without requiring reading.

---

## Why It Matters
This work is a prototype for **social signal amplification**:
- makes fast-moving collective emotion more accessible,
- supports peripheral awareness (especially for streamers),
- provides a reusable pipeline for other contexts (virtual events, classrooms, live commentary).

---

## Challenges & Learnings
- **Emotion nuance:** subtle/rare emotions were harder to predict (class imbalance + compression into 2D V–A).
- **Noise in chat:** emojis, slang, and low-information messages require careful filtering.
- **Audio design tradeoffs:** “expressive” vs “fatiguing”—sonification must stay informative without becoming distracting.