---
layout: portfolio_item
tags: [portfolio]
title: "Crowdsound"
subtitle: "Real-Time crowd sound Generation from chatroom messages"
date: 2025-03-01
category: "Interaction Design"

preview_image: /portfolio/images/crowdsound_valence.png
preview_alt: Screenshot of chat messages mapped into valence–arousal space with clustered affect states.

short_description: "Live stream chat can move too fast for streamers and viewers to reliably understand how the crowd feels in the moment. This project explores a different modality: making chatroom emotion audible like a live audience. We built a real-time pipeline that pulls live chat messages, estimates affect as valence-arousal pairs using a fine-tuned language model, aggregates crowd affect via clustering, and generates an evolving “crowd soundscape” by mapping affect states to emotionally ranked audio clips."

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
---
---

<h4 class="pi-label">Motivation</h4>
Text chat is a rich emotional signal, but in practice:
- messages scroll too quickly to read at scale,
- affective shifts are easy to miss,
- streamers have limited attention while performing.

We wanted to implement as solution that allowed crowd emotion to be sensed peripherally through sound, like live reactions in a sports event.

<h4 class="pi-label">Approach</h4>

- Input was taken from live chat message streams (pulled from Twitch streaming chat logs)
- Affective representation consisted of continuous valence (positive/negative) and arousal (calm/excited) representation
- Used k-means clustering over short time windows to capture dominant “mood states”
- Audio output: layered playback of affect-matched audio clips, scaled by cluster intensity

<h5 class="pi-label">Text-to-Affect Regression (V–A)</h5>
We fine-tuned a BERT model to predict a (valence, arousal) pair for each message.  
To create continuous labels, we used GoEmotions emotion categories and then mapped each category into V–A space using the NRC VAD lexicon.

{% include figure_wrap.html
  src='portfolio/images/crowdsound_valence.png'
  alt='Graph of valence-arousal cluster with three red circles of differing sizes, indicating the magnitude of the number of associated messages.'
  title='Valence-arousal coordinates of the window of messages'
  caption='Graph of valence-arousal cluster with three red circles of differing sizes, indicating the magnitude of the number of associated messages.'
  align='right'
  col='5'
  class='max-height-20em'
%}

<h5 class="pi-label">Affect Aggregation (Crowd State)</h5>
At every fixed interval (determined based on latency and responsiveness), we collect predicted V–A points, filtered near-neutral messages to reduce noise, and ran K-means (k=3) to find dominant affective states.

Each cluster produces an affect control signal consisting of the centroid coordinate for the valence-arousal pairing, as well as tha magnitude associated with the proportion of messages found in that cluster.

<h5 class="pi-label">Affect-to-Audio Mapping (Sonification)</h5>
We used Emo-Soundscapes (audio clips databse annotated with perceived V–A) as a retrieval base.

For each cluster signal (V, A, intensity), the system:
- finds the closest matching clips in V–A space,
- optionally injects controlled randomness for variety in values,
- mixes clips continuously in real time,
- scales loudness + layering based on intensity (bigger cluster = louder/denser sound).

In informal listening, the soundscape noticeably shifts during spikes of excitement/celebration,stays quiets during neutral chat periods, and conveys “crowd energy” without requiring reading.

<h4 class="pi-label">Outcome and Findings</h4>
We found that subtle/rare emotions were harder to predict and portray via the means we chose to implement the pipeline. We also found that emojis, slang, and low-information messages require careful filtering and processing.

This work is a prototype for social signal amplification that make fast-moving collective emotion more accessible, supports peripheral awareness, and provides a reusable pipeline for other contexts (virtual events, classrooms, live commentary).

{% include figure_wrap.html
  src='portfolio/images/crowdsound_poster.png'
  alt=''
  title='Poster'
  caption='Poster used for demo during showcase for Affective Computing symposium poster presentation.'
  align='none'
  col='5'
  class='max-height-20em'
%}