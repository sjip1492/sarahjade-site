---
tags: [portfolio]
title: "Embodied Audio"
subtitle: "Robotic arm + ultrasonic speaker for novel audio interactions"
date: 2026-01-01
# github: github.com
# category: "Tangible Audio Interfaces"

preview_image: /assets/images/upaies-preview.png
preview_alt: "Robot arm aiming a directional speaker"
description: "A research prototype exploring how embodied gestures can make highly directional sound a tangible, socially-aware interaction."
overview: "Embodied Audio is an interactive research prototype that explores how highly directional sound can be treated as a tangible, embodied interaction. The system combines a robotic arm–mounted ultrasonic (parametric) speaker with mid-air gesture input, allowing users to physically and socially shape how sound is delivered in shared space. \n\n The project is motivated by the idea that sound and gesture share similar social properties: both can include, exclude, direct attention, or create private moments within public environments. By coupling gesture-based control with person-specific, directional audio, this work investigates how sound can move beyond passive output toward intentional, embodied action."
role: "Designer, Researcher, Builder"
tools:
- ROS
- MoveIt
- Leap Motion
skills:
- Prototyping
- Interaction Design
- Gesture Design
- User Research
- ROS

gallery:
  - src: /assets/images/upaies-preview.png
    title: "title"
    description: "System overview: robotic arm + speaker and interaction space."
  - src: /portfolio/images/upaies_setup.png
    title: "Participant using the system"
    description: "Study setup used in our evaluation sessions."

layout: portfolio_item
---
#### System

The system consists of:

A robotic arm that dynamically positions a parametric speaker to deliver narrow sound beams to specific locations or individuals

An ultrasonic speaker capable of highly directional, person-specific audio

A Leap Motion Controller 2, used for real-time hand and gesture tracking

A custom interaction layer integrating gesture input with robotic motion and audio targeting

Gestures are used to control who hears sound, where sound is directed, and how it transitions through space—treating sound as something that can be pointed, offered, withheld, or shared.

#### Research Framing

This project builds on prior gesture elicitation work that identified user-preferred gestures for controlling directional audio. The current iteration extends that work by directly integrating gesture recognition into the system and examining its social and experiential impact.

The core research questions include:

How effective are mid-air gestures for controlling highly directional sound?

Do users perceive gesture-controlled audio as more intentional or socially expressive?

How do gestures influence feelings of inclusion, exclusion, and shared attention in multi-person environments?

By aligning embodied gesture with directional sound, the system probes how social boundaries of sound can be explicitly designed rather than implicitly assumed.

#### What I Did

Designed and implemented the gesture-based interaction model using Leap Motion Controller 2

Integrated gesture recognition with robotic control and audio targeting

Led iterative prototyping across hardware, software, and interaction layers

Designed a follow-up evaluation study building on an earlier gesture elicitation study

Developed study protocols to evaluate gesture effectiveness, usability, and social interpretation

Conducted pilot testing and refinement in preparation for formal evaluation sessions

#### Ongoing Evaluation

A follow-up evaluation study is currently underway to assess:

Gesture recognition reliability and learnability

User success rates and error patterns

Perceived expressiveness and social clarity of gestures

Overall effectiveness of gesture-controlled directional sound as a tangible interaction

This study aims to validate whether gesture-based control meaningfully improves the usability and social legibility of person-specific audio systems.

#### Outcome & Status

Fully integrated gesture + robotic + audio prototype

Gesture elicitation study completed

Follow-up evaluation study in progress

Findings will inform future iterations and academic publication