import assert from 'node:assert/strict';
import type { FieldHook } from 'payload';
import { immutableProductCategory } from '../src/hooks/slug';

const check = (args: Partial<Parameters<FieldHook>[0]>) => immutableProductCategory(args as Parameters<FieldHook>[0]);
assert.equal(check({ operation: 'create', value: 2 }), 2);
assert.equal(check({ operation: 'update', value: 2, originalDoc: { category: 1 } }), 2);
assert.equal(check({ operation: 'update', value: 1, originalDoc: { slug: 'old', category: 1 } }), 1);
assert.equal(check({ operation: 'update', value: '1', originalDoc: { slug: 'old', category: { id: 1 } } }), '1');
assert.equal(check({ operation: 'update', value: undefined, originalDoc: { slug: 'old', category: 1 } }), undefined);
assert.throws(() => check({ operation: 'update', value: 2, originalDoc: { slug: 'old', category: 1 } }), /301/);
assert.throws(() => check({ operation: 'update', value: { id: 2 }, originalDoc: { slug: 'old', category: 1 } }), /301/);
console.log('Product category URL guard: 7 checks passed.');
