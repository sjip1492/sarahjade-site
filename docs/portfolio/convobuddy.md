---
layout: portfolio_item
tags: [portfolio]
title: "ConvoBuddy"
subtitle: "A real-time conversational group-entry assistant for networking events"
date: 2025-04-01
category: "Interaction Design"

preview_image: /portfolio/images/convobuddy_1.png
preview_alt: "Screenshot of the UI for the intro screen of ConvoBuddy app."

short_description: "Facilitating smooth entry into ongoing conversations is essential for fostering inclusive social interactions, yet it remains one of the most challenging aspects of conversational dynamics. We present ConvoBuddy, a novel conversational assistant designed to support users actively seeking to join existing conversational groups based upon a preliminary need-finding user study and literature review. The aim of ConvoBuddy is to level the playing field when it comes to navigating informal networking and social scenarios for individuals with social difficulties or anxiety. ConvoBuddy leverages smartphone-based sensors to detect conversational group spatial formations in real time and incorporates entry timing and turn-taking management."

skills:
  - Interaction design
  - User research
  - Prototyping
  - Real-time systems
  - Human-centered AI
  - Need-finding
---

{% include figure_wrap.html
  src='/portfolio/images/convobuddy_1.png'
  alt='Screenshot of the UI for the intro screen of ConvoBuddy app'
  title='UI Screenshot'
  caption='Screenshot of the UI for the intro screen of ConvoBuddy app.'
  align='right'
  col='5'
  class='max-height-20em'
%}

<h4 class="pi-label">Motivation</h4>

Entering an ongoing group conversation is a common yet under-supported social challenge. Individuals often hesitate because they lack context and confidence when joining a group.  These uncertainties compound into social anxiety. Existing social technologies focus on connection before or after interaction (e.g., messaging, conversation facilitation, matchmaking), but offer little support in the moment of embodied social engagement.

ConvoBuddy aims to address this gap by providing real-time, situated assistance at the moment of conversational entry.

<h4 class="pi-label">Need-Finding & Research Insights</h4>

To ground the design, we conducted a need-finding survey exploring discomfort, decision factors, and desired technological support for joining group conversations.

<h5 class="pi-label">Participants</h5>

- 13 participants (ages 18–54; median 18–24), recruited via social networks and online communities.

<h5 class="pi-label">Key findings</h5>

A majority of participants reported discomfort joining ongoing conversations. Most participants decided whether to join based on:

- topic relevance to their interests or knowledge
- perceived interruptibility and conversational flow

Participants strongly valued:

- knowing the topic before joining
- receiving suggestions for what to say
- cues for when to speak

These findings directly informed ConvoBuddy’s core features: topic summarization, contribution suggestions, and timing cues.

{% include figure_wrap.html
  src='/portfolio/images/convobuddy_bar.png'
  alt='Bar graph showing the preferences of participants valuing the following: topic summarization, contribution suggestions, and timing cues'
  title='Needfinding results'
  caption='Participant responses to the question "If you had a technology-based tool to help you join a conversational group, how would you prefer this tool to assist you in joining conversations?"'
  align='left'
  col='5'
  class='max-height-20em'
%}
<br><br><br><br>
<h4 class="pi-label">Design Concept</h4>

ConvoBuddy is designed as a shared, opt-in system used by participants at the same event. Each user accesses the system through a mobile web interface, eliminating the need for specialized hardware or installation.

The interface is split into two complementary views:

<h5 class="pi-label">Spatial map view</h5>

Users are represented as points with orientation arrows

- Conversational groups are detected via an f-formation detection algorithm
- Grouped conversations are color-coded
- The map reflects the physical layout of the social space

{% include figure_wrap.html
  src='/portfolio/images/convobuddy_4.png'
  alt='Screenshot of UI showing three existing conversational groups.'
  title='Map view'
  caption='Screenshot of UI showing three existing conversational groups.'
  align='right'
  col='5'
  class='max-height-20em'
%}


<h5 class="pi-label">Conversation context view</h5>

- Each detected group is paired with a live topic summary
- Users can open a group to view a truncated transcript and tips for how to join in
- Tips for joining were informed by conversational social psychology literature review
- This design allows users to fluidly move between physical awareness and conversational understanding.

<h4 class="pi-label">System Architecture</h4>

ConvoBuddy is implemented as a mobile-friendly web application using a distributed, real-time architecture, using Flask for back-end server architecture and a node.js client-side application. 

<h5 class="pi-label">ConvoAnalyser (Flask back-end)</h5>

- Processes phone sensor data (gyroscope, accelerometer)
- Performs lightweight f-formation detection using proximity and orientation heuristics
- Groups users into conversational clusters
- Aggregates speech transcripts per group
- Calls an external LLM to generate topic summaries and curated conversational entry suggestions

<h5 class="pi-label">Real-Time Interaction Layer (Node.js)</h5>

The client-side Node.js application is responsible for:

- Collecting sensor and speech data from mobile devices
- Mapping speakers to relative spatial positions
- Rendering conversational clusters in real time
- Color-coding groups for visual correlation
- Detecting conversational pauses using a silence/noise threshold
- Displaying summaries, transcripts, and entry tips

<h4 class="pi-label">Outcome & Recognition</h4>

ConvoBuddy reframes conversational entry as a designable interaction problem. By supporting people at the precise moment of social engagement, we encourage a future of human-centered AI systems that enhance social agency and connection.

My development partner Kenny Zhang and I presented this project at the [SFU CS Diversity Awards](https://www.sfu.ca/fas/computing/about/diversity-cs/csdc-diversity-project-presentations/2025-diversity-project-presentations.html) in April 2025, where it was nominated as a finalist.
