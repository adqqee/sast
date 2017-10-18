const path = require('path')
const test = require('ava')
const {parse, parseFile, stringify} = require('..')

const fixture = (...args) => path.resolve(__dirname, 'fixtures', ...args)

test('it parses SCSS by default', t => {
  const root = parse('$foo: bar')
  t.deepEqual(root.type, 'stylesheet')
  t.deepEqual(root.children.length, 1)
  t.deepEqual(root.children[0].type, 'declaration')
})

test('it parses lists', t => {
  const root = parse('$list: (bar, baz)')
  t.is(root.children.length, 1)
  const [decl] = root.children
  t.is(decl.children.length, 4)
  const [name, colon, space, value] = decl.children
  const list = value.children[0]
  t.is(list.type, 'list')
  t.is(list.values.length, 2)
  t.deepEqual(list.values.map(stringify), ['bar', 'baz'])
})

test('it parses maps', t => {
  const root = parse('$list: (a: b, c: d)')
  t.is(root.children.length, 1)
  const [decl] = root.children
  t.is(decl.children.length, 4)
  const [name, colon, space, value] = decl.children
  const map = value.children[0]
  t.is(map.type, 'map')
  t.is(map.values.length, 2)
  t.deepEqual(
    map.values.map(({name, value}) => ({
      name: stringify(name),
      value: stringify(value),
    })),
    [
      {name: 'a', value: 'b'},
      {name: 'c', value: 'd'},
    ]
  )
})

test('it parses files', t => {
  return parseFile(fixture('basic.scss'))
    .then(tree => {
      t.is(tree.type, 'stylesheet')
    })
})