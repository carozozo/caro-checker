describe(`ref(fieldPath) - 支援取得指定欄位的值`, async () => {
  const plan = {a: cc.any(), b: cc.ref('a')}

  describe(`ref()`, async () => {
    it(`通過: {a: 3, b: 3}`, async () => {
      const input = {a: 3, b: 3}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, undefined)
    })
    it(`不通過: {a: 3, b: 6}`, async () => {
      const input = {a: 3, b: 6}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, 'b only accepts 3')
    })
  })
})

describe(`isRef(arg) - 檢查是否為 ref 物件`, async () => {
  it(`isRef(cc.ref())`, async () => {
    const isRef = cc.isRef(cc.ref('a'))
    assert.strictEqual(isRef, true)
  })
  it(`isRef({})`, async () => {
    const isRef = cc.isRef({})
    assert.strictEqual(isRef, false)
  })
})

describe(`isSchema(value, [type]) - 檢查是否為 schema 物件`, async () => {
  it(`isSchema(cc.any())`, async () => {
    const isSchema = cc.isSchema(cc.any())
    assert.strictEqual(isSchema, true)
  })
  it(`isSchema(cc.any(), 'any')`, async () => {
    const isSchema = cc.isSchema(cc.any(), 'any')
    assert.strictEqual(isSchema, true)
  })
  it(`isSchema({})`, async () => {
    const isSchema = cc.isSchema({})
    assert.strictEqual(isSchema, false)
  })
  it(`isSchema(cc.any(), 'string')`, async () => {
    const isSchema = cc.isSchema(cc.any(), 'string')
    assert.strictEqual(isSchema, false)
  })
})
