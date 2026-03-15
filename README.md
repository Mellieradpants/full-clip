# Signal Tool

A human-readable prototype verification engine for complex information.

This tool is designed to reduce cognitive load by running one piece of text through three constrained checks:

- Meaning  
  What the text is actually saying in plain language.

- Origin  
  Where the information appears to come from.

- Verification  
  Where supporting records should exist if the claims are grounded.

The goal is not to generate opinions, personality, or narrative.  
The goal is to make information easier to inspect.

## What it does

A user pastes text into the tool.

The system then:

1. detects the main assertions in the text  
2. rewrites the content in plain, readable language  
3. surfaces source and provenance signals  
4. routes each assertion toward the record systems where verification should exist

## Why it exists

A lot of important information is technically public but still hard to use.

People run into:
- dense policy language
- unclear source signals
- no obvious path for verification
- too much noise and not enough structure

This prototype is meant to help close that gap.

## Design principles

- human-readable output
- plain language first
- no narrative padding
- no personality layer
- no truth theater
- no vague “reputable sources” language
- named record systems whenever possible
- clear separation between mechanisms

## Current structure

This prototype currently shows three panels:

- Meaning
- Origin
- Verification

These are meant to work as one pipeline, not as three unrelated demos.

## Important note

This is a prototype verification engine.

It does not make final truth judgments.  
It shows:
- what the text is asserting
- where it appears to come from
- where supporting records should exist

## Long-term direction

This prototype is part of a broader constrained AI tool design focused on:

- lower cognitive load
- better public information access
- structured language interpretation
- source traceability
- verification routing

## Status

Prototype in active development.
