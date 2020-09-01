const json = {
  common: {
    '+ follow': false,
    setting1: 'Value 1',
    '- setting2': 200,
    '- setting3': true,
    '+ setting3': { key: 'value' },
    '+ setting4': 'blah blah',
    '+ setting5': { key5: 'value5' },
    setting6: {
      doge: {
        '- wow': 'too much',
        '+ wow': 'so much',
      },
      key: 'value',
      '+ ops': 'vops',
    },
  },
  group1: {
    '- baz': 'bas',
    '+ baz': 'bars',
    foo: 'bar',
    '- nest': { key: 'value' },
    '+ nest': 'str',
  },
  '- group2': {
    abc: 12345,
    deep: { id: 45 },
  },
  '+ group3': {
    fee: 100500,
    deep: {
      id: {
        number: 45,
      },
    },
  },
};

const plain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to [complex value]
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From 'too much' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

const stylish = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: too much
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        fee: 100500
        deep: {
            id: {
                number: 45
            }
        }
    }
}`;

export default (format) => {
  switch (format) {
    case 'plain':
      return plain;
    case 'stylish':
      return stylish;
    case 'json':
      return JSON.stringify(json);
    default:
      throw new Error(`Unknown expected by '${format}'`);
  }
};
