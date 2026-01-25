---
layout: portfolio_item
tags: [portfolio]
title: "ConvoBuddy"
subtitle: "A real-time conversational group-entry assistant for networking events"
date: 2025-01-01
category: "Interaction Design"

preview_image: /portfolio/images/convobuddy_1.png
preview_alt: "Screenshot of the UI for the intro screen of ConvoBuddy app."

short_description: "A mobile web application that helps users confidently join ongoing group conversations by providing topic summaries, join suggestions, and timing cues."
skills:
  - Interaction Design
  - User Research
  - Prototyping
  - Real-time Systems
  - Human-Centered AI
  - Data Visualization
  - Rapid Iteration

gallery:
  - src: /portfolio/images/convobuddy_fgroup.jpg
    alt: "Participant using the system"
    caption: "Study setup used in our evaluation sessions."
  - src: /portfolio/images/convobuddy_bar.png
    alt: "Participant using the system"
    caption: "Study setup used in our evaluation sessions."
  - src: /portfolio/images/convobuddy_1.png
    alt: "System overview diagram"
    caption: "System overview: robotic arm + speaker and interaction space."
  - src: /portfolio/images/convobuddy_2.png
    alt: "Participant using the system"
    caption: "Study setup used in our evaluation sessions."
  - src: /portfolio/images/convobuddy_3.png
    alt: "Participant using the system"
    caption: "Study setup used in our evaluation sessions."
---

#### Overview

ConvoBuddy is a mobile, real-time conversational assistant designed to support confident entry into ongoing group conversations. It helps users decide where, when, and how to join by providing contextual awareness of nearby conversational groups, including topic summaries, suggested entry points, and timing cues.

The system targets networking and social events with limited pre-existing social context, where conversational uncertainty can lead to hesitation, exclusion, or avoidance. ConvoBuddy reframes group entry as a supported interaction rather than a purely social gamble.

#### Problem Space

Entering an ongoing group conversation is a common yet under-supported social challenge. Individuals often hesitate because they lack information about:

what the group is talking about

whether the conversation is interruptible

what contribution would be appropriate

when a natural opening to speak will occur

These uncertainties compound into social anxiety, even among otherwise confident participants. Existing social technologies focus on connection before or after interaction (e.g., messaging, matchmaking), but offer little support in the moment of embodied social engagement.

ConvoBuddy addresses this gap by providing real-time, situated assistance at the moment of conversational entry.

Need-Finding & Research Insights

To ground the design, we conducted a short need-finding survey exploring discomfort, decision factors, and desired technological support for joining group conversations.

#### Participants

13 participants (ages 18–54; median 18–24)

Recruited via social networks and online communities

#### Key findings

A majority of participants reported discomfort joining ongoing conversations

Most participants decided whether to join based on:

topic relevance to their interests or knowledge

perceived interruptibility and conversational flow

Participants strongly valued:

knowing the topic before joining

receiving suggestions for what to say

cues for when to speak

These findings directly informed ConvoBuddy’s core features: topic summarization, contribution suggestions, and timing cues.

#### Design Concept

ConvoBuddy is designed as a shared, opt-in system used by participants at the same event. Each user accesses the system through a mobile web interface, eliminating the need for specialized hardware or installation.

The interface is split into two complementary views:

##### Spatial map view

Users are represented as points with orientation arrows

Conversational groups are detected and color-coded

The map reflects the physical layout of the social space

##### Conversation context view

Each detected group is paired with a live topic summary

Users can open a group to view a truncated transcript and join tips

This design allows users to fluidly move between physical awareness and conversational understanding.

#### Interaction Flow

The user opens ConvoBuddy upon arriving at an event

Nearby conversational groups appear on a live map

Each group is paired with a short topic summary

The user selects a group of interest

ConvoBuddy displays:

a brief transcript excerpt

suggested ways to enter the conversation

A timing cue activates when a conversational pause is detected, subtly signaling an opportunity to speak

The system is intentionally lightweight and non-directive, offering support without scripting social behavior.

#### System Architecture

ConvoBuddy is implemented as a mobile-friendly web application using a distributed, real-time architecture.


##### ConvoAnalyser (Python)

Processes phone sensor data (gyroscope, accelerometer)

Performs lightweight f-formation detection using proximity and orientation heuristics

Groups users into conversational clusters

Aggregates speech transcripts per group

Calls an external LLM to generate:

topic summaries

conversational entry suggestions

##### TranslateServer (Node.js)

Acts as a wrapper for LLM API requests

Handles authentication and request management

Simplifies communication between services

##### Real-Time Interaction Layer

The client-side Node.js application is responsible for:

Collecting sensor and speech data from mobile devices

Mapping speakers to relative spatial positions

Rendering conversational clusters in real time

Color-coding groups for visual correlation

Detecting conversational pauses using a silence/noise threshold

Displaying summaries, transcripts, and entry tips

Rather than providing exact turn-taking signals, the timing cue functions as an anticipatory nudge, respecting the fluid nature of human conversation.

#### Design Decisions & Trade-offs

Relative positioning instead of GPS
Avoids the precision and infrastructure requirements of absolute positioning indoors.

Web application instead of native app
Reduces friction and lowers barriers to adoption at events.

Heuristic group detection
Prioritizes responsiveness and usability over perfect accuracy.

Non-directive cues
Supports user agency rather than prescribing social behavior.

#### Outcome & Recognition

Developed a fully functional real-time prototype

Demonstrated end-to-end interaction from sensing → summarization → social cueing

Presented the project at the CS Diversity Awards, where it was nominated as a finalist

#### Research Contributions

ConvoBuddy contributes to HCI research by:

Exploring AI-mediated support for in-situ social interaction, rather than pre- or post-interaction tooling

Combining spatial sensing, conversational analysis, and LLMs into a unified real-time system

Demonstrating how subtle, non-verbal cues can scaffold social confidence without overt intervention

#### Future Directions

Potential extensions include:

More robust group detection under dynamic movement

Privacy-preserving on-device speech processing

Evaluation in real networking or conference settings

Adaptive summarization based on user goals

Longitudinal studies on confidence and social inclusion

#### Why this matters

ConvoBuddy reframes conversational entry as a designable interaction problem, not a personal shortcoming. By supporting people at the precise moment of social engagement, it points toward a future of human-centered AI systems that enhance—not replace—social agency.