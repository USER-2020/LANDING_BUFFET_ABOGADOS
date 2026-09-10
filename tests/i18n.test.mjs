import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from '@babel/parser';
import { english, translate, initialLanguage } from '../src/i18n.js';

test('Saved choices take priority and unsupported preferences fall back to Spanish', () => {
  for (const [saved, expected] of [[null, 'es'], ['en', 'en'], ['es', 'es'], ['fr', 'es']]) {
    globalThis.localStorage = { getItem: () => saved };
    assert.equal(initialLanguage({ languages: ['fr-FR'] }), expected);
  }
  globalThis.localStorage = { getItem() { throw new Error('Storage disabled'); } };
  assert.equal(initialLanguage({}), 'es');
  assert.equal(initialLanguage({ languages: ['en-GB'] }), 'en');
  delete globalThis.localStorage;
});

test('Browser languages use the first supported preference, including regional variants', () => {
  for (const [browser, expected] of [
    [{ languages: ['en-US', 'es-CO'] }, 'en'],
    [{ languages: ['es-MX', 'en-US'] }, 'es'],
    [{ languages: ['fr-FR', 'en-GB', 'es'] }, 'en'],
    [{ languages: ['pt-BR', 'es-CO'] }, 'es'],
    [{ language: 'EN_us' }, 'en'],
    [{ languages: [], language: 'es-ES' }, 'es'],
    [{ languages: ['de-DE'] }, 'es'],
    [{}, 'es'],
  ]) assert.equal(initialLanguage(browser), expected);
  globalThis.localStorage = { getItem: () => 'es' };
  assert.equal(initialLanguage({ languages: ['en-US'] }), 'es');
  globalThis.localStorage = { getItem: () => 'en' };
  assert.equal(initialLanguage({ languages: ['es-CO'] }), 'en');
  delete globalThis.localStorage;
});

test('Translations preserve Spanish and provide English for every dictionary entry', () => {
  for (const [spanish, englishText] of Object.entries(english)) {
    assert.equal(translate('es', spanish), spanish);
    assert.equal(translate('en', spanish), englishText);
    assert.ok(englishText.trim());
  }
});

test('Every literal translation call and service/FAQ data has an English translation', () => {
  const ast = parse(fs.readFileSync('src/main.jsx', 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
  const missing = [];
  function visit(node, inData = false) {
    if (!node || typeof node !== 'object') return;
    const data = inData || (node.type === 'VariableDeclarator' && ['services', 'questions'].includes(node.id.name));
    if (node.type === 'CallExpression' && node.callee.name === 't' && node.arguments[0]?.type === 'StringLiteral') {
      if (!english[node.arguments[0].value]) missing.push(node.arguments[0].value);
    }
    if (data && node.type === 'StringLiteral' && !english[node.value]) missing.push(node.value);
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(item => visit(item, data));
      else if (value && typeof value === 'object') visit(value, data);
    }
  }
  visit(ast);
  assert.deepEqual(missing, []);
});
