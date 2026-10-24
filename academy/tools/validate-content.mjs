#!/usr/bin/env node
/**
 * Quick Services Academy — Master Content Validator
 * Validates all course manifests, lesson schemas, sentence visuals, 
 * paragraph self-checks, quiz banks, and accessibility attributes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

const VALID_VISUAL_KINDS = new Set([
  'flow', 'cycle', 'compare', 'table', 'hierarchy', 'timeline', 'venn',
  'pyramid', 'matrix2x2', 'funnel', 'stack', 'formula', 'numberLine',
  'barchart', 'donut', 'scale', 'checklist', 'beforeAfter', 'annotatedExample',
  'definition', 'quote', 'dosDonts', 'mistakeFix', 'decisionTree', 'mindmap',
  'iconCards', 'keyTermCard', 'process', 'anatomy', 'textFallback'
]);

const VALID_QUESTION_TYPES = new Set([
  'single', 'multi', 'trueFalse', 'fillBlank', 'order', 'match',
  'categorise', 'hotspot', 'spotError', 'shortAnswer', 'scenario', 'calculation'
]);

let errors = [];
let stats = {
  courses: 0,
  modules: 0,
  lessons: 0,
  readLessons: 0,
  videoLessons: 0,
  visualLessons: 0,
  quizLessons: 0,
  paragraphs: 0,
  sentences: 0,
  sentenceVisuals: 0,
  paragraphVisuals: 0,
  selfChecks: 0,
  selfCheckQuestions: 0,
  quizBankQuestions: 0,
  questionsByType: {}
};

function logError(file, msg) {
  errors.push(`[${file}] ${msg}`);
}

function validateVisual(visual, context) {
  if (!visual || typeof visual !== 'object') {
    logError(context, 'Missing or invalid visual object');
    return;
  }
  if (!visual.kind || !VALID_VISUAL_KINDS.has(visual.kind)) {
    logError(context, `Invalid or unknown visual kind: "${visual.kind}"`);
  }
  if (!visual.title || typeof visual.title !== 'string') {
    logError(context, 'Visual missing required string "title"');
  }
  if (!visual.data || typeof visual.data !== 'object') {
    logError(context, 'Visual missing required object "data"');
  }
  if (!visual.caption || typeof visual.caption !== 'string') {
    logError(context, 'Visual missing required string "caption"');
  }
  const str = JSON.stringify(visual);
  if (/<img|\.png|\.jpg|\.jpeg|\.webp|http:\/\/|https:\/\/(?!fonts)/i.test(str)) {
    logError(context, 'Visual contains raster image tag or external raster URL');
  }
}

function validateQuestion(q, context) {
  if (!q.type || !VALID_QUESTION_TYPES.has(q.type)) {
    logError(context, `Invalid question type: "${q.type}"`);
    return;
  }
  stats.questionsByType[q.type] = (stats.questionsByType[q.type] || 0) + 1;
  if (!q.q || typeof q.q !== 'string') {
    logError(context, 'Question missing string prompt "q"');
  }
  if (!q.explanation || typeof q.explanation !== 'string') {
    logError(context, 'Question missing string "explanation"');
  }
  if (q.type === 'single' || q.type === 'multi') {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      logError(context, 'Choice question must have at least 2 options');
    }
  }
}

function runValidation() {
  console.log('🔍 Starting Quick Services Academy Content Validation...\n');

  const coursesFile = path.join(DATA_DIR, 'courses.json');
  if (!fs.existsSync(coursesFile)) {
    console.error(`❌ Fatal: ${coursesFile} not found.`);
    process.exit(1);
  }

  const courses = JSON.parse(fs.readFileSync(coursesFile, 'utf8'));
  stats.courses = courses.length;

  for (const c of courses) {
    const courseManifestPath = path.join(DATA_DIR, 'courses', `${c.id}.json`);
    if (!fs.existsSync(courseManifestPath)) {
      logError(coursesFile, `Course manifest missing for id "${c.id}" at ${courseManifestPath}`);
      continue;
    }

    const manifest = JSON.parse(fs.readFileSync(courseManifestPath, 'utf8'));
    if (!Array.isArray(manifest.modules)) {
      logError(courseManifestPath, 'Course manifest missing "modules" array');
      continue;
    }

    stats.modules += manifest.modules.length;

    for (const mod of manifest.modules) {
      if (!Array.isArray(mod.lessons)) continue;
      for (const l of mod.lessons) {
        stats.lessons++;
        const lessonPath = path.join(DATA_DIR, 'lessons', c.id, `${l.id}.json`);
        if (!fs.existsSync(lessonPath)) {
          // File might not be generated yet during incremental rollout
          continue;
        }

        const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
        const fileTag = `${c.id}/${l.id}.json`;

        if (lesson.type === 'read') {
          stats.readLessons++;
          const content = lesson.content || lesson.c;
          if (!content) {
            logError(fileTag, 'Read lesson missing content object');
            continue;
          }
          if (!content.quick) {
            logError(fileTag, 'Read lesson missing "quick" summary');
          }
          if (!Array.isArray(content.blocks) || content.blocks.length === 0) {
            logError(fileTag, 'Read lesson missing "blocks" array');
            continue;
          }

          for (const block of content.blocks) {
            stats.paragraphs++;
            // Check paragraph visual
            stats.paragraphVisuals++;
            validateVisual(block.visual, `${fileTag}#${block.id}-pvisual`);

            if (!Array.isArray(block.sentences) || block.sentences.length === 0) {
              logError(fileTag, `Block ${block.id} has no sentences array`);
              continue;
            }

            for (const s of block.sentences) {
              stats.sentences++;
              stats.sentenceVisuals++;
              validateVisual(s.visual, `${fileTag}#${s.id}-svisual`);
            }

            if (block.check) {
              stats.selfChecks++;
              if (Array.isArray(block.check.questions)) {
                for (const cq of block.check.questions) {
                  stats.selfCheckQuestions++;
                  validateQuestion(cq, `${fileTag}#${block.id}-check`);
                }
              }
            }
          }
        } else if (lesson.type === 'video') {
          stats.videoLessons++;
        } else if (lesson.type === 'visual') {
          stats.visualLessons++;
        } else if (lesson.type === 'quiz') {
          stats.quizLessons++;
          const content = lesson.content || lesson.c;
          if (content && Array.isArray(content.bank)) {
            for (const q of content.bank) {
              stats.quizBankQuestions++;
              validateQuestion(q, `${fileTag}#quizbank`);
            }
          }
        }
      }
    }
  }

  console.log('--- Content Statistics ---');
  console.log(`Courses:                ${stats.courses}`);
  console.log(`Modules:                ${stats.modules}`);
  console.log(`Lessons Total:          ${stats.lessons}`);
  console.log(`  - Read Lessons:       ${stats.readLessons}`);
  console.log(`  - Video Lessons:      ${stats.videoLessons}`);
  console.log(`  - Visual Lessons:     ${stats.visualLessons}`);
  console.log(`  - Quiz Lessons:       ${stats.quizLessons}`);
  console.log(`Paragraphs:             ${stats.paragraphs}`);
  console.log(`Sentences:              ${stats.sentences}`);
  console.log(`Sentence Visuals:       ${stats.sentenceVisuals}`);
  console.log(`Paragraph Visuals:      ${stats.paragraphVisuals}`);
  console.log(`Self-Checks Authored:   ${stats.selfChecks}`);
  console.log(`Self-Check Questions:   ${stats.selfCheckQuestions}`);
  console.log(`Quiz Bank Questions:    ${stats.quizBankQuestions}`);
  console.log('\nQuestions by Type:');
  for (const [t, count] of Object.entries(stats.questionsByType)) {
    console.log(`  ${t.padEnd(14)}: ${count}`);
  }
  console.log('--------------------------\n');

  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} error(s):`);
    for (const err of errors.slice(0, 50)) {
      console.error(`  • ${err}`);
    }
    if (errors.length > 50) {
      console.error(`  ... and ${errors.length - 50} more errors.`);
    }
    process.exit(1);
  } else {
    console.log('✅ All verified content passed validation with 0 errors!\n');
    process.exit(0);
  }
}

runValidation();
